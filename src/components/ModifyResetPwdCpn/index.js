import React, {Component, Fragment} from 'react';
import {InputItem, Button} from 'antd-mobile';
import {createForm} from 'rc-form';
import NavBarCpn from "../NavBarCpn";
import axiosHttp from "../../utils/ajax";
import {withRouter} from "react-router-dom";
import Utils from "../../utils/utils";
import {Toast} from "antd-mobile/es";
import commonFun from "../../utils/commonFun";
import './index.less'

class ForgetPasswordCpn extends Component {
    state = {
        confirmDirty: false,
        loading: false,
    };

    _handleSubmit = () => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
                this.updateAccountHttp(value);
            }
        });
    };
    updateAccountHttp = (params) => {  //修改信息
        this.setState({loading: true});
        axiosHttp('api/UserSite/AccountManage/UpdateAccount', params).then((res) => {
            this.setState({loading: false});
            let userId = window.sessionStorage.getItem('userId');
            if (res.code === 200) {
                Utils.InsertUpdatePwdRecordHttp(userId, 2, 1);
                Toast.success('密码修改成功', 1);
                this.props.history.push('/accountInfoCpn');
            } else {
                Utils.InsertUpdatePwdRecordHttp(userId, 2, 0, res.msg);
                Toast.fail(res.msg, 1);
            }
        }).catch(e => {
            console.log(e);
        })
    };
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('new_password')) {
            callback('新密码和确认密码不一样!');
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
    handleConfirmBlur = (value) => {
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    render() {
        const {getFieldProps, getFieldError, getFieldsError, getFieldsValue} = this.props.form;
        let disabled = Utils.hasValues(getFieldsValue()) === true || Utils.hasErrors(getFieldsError()) === true;
        const {loading} = this.state;
        return (
            <Fragment>
                {/*修改昵称/修改手机号*/}
                <NavBarCpn title='重置密码'/>
                <div className="whiteSpace16"/>
                <form className="inputWrap" onSubmit={this._handleSubmit}>
                    <InputItem type="password" clear
                               {...getFieldProps('old_password', {
                                   initialValue: '',
                                   rules: [
                                       {required: true, message: "密码不能为空"},
                                   ],
                                   validateTrigger: 'onBlur'
                               })}
                               placeholder="旧密码"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'old_password')}
                    <InputItem type="password" clear
                               {...getFieldProps('new_password', {
                                   initialValue: '',
                                   rules: [
                                       {required: true, message: "密码不能为空"},
                                       {validator: this.validateToNextPassword},
                                       {pattern: /^[0-9A-Za-z\S]{8,20}$/, message: "密码格式不对"}
                                   ],
                                   validateTrigger: 'onBlur'
                               })}
                               placeholder="新密码"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'new_password')}
                    <InputItem type="password" clear
                               {...getFieldProps('confirm', {
                                   initialValue: "",
                                   onBlur: this.handleConfirmBlur,
                                   rules: [{
                                       required: true, message: '确认密码不能为空',
                                   }, {validator: this.compareToFirstPassword}],
                                   validateTrigger: 'onBlur'
                               })}
                               placeholder="确认密码"
                    >
                    </InputItem>
                    {commonFun.ErrorWrap(getFieldError, 'confirm')}
                    <Button className="defineBtn" loading={loading} disabled={disabled} type='primary'
                            onClick={this._handleSubmit}>确认</Button>
                </form>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(ForgetPasswordCpn));