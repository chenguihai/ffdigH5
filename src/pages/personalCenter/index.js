import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {List} from 'antd-mobile';
import {Link} from 'react-router-dom';
import imgURL from '../../img/me/touxiang.png';
import zhanghao from '../../img/me/zhanghao.png';
import shoucangicon from '../../img/me/shoucangicon.png';
import sqrIcon from '../../img/detailPage/sqr.png';
// import fankuiicon from '../../img/me/fankuiicon.png';
import emitter from "../../utils/events";
import './index.less'

const Item = List.Item;

class PersonalCenter extends Component {
    state = {
        nickName: '',
        headImgUrl: '',
        isWeixin: false
    };
    storage = window.sessionStorage;
    eventEmitter = null;

    componentDidMount() {
        // console.log('PersonalCenter');
        this.storage.removeItem('newProductHeat');
        this.setStateCommonFun();
        this.eventEmitter = emitter.addListener('loginFlag', (message) => {
            this.setStateCommonFun();
        });
    }

    setStateCommonFun = () => {
        let session = window.sessionStorage,
            ua = navigator.userAgent.toLowerCase(),
            isWeixin = ua.indexOf('micromessenger') !== -1;
        console.log('setStateCommonFun');
        this.setState({
            nickName: session.getItem("nickName") || '',
            headImgUrl: session.getItem('headImgUrl') || '',
            isWeixin: isWeixin
        });
    };
    _handleLoginOrRegister = () => {
        let nickName = window.sessionStorage.getItem('nickName');
        if (nickName) {
            this.props.history.push('/accountInfoCpn');
        } else {
            this.props.history.push('/loginCpn');
        }
    };
    _handleAccountInfo = () => {
        if (!this.state.nickName) {
            this.props.history.push('/loginCpn');
        } else {
            this.props.history.push('/accountInfoCpn');
        }
    };
    _handleLookCollect = () => {
        if (!this.state.nickName) {
            this.props.history.push('/loginCpn');
        } else {
            this.props.history.push('/myCollect');
        }
    };

    componentWillUnmount() {
        this.eventEmitter = null;
    }

    render() {
        const {nickName, headImgUrl, isWeixin} = this.state;
        return (
            <div className="personalWrap">
                <div className="avatar" onClick={this._handleLoginOrRegister}>
                    <img className="img" src={headImgUrl || imgURL} alt="头像"/>
                    <span className="text">{nickName === '' ? '登录/注册' : nickName}</span>
                </div>
                <List className="listWrap">
                    <Item thumb={zhanghao} arrow="horizontal" onClick={this._handleAccountInfo}>账号信息</Item>
                    <Item thumb={shoucangicon} onClick={this._handleLookCollect} arrow="horizontal">我的收藏</Item>
                    {/*<Item thumb={fankuiicon} onClick={this._handleLookCollect} arrow="horizontal">我要反馈</Item>*/}
                </List>
                {
                    !isWeixin ? <div className="centerCode">
                        <p className="title">微信访问火联，请关注公众号</p>
                        <img className="img" src={sqrIcon} alt="微信二维码"/>
                        <p className="wxDesc">微信扫一扫</p>
                        <p className="emTitle">或微信搜索公众号“ffdig火联”</p>
                    </div> : null
                }
                <div className={`linkWrap ${isWeixin ? 'fixed' : 'active'}`}>
                    <Link to="/aboutWe">
                        <div className="aboutWe"><i className="aboutIcon"/><span>关于我们</span></div>
                    </Link>
                    <div className="linkPc">网址访问<span> www.ffdig.com</span></div>
                </div>
            </div>
        );
    }
}

export default withRouter(PersonalCenter);