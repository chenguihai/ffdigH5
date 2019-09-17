import React, {Component} from 'react';
import {Link} from "react-router-dom";
import axiosHttp from "../../utils/ajax";
import topIcon from "../../img/heat/top.png";
import num1Icon from "../../img/heat/1.png";
import num2Icon from "../../img/heat/2.png";
import num3Icon from "../../img/heat/3.png";
import GoodsDetail from "../goodsDetail";
import emitter from "../../utils/events";
import commonFun from "../../utils/commonFun";
import moment from "moment";

import placeholder from '../../img/placeholder.jpg';
import heatIcon from '../../img/xiiangqing-icon-xin-dianzhong@2x.png';
import './index.less'
// 背景色
const colorStatic = ['#FFE9E9', '#FFF6EC', '#E1FFFB'];
// 背景色阴影
const listColorRgbaStatic = ['rgba(255, 170, 170,.8)', 'rgba(255, 196, 131,.8)', 'rgba(166, 220, 213,.8)'];
// 边框色
const listColorStatic = ['#FFAAAA', '#FFC483', '#A6DCD5'];
// 数字图片1，2，3
const numIconStatic = [num1Icon, num2Icon, num3Icon];

class NewProductHeat extends Component {
    state = {
        hotData: [],
        listData: [],
        selectIndex: 0,
        isDetailFlag: false,
        productId: '',
        isLoginFlag: window.sessionStorage.getItem('nickName') || '',
        clientHeight: 861,
        position: '',
    };
    isCollectArr = [];

    componentDidMount() {
        this.getHotReviewDataHttp();
        var mybody = document.getElementsByTagName('body')[0];
        var startX, startY, moveEndX, moveEndY, X, Y;
        mybody.addEventListener('touchstart', (e) => {
            // e.preventDefault();
            startX = e.touches[0].pageX;
            startY = e.touches[0].pageY;
        }, false);
        // mybody.addEventListener('touchend', (e) => {
        //     // e.preventDefault();
        //     commonFun.lazyLoadBgImgFun();
        // }, false);
        mybody.addEventListener('touchmove', (e) => {
            // e.preventDefault();
            moveEndX = e.changedTouches[0].pageX;
            moveEndY = e.changedTouches[0].pageY;
            X = moveEndX - startX;
            Y = moveEndY - startY;
            if (!this.state.isLoginFlag) {
                return
            }
            if (Math.abs(X) > Math.abs(Y) && X > 0) {// right
                console.log('向右');
            } else if (Math.abs(X) > Math.abs(Y) && X < 0) {// left
                console.log('向左');
            } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {// down
                let heatRef = this.refs.heatListUlTopRef;
                if (heatRef && heatRef.scrollTop === 0) {
                    this.setState({
                        position: ''
                    })
                }
            } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {// up
                if (this.state.clientHeight < startY) {
                    this.setState({
                        position: 'top'
                    })
                }
            } else {//没有发生滑动
                console.log('没有发生滑动');
            }
        });
    }

