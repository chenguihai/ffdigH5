import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {InputItem, Button, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import axiosHttp from "../../utils/ajax";
import NavBarCpn from "../NavBarCpn";
import Utils from "../../utils/utils";
import commonFun from "../../utils/commonFun";
import './index.less'

class ForgetPasswordCpn extends Component {
    state = {
        timer: 60,
        forgetPWdFlag: true, //true
        resetSuccessFlag: false,
        isSendCodeFlag: false,
        phoneCheckOut: false,
        confirmDirty: false,
    };
    isExistFlag = false;
    pageInfo = {
        myPhone: '',
        mb_verify_code: ''
    };
    storage = window.sessionStorage;

    componentDidMount() {
        // let search = window.location.search;
        // if (search) {
        //     this.storage.setItem("wcParams", search);
        //     let wcParams = this.storage.getItem("wcParams");
        //     if (wcParams) {
        //         this.getOpenIdByGzhSnsapiBase(wcParams);
        //     }
        // }
    }

    // getOpenIdByGzhSnsapiBase = (wcParams) => { // 公众号静默授权获取用户openID
    //     axiosHttp('api/WeiXin/WeixinLogin/GetOpenIdByGzhSnsapiBase' + wcParams, '', 'get').then((res) => {
    //         if (res.code === 200) {
    //             this.openid = JSON.parse(res.data).openid;
    //             window.sessionStorage.setItem('openid', this.openid);
    //         }
    //     })
    // };
    _handleSubmit = () => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
                this.pageInfo.myPhone = value.phone;
                this.pageInfo.mb_verify_code = value.code;
                this.verifyCodeHttp(value);
            }
        });
    };

    verifyCodeHttp = (value) => {  // 忘记密码下一步
        const {code, phone} = value;
        axiosHttp(`api/WebSite/Login/VerifyCode?mb_verify_code=${code}&mobile_phone=${phone}`, '', 'GET').then((res) => {
            if (res.code === 200) {
                this.props.history.push(`/modifyPwdCpn/${code}/${phone}`);
            } else if (res.code === 1003) {
                this.setState({
                    timer: 60,
                    isSendCodeFlag: false
                });
                Toast.fail(res.msg, 1);
            } else {
                Toast.fail(res.msg, 1);
            }
        }).catch(e=>{
            console.log(e);
        })
    };

    checkoutPhoneBlur = (rule, value, callback) => {
        this.pageInfo.myPhone = value;
        if (!value) {
            callback('手机号不能为空！');
        } else if (!/^1[0-9]{10}$/.test(value)) {
            callback('请输入正确的手机号码');
        } else if (/^1[0-9]{10}$/.test(value)) {
            this.setState({
                isSendCodeFlag: false
            });
            this.checkExistHttp(value).then(res => {
                if (res.code === 200) {
                    this.isExistFlag = false;
                    callback();
                } else {
                    this.isExistFlag = true;
                    callback('手机账号不存在');
                }
                this.setState({
                    phoneCheckOut: true
                });
            }).catch(e => {
                console.log(e);
            });

        } else {
            callback();
        }

    };
    checkoutCodeBlur = (rule, value, callback) => {
        value = value.trim();
        if (!value) {
            callback('验证码不能为空');
        } else if (!/^[0-9]{6}$/.test(value)) {
            callback('6位数数字');
        } else {
            callback();
        }
    };
    checkExistHttp = (phone) => {  // 检查手机号码是否存在
        return new Promise((resolve, reject) => {
            axiosHttp('api/WebSite/Login/CheckExist?phone=' + phone, '', 'GET').then((res) => {
                resolve(res)
            }).catch(e => {
                reject(e)
            });
        })

    };
    getMphoneVerifyCodeHttp = () => {  //获取手机验证码--未登录
        const {myPhone} = this.pageInfo;
        const {isSendCodeFlag} = this.state;
        if (this.isExistFlag || isSendCodeFlag || !myPhone) {
            return
        }
        this.setState({
            isSendCodeFlag: true
        });
        axiosHttp(`api/WebSite/GetPhoneVerifyCode/GetMphoneVerifyCode?mPhone=${this.pageInfo.myPhone}&messageType=找回密码`, '', 'GET').then((res) => {
            let userId = window.sessionStorage.getItem('userId');
            if (res.code === 200) {
                Utils.InsertVerifycodeRecordHttp(userId, 2, 1);
                this.timer = setInterval(() => {
                    if (this.state.timer < 1) {
                        this.setState({
                            isSendCodeFlag: false,
                            timer: 60
                        });
                        clearInterval(this.timer);
                        return;
                    }
                    this.setState({
                        timer: this.state.timer - 1
                    })
                }, 1000);
            } else {
                Utils.InsertVerifycodeRecordHttp(userId, 2, 0, res.msg);
                Toast.fail(res.msg, 1);
            }
        }).catch(e=>{
            console.log(e);
        })
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        const {getFieldProps, getFieldError, getFieldsError, getFieldsValue} = this.props.form;
        let disabled = Utils.hasValues(getFieldsValue()) === true || Utils.hasErrors(getFieldsError()) === true;
        const style = {
            pa: {position: 'absolute'}
        };
        const {phoneCheckOut, isSendCodeFlag, timer} = this.state;
        return (
            <Fragment>
                <NavBarCpn title="找回密码"/>
                <div className="whiteSpace16"/>
                <form className="inputWrap" onSubmit={this._handleSubmit}>
                    <InputItem clear
                               {...getFieldProps('phone', {
                                   initialValue: '',
                                   rules: [{validator: this.checkoutPhoneBlur}],
                                   validateTrigger: 'onBlur',
                               })}
                               placeholder="手机号"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'phone')}
                    <InputItem maxLength="6" clear
                               {...getFieldProps('code', {
                                   initialValue: '',
                                   rules: [{validator: this.checkoutCodeBlur}],
                                   validateTrigger: 'onBlur',
                               })}
                               placeholder="验证码"
                    >
                        <div className="code"/>
                        <Button onClick={this.getMphoneVerifyCodeHttp}
                                className={`codeBtn ${phoneCheckOut && !isSendCodeFlag ? "active" : ""}`}
                                style={style.pa}
                                size="small">{isSendCodeFlag ? `剩余 ${timer}(s)` : "发送验证码"}</Button>
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'code')}

                    <Button className="defineBtn" type='primary' disabled={disabled}
                            onClick={this._handleSubmit}>下一步</Button>
                    <div className="jumpText tc">
                        已想起密码，去<Link to="/loginCpn" className="c_primary">登录</Link>
                    </div>
                </form>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(ForgetPasswordCpn));