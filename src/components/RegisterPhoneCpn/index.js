import React, {Component, Fragment} from 'react';
import {InputItem, Button, Toast, Modal, NavBar} from 'antd-mobile';
import {createForm} from 'rc-form';
import {withRouter} from 'react-router-dom';
import axiosHttp from "../../utils/ajax";
import Utils from "../../utils/utils";
import commonFun from "../../utils/commonFun";
import VerificationCodeCpn from '../../components/VerificationCodeCpn'
import './index.less'

const alert = Modal.alert;

class RegisterPhoneCpn extends Component {
    state = {
        timer: 60, //验证码的倒计时
        isSendCodeFlag: false,
        phoneCheckOut: false,
        accountData: {},
        myPhone: '',
        loading: false,
    };
    isExistFlag = false;
    pageInfo = {
        mPhone: "",
        verify_code: ''
    };

    componentDidMount() {
        let mPhone = this.props.match.params.mPhone;
        this.setState({
            myPhone: mPhone
        });
        this.pageInfo.mPhone = mPhone;
        window.sessionStorage.setItem('mPhone', mPhone);
        let storage = window.sessionStorage;
        let nickName = storage.getItem("nickName");
        if (!nickName) {
            let search = window.location.search;
            if (search) {
                storage.setItem("wcParams", search);
                let wcParams = storage.getItem("wcParams"),
                    ua = navigator.userAgent.toLowerCase(),
                    isWeixin = ua.indexOf('micromessenger') !== -1;
                if (wcParams && isWeixin) {
                    this.webUserAuthHttp(wcParams);
                }
            }
        }
    }

