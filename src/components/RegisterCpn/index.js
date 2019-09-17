import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, InputItem, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import axiosHttp from "../../utils/ajax";
import commonFun from "../../utils/commonFun";
import NavBarCpn from "../NavBarCpn";
import Utils from "../../utils/utils";
import './index.less'
// 昵称:1,手机:2,邮箱:3
const NICK_NAME = 1, PHONE = 2, EMAIL = 3;

class RegisterCpn extends Component {
    state = {
        isSendCodeFlag: false,
        phoneCheckOut: false,
        timer: 60,
        confirmDirty: false,
        errorInfo: '',
        twoStepFlag: false, //显示下一步的内容
        loading: false,
        isExistFlag: false,
    };
    pageInfo = {
        mobile_phone: ""
    };
    params = {};
    storage = window.sessionStorage;
    timer = null;

    componentDidMount() {
        let search = window.location.search;
        if (search) {
            this.storage.setItem("wcParams", search);
            let wcParams = this.storage.getItem("wcParams");
            if (wcParams) {
                this.getOpenIdByGzhSnsapiBase(wcParams);
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
                this.params = {...this.params, ...value};
                const {twoStepFlag} = this.state;
                if (!twoStepFlag) {
                    clearInterval(this.timer);
                    this.setState({
                        twoStepFlag: !twoStepFlag,
                        timer: 0
                    });
                    Utils.compositionInput('nickNameId', this);
                } else {
                    this.createUserHttp(this.params);
                }
            }
        });
    };
    getMphoneVerifyCodeHttp = () => {         // 获取手机验证码
        const {getFieldError, getFieldValue} = this.props.form;
        if (getFieldError('mobile_phone') !== undefined || this.state.isExistFlag || !/^1[0-9]{10}$/.test(getFieldValue('mobile_phone'))) {
            return
        }
        this.setState({
            isSendCodeFlag: true
        });
        const {mobile_phone} = this.pageInfo;
        this.storage.setItem('mPhone', mobile_phone);
        axiosHttp(`api/WebSite/GetPhoneVerifyCode/GetMphoneVerifyCode?mPhone=${mobile_phone}&messageType=注册`, '', 'GET').then((res) => {
            let userId = window.sessionStorage.getItem('userId');
            if (res.code === 200) {
                Utils.InsertVerifycodeRecordHttp(userId, 1, 1);
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
                // 1005
                Utils.InsertVerifycodeRecordHttp(userId, 1, 0, res.msg);
                Toast.fail(res.msg, 1);
            }
        }).catch(e => {
            console.log(e);
        });
    };

    registerCheckHttp = (key, type) => {  // 检查用户昵称、手机、邮箱是否已存在
        return new Promise((resolve, reject) => {
            axiosHttp(`api/WebSite/Register/Check?key=${key}&keyType=${type}`, '', 'GET').then((res) => {
                resolve(res);
            }).catch(e => {
                reject(e)
            })
        });
    };
    createUserHttp = (params) => {  //注册
        this.setState({loading: true});
        let ua = navigator.userAgent.toLowerCase(),
            isWeixin = ua.indexOf('micromessenger') !== -1;
        axiosHttp('api/WebSite/Register/CreateUser', {
            ...params,
            rgType: 'account',
            rgSource: isWeixin ? 'wechat_public' : 'wap',
            gzhOpenId: this.openid
        }).then((res) => {
            this.setState({loading: false});
            if (res.code === 200) {
                const {userId} = res.data;
                Utils.storageLoginInfoFun(res.data);
                let heatPage = this.storage.getItem('newProductHeat');
                if (heatPage) {
                    this.storage.removeItem('newProductHeat');
                    this.props.history.push('/newProductHeat');
                } else {
                    this.props.history.push('/personalCenter');
                }
                Utils.insertRegisterRecordHttp(1, userId);
            } else if (res.code === 1002) {//验证码过期
                Toast.fail(res.msg, 1);
                this.setState({
                    twoStepFlag: false,
                    timer: 60,
                    isSendCodeFlag: false
                }, () => {
                    const {nick_name, email, ...props} = this.params;
                    this.props.form.setFieldsValue(props);
                });
                Utils.insertRegisterRecordHttp(0, '', res.msg);
            } else {
                Toast.fail(res.msg, 1);
                Utils.insertRegisterRecordHttp(0, '', res.msg);
            }
        }).catch(e => {
            console.log(e);
        })
    };
    _handleNicknameRegisterCheck = (rule, value, callback) => { //验证昵称
        value = value.trim();
        if (!value) {
            callback('昵称不能为空');
        } else {
            this.registerCheckHttp(value, NICK_NAME).then(res => {
                if (res.code === 200) {
                    this.setState({
                        isExistFlag: false
                    });
                    callback();
                } else {
                    this.setState({
                        isExistFlag: true
                    });
                    callback('昵称已存在');
                }
            }).catch(e => {
                console.log(e);
            });
        }
    };
    _handleEmailRegisterCheck = (rule, value, callback) => { //验证邮箱
        let flag = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value);
        if (!value) {
            callback('邮箱不能为空');
        } else if (!flag) {
            callback('邮箱格式输入有误');
        } else {
            this.registerCheckHttp(value, EMAIL).then(res => {
                if (res.code === 200) {
                    this.setState({
                        isExistFlag: false
                    });
                    callback();
                } else {
                    this.setState({
                        isExistFlag: true
                    });
                    callback('邮箱已存在');
                }
            }).catch(e => {
                console.log(e);
            });
        }
    };
    validatorMobilePhone = (rule, value, callback) => { //验证手机号码是否存在
        let flag = /^1[0-9]{10}$/.test(value);
        if (!value) {
            callback('手机号码不能为空');
        } else if (!flag) {
            callback('11位数字');
        } else if (flag) {
            this.registerCheckHttp(value, PHONE).then(res => {
                if (res.code === 200) {
                    this.setState({
                        isExistFlag: false
                    });
                    if (this.state.isSendCodeFlag) {
                        let mPhone = this.storage.getItem('mPhone');
                        if (value !== mPhone) {
                            callback("收到验证码的号码和输入的号码不一致");
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                } else {
                    this.setState({
                        isExistFlag: true
                    });
                    callback('手机号码已存在');
                }
            }).catch(e => {
                console.log(e);
            });
        }
    };
    getPhoneValue = (value) => {
        this.pageInfo.mobile_phone = value;
        let checkOut = /^1[0-9]{10}$/.test(value);
        this.setState({
            phoneCheckOut: checkOut
        });
    };
    _handleCodeRegisterCheck = (rule, value, callback) => { //验证手机号码是否存在
        let flag = /^[0-9]{6}$/.test(value);
        if (!value) {
            callback('验证码不能为空');
        } else if (!flag) {
            callback('6位数字');
        } else {
            callback();
        }
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('密码输入不一致');
        } else {
            callback();
        }
    };
    handleConfirmBlur = (value) => {
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    render() {
        const {getFieldProps, getFieldError, getFieldsValue, getFieldsError} = this.props.form;
        let disabled = Utils.hasValues(getFieldsValue()) === true || Utils.hasErrors(getFieldsError()) === true;
        const style = {
            pa: {position: 'absolute'}
        };
        const {isSendCodeFlag, phoneCheckOut, timer, twoStepFlag, loading} = this.state;
        return (
            <Fragment>
                <NavBarCpn title="注册新账号"/>
                <div className="whiteSpace16"/>
                <form className="inputWrap" onSubmit={this._handleSubmit}>
                    {
                        twoStepFlag ? <Fragment>
                            <InputItem clear id="nickNameId" maxLength={30}
                                       {...getFieldProps('nick_name', {
                                           initialValue: '',
                                           rules: [{validator: this._handleNicknameRegisterCheck}],
                                           validateTrigger: 'onBlur',
                                       })}
                                       placeholder="设置昵称"
                            >
                            </InputItem>
                            {commonFun.ErrorWrap(getFieldError, 'nick_name')}
                            <InputItem clear
                                       {...getFieldProps('email', {
                                           initialValue: '',
                                           rules: [{
                                               validator: this._handleEmailRegisterCheck
                                           }],
                                           validateTrigger: 'onBlur',
                                       })}
                                       placeholder="邮箱"
                            >
                            </InputItem>
                            {commonFun.ErrorWrap(getFieldError, 'email')}
                        </Fragment> : <Fragment>
                            <InputItem clear
                                       {...getFieldProps('mobile_phone', {
                                           initialValue: '',
                                           onChange: this.getPhoneValue,
                                           rules: [{validator: this.validatorMobilePhone}],
                                           validateTrigger: 'onBlur',
                                       })}
                                       placeholder="手机号"
                            > </InputItem>
                            {commonFun.ErrorWrap(getFieldError, 'mobile_phone')}
                            <InputItem clear maxLength="6"
                                       {...getFieldProps('mb_verify_code', {
                                           initialValue: '',
                                           rules: [{
                                               validator: this._handleCodeRegisterCheck
                                           }],
                                           validateTrigger: 'onBlur',
                                       })}
                                       placeholder="验证码"
                            >
                                <Button onClick={this.getMphoneVerifyCodeHttp}
                                        className={`codeBtn ${phoneCheckOut && !isSendCodeFlag ? "active" : ""}`}
                                        style={style.pa}
                                        size="small">{isSendCodeFlag ? `剩余 ${timer}(s)` : "发送验证码"}</Button>
                            </InputItem>
                            {commonFun.ErrorWrap(getFieldError, 'mb_verify_code')}
                            <InputItem clear type="password"
                                       {...getFieldProps('password', {
                                           initialValue: '',
                                           rules: [
                                               {required: true, message: "密码不能为空"},
                                               {pattern: /^[0-9A-Za-z\S]{8,20}$/, message: "8位以上，数字/英文/符号组合"},
                                               {validator: this.validateToNextPassword}
                                           ],
                                           validateTrigger: 'onBlur',
                                       })}
                                       placeholder="密码"
                            >
                            </InputItem>
                            {commonFun.ErrorWrap(getFieldError, 'password')}
                            <InputItem clear type="password"
                                       {...getFieldProps('confirm', {
                                           initialValue: '',
                                           onBlur: this.handleConfirmBlur,
                                           rules: [
                                               {required: true, message: '确认密码不能为空'},
                                               {validator: this.compareToFirstPassword}
                                           ],
                                           validateTrigger: 'onBlur',
                                       })}
                                       placeholder="确认密码"
                            >
                            </InputItem>
                            {commonFun.ErrorWrap(getFieldError, 'confirm')}
                        </Fragment>
                    }
                    <Button className="defineBtn" disabled={disabled} loading={loading} size="large" type='primary'
                            onClick={this._handleSubmit}>{twoStepFlag ? '完成注册' : '下一步'}</Button>
                    <div className="jumpText tc">
                        已注册过，去 <Link to="/loginCpn" className="c_primary">登录</Link>
                    </div>
                </form>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(RegisterCpn));