import React, {Component} from 'react';
import {createForm} from "rc-form";
import {specialData, catData} from '../../config/staticData';
// import {Carousel} from "antd-mobile";
import {Link} from "react-router-dom";
import moment from "moment";
import commonFun from "../../utils/commonFun";


import backgoundone from "../../img/home/backgoundone@2x.jpg";
import fontone from "../../img/home/fontone@2x.png";
import h5one from "../../img/home/h5one@2x.png";
import qushibanner from "../../img/home/qushibanner@2x.jpg";
import qushifont from "../../img/home/qushifont@2x.png";

// select
import fashionClothingGif from "../../img/home/fashionClothing.gif";
import zttwo from "../../img/selected/zttwo@2x.jpg";
import zttre from "../../img/selected/zttre@2x.jpg";
import ztfour from "../../img/selected/ztfour@2x.jpg";
import ztfive from "../../img/selected/ztfive@2x.jpg";
import ztsix from "../../img/selected/ztsix@2x.jpg";
// site
import ppone from "../../img/site/ppone@2x.jpg";
import zara from "../../img/site/zara@2x.png";
import pptwo from "../../img/site/pptwo@2x.jpg";
import everlane from "../../img/site/everlane@2x.png";
import ppthree from "../../img/site/ppthree@2x.jpg";
import net from "../../img/site/net-a-porter@2x.png";
import ppfou from "../../img/site/ppfou@2x.jpg";
import zappos from "../../img/site/zappos@2x.png";

// 更多品牌
import hmImg from "../../img/site/hmtu@2x.jpg";
import hmIcon from "../../img/site/hm@2x.png";
import asosImg from "../../img/site/asostu@2x.jpg";
import asosIcon from "../../img/site/asos@2x.png";
import fashImg from "../../img/site/fashtu@2x.jpg";
import fashIcon from "../../img/site/fashon@2x.png";
import foreverImg from "../../img/site/forevertu@2x.jpg";
import foreverIcon from "../../img/site/forever21@2x.png";
import bodenImg from "../../img/site/bodentu@2x.jpg";
import bodenIcon from "../../img/site/boden@2x.png";
import zaloraImg from "../../img/site/zaloratu@2x.jpg";
import zaloraIcon from "../../img/site/zalora@2x.png";
import loftImg from "../../img/site/lofttu@2x.jpg";
import loftIcon from "../../img/site/loft@2x.png";
// 丰富多元品类
import womenWearGif from "../../img/home/nvx2.gif";
import cptwo from "../../img/home/cptwo@2x.jpg";
import cpthree from "../../img/home/cpthree@2x.jpg";
import cpjiaju from "../../img/home/cpjiaju@2x.jpg";
import cpsix from "../../img/home/cpsix@2x.jpg";
import cpseve from "../../img/home/cpseve@2x.jpg";
import cpeaea from "../../img/home/cpeaea@2x.jpg";
// barrage
import icon3 from "../../img/barrage/3@2x.png";
import icon4 from "../../img/barrage/4@2x.png";
import icon5 from "../../img/barrage/5@2x.png";
import icon6 from "../../img/barrage/6@2x.png";
import icon7 from "../../img/barrage/7@2x.png";
import icon8 from "../../img/barrage/8@2x.png";
import icon9 from "../../img/barrage/9@2x.png";
import icon10 from "../../img/barrage/10@2x.png";
import icon11 from "../../img/barrage/11@2x.png";
import icon12 from "../../img/barrage/12@2x.png";
import icon13 from "../../img/barrage/13@2x.png";
import icon14 from "../../img/barrage/14@2x.png";
import icon15 from "../../img/barrage/15@2x.png";
import icon16 from "../../img/barrage/16@2x.png";
import icon17 from "../../img/barrage/17@2x.png";

import loading from '../../img/loading.gif';

import './index.less'