    webUserAuthHttp = (wcParams) => {  //web微信用户授权
        axiosHttp('api/WeiXin/WeixinLogin/GzhUserAuth' + wcParams, '', 'GET').then((res) => {
            if (res.code === 200) {
                let data = JSON.parse(res.data);
                if (data.errcode === 41001) {

                } else {
                    window.sessionStorage.setItem('weChatData', res.data);
                    this.props.history.push('/registerPhoneCpn');
                    // this.props.history.push('/bindPhone');
                }
            } else if (res.code === 210) {//已授权，直接扫码登录
                window.sessionStorage.removeItem("wcParams");
                this.loginCommonFun(res.data);
            }
        }).catch(e=>{
            console.log(e);
        });
    };
    _handleSubmit = () => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
                this.pageInfo.mPhone = value.phone;
                this.pageInfo.verify_code = value.code;
                this.wxCtMphoneHttp(value);
            }
        });
    };
    checkExistHttp = () => {  // 检查手机号码是否存在
        if (this.state.timer !== 60) {
            return
        }
        axiosHttp(`api/WebSite/Login/CheckExist?phone=${this.pageInfo.mPhone}&wx=true`, '', 'GET').then((res) => {
            if (res.code === 6100) {
                alert('提示', '手机号码已注册，并已绑定其他微信，是否更换绑定微信', [
                    {text: '取消', onPress: this.jumpLoginCpn},
                    {text: '确定', onPress: this.getMphoneVerifyCodeHttp},
                ])
            } else {
                this.getMphoneVerifyCodeHttp();
            }
        })
    };
    jumpLoginCpn = () => {
        this.props.history.push('/loginCpn');
    };
    wxCtMphoneHttp = (params) => {  //微信关联手机流程
        this.setState({loading: true});
        let weChatData = window.sessionStorage.getItem('weChatData'), param = {};
        if (weChatData) {
            param = JSON.parse(weChatData);
        }
        axiosHttp('api/WeiXin/WeixinLogin/WxCtMphone', {...params, ...param, visitor_state: 'gzh'}).then((res) => {
            this.setState({loading: false});
            if (res.code === 200) {
                window.sessionStorage.setItem('weChatData', JSON.stringify(res.data));
                this.props.history.push('/bindPhone');
            } else if (res.code === 210) {
                this.loginCommonFun(res.data);
            } else {
                Toast.fail(res.msg, 1);
                Utils.insertLoginRecordHttp(0, '', res.msg);
            }
        })
    };
    loginCommonFun = (data) => {
        const {nickName, headImgurl, userId} = data;
        Utils.storageLoginInfoFun(data);
        this.props.history.push('/personalCenter');
        Utils.insertLoginRecordHttp(1, userId);
    };
    // checkoutPhoneBlur = (rule, value, callback) => { //验证手机号码是否存在
    //     let flag = /^1[0-9]{10}$/.test(value);
    //     if (!value) {
    //         callback('手机号码不能为空');
    //     } else if (!flag) {
    //         callback('11位数字');
    //     } else {
    //         callback();
    //     }
    // };
    getMphoneVerifyCodeHttp = () => {         // 获取手机验证码
        const {mPhone} = this.pageInfo;
        const {myPhone, isSendCodeFlag} = this.state;
        if (this.isExistFlag) {
            return
        } else if (isSendCodeFlag) {
            return;
        }
        if (!mPhone && mPhone !== myPhone) {
            return;
        }
        this.setState({
            isSendCodeFlag: true
        });

        window.sessionStorage.setItem('mPhone', mPhone);
        axiosHttp(`api/WebSite/GetPhoneVerifyCode/GetMphoneVerifyCode?mPhone=${mPhone}&messageType=注册`, '', 'GET').then((res) => {
            let userId = window.sessionStorage.getItem('userId');
            if (res.code === 200) {
                Utils.InsertVerifycodeRecordHttp(userId, 1, 1);
                // if (this.timer) {
                //     clearInterval(this.timer);
                // }
                // this.timer = setInterval(() => {
                //     if (this.state.timer < 1) {
                //         this.setState({
                //             isSendCodeFlag: false
                //         });
                //         clearInterval(this.timer);
                //         return;
                //     }
                this.setState({
                    timer: this.state.timer - 1
                })
                // }, 1000);
            } else {
                Utils.InsertVerifycodeRecordHttp(userId, 1, 0, res.msg);
                Toast.fail(res.msg, 1);
            }
        });
    };
    getPhoneValue = (value) => {
        this.pageInfo.mPhone = value;
        let checkOut = /^1[0-9]{10}$/.test(value);
        this.setState({
            phoneCheckOut: checkOut
        })
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        const {getFieldProps, getFieldError, getFieldsError, getFieldsValue} = this.props.form;
        let disabled = Utils.hasValues(getFieldsValue()) === true || Utils.hasErrors(getFieldsError()) === true;
        const {phoneCheckOut, isSendCodeFlag, timer, loading} = this.state;
        const style = {
            pa: {position: 'absolute'}
        };
        return (
            <Fragment>
                {/*修改昵称/修改手机号*/}
                {/*<NavBarCpn title='微信登录'/>*/}
                <NavBar className="navBarWrap"
                        mode="light"
                        leftContent={[<i key="1" className="fanhui"/>]}
                        onLeftClick={() => this.props.history.push('/loginCpn')}
                >微信登录</NavBar>
                <div className="whiteSpace16"/>
                <form className="inputWrap" onSubmit={this._handleSubmit}>
                    <InputItem clear
                               {...getFieldProps('mphone', {
                                   initialValue: '',
                                   onChange: this.getPhoneValue,
                                   rules: [
                                       {
                                           validator: commonFun.checkoutPhoneBlur
                                       }
                                   ],
                                   validateTrigger: 'onBlur'
                               })}
                               placeholder="手机号"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'mphone')}
                    <InputItem clear
                               {...getFieldProps('verify_code', {
                                   initialValue: '',
                                   rules: [
                                       {required: true, message: '验证码不能为空'},
                                       {pattern: /^[0-9]{6}$/, message: "6位数数字"}
                                   ],
                                   validateTrigger: 'onBlur'
                               })}
                               placeholder="验证码"
                    >
                        {/*`剩余 ${timer}(s)`*/}
                        <Button onClick={this.checkExistHttp}
                                className={`codeBtn ${phoneCheckOut && !isSendCodeFlag ? "active" : ""}`}
                                style={style.pa}
                                size="small">{isSendCodeFlag ? <VerificationCodeCpn time={timer}/> : "发送验证码"}</Button>
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'verify_code')}
                    <Button className="defineBtn" loading={loading} disabled={disabled} type='primary'
                            onClick={this._handleSubmit}
                    >立即绑定</Button>
                    <p className="jumpText tc">一个手机号只能绑定一个微信号，可更换绑定</p>
                </form>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(RegisterPhoneCpn));