    handleScroll = () => {
        console.log('handleScroll');
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            commonFun.lazyLoadBgImgFun();
        }, 100);
    };
    _handleSpecialSite = (index) => {
        commonFun.clearLazyImgAttFun();
        this.setState({
            selectIndex: index,
            listData: this.state.hotData[index].dates
        }, () => {
            commonFun.lazyLoadBgImgFun();
            this.refs.heatListUlTopRef.scrollTo(0, 0);
            // if (!this.isCollectArr[index]) {
            //     this.isCollectArr[index] = 1;
            //     this.checkIsCollectHttp();
            //     console.log(94, this.isCollectArr);
            // }
        })
    };
    _handleJumpToDetail = (id) => {
        let session = window.sessionStorage;
        session.setItem('detailPages', 'detailPage');
        session.setItem('productId', id);
        this.setState({
            isDetailFlag: true,
            productId: id
        })
    };
    // _handleCollectProduct = (item) => {
    //     if (!this.state.isLoginFlag) {
    //         return
    //     }
    //     if (item.isCollect) {
    //         this.deleteProductCollectHttp(item.object_id);
    //     } else {
    //         this.insertOrUpdateProductCollectHttp(item);
    //     }
    //     console.log(item.object_id);
    // };
    _handleClose = () => {
        this.setState({
            isDetailFlag: false
        });
        this.emitterCommonFun();
    };
    emitterCommonFun = () => {
        this.eventEmitter = emitter.emit('detailPage', true);
    };
    getHotReviewDataHttp = () => { //获取热评数据
        axiosHttp('api/WebSite/HomePage/GetHotReviewData', {}).then((res) => {
            this.setState({
                hotData: res,
                listData: res[0].dates
            }, () => {
                this.isCollectArr = new Array(res.length);
                console.log(this.isCollectArr);
                this.setState({
                    clientHeight: this.refs.statisticRef.clientHeight
                });
                window.scrollTo(0, 0);
                this.isCollectArr[0] = 1;
                // this.checkIsCollectHttp();
                commonFun.lazyLoadBgImgFun();
            });
        }).catch(e => {
            console.log(e);
        })
    };
    checkIsCollectHttp = () => { //检查商品是否已收藏
        const {listData, isLoginFlag} = this.state;
        if (!isLoginFlag) {
            return
        }
        let productIdArr = listData.map((item) => item.object_id);
        axiosHttp('api/WebSite/HomePage/CheckIsCollect', {products: productIdArr.toString()}).then((res) => {
            if (res.code === 200) {
                let data = {};
                for (let j = 0; j < res.data.length; j++) {
                    data = res.data[j];
                    listData[j].isCollect = data.isCollect;
                    listData[j].lable = data.lable;
                }
                // console.log(listData);
                this.setState({
                    listData: listData
                });
            }
        }).catch(e => {
            console.log(e);
        })
    };
    _handlePosition = () => {
        if (this.state.isLoginFlag) {
            this.setState({
                position: this.state.position === 'top' ? '' : 'top'
            })
        }
    };
    _handleNewLogin = () => {
        window.sessionStorage.setItem('newProductHeat', '/newProductHeat');
        this.props.history.push('/registerCpn');
    };

    render() {
        const {hotData, listData, selectIndex, isDetailFlag, productId, isLoginFlag, clientHeight, position} = this.state;
        return (
            <div className={`heatWrap ${isLoginFlag ? '' : 'noScroll'}`}>
                <div ref="statisticRef" className="statistics">
                    {/*<Link to="/firstPage">*/}
                    <img className="imgTitle" src={topIcon} alt="各品牌站热评新品趋势" useMap="#planetmap"/>
                    <map name="planetmap">
                        <area shape="rect" coords="0,0,100,100" alt="Sun" href="/firstPage"/>
                    </map>
                    {/*</Link>*/}
                    <ul className="heatUl">
                        <li className="title">
                            <span>{moment(new Date()).format('YYYY.MM.DD')}更新 最近2个月</span><span>spu数</span></li>
                        {
                            hotData.map((item, index) => {
                                let rate = Math.round(item.spu_count / hotData[0].spu_count * 100),
                                    ratio = rate >= 2 ? rate + '%' : '2%';
                                if (index < 3) {
                                    return (<li key={index} className="heatLiTop"><span className="barTop"
                                                                                        style={{
                                                                                            width: ratio,
                                                                                            backgroundColor: colorStatic[index],
                                                                                            boxShadow: `.05rem .05rem 0 ${listColorRgbaStatic[index]}`
                                                                                        }}>{item.site}</span><span
                                        className="num">{item.spu_count}</span></li>)
                                } else {
                                    return (<li key={index} className="heatLi"><span className="bar"
                                                                                     style={{
                                                                                         width: ratio,
                                                                                         color: rate < 25 ? '#fff' : '#333',
                                                                                     }}>{item.site}</span><span
                                        className="num">{item.spu_count}</span></li>)
                                }
                            })
                        }
                    </ul>
                </div>
                {/*列表数据*/}
                <div ref="heatListRef"
                     className={`heatList ${position === 'top' ? 'active' : ''}`}
                     style={{marginTop: position === 'top' ? '.92rem' : clientHeight}}>
                    <div className="heatLine" onClick={this._handlePosition}/>
                    <div className="heatNavWrap">
                        <ul ref="heatNavRef" className="heatNav">
                            {
                                hotData.map((item, index) => {
                                    return (
                                        <li onClick={this._handleSpecialSite.bind(this, index)}
                                            className={`item ${index === selectIndex ? 'active' : ''}`}
                                            key={index}>{item.site}</li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                    <ul ref="heatListUlTopRef" onScroll={this.handleScroll}
                        className={`heatListUlTop ${position === 'top' ? 'scroll' : ''}`}>
                        {
                            listData.map((item, index) => {
                                let num = Math.round(item.cmtStar),
                                    starNum = new Array(num).fill(''),
                                    starEmptyNum = new Array(item.cmtStars - num).fill(''),
                                    rate = item.cmtCount / listData[0].cmtCount * 100;
                                return (
                                    <li key={index} className="heatListLiTop"
                                        onClick={this._handleJumpToDetail.bind(this, item.object_id)}>
                                        <div className="leftImg lazyLoadBg"
                                             data-src={item.icon} style={{
                                            borderColor: index < 3 ? listColorStatic[index] : '#bbb',
                                            backgroundImage: `url('${placeholder}')`
                                        }}/>
                                        <div className="content pr">
                                            <p className="name">{item[`title_${item.lang}`]}</p>
                                            <div className="price">  {
                                                item.list_price_cny > 0 ? `¥ ${Math.round(item.list_price_cny * 100) / 100}` : ' '
                                            }
                                            </div>
                                            <div className="cmtStar">
                                                <span>好评星级</span>
                                                {
                                                    starNum.map((item, index) => {
                                                        return (<i key={index} className="cmtStarIcon"/>)
                                                    })
                                                }
                                                {
                                                    starEmptyNum.map((item, index) => {
                                                        return (<i key={index} className="cmtStarIcon active"/>)
                                                    })
                                                }
                                            </div>
                                            <div className="cmtCount">{item.cmtCount}</div>
                                            {/*<i className="heatIcon"*/}
                                            {/*onClick={this._handleCollectProduct.bind(this, item)}*/}
                                            {/*style={item.isCollect ? {backgroundImage: `url('${heatIcon}')`} : {}}/>*/}
                                            <i className="barIcon"
                                               style={{
                                                   width: (rate > 1 ? rate : 1) + '%',
                                                   backgroundColor: index < 3 ? listColorStatic[index] : '#bbb'
                                               }}/>
                                            {
                                                index < 3 ? <i className="topNum"
                                                               style={{backgroundImage: `url('${numIconStatic[index]}')`}}/> : null
                                            }

                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>

                </div>
                {/*提示登录注册*/}
                {
                    !isLoginFlag ? <div className="tipsInfo">
                        <span className="text">首次注册，前 <b className="boldFont">2</b> 个月可免费查看热评产品趋势!</span>
                        <span className="btn" onClick={this._handleNewLogin}>立即注册</span>
                    </div> : null
                }
                {/*右侧的产品详情页面*/}
                {
                    isDetailFlag &&
                    <GoodsDetail flag={isDetailFlag} productId={productId} onClose={this._handleClose}/>
                }
            </div>
        );
    }
}

export default NewProductHeat;