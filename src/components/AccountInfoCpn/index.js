import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {List, Button, Modal, NavBar} from 'antd-mobile';
import axiosHttp from "../../utils/ajax";

import './index.less'

const Item = List.Item;
const alert = Modal.alert;

class AccountInfoCpn extends Component {
    state = {
        accountData: {}
    };
    storage = window.sessionStorage;

    componentDidMount() {
        let search = window.location.search;
        if (search) {
            this.storage.setItem("wcParams", search);
            let wcParams = this.storage.getItem("wcParams");
            if (wcParams) {
                this.getOpenIdByGzhSnsapiBase(wcParams);
            }
        }
        this.getAccountHttp();
    }

    getOpenIdByGzhSnsapiBase = (wcParams) => { // 公众号静默授权获取用户openID
        axiosHttp('api/WeiXin/WeixinLogin/GetOpenIdByGzhSnsapiBase' + wcParams, '', 'get').then((res) => {
            if (res.code === 200) {
                this.openid = JSON.parse(res.data).openid;
                window.sessionStorage.setItem('openid', this.openid);
            }
        }).catch(e=>{
            console.log(e);
        })
    };
    getAccountHttp = () => {  //修改信息
        axiosHttp('api/UserSite/AccountManage/GetAccount', "", "GET").then((res) => {
            if (res.code === 200) {
                this.setState({
                    accountData: res.data
                });
            } else {
                this.setState({
                    errorInfo: res.msg
                });
            }
        }).catch(e=>{
            console.log(e);
        })
    };

    gzhLoginStateClearCacheHttp = (openid = '') => {  //公众号退出清除缓存登录状态
        axiosHttp('api/WebSite/Login/GzhLoginStateClearCache?gzhOpenId=' + openid, "", "GET").then((res) => {
            if (res.code === 200) {

            } else {

            }
        }).catch(e=>{
            console.log(e);
        })
    };

    _handleOnPress = () => {
        let storage = window.sessionStorage,
            openid = storage.getItem('openid');
        openid && this.gzhLoginStateClearCacheHttp(openid);
        storage.clear();
        // storage.setItem('logout', true);
        this.props.history.push('/personalCenter');
    };

    render() {
        const {email, mPhone, nickName, rgSource} = this.state.accountData;
        return (
            <div className="accountWrap">
                <NavBar className="navBarWrap"
                        mode="light"
                        leftContent={[<i key="1" className="fanhui"/>]}
                        onLeftClick={() => this.props.history.push('/personalCenter')}
                >账号信息</NavBar>
                <div className="whiteSpace16"/>
                <List className="listWrap active">
                    <Item arrow="horizontal" onClick={() => {
                        this.props.history.push('/modifyNickNameCpn/' + nickName);
                    }}
                    >
                        <div className="itemWrap">
                            <span className="title">昵称</span>
                            <span className="text">{nickName}</span>
                        </div>
                    </Item>
                    <Item arrow="horizontal">
                        <div className="itemWrap">
                            <span className="title">邮箱</span>
                            <span className="text">{email}</span>
                        </div>
                    </Item>
                    <Item arrow="horizontal" onClick={() => {
                        this.props.history.push('/modifyPhoneCpn/' + mPhone);
                    }}>
                        <div className="itemWrap">
                            <span className="title">手机</span>
                            <span className="text">{mPhone}</span>
                        </div>
                    </Item>
                    <Item arrow="horizontal" onClick={() => {
                        this.props.history.push('/modifyResetPwdCpn');
                    }}>
                        <div className="itemWrap">
                            <span className="title">密码</span>
                            <span className="text">*******</span>
                        </div>
                    </Item>
                </List>
                <Button className="defineBtn" type="primary" onClick={() =>
                    alert('退出登录', '你确定退出登录吗?', [
                        {text: '取消'},
                        {
                            text: '确定',
                            onPress: this._handleOnPress
                        },
                    ])
                }>退出当前账号</Button>
            </div>

        );
    }
}

export default withRouter(AccountInfoCpn);