import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {InputItem, Button, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import NavBarCpn from "../NavBarCpn";
import axiosHttp from "../../utils/ajax";
import Utils from "../../utils/utils";
import commonFun from "../../utils/commonFun";
import './index.less'

class ModifyPwdCpn extends Component {
    state = {
        confirmDirty: false,
    };
    pageInfo = {};

    componentDidMount() {
        this.pageInfo = this.props.match.params;
    }

    _handleSubmitConfirmReset = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.forgotPwdHttp(values);
            }
        });
    };
    forgotPwdHttp = (value) => {  // 重置密码
        const {password} = value, storage = window.sessionStorage;

        const {myPhone, mb} = this.pageInfo;
        let params = {
            "mobile_phone": myPhone,
            "mb_verify_code": mb,
            "new_password": password,
            "gzhOpenId": storage.getItem('openid'),
            "visitor_state": 'gzh'
        };
        axiosHttp('api/WebSite/Login/ForgotPwd', params).then((res) => {
            let userId = window.sessionStorage.getItem('userId');
            if (res.code === 200) {
                Utils.InsertUpdatePwdRecordHttp(userId, 1, 1);
                Toast.success('密码修改成功', 1);
                Utils.storageLoginInfoFun(res.data);
                this.props.history.push('/personalCenter');
            } else if (res.code === 1003) { //验证码失效
                Utils.InsertUpdatePwdRecordHttp(userId, 1, 0, res.msg);
                this.props.history.push('/forgetPasswordCpn');
            } else {
                Utils.InsertUpdatePwdRecordHttp(userId, 1, 0, res.msg);
                Toast.success(res.msg, 1);
            }
        }).catch(e=>{
            console.log(e);
        })
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (!value) {
            callback('密码不能为空');
        } else if (value && value !== form.getFieldValue('password')) {
            callback('密码输入不一致');
        } else {
            callback();
        }
    };
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (!value) {
            callback('密码不能为空！');
        } else if (!/^[0-9A-Za-z\S]{8,20}$/.test(value)) {
            callback('密码输入格式有误');
        } else if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };
    handleConfirmBlur = (value) => {
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    render() {
        const {getFieldProps, getFieldError, getFieldsValue, getFieldsError} = this.props.form;
        let disabled = Utils.hasValues(getFieldsValue()) === true || Utils.hasErrors(getFieldsError()) === true;
        return (
            <Fragment>
                <NavBarCpn title="修改登录密码"/>
                <div className="whiteSpace16"/>
                <form className="inputWrap" onSubmit={this._handleSubmit}>
                    <InputItem clear type="password"
                               {...getFieldProps('password', {
                                   initialValue: '',
                                   rules: [{validator: this.validateToNextPassword}],
                                   validateTrigger: 'onBlur',
                               })}
                               placeholder="新密码"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'password')}
                    <InputItem clear type="password"
                               {...getFieldProps('confirm', {
                                   initialValue: '',
                                   onBlur: this.handleConfirmBlur,
                                   rules: [{validator: this.compareToFirstPassword}],
                                   validateTrigger: 'onBlur',
                               })}
                               placeholder="确认密码"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'confirm')}
                    <Button className="defineBtn" disabled={disabled} type='primary'
                            onClick={this._handleSubmitConfirmReset}>确认修改密码</Button>
                    <div className="jumpText tc">
                        已想起密码，去<Link to="/loginCpn" className="c_primary">登录</Link>
                    </div>
                </form>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(ModifyPwdCpn));