import React, {Component, Fragment} from 'react';
import {Carousel} from 'antd-mobile';
import {createForm} from "rc-form";
import {Link, withRouter} from "react-router-dom";
import GlobalProducts from "../globalProducts";

import banner1 from "../../img/banner.jpg";
import banner2 from "../../img/banner2.jpg";
import bannerShadow from "../../img/bannerShadow.png";
import shdow2 from "../../img/shdow2.png";

import commonFun from "../../utils/commonFun";
import loading from '../../img/loading.gif';

import './index.less'

class HomePage extends Component {
    state = {
        data: ['1', '2'],
        selectedIndex: 0,
        imgHeight: 320,
    };
    timer = null;
    count = 0;

    componentDidMount() {
        let {hidden = '0'} = this.props.match.params;
        if (!isNaN(hidden)) {
            this.timer = setTimeout(() => {
                let productListId = document.getElementById('productListId');
                productListId.scrollTop = '10px';
                this.demoCommonFun();
                clearTimeout(this.timer);
            }, 200);
        }
        // window.addEventListener('scroll', this._handleScroll);
    }

    _handleScroll = () => {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
            globalProductId = document.getElementById('globalProductId'),
            productListId = document.getElementById('productListId');
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            commonFun.lazyLoadImgFun();
            if (scrollTop + 210 >= globalProductId.offsetTop && this.count === 0) {
                this.demoCommonFun();
            } else if (scrollTop + 210 < globalProductId.offsetTop && this.count === 1) {
                this.count = 0;
            }
            if (productListId.className.includes('overflowYH') && this.count === 1) {
                this.count = 0;
            }
        }, 42);
    };
    demoCommonFun = () => {
        this.count = 1;
        let homeSearchId = document.getElementById('homeSearchId'),
            productListId = document.getElementById('productListId');
        if (productListId.className.indexOf('overflowYH') < 0) {
            return
        }
        homeSearchId.style = 'height:0; overflow:hidden';
        productListId.className = 'productList homePageH';
        productListId.scrollTop = 10;
    };
    goToBack = () => {
        window.sessionStorage.setItem('goToBack', this.props.match.url); //保存入口的路径，
        this.props.history.push('/searchListCpn')
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
        // window.removeEventListener('scroll', this._handleScroll);
    }

    render() {
        const {getFieldProps} = this.props.form;
        const {imgHeight, selectedIndex} = this.state;
        const style = {
            img: {width: '100%', verticalAlign: 'top'},
            link: {display: 'inline-block', width: '100%', height: imgHeight}
        };
        return (
            <div className="boxWrap">
                {/*<div className="singleSearch">*/}
                {/*<div className="pr" onClick={this.goToBack}>*/}
                {/*<input type="text" placeholder="搜索产品"*/}
                {/*{...getFieldProps('keyword', {*/}
                {/*initialValue: '',*/}
                {/*onChange: this._handleOnChange,*/}
                {/*validateTrigger: 'onBlur'*/}
                {/*})}/>*/}
                {/*<i className="searchIcon"/>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*<div id="homeSearchId">*/}
                {/*/!*轮播图*!/*/}
                {/*<div className="carouselWrap">*/}
                {/*/!*<img className="carouselImg" src={Banner} alt="banner图片"/>*!/*/}
                {/*/!*<img className="bannerShadow" src={bannerShadow} alt="背景阴影图片"/>*!/*/}
                {/*<Carousel*/}
                {/*infinite*/}
                {/*autoplay*/}
                {/*beforeChange={(from, to) => this.setState({*/}
                {/*selectedIndex: to*/}
                {/*})}*/}
                {/*// afterChange={index => console.log('slide to', index)}*/}
                {/*>*/}
                {/*<Link to="/promotionPage" style={style.link}>*/}
                {/*<img className="carouselImg" src={banner1}*/}
                {/*alt="banner图片"*/}
                {/*style={style.img}*/}
                {/*onLoad={() => {*/}
                {/*window.dispatchEvent(new Event('resize'));*/}
                {/*this.setState({imgHeight: 'auto'});*/}
                {/*}}*/}
                {/*/>*/}
                {/*</Link>*/}
                {/*<Link to="/womenFashion" style={style.link}>*/}
                {/*<img className="carouselImg" src={banner2}*/}
                {/*alt="banner图片"*/}
                {/*style={style.img}*/}
                {/*onLoad={() => {*/}
                {/*window.dispatchEvent(new Event('resize'));*/}
                {/*this.setState({imgHeight: 'auto'});*/}
                {/*}}*/}
                {/*/>*/}
                {/*</Link>*/}
                {/*</Carousel>*/}
                {/*<img className="bannerShadow" src={`${selectedIndex === 0 ? bannerShadow : shdow2}`}*/}
                {/*alt="背景阴影图片"/>*/}
                {/*</div>*/}
                {/*/!*人气品牌*!/*/}
                {/*<h6 className="homeTitle">精选TOP100</h6>*/}
                {/*<div className="selected">*/}
                {/*<div className="selectedItem">*/}
                {/*<Link to="/specialPage/0">*/}
                {/*<p className="selectedP">*/}
                {/*<img className="bgImg" src={b1s} alt="时尚服饰"/>*/}
                {/*<span className="text">时尚服饰</span>*/}
                {/*</p>*/}
                {/*</Link>*/}
                {/*<Link to="/specialPage/1">*/}
                {/*<p className="selectedP">*/}
                {/*<img className="bgImg" src={b2z} alt="包包鞋子"/>*/}

                {/*<span className="text">包包鞋子</span>*/}
                {/*</p>*/}
                {/*</Link>*/}
                {/*</div>*/}
                {/*<div className="selectedItem">*/}
                {/*<Link to="/specialPage/2">*/}
                {/*<p className="selectedP">*/}
                {/*<img className="bgImg" src={b3zb} alt="珠宝首饰"/>*/}
                {/*<span className="text">珠宝首饰</span>*/}
                {/*</p>*/}
                {/*</Link>*/}
                {/*<Link to="/specialPage/3">*/}
                {/*<p className="selectedP">*/}
                {/*<img className="bgImg" src={b4j} alt="家居生活"/>*/}
                {/*<span className="text">家居生活</span>*/}
                {/*</p>*/}
                {/*</Link>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*/!*人气品牌*!/*/}
                {/*<h6 className="homeTitle">人气品牌</h6>*/}
                {/*<ul className="brand">*/}
                {/*<li className="brandItem">*/}
                {/*<Link to="/specialPage/hm">*/}
                {/*<img className="bgImg" src={hmBig} alt="hm"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${hmSmall})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*<li className="brandItem">*/}
                {/*<Link to="/specialPage/asos">*/}
                {/*<img className="bgImg" src={asosBig} alt="asos"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${asosSmall})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*<li className="brandItem">*/}
                {/*<Link to="/specialPage/fashionnova">*/}
                {/*<img className="bgImg lazyLoad" data-src={fashionnovaBig} src={loading}*/}
                {/*alt="fashionnova"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${fashionnovaSmall})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*<li className="brandItem">*/}
                {/*<Link to="/specialPage/zara">*/}
                {/*<img className="bgImg lazyLoad" data-src={zaraBig} src={loading} alt="zara"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${zaraSmall})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*<li className="brandItem">*/}
                {/*<Link to="/specialPage/forever21">*/}
                {/*<img className="bgImg lazyLoad" data-src={forever21Big} src={loading} alt="forever21"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${forever21Small})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*<li className="brandItem">*/}
                {/*<Link to="/specialPage/net-a-porter">*/}
                {/*<img className="bgImg lazyLoad" data-src={netBig} src={loading} alt="net-a-porter"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${netSmall})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*<li className="brandItem">*/}
                {/*/!*zalando*!/*/}
                {/*<Link to="/specialPage/boden">*/}
                {/*<img className="bgImg lazyLoad" data-src={bodenBig} src={loading} alt="boden"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${bodenSmall})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*<li className="brandItem">*/}
                {/*<Link to="/specialPage/zalora">*/}
                {/*<img className="bgImg lazyLoad" data-src={zaloraBig} src={loading} alt="zalora"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${zaloraSmall})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*<li className="brandItem">*/}
                {/*<Link to="/specialPage/loft">*/}
                {/*<img className="bgImg lazyLoad" data-src={loftBig} src={loading} alt="loft"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${loftSmall})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*<li className="brandItem">*/}
                {/*<Link to="/specialPage/zappos">*/}
                {/*<img className="bgImg lazyLoad" data-src={zapposBig} src={loading} alt="zappos"/>*/}
                {/*<span className="nameImg" style={{backgroundImage: `url(${zapposSmall})`}}/>*/}
                {/*<span className="bgMask"/>*/}
                {/*</Link>*/}
                {/*</li>*/}
                {/*</ul>*/}
                {/*<h5 className="homeTitle homePage">全球优品</h5>*/}
                {/*</div>*/}
                {/*<GlobalProducts/>*/}
            </div>
        )
    }
}

export default createForm()(withRouter(HomePage));