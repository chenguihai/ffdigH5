import React, {Component, Fragment} from 'react';
import {Carousel, Toast} from 'antd-mobile';
import axiosHttp from "../../utils/ajax";
import {Link, withRouter} from "react-router-dom";
import moment from "moment";
import emitter from "../../utils/events";
import logoBig from '../../img/detailPage/svgLogoBlack.svg';
import sqr from '../../img/detailPage/sqr.png';
import commonFun from "../../utils/commonFun";
import loading from '../../img/loading.gif';
import './index.less'

class GoodsDetail extends Component {
    state = {
        detailData: {}, //整个的数据结构
        product: {},  ///产品详情的内容
        similarProduct: [], //猜你喜欢
        isCollect: false, //是否收藏
        productId: '',
        tipsFlag: true, //是否显示提示
    };

    componentDidMount() {
        const storage = window.sessionStorage;
        const {productId} = this.props;
        this.productId = productId || this.props.match.params.productId;
        this.nickName = storage.getItem('nickName');
        this.getProductDetailHttp();
        this.getSimilarProductsHttp();
        // let detailFixedRef = this.refs.detailFixedRef;
        // let carouselWrapRef = this.refs.carouselWrapRef;
        // let carouselWrap =  document.getElementsByClassName('carouselWrap');
        // 手指接触屏幕
        // detailFixedId.classList.add('active');
        // = this.chDetail/100+'rem';
        document.getElementById('goodsDetailId').addEventListener('scroll', this.handleScroll);
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
    _handleReplaceDetail = (productId) => { //更换详情的产品
        this.productId = productId;
        // window.scroll(0, 0);
        this.getProductDetailHttp();
        this.getSimilarProductsHttp();
    };
    getProductDetailHttp = () => {  //获取产品详情
        axiosHttp('api/WebSite/Product/GetProductDetail?productId=' + this.productId, "", "GET").then((res) => {
            if (res.code === 200) {
                const {product = {}, product: {detail = {}, name}} = res.data;
                const {images = [], desc_att = []} = detail;
                let htmlStr = '';
                desc_att.forEach((item, index) => {
                    htmlStr += item.name + ":" + item.value + (index === desc_att.length - 1 ? '' : '|');
                });
                let storage = window.localStorage;
                storage.setItem('shareTitle', name);
                storage.setItem('shareImg', images.length > 0 && (images[0].scaled_paths._220.path || images[0].url));
                storage.setItem('shareDesc', htmlStr);
                // console.log(120, 'GetProductDetail', name, images[0].url);
                document.title = name || '火联网罗全球优品';
                this.eventEmitter = emitter.emit('detailPage', true);
                this.setState({
                    detailData: res.data,
                    product: product,
                });
                // document.getElementById('carouselWrapId1').onload = function(e){
                //     e.stopPropagation();
                //     let carouselWrapId = document.getElementById('carouselWrapId');
                //     console.log(carouselWrapId.clientHeight);
                //     this.chDetail = carouselWrapId.clientHeight;
                // };
                if (this.nickName) {
                    this.checkIsCollectHttp();
                }
            }
            document.getElementById('goodsDetailId').scrollTop = 0;
        }).catch(e => {
            console.log(e);
        })
    };
    getSimilarProductsHttp = () => {  //获取类似产品
        axiosHttp(`api/WebSite/Product/GetSimilarProducts?productId=${this.productId}&count=12`, "", "GET").then((res) => {
            if (res.code === 200) {
                this.setState({
                    similarProduct: res.data
                })
            } else {
                this.setState({
                    similarProduct: []
                });
            }
        }).catch(e => {
            console.log(e);
        })
    };

    _handleCollect = (e) => {
        e.stopPropagation();
        if (!this.nickName) {
            Toast.info('登录之后才能收藏', 1);
            return
        }
        if (this.state.isCollect) {
            this.deleteProductCollectHttp();
        } else {
            this.insertOrUpdateProductCollectHttp();
        }
    };
    insertOrUpdateProductCollectHttp = () => { //新增或更新商品收藏
        const {product, detailData} = this.state;
        const {cmiCat1 = {}, cmiCat2 = {}, cmiCat3 = {}} = detailData;
        let cat = cmiCat3 === null ? (cmiCat2 === null ? cmiCat1.cat1_name_cn : cmiCat2.cat2_name_cn) : cmiCat3.cat3_name_cn;
        let params = {
            "spuId": product.spu_id,
            "currency": product.currency,
            "att": JSON.stringify(product.att),
            "skus": JSON.stringify(product.skus),

            "productId": product._id || 0,
            "listPrice": product.list_price - 0 || 0,
            "name": product.name || '',
            "countSku": product.count_sku || 0,
            "img": JSON.stringify(product.detail.images),
            "markLable": '',
            "saleCount": product.saleCount || 0,
            "canBookCount": product.canBookCount || 0,
            "rateLevel": product.cxt || 0,
            "rateCount": 0,
            "ondateOnline": moment(product.ondateOnline ? product.ondateOnline * 1000 : +product.ondate).format('YYYY-MM-DD h:mm:ss'),
            "updateTime": moment(product.updateDateTime ? product.updateDateTime * 1000 : new Date()).format('YYYY-MM-DD h:mm:ss'),
            "site": product.site || '',
            "cat": cat
        };
        axiosHttp("api/WebSite/ProductCollect/InsertOrUpdateProductCollect", params).then((res) => {
            if (res.code === 200) {
                Toast.success('收藏成功', 1);
                this.checkIsCollectHttp();
            } else {
                Toast.fail(res.msg, 1);
            }
        }).catch(e => {
            console.log(e);
        })
    };
    checkIsCollectHttp = () => { //检查商品是否已收藏
        axiosHttp('api/WebSite/HomePage/CheckIsCollect', {products: this.productId}).then((res) => {
            if (res.code === 200) {
                this.setState({
                    isCollect: res.data[0].isCollect
                });
            } else {
                Toast.fail(res.msg, 1);
            }
        }).catch(e => {
            console.log(e);
        })
    };
    deleteProductCollectHttp = () => { //删除商品收藏
        axiosHttp("api/WebSite/ProductCollect/DeleteProductCollect?productId=" + this.productId, '', 'delete').then((res) => {
            if (res.code === 200) {
                Toast.success('已取消收藏', 1);
                this.checkIsCollectHttp();
            } else {
                Toast.fail(res.msg, 1);
            }
        }).catch(e => {
            console.log(e);
        })
    };
    _handleGoBack = () => {
        const {productId} = this.props;
        window.sessionStorage.setItem('detailPages', '');
        if (productId) {
            // window.sessionStorage.removeItem('detailPage');
            this.props.onClose();
            document.title = window.sessionStorage.getItem('specialTitle');
        } else {
            this.props.history.push('/firstPage');
        }
    };

    _handleClose = () => {
        this.setState({
            tipsFlag: false
        })
    };

    listCodeFragment = (data) => {  //列表代码片段
        return (
            data.map((item, index) => {
                let {scaled_paths = {}} = item.detail.images[0],
                    icon = scaled_paths._350.path || item.url;
                return (
                    <div key={item._id} data-index={index + 1}
                         className="imgListWrap"
                         onClick={this._handleReplaceDetail.bind(this, item._id)}>
                        <div className="pic">
                            <div className="imgBox">
                                <img alt="列表图片" data-src={icon} src={loading} className='lazyLoad larry_waterfall_img'/>
                            </div>
                            <p className="title">{item.name}</p>
                            {
                                item.list_price_cny ?
                                    <div
                                        className="price">¥ {Math.round(item.list_price_cny * 100) / 100 || 0}</div> : null
                            }
                            <div className="from">{item.site}</div>
                        </div>
                    </div>
                )
            })
        )
    };

    componentWillUnmount() {
        window.sessionStorage.setItem('detailPages', '');
        clearTimeout(this.timer);
        document.getElementById('goodsDetailId').removeEventListener('scroll', this.handleScroll);

    }

    render() {
        const {product: {detail = {}, att = [], name, site = '', designer = '', designer_by = '', list_price_cny = '', cmtCount = 0, cmtStar = 0, cmtStars = 0, updateDateTime = 0, ondateOnline = 0}, similarProduct = [], isCollect = [], tipsFlag} = this.state;
        const {images = [], desc_att = []} = detail;
        // images[0].url
        const {flag} = this.props;
        const dataInitLeft = similarProduct.filter((item, index) => index % 2 === 0),
            dataInitRight = similarProduct.filter((item, index) => index % 2 !== 0);
        let attFlag = !!att.length > 0 && att[0].value[0].name;
        let cmtStarRound = Math.round(cmtStar),
            cmtCountRound = Math.round(cmtCount),
            cmtStarsRound = Math.round(isNaN(cmtStars) ? 0 : cmtStars),
            brightStar = new Array(cmtStarRound).fill(0),
            darkStars = new Array(cmtStarsRound - cmtStarRound).fill(0);
        return (
            <Fragment>
                {/*header*/}
                <div className="detailHeaderWrap">
                    {
                        !flag && tipsFlag && <div className={`detailHeader ${!flag ? 'active' : ''}`}>
                            <i className="closeIcon" onClick={this._handleClose}/>
                            <i className="logoIcon"/>
                            <span className="text">关注"ffdig火联"公众号，查看全球优品</span>
                            <a href="#publicNumberId" className="toBottom">立即关注 <i className="toBottomIcon"/></a>
                        </div>
                    }
                    {/*收藏容器*/}
                    {
                        flag ? <div className="collectWrap">
                            <i className="fanhui" onClick={this._handleGoBack}/>
                            {/*<i className="flex" onClick={this._handleGoBack}/>*/}
                            <span className="collect" onClick={this._handleCollect}><i
                                className={`collectIcon ${isCollect ? 'active' : ''}`}/></span>
                        </div> : null
                    }

                </div>
                {/*vh100*/}
                <div id="goodsDetailId" className={` ${flag ? 'goodsDetailWrap' : 'singleWrap'}`}
                     style={{transform: `${flag ? 'translateX(-100%)' : 'translateX(0)'}`}}>
                    <div id="carouselWrapId">
                        <Carousel className="carouselWrap"
                            // vertical={true}
                                  infinite
                            // beforeChange={(from, to) => console.log(`slide from ${from} to ${to}`)}
                            // afterChange={index => console.log('slide to', index)}
                        >
                            {images.map((item, index) => {
                                // let url = item.scaled_paths._790.path || item.url;
                                let {_790 = {}} = item.scaled_paths;
                                return (
                                    <img id={`carouselWrapId${index}`} key={index} className="img"
                                         src={_790.path || item.url}
                                         alt="图片"
                                         onLoad={() => {
                                             window.dispatchEvent(new Event('resize'));
                                             // this.setState({imgHeight: 'auto'});
                                         }}
                                    />
                                )
                            })}
                        </Carousel>
                    </div>
                    {/*滑动模块*/}
                    <div className="detailFixed" id="detailFixedId">
                        <div className="detailWrap">
                            <div className="slipe"/>
                            <p className="title">{name}</p>
                            <div className="price">
                                {
                                    list_price_cny ?
                                        <span
                                            className="priceValue">¥ {Math.round(list_price_cny * 100) / 100 || 0} </span> : null
                                }
                                <Link className="publicNum" to="/aboutWe">火联</Link>
                            </div>
                            {
                                updateDateTime || ondateOnline ? <div className="timer">
                                    <span
                                        className="updateTime">{moment(updateDateTime * 1000).format('YYYY.MM.DD')}更新</span>
                                    {
                                        ondateOnline ? <Fragment>
                                            {
                                                updateDateTime ? <i className="timeLine"/> : null
                                            }
                                            <span
                                                className="onlineTime">{moment(ondateOnline * 1000).format('YYYY.MM.DD')}上架</span>
                                        </Fragment> : null
                                    }
                                </div> : null
                            }
                            {
                                (cmtStarRound || cmtCountRound) ? <div className="starDetailWrap">
                                    {cmtStarRound ? <span className="star">
                                        {
                                            brightStar.map((item, index) => {
                                                return (
                                                    <i key={index} className="brightStar"/>
                                                )
                                            })
                                        }
                                        {
                                            darkStars.map((item, index) => {
                                                return (
                                                    <i key={index} className="darkStars"/>
                                                )
                                            })
                                        }
                                    </span> : null
                                    }
                                    {
                                        cmtStarRound && cmtCountRound ? <i className="line"/> : null
                                    }
                                    {
                                        cmtCountRound ? <Fragment>
                                            <i className="userIcon"/>
                                            <span className="text">{cmtCountRound}</span>
                                        </Fragment> : null
                                    }
                                </div> : null
                            }
                            {
                                attFlag && att.map((item, index) => {
                                    let name = /Color/i.test(item.name) ? '颜色' : /Size/i.test(item.name) ? '尺寸' : item.name;
                                    return (
                                        <div key={index} className={`attWrap active ${index === 0 ? "mb24" : ''}`}>
                                            <p className="label">{name}</p>
                                            <ul className="itemUl">
                                                {item.value.map((subItem, subIndex) => {
                                                    return (
                                                        <li key={subIndex} className='item'>{subItem.name}</li>
                                                    )
                                                })}
                                            </ul>
                                        </div>
                                    )
                                })
                            }
                            {
                                desc_att.length > 0 ? <div className="attWrap">
                                    <p className="label">产品描述</p>
                                    <div className="describe">
                                        {
                                            desc_att.map((item, index) => {
                                                return (
                                                    <p key={index} className="text">{item.name}：{item.value}</p>
                                                )
                                            })
                                        }
                                    </div>
                                </div> : null
                            }

                            <div className="attWrap">
                                <p className="label">来源</p>
                                <div className="describe">
                                    <Link to={`/searchPage/site/${site}`}>
                                        <p className="text active">{site}</p>
                                    </Link>
                                </div>
                            </div>
                            {
                                designer ? <div className="attWrap">
                                    <p className="label">品牌</p>
                                    <div className="describe">
                                        <Link to={`/searchPage/source_brand/${designer}`}>
                                            <p className="text active">{designer}</p>
                                        </Link>
                                    </div>
                                </div> : null
                            }
                            {
                                designer_by ? <div className="attWrap">
                                    <p className="label">设计师</p>
                                    <div className="describe">
                                        <Link to={`/searchPage/designer/${designer_by}`}>
                                            <p className="text active">{designer_by}</p>
                                        </Link>
                                    </div>
                                </div> : null
                            }
                        </div>
                        {
                            similarProduct.length > 0 ? <Fragment>
                                <p className="guessLabel">更多相近产品</p>
                                <div className="waterfallBox">
                                    <div className="waterfallWrap">
                                        <div id="waterfallLeft" className="waterfallLeft">
                                            {this.listCodeFragment(dataInitLeft)}
                                        </div>
                                        <div id="waterfallRight" className="waterfallRight">
                                            {this.listCodeFragment(dataInitRight)}
                                        </div>
                                    </div>
                                </div>
                            </Fragment> : null
                        }

                        <div className="noData">已经到底了</div>
                    </div>
                    {/*关注公众号*/}
                    {
                        !flag && <div id="publicNumberId" className="publicNumberWrap">
                            <div className="left">
                                <img className="img" src={logoBig} alt="logo图片"/>
                                <p className="desc">
                                    网络全球优品 <br/>快看最新产品市场趋势
                                </p>
                                <p className="link"><span className="linkLeft">PC端访问：</span><a className="linkHref"
                                                                                               href="#">www.ffdig.com</a>
                                </p>
                            </div>
                            <div className="right">
                                <img className="codeImg" src={sqr} alt="二维码"/>
                                <p className="text">长按关注公众号</p>
                            </div>
                        </div>
                    }

                </div>
                {/*查看更多产品*/}
                {
                    !flag ? <div className="moreProductWrap">
                        <Link to="/firstPage" className="moreProduct">
                            <span>查看更</span>
                            <span>多产品</span>
                        </Link>
                    </div> : null
                }
            </Fragment>
        );
    }
}

export default withRouter(GoodsDetail);