const bottomSite = ['hm', 'asos', 'fashionnova', 'forever21', 'boden', 'zalora', 'loft'];
let barrageArr = [icon3, icon4, icon5, icon6, icon7, icon8, icon9, icon10, icon11, icon12, icon13, icon14, icon15, icon16, icon17];
const siteImgArr = [hmImg, asosImg, fashImg, foreverImg, bodenImg, zaloraImg, loftImg];
const siteIconArr = [hmIcon, asosIcon, fashIcon, foreverIcon, bodenIcon, zaloraIcon, loftIcon];
const catImgArr = [womenWearGif, cpthree, cptwo, cpjiaju, cpsix, cpseve, cpeaea];
const specialImgArr = [fashionClothingGif, zttwo, zttre, ztfour, ztfive, ztsix];
const titleCommon = (title = '', index) => {
    return (
        <div className={`hotColumn ${index === 3 ? 'active' : ''}`}>
            <h3 className="h3">{title}</h3>
            <p className="timer">{moment(new Date()).format('YYYY')}年</p>
            <p className="top100">TOP 100热评</p>
        </div>
    )
};
const RATE_POINT_8 = 0.5;

let isStop = false;

class FirstPage extends Component {
    state = {
        data: ['1'],
        selectedIndex: 0,
        imgHeight: 320,
    };
    timer = null;

