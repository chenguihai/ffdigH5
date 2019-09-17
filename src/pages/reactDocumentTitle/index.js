import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom'
import wx from 'weixin-js-sdk'
import axiosHttp from "../../utils/ajax";
import emitter from "../../utils/events";
import config from "../../config/config";
import Utils from "../../utils/utils";

var _hmt = _hmt || [];
const title = {
    myCollect: '我的收藏',
    goodsDetail: '产品详情',
    loginCpn: '登录',
    registerCpn: '注册新账号',
    forgetPasswordCpn: '找回密码',
    modifyPwdCpn: '修改登录密码',
    bindPhone: '绑定手机号码',
    accountInfoCpn: '账号信息',
    modifyNickNameCpn: '修改昵称',
    modifyPhoneCpn: '修改手机号',
    modifyResetPwdCpn: '重置密码',
    searchListCpn: '搜索',
    hotProducts: '热门优品',
    firstPage: '火联-网罗全球优品 洞察产品趋势',
    searchPage: '搜罗产品',
    specialPage: '精选专栏',
    personalCenter: '个人中心',
    goodsClassifyCpn: '产品分类',
    registerPhoneCpn: '微信登录',
    promotionPage: '火联网罗全球优品',
    womenFashion: '火联网罗全球优品',
    newProductHeat: '各品牌站热评新品趋势',
};

class ReactDocumentTitle extends Component {
    state = {
        recordParam: '', //埋点的参数
    };
    pathname = "";
    shareImg = '';
    shareDesc = '';
    isIosFlag = '';
    autographCount = 0;
    eventEmitter = null;

    componentDidMount() {
        // if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent) && document.URL.indexOf('.baidu.com') === -1) { //路径重定向
        //     window.location.href = "http://ffdig.gw-ec.com/";
        // }
        let pathname = this.props.history.location.pathname.substring(1);
        window.sessionStorage.setItem('initLink', '');
        if (pathname !== 'registerPhoneCpn') {
            Utils.openWeixinCommonFun(pathname);
        }
        let storage = window.sessionStorage,
            nickName = storage.getItem("nickName"),
            ua = navigator.userAgent.toLowerCase(),
            isWeixin = ua.indexOf('micromessenger') !== -1;
        console.log('storageLoginInfoFun');
        if (!nickName) {
            let {search} = window.location;
            if (search) {
                storage.setItem("wcParams", search);
                let wcParams = storage.getItem("wcParams");
                if (wcParams && isWeixin) {
                    this.webUserAuthHttp(wcParams);
                }
            }
        }
        this.commonFun();
        this.getUrlSearchParam();
        this.props.history.listen((e) => {
            // todo
            _hmt.push(['_trackPageview', e.pathname]);
            this.commonFun(e.pathname);
            this.getUrlSearchParam();
        });
        let visitId = window.localStorage.getItem('visitId');
        if (!visitId) {
            this.createWebSiteVidHttp(); //获取访客唯一id
        }
        // const ua = window.navigator.userAgent.toLowerCase();
// 如果不在微信浏览器内，微信分享也没意义了对吧？这里判断一下
//         if (ua.indexOf('micromessenger') < 0) return false;

// 最好在在 router 的全局钩子里调用这个方法，每次页面的 URL 发生变化时，都需要重新获取微信分享参数
// 如果你的 router 使用的是 hash 形式，应该不用每次都重新获取微信分享参数
//         const data = axiosHttp.post({
//             url: '当前页面的 URL',
//             // xxx
//             // xxx
//         });
//         this.getJsSdkSignatureHttp();
        wx.error((res) => {
            if (this.autographCount === 1) {
                return;
            }
            ++this.autographCount;
            this.getJsapiTicketHttp();
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            // this.getJsSdkSignatureHttp();
        });
        this.eventEmitter = emitter.addListener('detailPage', (message) => {
            this.commonFun();
        });
    }

