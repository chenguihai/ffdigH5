import React, {Component, Fragment} from 'react';
import {InputItem, Button, Toast} from 'antd-mobile';
import axiosHttp from "../../utils/ajax";
import {createForm} from 'rc-form';
import {withRouter} from 'react-router-dom';
import NavBarCpn from "../../components/NavBarCpn";
import Utils from "../../utils/utils";
import commonFun from "../../utils/commonFun";
import './index.less'
// 昵称:1,手机:2,邮箱:3
const NICK_NAME = 1;

class BindPhone extends Component {
    state = {
        confirmDirty: false,
        errorInfo: '',
        twoStepFlag: false, //显示下一步的内容
        loading: false
    };
    pageInfo = {
        mobile_phone: "",
    };
    params = {};
    storage = window.sessionStorage;

    componentDidMount() {
        let data = this.storage.getItem('weChatData');
        if (data) {
            this.weChatData = JSON.parse(data);
            this.props.form.setFieldsValue({nickname: this.weChatData.nickname});
        }
        Utils.compositionInput('nickNameId', this);
    }

    _handleSubmit = () => {
        let param = this.props.form.getFieldsValue() || {};
        this.webInsertUserHttp({
            ...this.weChatData, ...param,
            rgSource: 'wechat_public',
            rgType: 'wechat'
        });
    };

    webInsertUserHttp = (params) => { // 微信关联注册
        this.setState({loading: true});
        axiosHttp('api/WeiXin/WeixinLogin/WxInsertUser', params).then((res) => {
            this.setState({loading: false});
            if (res.code === 200) {
                this.loginCommonFun(res.data);
            } else {
                Toast.fail(res.msg, 1);
                Utils.insertRegisterRecordHttp(0, '', res.msg);
            }
        }).catch(e => {
            console.log(e);
        });
    };
    loginCommonFun = (data) => {
        Utils.storageLoginInfoFun(data);
        this.props.history.push('/personalCenter');
        Utils.insertRegisterRecordHttp(1, data.userId);
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
    _handleNicknameRegisterCheck = (rule, value, callback) => { //验证昵称
        value = value.trim();
        if (!value) {
            callback('昵称不能为空');
        }else {
            this.registerCheckHttp(value, NICK_NAME).then(res => {
                if (res.code === 200) {
                    this.isExistFlag = false;
                    callback();
                } else {
                    this.isExistFlag = true;
                    callback('昵称已存在');
                }
            }).catch(e => {
                console.log(e);
            });
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
        if (value && value !== form.getFieldValue('pass_word')) {
            callback('密码输入不一致');
        } else {
            callback();
        }
    };
    handleConfirmBlur = (value) => {
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    render() {
        const {getFieldProps, getFieldError, getFieldsValue, getFieldsError} = this.props.form;
        let disabled = Utils.hasValues(getFieldsValue()) === true || Utils.hasErrors(getFieldsError()) === true;
        const {loading} = this.state;
        return (
            <Fragment>
                <NavBarCpn title="微信登录"/>
                <div className="whiteSpace16"/>
                <form className="inputWrap" onSubmit={this._handleSubmit}>
                    <InputItem id="nickNameId" maxLength={30} clear
                               {...getFieldProps('nickname', {
                                   initialValue: '',
                                   rules: [{validator: this._handleNicknameRegisterCheck}],
                                   validateTrigger: 'onBlur',
                               })}
                               placeholder="昵称15个字以内，中文/英文/数字组合"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'nickname')}
                    <InputItem clear type="password"
                               {...getFieldProps('pass_word', {
                                   initialValue: '',
                                   rules: [
                                       {required: true, message: "密码不能为空"},
                                       {pattern: /^[0-9A-Za-z\S]{8,20}$/, message: "密码（8位以上数字/英文/符号组合）"},
                                       {validator: this.validateToNextPassword}
                                   ],
                                   validateTrigger: 'onBlur',
                               })}
                               placeholder="密码"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'pass_word')}
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

                    <Button loading={loading} className="defineBtn" type='primary' disabled={disabled}
                            onClick={this._handleSubmit}
                    >立即绑定</Button>
                    <p className="jumpText tc">您可以在电脑PC端登录或联网：<span className="color_Link"
                    >www.ffdig.com</span></p>
                </form>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(BindPhone));