    componentDidMount() {
        // 弹幕方法
        var subIndex = 0,
            xIndex = 0,
            trackArr = [0, 60, 120, 180, 240, 300, 0, 60, 120, 180, 240, 300, 0, 60, 120];
        isStop = false;
        var canvasBarrage = function (canvas, data) {
            if (!canvas || !data || !data.length) {
                return;
            }
            if (typeof canvas == 'string') {
                canvas = document.querySelector(canvas);
                canvasBarrage(canvas, data);
                return;
            }
            var context = canvas.getContext('2d');
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            // 内存中先加载，然后当内存加载完毕时，再把内存中的数据填充到我们的 dom元素中，这样能够快速的去
            // 反应，比如网易的图片

            // 存储实例
            var store = {};
            // 字号大小
            // 实例方法
            var Barrage = function (obj, index) {
                // 随机x坐标也就是横坐标，对于y纵坐标，以及变化量moveX
                // this.x = (1 + index * 0.1 / Math.random()) * canvas.width;
                this.x = (1 + xIndex * RATE_POINT_8) * canvas.width;
                // this.y = obj.range[0] * canvas.height + (obj.range[1] - obj.range[0]) * canvas.height * Math.random() + 42;
                this.y = trackArr[subIndex];
                subIndex++;
                xIndex++;
                if (subIndex >= 15) {
                    subIndex = 0;
                }
                this.moveX = 3;

                this.params = obj;
                this.drawCommon = function () {
                    var img = new Image();
                    img.onload = () => {
                        // 将图片画到canvas上面上去！
                        context.drawImage(img, this.x, this.y);
                    };
                    img.src = barrageArr[index];
                    context.drawImage(img, this.x, this.y);
                };
            };

            data.forEach(function (obj, index) {
                store[index] = new Barrage(obj, index);
            });

            // 绘制弹幕文本
            var draw = function () {
                for (var index in store) {
                    var barrage = store[index];
                    // 位置变化
                    barrage.x -= barrage.moveX;
                    if (barrage.x < -1 * canvas.width * 1.5) {
                        // barrage.x = (1 + index * 0.1 / Math.random()) * canvas.width;
                        // 移动到画布外部时候从左侧开始继续位移
                        barrage.x = (1 + xIndex * RATE_POINT_8) * canvas.width;
                        // barrage.y = (barrage.params.range[0] + (barrage.params.range[1] - barrage.params.range[0]) * Math.random()) * canvas.height;
                        // if (barrage.y < fontSize) {
                        //     barrage.y = fontSize;
                        // } else if (barrage.y > canvas.height - fontSize) {
                        //     barrage.y = canvas.height - fontSize;
                        // }
                        barrage.y = trackArr[subIndex];
                        subIndex++;
                        xIndex++;
                        if (subIndex >= 15) {
                            subIndex = 0;
                        }
                        // barrage.moveX = 1 + Math.random() * 3;
                        barrage.moveX = 3;
                    }
                    // 根据新位置绘制圆圈圈
                    store[index].drawCommon();
                }
            };

            // 画布渲染
            var render = function () {
                if (isStop) {
                    return
                }
                // 清除画布
                context.clearRect(0, 0, canvas.width, canvas.height);
                // 绘制画布上所有的圆圈圈
                draw();
                // 继续渲染
                requestAnimationFrame(render);
            };

            render();
        };
        // canvasBarrage('#canvasBarrage', barrageData);
        canvasBarrage('#canvasBarrage', barrageArr);
        // commonFun.lazyLoadImgFun();
        window.addEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
            clearTimeout(this.timer);
            commonFun.lazyLoadImgFun();
        }, 100);
    };
    goToBack = () => {
        window.sessionStorage.setItem('goToBack', this.props.match.url); //保存入口的路径，
        this.props.history.push('/searchListCpn')
    };

    componentWillUnmount() {
        isStop = true;
        clearTimeout(this.timer);
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        const {getFieldProps} = this.props.form;
        const {imgHeight} = this.state;
        // const style = {
        //     img: {width: '100%', verticalAlign: 'top'},
        //     link: {display: 'inline-block', width: '100%', height: imgHeight}
        // };
        return (
            <div className="firstPage">
                <div className="singleSearch absolute">
                    <div className="pr" onClick={this.goToBack}>
                        <input type="text" placeholder="搜索产品"
                               {...getFieldProps('keyword', {
                                   initialValue: '',
                                   onChange: this._handleOnChange,
                                   validateTrigger: 'onBlur'
                               })}/>
                        <i className="searchIcon"/>
                    </div>
                </div>
                <div className="barrage pr">
                    <Link to="/promotionPage">
                        <canvas id="canvasBarrage" className="canvas-barrage"/>
                        <img className="blockImg" src={backgoundone} alt=""/>
                        <img className="textImg" src={fontone} alt=""/>
                    </Link>
                </div>
                {/*<Carousel*/}
                {/*infinite*/}
                {/*// autoplay*/}
                {/*beforeChange={(from, to) => this.setState({*/}
                {/*selectedIndex: to*/}
                {/*})}*/}
                {/*>*/}
                <div>
                    {/*style={style.link}*/}
                    <Link to="/womenFashion">
                        {/*carouselImg*/}
                        <img className="blockImg" src={h5one}
                             alt="banner图片"
                            // style={style.img}
                            // onLoad={() => {
                            //     window.dispatchEvent(new Event('resize'));
                            //     this.setState({imgHeight: 'auto'});
                            // }}
                        />
                    </Link>
                </div>
                {/*</Carousel>*/}
                {/*产品流行趋势*/}
                <h3 className="titleH3">产品流行趋势</h3>
                <div className="pr">
                    <Link to="/newProductHeat">
                        <img className="blockImg lazyLoad" data-src={qushibanner} src={loading} alt=""/>
                        <div className="trendsWrap">
                            <img className="trendsImg" src={qushifont} alt=""/>
                            <p className="title">首次注册</p>
                            <p>前 <span className="num">2</span> 个月可免费查看热评产品趋势!</p>
                        </div>
                    </Link>
                </div>
                {/*精选热评专栏*/}
                <h3 className="titleH3">精选热评专栏</h3>
                {
                    specialData.map((item, index) => {
                        return (
                            <div key={index} className="pr">
                                <Link to={`specialPage/${item.name}/column/${index}`}>
                                    <img className="blockImg lazyLoad" src={loading} data-src={specialImgArr[index]}
                                         alt={item.name}/>
                                    {titleCommon(item.name, index)}
                                </Link>
                            </div>
                        )
                    })
                }
                {/*知名流量大站*/}
                <h3 className="titleH3">知名流量大站</h3>
                <ul className="">
                    <li className="flowStation pr">
                        <Link to="/specialPage/zara/site/zara">
                            <img className="blockImg lazyLoad" src={loading} data-src={ppone} alt=""/>
                            <p className="textP text">以短、快上新和设计款式时尚流行著称</p>
                            <p className="textP">自然流量占比过半，广告占比低于10%</p>
                            <span className="productBtn">精选产品</span>
                            {/*site*/}
                            <div className="flowTextAbs">
                                <img className="flowIcon" src={zara} alt=""/>
                                <h3 className="flowH3">服装设计、产销一体化</h3>
                                <p>全球流量排名391</p>
                                <p className="flowP">服饰类排名第2</p>
                            </div>
                        </Link>
                    </li>
                    <li className="flowStation pr">
                        <Link to="/specialPage/everlane/site/everlane">
                            <img className="blockImg lazyLoad" src={loading} data-src={pptwo} alt=""/>
                            <p className="textP text">从社交平台打开市场，极少依赖广告</p>
                            <p className="textP">网红款一上架即售罄，排队等货的上千人</p>
                            <span className="productBtn">精选产品</span>
                            {/*site*/}
                            <div className="flowTextAbs">
                                <img className="flowIcon" src={everlane} alt=""/>
                                <h3 className="flowH3">美国时尚服饰</h3>
                                <p>款式简约/高品质/高冷</p>
                            </div>
                        </Link>
                    </li>
                    <li className="flowStation pr">
                        <Link to="/specialPage/net-a-porter/site/net-a-porter">
                            <img className="blockImg lazyLoad" src={loading} data-src={ppthree} alt=""/>
                            <p className="textP text">甄选逾800个国际新锐时尚设计师品牌</p>
                            <span className="productBtn">精选产品</span>
                            {/*site*/}
                            <div className="flowTextAbs">
                                <img className="flowIcon" src={net} alt=""/>
                                <h3 className="flowH3">英国奢侈品高端电商平台</h3>
                                <p>款式高端、大气</p>
                            </div>
                        </Link>
                    </li>
                    <li className="flowStation pr">
                        <Link to="/specialPage/zappos/site/zappos">
                            <img className="blockImg lazyLoad" src={loading} data-src={ppfou} alt=""/>
                            <p className="textP text">以高效良好的退换货服务闻名</p>
                            <p className="textP">拓展手提包、眼镜、服装、儿童商品和手表等品类</p>
                            <span className="productBtn">精选产品</span>
                            {/*site*/}
                            <div className="flowTextAbs">
                                <img className="flowIcon" src={zappos} alt=""/>
                                <h3 className="flowH3">美国鞋类电商平台</h3>
                                <p>全球流量1917，美国排名343</p>
                                <p className="flowP">"鞋业亚马逊"</p>
                            </div>
                        </Link>
                    </li>
                </ul>
                {/*更多品牌*/}
                <h4 className="moreBrands">更多品牌</h4>
                {
                    bottomSite.map((item, index) => {
                        return (
                            <div key={index} className="pr">
                                <Link to={`/specialPage/${item}/site/${item}`}>
                                    <img className="blockImg lazyLoad" src={loading} data-src={siteImgArr[index]}
                                         alt=""/>
                                    <img className="siteAbs" src={siteIconArr[index]} alt=""/>
                                    <span className="moreAbs productBtn active">精选产品</span>
                                </Link>
                            </div>
                        )
                    })
                }
                {/*丰富多元品类*/}
                <h3 className="titleH3">丰富多元品类</h3>
                {
                    catData.map((item, index) => {
                        return (
                            <div key={index} className="pr">
                                <Link to={`specialPage/${item.name}/cat/${item.id}`}>
                                    <img className="blockImg lazyLoad" src={loading} data-src={catImgArr[index]}
                                         alt="女装"/>
                                    <span className={`titleAbs ${item.color ? 'active' : ''}`}>{item.name}</span>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}

export default createForm()(FirstPage);