    webUserAuthHttp = (wcParams) => {  //web微信用户授权
        axiosHttp('api/WeiXin/WeixinLogin/GzhSnsapiBase' + wcParams, '', 'GET').then((res) => {
            if (res.code === 200) {
                if (res.data === null) {
                    return;
                }
                Utils.insertLoginRecordHttp(0, '', res.msg);
            } else if (res.code === 210) {//已授权，直接扫码登录
                let storage = window.sessionStorage;
                storage.removeItem("wcParams");
                // storage.setItem('isWeixinLogin', '');
                this.loginCommonFun(res.data);
            }
        }).catch(e => {
            console.log(e);
        });
    };
    loginCommonFun = (data) => {
        Utils.storageLoginInfoFun(data);
        if (this.props.history.location.pathname === '/registerPhoneCpn') {
            this.props.history.push('/personalCenter');
        }
        Utils.insertLoginRecordHttp(1, data.userId);
        console.log('loginCommonFun');
        this.eventEmitter = emitter.emit('loginFlag', true);
    };
    getUrlSearchParam = () => {
        let {search} = window.location, storage = window.sessionStorage,
            nickName = storage.getItem('nickName'), recordParam = storage.getItem('recordParam') || '';
        this.setState({
            recordParam: nickName ? '' : recordParam
        });
        if (search.indexOf('utm_campaign') < 0) {
            return
        }
        let obj = {}, searchArr = search.substring(1,).split('&');
        for (let i = 0; i < searchArr.length; i++) {
            let [name, value] = searchArr[i].split('=');
            obj[name] = value;
        }
        storage.setItem('recordParam', JSON.stringify(obj));
        if (!nickName) {
            this.setState({
                recordParam: obj
            });
        }
    };
    commonFun = (pathNames = '') => {
        const session = window.sessionStorage, storage = window.localStorage;
        if (!session.getItem('initLink')) {
            session.setItem('initLink', window.location.href)
        }
        // 非ios设备，切换路由时候进行重新签名
        if (window.__wxjs_is_wkwebview !== true) {
            this.isIosFlag = false;
        }

        // ios 设备进入页面则进行js-sdk签名
        if (window.__wxjs_is_wkwebview === true) {
            this.isIosFlag = true;
        }
        let name = pathNames || this.props.history.location.pathname;
        let pathname = name.substring(1).split('/')[0];
        let detailPage = session.getItem('detailPages');
        this.origin = '';
        this.shareDesc = '致力于网罗全球优质、市场前沿产品，提供产品精选服务，激发产品设计灵感，帮助用户发掘吻合自己需求或最具市场潜力价值产品。';
        if ((pathname === 'newProductHeat' || pathname === 'myCollect' || pathname === 'specialPage' || pathname === 'searchPage') && detailPage) { //全球优品
            let productId = session.getItem('productId');
            this.pathname = storage.getItem('shareTitle');
            this.shareImg = storage.getItem('shareImg');
            this.shareDesc = storage.getItem('shareDesc');
            this.origin = window.location.origin + '/goodsDetail/' + productId;
        } else if (pathname === 'goodsDetail') { //详情页面
            this.pathname = storage.getItem('shareTitle');
            this.shareImg = storage.getItem('shareImg');
            this.shareDesc = storage.getItem('shareDesc');
            // this.origin = '';
        } else if (pathname === 'specialPage') {
            this.pathname = storage.getItem('shareTitle');
            this.shareImg = config.serverUrl + 'shareLogo.png';
        } else {
            // this.shareDesc = '';
            // this.origin = '';
            this.pathname = title[pathname];
            this.shareImg = config.serverUrl + 'shareLogo.png';
        }
        document.title = this.pathname || '火联网罗全球优品';
        this.getJsSdkSignatureHttp();
    };
    getJsapiTicketHttp = () => {    // 获取jssdk临时票据jsapi_ticket
        axiosHttp('api/WeiXin/WeixinLogin/GetJsapiTicket', "", "GET").then((res) => {
            if (res.code === 200) {
                this.getJsSdkSignatureHttp();
            } else {
                this.getJsSdkSignatureHttp();
            }
        }).catch(e => {
            console.log(e);
        });
    };
    createWebSiteVidHttp = () => { // 获取访客唯一id
        axiosHttp('api/Record/UserRecord/CreateWebSiteVid', '', 'get').then((res) => {
            if (res.code === 200) {
                window.localStorage.setItem('visitId', res.data || '');
            }
        }).catch(e => {
            console.log(e);
        })
    };
    // 完整的url链接
    getJsSdkSignatureHttp = () => { //获取jssdk签名
        // this.href
        axiosHttp('api/WeiXin/WeixinLogin/GetJsSdkSignature?url=' + (this.isIosFlag ? encodeURIComponent(window.sessionStorage.getItem('initLink')) : encodeURIComponent(window.location.href)), "", "GET").then((res) => {
            if (res.code === 200) {
                const {appId, timestamp, nonceStr, signature} = res.data;
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: appId, // 必填，公众号的唯一标识
                    timestamp: timestamp, // 必填，生成签名的时间戳
                    nonceStr: nonceStr, // 必填，生成签名的随机串
                    signature: signature,// 必填，签名，见附录1
                    jsApiList: [
                        'onMenuShareAppMessage',
                        'onMenuShareTimeline',
                        // 'updateAppMessageShareData',
                        // 'updateTimelineShareData',
                        // 微信新版1.4.0暂不支持安卓，故这里要两个接口一起调用下
                    ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                let data = {
                    link: this.origin || window.location.href,
                    imgUrl: this.shareImg, // 分享图标
                    title: document.title || '火联网罗全球优品', // 分享标题
                    desc: '',
                    success: () => {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                };


                wx.ready(() => {
                    //分享给朋友
                    wx.onMenuShareAppMessage({...data, desc: this.shareDesc});
                    // wx.updateAppMessageShareData({...data, desc: this.shareDesc});

                    //分享到朋友圈
                    wx.onMenuShareTimeline(data);
                    // wx.updateTimelineShareData(data);
                });
            }
        }).catch(e => {
            console.log(e);
        });
    };

    componentWillUnmount() {
        this.eventEmitter = null;
        // window.sessionStorage.removeItem('initLink');
    }

    render() {
        const {recordParam} = this.state;
        // return React.Children.only(this.props.children)
        return (<Fragment>
            {
                this.props.children
            }
            {/*关注火联*/}
            {
                recordParam ?
                    <div className="followWrap">
                        <Link className="moreProduct" to="/aboutWe">
                            <span>关注</span>
                            <span>火联</span>
                        </Link>
                    </div> : null
            }
        </Fragment>)
    }
}

export default withRouter(ReactDocumentTitle)