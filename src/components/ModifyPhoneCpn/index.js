import React, {Component, Fragment} from 'react';
import {withRouter} from 'react-router-dom';
import {InputItem, Button, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import NavBarCpn from "../NavBarCpn";
import axiosHttp from "../../utils/ajax";
import Utils from "../../utils/utils";
import commonFun from "../../utils/commonFun";
import './index.less'
// 昵称:1,手机:2,邮箱:3
const PHONE = 2;

class ModifyPhoneCpn extends Component {
    state = {
        timer: 60, //验证码的倒计时
        nick_nameFlag: false,
        emailFlag: false,
        mobile_phoneFlag: false,
        isChangePhoneFlag: false,
        confirmFlag: false,
        isSendCodeFlag: false,
        confirmDirty: false,
        phoneCheckOut: false,
        accountData: {},
        myPhone: '',
        loading: false,
    };
    isExistFlag = false;
    pageInfo = {
        mPhone: "",
    };
    storage = window.sessionStorage;

    componentDidMount() {
        let mPhone = this.props.match.params.mPhone;
        this.setState({
            myPhone: mPhone
        });
        this.pageInfo.mPhone = mPhone;
    }

    _handleSubmit = () => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
                this.pageInfo.mPhone = value.phone;
                this.pageInfo.mb_verify_code = value.code;
                this.updateAccountHttp(value);
            }
        });
    };
    updateAccountHttp = (params) => {  //修改信息
        this.setState({loading: true});
        axiosHttp('api/UserSite/AccountManage/UpdateAccount', params).then((res) => {
            this.setState({loading: false});
            if (res.code === 200) {
                Toast.success(res.msg, 1);
                this.props.history.push('/accountInfoCpn');
            } else if (res.code === 1003) { //验证码错误
                Toast.fail(res.msg, 1);
                this.setState({
                    isSendCodeFlag: false,
                    timer: 60
                })
            } else {
                Toast.fail(res.msg, 1);
            }
        }).catch(e => {
            console.log(e);
        })
    };
    checkoutPhoneBlur = (rule, value, callback) => { //验证手机号码是否存在
        let flag = /^1[0-9]{10}$/.test(value);
        if (!value) {
            callback('手机号码不能为空');
        } else if (!flag) {
            callback('11位数字');
        } else if (flag) {
            this.checkExistHttp(value, PHONE).then(res => {
                if (res.code === 200) {
                    this.isExistFlag = false;
                    if (this.state.isSendCodeFlag) {
                        if (value !== this.pageInfo.mPhone) {
                            callback("收到验证码的号码和输入的号码不一致");
                        } else {
                            callback();
                        }
                    } else {
                        callback();
                    }
                } else {
                    this.isExistFlag = true;
                    callback('手机号码已存在');
                }
            }).catch(e => {
                console.log(e);
            });
        }
    };
    getMphoneVerifyCodeHttp = () => {         // 获取手机验证码
        const {myPhone, isSendCodeFlag} = this.state;
        const {mPhone} = this.pageInfo;
        if (this.isExistFlag || isSendCodeFlag || mPhone === myPhone) {
            return
        }
        this.setState({
            isSendCodeFlag: true
        });
        axiosHttp(`api/WebSite/GetPhoneVerifyCode/GetMphoneVerifyCode?mPhone=${mPhone}&messageType=修改密码`, '', 'GET').then((res) => {
            let userId = window.sessionStorage.getItem('userId');
            if (res.code === 200) {
                Utils.InsertVerifycodeRecordHttp(userId, 3, 1);
                this.timer = setInterval(() => {
                    if (this.state.timer < 1) {
                        this.setState({
                            isSendCodeFlag: false
                        });
                        clearInterval(this.timer);
                        return;
                    }
                    this.setState({
                        timer: this.state.timer - 1
                    })
                }, 1000);
            } else {
                Utils.InsertVerifycodeRecordHttp(userId, 3, 0, res.msg);
                Toast.fail(res.msg, 1);
            }
        }).catch(e => {
            console.log(e);
        });
    };
    checkExistHttp = (key, type) => {  //检查用户昵称、手机、邮箱是否已存在
        return new Promise((resolve, reject) => {
            axiosHttp(`api/UserSite/AccountManage/CheckExist?key=${key}&keyType=${type}`, "", "GET").then((res) => {
                resolve(res);
            }).catch(e => {
                reject(e)
            });
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
        const {myPhone, phoneCheckOut, isSendCodeFlag, timer, loading} = this.state;
        const style = {
            pa: {position: 'absolute'}
        };
        return (
            <Fragment>
                {/*修改昵称/修改手机号*/}
                <NavBarCpn title='修改手机号'/>
                <div className="whiteSpace16"/>
                <form className="inputWrap" onSubmit={this._handleSubmit}>
                    <InputItem clear
                               {...getFieldProps('mobile_phone', {
                                   initialValue: `${myPhone}`,
                                   onChange: this.getPhoneValue,
                                   rules: [
                                       {
                                           validator: this.checkoutPhoneBlur
                                       }
                                   ],
                                   validateTrigger: 'onBlur'
                               })}
                               placeholder="手机号"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'mobile_phone')}
                    <InputItem clear
                               {...getFieldProps('mb_verify_code', {
                                   initialValue: '',
                                   rules: [
                                       {required: true, message: '验证码不能为空'},
                                       {pattern: /^[0-9]{6}$/, message: "6位数数字"}
                                   ],
                                   validateTrigger: 'onBlur'
                               })}
                               placeholder="验证码"
                    >
                        <Button onClick={this.getMphoneVerifyCodeHttp}
                                className={`codeBtn ${phoneCheckOut && !isSendCodeFlag ? "active" : ""}`}
                                style={style.pa}
                                size="small">{isSendCodeFlag ? `剩余 ${timer}(s)` : "发送验证码"}</Button>
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'mb_verify_code')}
                    <Button className="defineBtn" loading={loading} disabled={disabled} type='primary'
                            onClick={this._handleSubmit}>确认</Button>
                </form>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(ModifyPhoneCpn));