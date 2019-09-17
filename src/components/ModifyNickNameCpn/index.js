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
const NICK_NAME = 1;

class ForgetPasswordCpn extends Component {
    state = {
        nickName: '',
        loading: false,
    };
    nickName = '';

    componentDidMount() {
        this.nickName = this.props.match.params.nickName;
        this.props.form.setFieldsValue({nick_name: this.nickName});
        Utils.compositionInput('nickNameId', this);
    }

    _handleSubmit = () => {
        let value = this.props.form.getFieldsValue() || {};
        this.updateAccountHttp(value);
    };
    updateAccountHttp = (params) => {  //修改信息
        this.setState({loading: true});
        axiosHttp('api/UserSite/AccountManage/UpdateAccount', params).then((res) => {
            this.setState({loading: false});
            if (res.code === 200) {
                Toast.success('修改成功', 1);
                this.props.history.push('/accountInfoCpn');
            } else {
                Toast.fail(res.msg, 1);
            }
        }).catch(e => {
            console.log(e);
        })
    };
    checkoutNicknamechange = (rule, value, callback) => { //验证昵称
        value = value.trim();
        if (!value) {
            callback('昵称不能为空');
        } else {
            if (this.nickName === value) {
                callback('昵称已存在');
                return;
            }
            this.checkExistHttp(value, NICK_NAME).then(res => {
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
    checkExistHttp = (key, type) => {  //检查用户昵称、手机、邮箱是否已存在
        return new Promise((resolve, reject) => {
            axiosHttp(`api/UserSite/AccountManage/CheckExist?key=${key}&keyType=${type}`, "", "GET").then((res) => {
                resolve(res);
            }).catch(e => {
                reject(e)
            });
        });
    };

    render() {
        const {getFieldProps, getFieldError, getFieldsValue, getFieldsError} = this.props.form;
        let disabled = Utils.hasValues(getFieldsValue()) === true || Utils.hasErrors(getFieldsError()) === true;
        const {loading} = this.state;
        return (
            <Fragment>
                {/*修改昵称/修改手机号*/}
                <NavBarCpn title='修改昵称'/>
                <div className="whiteSpace16"/>
                <form className="inputWrap" onSubmit={this._handleSubmit}>
                    <InputItem id="nickNameId" clear maxLength={30}
                               {...getFieldProps('nick_name', {
                                   initialValue: '',
                                   rules: [
                                       {
                                           validator: this.checkoutNicknamechange
                                       }
                                   ],
                                   validateTrigger: 'onBlur'
                               })}
                               placeholder="昵称"
                    />
                    <div className="inputExplain">中文/英文/数字组合，限15个字</div>
                    {commonFun.ErrorWrap(getFieldError, 'nick_name')}
                    <Button className="defineBtn" loading={loading} disabled={disabled} type='primary'
                            onClick={this._handleSubmit}>确认</Button>
                </form>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(ForgetPasswordCpn));