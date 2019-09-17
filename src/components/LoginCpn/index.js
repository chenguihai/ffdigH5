import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {InputItem, Button, Toast} from 'antd-mobile';
import NavBarCpn from '../NavBarCpn'
import {createForm} from 'rc-form';
import axiosHttp from "../../utils/ajax";
import Utils from "../../utils/utils";
import config from "../../config/config";
import commonFun from "../../utils/commonFun";
import './index.less'

class LoginCpn extends Component {
    state = {
        pass_word: '',
        user_name: '',
        loading: false,
    };
    rememberPwd = false;
    local = window.localStorage;

    componentDidMount() {
        this.base64 = new Utils.base64Function();
        let params = this.local.getItem('loginInfo');
        if (params) {
            let account = JSON.parse(params);
            const {pass_word, user_name, rememberPwd, date} = account;
            let current = new Date().getTime();
            this.rememberPwd = false;

            if (current - date > 1000 * 60 * 60 * 24 * 7) {
                this.local.clear();
            } else {
                this.props.form.setFieldsValue({
                    pass_word: this.base64.decode(pass_word),//解密
                    user_name: user_name,
                    rememberPwd: rememberPwd
                });
                this.props.form.validateFields();
            }
        }
        let storage = window.sessionStorage;
        let nickName = storage.getItem("nickName");
        let ua = navigator.userAgent.toLowerCase();
        this.isWeixin = ua.indexOf('micromessenger') !== -1;
        if (nickName) {
            this.setState({
                nickName: storage.getItem('nickName') || '',
                headImgUrl: storage.getItem('headImgUrl') || ''
            });
        } else {
            let search = window.location.search;
            if (search) {
                storage.setItem("wcParams", search);
                let wcParams = storage.getItem("wcParams");
                if (wcParams) {
                    // window.history.replaceState(null, null, '/loginCpn');
                    this.getOpenIdByGzhSnsapiBase(wcParams);
                }
            }
        }
    }

    getOpenIdByGzhSnsapiBase = (wcParams) => { // 公众号静默授权获取用户openID
        axiosHttp('api/WeiXin/WeixinLogin/GetOpenIdByGzhSnsapiBase' + wcParams, '', 'get').then((res) => {
            if (res.code === 200) {
                this.openid = JSON.parse(res.data).openid;
                window.sessionStorage.setItem('openid', this.openid);
            }
        }).catch(e => {
            console.log(e);
        })
    };

    _handleSubmit = () => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
                this.userLoginHttp(value);
            }
        });
    };
    userLoginHttp = (params) => {  //用户登录
        let {rememberPwd, ...props} = params;

        this.setState({
            loading: true
        });
        let loginParams = props;
        if (this.isWeixin) {
            loginParams = {...props, login_state: 'gzh', login_openid: this.openid}
        }
        axiosHttp('api/WebSite/Login/UserLogin', loginParams).then((res) => {
            this.setState({
                loading: false
            });
            if (res.code === 200) {
                if (rememberPwd === false) {
                    const {pass_word, user_name, rememberPwd} = params;
                    let param = {
                        pass_word: this.base64.encode(pass_word),//加密
                        user_name,
                        rememberPwd: false,
                        date: new Date().getTime()
                    };
                    this.local.setItem('loginInfo', JSON.stringify(param));
                }
                const {userId} = res.data;
                Utils.storageLoginInfoFun(res.data);
                let session = window.sessionStorage,
                    heatPage = session.getItem('newProductHeat');
                if (heatPage) {
                    session.removeItem('newProductHeat');
                    this.props.history.push('/newProductHeat');
                } else {
                    this.props.history.push('/personalCenter');
                }
                // this.props.history.goBack();
                Utils.insertLoginRecordHttp(1, userId);
            } else {
                Toast.fail(res.msg, 1);
                Utils.insertLoginRecordHttp(0, '', res.msg);
            }

        }).catch(e => {
            console.log(e);
        })
    };
    checkUsername = (rule, value, callback) => {
        var regPhone = /^1[0-9]{10}$/,
            // regEmail = /^([a-z0-9+_]|\\-|\\.)+@(([a-z0-9_]|\\-)+\\.)+[a-z]{2,6}\$/i;
            regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!value) {
            callback('请输入账号(邮箱/手机号)！');
        } else if (!regPhone.test(value) && !regEmail.test(value)) {
            callback('请输入正确的账号！');
        } else {
            callback();
        }
    };
    _handleRegisterPhone = () => {
        if (this.isWeixin) {
            window.location.replace(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${config.appID}&redirect_uri=${config.serverUrl}registerPhoneCpn&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`);
        } else {
            Toast.info('请用微信打开', 1);
        }
    };
    _handleRegister = () => {
        this.props.history.push('/registerCpn');
    };
    _handleForgetPwd = () => {
        this.props.history.push('/forgetPasswordCpn');
    };

    render() {
        const {getFieldProps, getFieldError, getFieldsError, getFieldsValue} = this.props.form;
        let disabled = Utils.hasValues(getFieldsValue()) === true || Utils.hasErrors(getFieldsError()) === true;
        const {loading} = this.state;
        return (
            <Fragment>
                <NavBarCpn title="登录"/>
                <div className="whiteSpace16"/>
                <form className="inputWrap" onSubmit={this._handleSubmit}>
                    <InputItem type="text" clear
                               {...getFieldProps('user_name', {
                                   initialValue: '',
                                   rules: [{validator: this.checkUsername}],
                                   validateTrigger: 'onBlur',
                               })}
                               placeholder="手机号/邮箱"
                    />
                    {commonFun.ErrorWrap(getFieldError, 'user_name')}
                    <InputItem type="password" clear
                               {...getFieldProps('pass_word', {
                                   initialValue: '',
                                   rules: [
                                       {required: true, message: "密码不能为空"}
                                   ],
                                   validateTrigger: 'onBlur',
                               })}
                               placeholder="密码"
                    />
                    {commonFun.ErrorWrap(getFieldError, 'pass_word')}
                    <Button className="defineBtn" loading={loading} disabled={disabled} type='primary'
                            onClick={this._handleSubmit}>登录</Button>
                    <div className="otherType">
                        <div className="btnGroup">
                            <span onClick={this._handleRegister} className="text">我要注册</span>
                            <span className="dividingLine"/>
                            <span onClick={this._handleForgetPwd} className="link">忘记密码</span>
                        </div>
                        <div className="wcIcon" onClick={this._handleRegisterPhone}/>
                    </div>
                </form>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(LoginCpn));