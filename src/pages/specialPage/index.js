import React, {Component, Fragment} from 'react';

import {ActivityIndicator, Button, NoticeBar} from 'antd-mobile';
import axiosHttp from "../../utils/ajax";
import moment from "moment";
import commonFun from "../../utils/commonFun";
import {Link, withRouter} from "react-router-dom";
import GoodsDetail from "../goodsDetail";
import {createForm} from "rc-form";
import noResult from "../../img/no-result.png";
import {specialData, siteData, initData, catData} from "../../config/staticData";
import Utils from "../../utils/utils";
import emitter from "../../utils/events";
import './index.less'

let NUM_9 = 9, MAX_21 = 21, initDataCopy = JSON.parse(JSON.stringify(initData));

class SpecialPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            dataList: [],
            total: 0,//搜索的列表数量
            isNoticeFlag: false, //通知登录弹框
            open: false,  //打开右边筛选
            defaultFlag: false,
            isDetailFlag: false, //是否显示产品详情
            productId: '', //产品id
            relation: {}, //根据分类id获取分类映射信息
        };
    }

    pageInfo = {
        "page": 1,
        "limit": 12,
        "keyword": "",
        "site": "",
        "cat_id": '0',
        "price_min": 0,
        "price_max": 0,
        "sort": "", //排序字段 list_price_usd / ondateOnline
        "sort_type": "",  //升序:asc 倒序:desc
        "source_brand": "",//	string 品牌(需支持多个)
        "designer": "",//设计师(需支持多个)
        "cmtStar": 0,//评论星级
        "start_time": 0,//上架时间开始时间(传时间戳)
        "end_time": 0,//上架时间结束时间(传时间戳)
        "currency": "cny",
    };
    storage = window.sessionStorage;
    local = window.localStorage;
    count = 1;
    timer = null;
    selectTime = -1;
    sortName = '默认';//排序的名称

    componentDidMount() {
        const {url, params: {name = '', type = '', index = ''}} = this.props.match;
        this.storage.setItem('historyUrl', url);
        let shareTitle = '';
        if (type === 'site') {
            shareTitle = name + ' 产品精选';
            this.pageInfo.site = index || '';
        } else if (type === 'cat') {
            shareTitle = name + ' 产品精选';
            this.pageInfo.cat_id = index || '';
            this.getCatRelationHttp(index);
        } else if (type === 'column') {
            shareTitle = name + ` ${moment(new Date()).format('YYYY')}年TOP100热评`;
            let id = specialData[index].id || '0';
            this.pageInfo.cat_id = id;
            this.getCatRelationHttp(id);
        }
        document.title = shareTitle;
        this.local.setItem('shareTitle', shareTitle);
        this.homePageSearchHttp();
        this.timer = setTimeout(() => {
            let itemActive = document.querySelector('.homeNav>.item.active');
            itemActive && (this.refs.homeNavRef.scrollLeft = itemActive.offsetLeft);
            clearTimeout(this.timer);
        }, 100);
    }

    _handleScroll = (evt) => {
        const {scrollTop, scrollHeight, clientHeight} = evt.target;
        const {isDetailFlag, isLoading, total, dataList} = this.state;
        const {limit} = this.pageInfo;
        if (isDetailFlag || isLoading || (total % limit) >= dataList.length) { //出现详情就不应该在滚动了
            return
        }
        // 是否出现滚动到顶部
        if (scrollTop > 600) {
            if (!this.refs.toTopRef.className.includes('active')) {
                this.refs.toTopRef.className = 'toTop active';
            }
        } else {
            if (this.refs.toTopRef.className.includes('active')) {
                this.refs.toTopRef.className = 'toTop';
            }
        }
        if (scrollTop + clientHeight + 1000 >= scrollHeight && this.count === 1) {
            this.count = 2;
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                ++this.pageInfo.page;
                this.homePageSearchHttp();
                this.count = 1;
                clearTimeout(this.timer)
            }, 300)
        }
    };
    //     根据分类id获取分类映射信息
    getCatRelationHttp = (cat_id = '') => { //首页搜索--已登录
        axiosHttp(`api/WebSite/Classify/GetCatRelation?catid=${cat_id}`, '', 'get').then((res) => {
            if (res.code === 200) {
                let relation = {};
                if (res.data) {
                    const {designerBy, designer, site, style, texture, color} = res.data;
                    relation = {
                        designerBy: this.bouncerCommonFun(designerBy),
                        designer: this.bouncerCommonFun(designer),
                        site: site,
                        style: this.bouncerCommonFun(style),
                        texture: this.bouncerCommonFun(texture),
                        color: this.bouncerCommonFun(color),
                    };
                    this.setState({
                        relation
                    });
                }
            }
        }).catch(e => {
            console.log(e);
        })
    };
    bouncerCommonFun = (data = []) => {
        return Utils.bouncer(data).map((item, index) => {
            return ({
                name: item,
                index,
                isSelectFlag: false
            })
        });
    };

    _handleResetHomepage = () => {
        this.setState({
            defaultFlag: true
        })
    };
    _handleCloseSort = () => {
        this.setState({
            defaultFlag: false
        });
    };

    _handlePrice = () => {
        if (this.state.isLoading) {
            return;
        }
        let sort = this.pageInfo.sort_type === 'asc' ? 'desc' : 'asc';
        this.sortName = '默认';
        this.pageInfo.sort = 'list_price_usd';
        this.pageInfo.sort_type = sort;
        this.searchCommonFun();
    };
    _handleOnlineTime = (item) => {
        if (this.state.isLoading) {
            return;
        }
        this.sortName = item.name;
        this.pageInfo.sort = item.sort;
        this.pageInfo.sort_type = item.sortType;
        this.setState({
            defaultFlag: false
        });
        this.searchCommonFun();
    };
    _handleDefault = () => {
        if (this.state.isLoading) {
            return;
        }
        this.sortName = '默认';
        this.pageInfo.sort = '';
        this.pageInfo.sort_type = '';
        this.setState({
            defaultFlag: false,
        });
        this.searchCommonFun();
    };
    _handleReset = () => {
        const {cat_id, keyword, sort, sort_type} = this.pageInfo;
        this.pageInfo = {
            "page": 1,
            "limit": 12,
            "keyword": keyword,
            "cat_id": cat_id,
            "sort": sort, //排序字段 list_price_usd / ondateOnline
            "sort_type": sort_type,  //升序:asc 倒序:desc
            "site": "",
            "price_min": 0,
            "price_max": 0,
            "source_brand": "",//	string 品牌(需支持多个)
            "designer": "",//设计师(需支持多个)
            "cmtStar": 0,//评论星级
            "start_time": 0,//上架时间开始时间(传时间戳)
            "end_time": 0,//上架时间结束时间(传时间戳)
            "currency": "cny",
        };
        this.selectTime = -1;
        const {relation} = this.state;
        Object.keys(relation).forEach(k => {
            return relation[k].map((item,) => item.isSelectFlag = false)
        });
        this.setState({
            relation,
            open: false
        });
        this.searchCommonFun();
    };
    _handleSubmit = () => {
        this.setState({
            open: false
        });
        this.searchCommonFun();
    };
    searchCommonFun = () => {
        this.removeChildFun();
        this.pageInfo.page = 1;
        this.homePageSearchHttp();
    };
    removeChildFun = () => { //删除之前的dom原素
        let waterfallLeft = document.getElementById('waterfallLeft'),
            waterfallRight = document.getElementById('waterfallRight');
        let childLeft = waterfallLeft.childNodes,
            childRight = waterfallRight.childNodes;
        for (let i = childLeft.length - 1; i >= 0; i--) {
            waterfallLeft.removeChild(childLeft[i]);
        }
        for (let i = childRight.length - 1; i >= 0; i--) {
            waterfallRight.removeChild(childRight[i]);
        }
    };
    onOpenChange = (...args) => {
        this.setState({open: !this.state.open});
        // const {relation = {}} = this.state;
        // if (!relation.style) {
        //     this.getCatRelationHttp(this.pageInfo.cat_id);
        // }
    };
    _handleCloseDrawer = (e) => {
        e.stopPropagation();
        this.setState({
            open: !this.state.open
        })
    };
    _handleGoodsDetail = (object_id) => { //这个方法用到了，commonFun.js
        let session = window.sessionStorage;
        session.setItem('detailPages', 'detailPage');
        session.setItem('specialTitle', document.title);
        session.setItem('productId', object_id);
        this.setState({
            isDetailFlag: true,
            productId: object_id
        });
    };
    _handleClose = () => {
        this.setState({
            isDetailFlag: false
        });
        this.emitterCommonFun();
    };
    emitterCommonFun = () => {
        this.eventEmitter = emitter.emit('detailPage', true);
    };
    homePageSearchHttp = () => { //首页搜索--已登录
        this.setState({
            isLoading: true
        });
        axiosHttp("api/WebServices/Search/HomePageSearch", this.pageInfo).then((res) => {
            if (res.code === 0) {
                if (res.data) {
                    let cat2Id = this.storage.getItem('cat2Id'),
                        cat1Id = this.storage.getItem('cat1Id'), isHasFlag = false;
                    const codeCat1 = [10000019, 10000018, 10000024, 10000017],
                        codeCat2 = [20000017, 20000160];
                    for (let i = 0; i < codeCat1.length; i++) {
                        if (cat1Id == codeCat1[i]) {
                            isHasFlag = true;
                            break;
                        }
                    }
                    for (let m = 0; m < codeCat2.length; m++) {
                        if (cat2Id == codeCat2[m]) {
                            isHasFlag = true;
                            break
                        }
                    }
                    this.setState({
                        dataList: res.data || [],
                        total: Math.ceil(res.count || 0),
                    }, () => {
                        commonFun.createElementCommonFun(res.data, this);
                        this.setState({
                            isLoading: false
                        })
                    });
                } else {
                    this.initStateCommon();
                }
            } else if (res.code === 200) {
                this.initStateCommon();
            }
        }).catch(e => {
            console.log(e);
            this.setState({
                isLoading: false
            });
        })
    };
    initStateCommon = () => {
        this.setState({
            dataList: [],
            dataInit: [],
            total: 0,
            isLoading: false,
            isNoticeFlag: this.pageInfo.page > 4
        });
    };
    _handleClearValue = () => { //清除价格输入框中的值
        this.pageInfo.price_max = 0;
        this.pageInfo.price_min = 0;
        this.pageInfo.keyword = '';
        this.props.form.setFieldsValue({
            price_min: '',
            price_max: '',
        });
        this.searchCommonFun();
    };
    _handlePriceSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                // console.log(values);
                if (values.price_min <= values.price_max) {
                    this.pageInfo.price_min = values.price_min;
                    this.pageInfo.price_max = values.price_max;
                    this.setState({
                        open: false
                    });
                    this.searchCommonFun();
                }
            }
        });
    };
    _handleStar = (star) => {
        this.pageInfo.cmtStar = this.pageInfo.cmtStar === star ? 0 : star;
        this.setState({
            open: true
        });
    };
    _handleSite = (item, index) => {
        const {relation} = this.state;
        let selectArr = [];
        relation.site[index].isSelectFlag = !relation.site[index].isSelectFlag;
        relation.site.forEach((item) => {
            if (item.isSelectFlag) {
                selectArr = selectArr.concat(item.pdtSite)
            }
        });
        this.pageInfo.site = selectArr.toString();
        this.setState({
            relation,
            open: true
        });
    };
    _handleStyle = (type, index) => {
        const {relation} = this.state;
        let selectArr = [];
        relation[type][index].isSelectFlag = !relation[type][index].isSelectFlag;
        if (type === 'designer') {
            relation[type].forEach((item) => {
                if (item.isSelectFlag) {
                    selectArr.push(item.name)
                }
            });
            this.pageInfo.source_brand = selectArr.toString();
        } else if (type === 'designerBy') {
            relation[type].forEach((item) => {
                if (item.isSelectFlag) {
                    selectArr.push(item.name)
                }
            });
            this.pageInfo.designer = selectArr.toString();
        } else {
            const {style, color, texture} = relation;
            let newArr = style.concat(color, texture);
            newArr.forEach((item) => {
                if (item.isSelectFlag) {
                    selectArr.push(item.name)
                }
            });
            this.pageInfo.keyword = selectArr.toString();
        }
        this.setState({
            relation,
            open: true
        });
    };
    _handleSearchTime = (type, index) => {
        const [name, value] = type.split('=');
        this.selectTime = this.selectTime === index ? -1 : index;
        this.pageInfo.start_time = Math.round(moment().subtract(name, value).valueOf() / 1000);
        this.setState({
            open: true
        });
    };
    _handleSearchList = () => {
        let params = this.keyword.trim();
        if (params) {
            this.props.history.push('/globalProducts/' + params);
        }
    };
    _handleOnChange = (e) => {
        this.keyword = e.target.value;
    };
    _handleScrollTop = () => {
        this.refs.specialRef.scrollTop = 0;
    };
    _handleSpecial = (item) => {
        // let id = specialData[index].id;
        this.selectTime = -1;
        this.sortName = '默认';//排序的名称
        document.title = item.name + ` ${moment(new Date()).format('YYYY')}年TOP100热评`;
        // this.local.setItem('shareTitle', item.name);
        this.pageInfo = {...initDataCopy, cat_id: item.id};
        this.getCatRelationHttp(item.id);
        this.searchCommonFun();
    };
    _handleSpecialSite = (item) => {
        // console.log(item);
        this.selectTime = -1;
        this.sortName = '默认';//排序的名称
        if (typeof item === 'object') {
            document.title = item.name + ' 产品精选';
            // this.local.setItem('shareTitle', item.name);
            this.pageInfo = {...initDataCopy, cat_id: item.id};
        } else {
            document.title = item + ' 产品精选';
            // this.local.setItem('shareTitle', item);
            this.pageInfo = {...initDataCopy, site: item};
        }
        this.getCatRelationHttp(item.id);
        this.searchCommonFun();
    };
    goToBack = () => {
        window.sessionStorage.setItem('goToBack', this.props.match.url); //保存入口的路径，
        this.props.history.push('/searchListCpn');
    };
    _handleAccordion = (type) => {
        let itemArr = ['style', 'texture', 'color', 'designer', 'designerBy', 'site'];
        const {relation} = this.state;
        for (let i = 0; i < itemArr.length; i++) {
            if (type === itemArr[i]) {
                relation[type + 'Flag'] = !(relation[type + 'Flag']);
            } else {
                relation[itemArr[i] + 'Flag'] = false;
            }
        }
        this.setState({
            relation
        });
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        const {getFieldProps} = this.props.form;
        const {url, params: {type = '', index = ''}} = this.props.match;
        const {isLoading, isNoticeFlag, open, defaultFlag, isDetailFlag, productId, relation = {}, total} = this.state;
        const {style = [], styleFlag = false, texture = [], textureFlag = false, color = [], colorFlag = false, designer = [], designerFlag = false, designerBy = [], designerByFlag = false, site = [], siteFlag = false} = relation;
        // 款式  材质 颜色 品牌 设计师 平台
        const {page, limit, cmtStar, cat_id} = this.pageInfo;
        let styleData = style.filter((em, index) => index < (styleFlag ? style.length : NUM_9)),
            textureData = texture.filter((em, index) => index < (textureFlag ? texture.length : NUM_9)),
            colorData = color.filter((em, index) => index < (colorFlag ? color.length : NUM_9)),
            designerData = designer.filter((em, index) => index < (designerFlag ? MAX_21 : NUM_9)),
            designerByData = designerBy.filter((em, index) => index < (designerByFlag ? MAX_21 : NUM_9)),
            siteDatas = site.filter((em, index) => index < (siteFlag ? site.length : NUM_9));
        return (
            <div className="boxWrap">
                <div className="searchNavBar special">
                    <i className="fanhui" onClick={() => this.props.history.push('/firstPage')}/>
                    <div className="middle" onClick={this.goToBack}>
                        <form onSubmit={this._handleSearchList}>
                            <input type="text" placeholder="搜索产品"  {...getFieldProps('keyword', {
                                initialValue: '',
                                // onChange: this._handleOnChange,
                                // validateTrigger: 'onBlur'
                            })}/>
                        </form>
                        <i className="searchIcon"/>
                        <i className="delIcon" onClick={this._handleDeleteCtn}/>
                    </div>
                </div>
                {/*导航栏*/}
                {
                    type === 'cat' ? <div className="homeNavWrap">
                        <ul ref="homeNavRef" className="homeNav">
                            {
                                catData.map((item, index) => {
                                    return (
                                        <li onClick={this._handleSpecialSite.bind(this, item)}
                                            className={`item ${item.id === cat_id ? 'active' : ''}`}
                                            key={index}>{item.name}</li>
                                    )
                                })
                            }
                        </ul>
                    </div> : null
                }
                {
                    // type === 'column' ? <ul className="specialNav">
                    //     {
                    //
                    //         specialData.map((item, index) => {
                    //             return (
                    //                 <li onClick={this._handleSpecial.bind(this, item)}
                    //                     className={`item ${item.id === cat_id ? 'active' : ''}`}
                    //                     key={index}>{item.name}</li>
                    //             )
                    //         })
                    //     }
                    // </ul> : null
                }
                {
                    // type === 'site' ? <div className="homeNavWrap">
                    //     <ul ref="homeNavRef" className="homeNav">
                    //         {
                    //             siteData.map((item, index) => {
                    //                 return (
                    //                     <li onClick={this._handleSpecialSite.bind(this, item)}
                    //                         className={`item ${item === this.pageInfo.site ? 'active' : ''}`}
                    //                         key={index}>{item}</li>
                    //                 )
                    //             })
                    //         }
                    //     </ul>
                    // </div> : null
                }
                {/*排序公共的部分*/}
                {
                    commonFun.sortCommonFun(defaultFlag, this)
                }
                {/*筛选遮罩/按钮组*/}
                {
                    commonFun.drawerMaskCommonFun(open, this)
                }
                {/*筛选内容*/}
                <div className="drawerWrap"
                    // onClick={this._handleCloseDrawer}
                     style={{transform: `${open ? 'translateX(-100%)' : 'translateX(0)'}`}}>
                    {
                        style.length > 0 ? <div className="drawerItem">
                            <div className="drawerTitle">
                                <span className="title">款式</span>
                                {/*手风琴*/}
                                {
                                    style.length > NUM_9 ? <i className={`directionIcon ${styleFlag ? 'pullUp' : ''}`}
                                                              onClick={this._handleAccordion.bind(this, 'style')}/> : null
                                }
                            </div>
                            <ul className="drawerUl">
                                {
                                    styleData.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`drawerLi ${item.isSelectFlag ? 'active' : ''}`}
                                                onClick={this._handleStyle.bind(this, 'style', index)}>{item.name}</li>

                                        )
                                    })
                                }
                            </ul>
                        </div> : null
                    }
                    {
                        texture.length > 0 ? <div className="drawerItem">
                            <div className="drawerTitle">
                                <span className="title">材质</span>
                                {/*手风琴*/}
                                {
                                    texture.length > NUM_9 ?
                                        <i className={`directionIcon ${textureFlag ? 'pullUp' : ''}`}
                                           onClick={this._handleAccordion.bind(this, 'texture')}/> : null
                                }
                            </div>
                            <ul className="drawerUl">
                                {
                                    textureData.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`drawerLi ${item.isSelectFlag ? 'active' : ''}`}
                                                onClick={this._handleStyle.bind(this, 'texture', index)}>{item.name}</li>

                                        )
                                    })
                                }
                            </ul>
                        </div> : null
                    }
                    {
                        color.length > 0 ? <div className="drawerItem">
                            <div className="drawerTitle">
                                <span className="title">颜色</span>
                                {/*手风琴*/}
                                {
                                    color.length > NUM_9 ? <i className={`directionIcon ${colorFlag ? 'pullUp' : ''}`}
                                                              onClick={this._handleAccordion.bind(this, 'color')}/> : null
                                }
                            </div>
                            <ul className="drawerUl">
                                {
                                    colorData.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`drawerLi ${item.isSelectFlag ? 'active' : ''}`}
                                                onClick={this._handleStyle.bind(this, 'color', index)}>{item.name}</li>

                                        )
                                    })
                                }
                            </ul>
                        </div> : null
                    }


                    {
                        site.length > 0 ? <div className="drawerItem">
                            <div className="drawerTitle">
                                <span className="title">平台</span>
                                {/*手风琴*/}
                                {
                                    site.length > NUM_9 ? <i className={`directionIcon ${siteFlag ? 'pullUp' : ''}`}
                                                             onClick={this._handleAccordion.bind(this, 'site')}/> : null
                                }
                            </div>
                            <ul className="drawerUl">
                                {
                                    siteDatas.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`drawerLi ${item.isSelectFlag ? 'active' : ''}`}
                                                onClick={this._handleSite.bind(this, item, index)}>{item.adminSite}</li>

                                        )
                                    })
                                }
                            </ul>
                        </div> : null
                    }
                    {/*其他筛选*/}
                    <div className="drawerItem">
                        <div className="drawerTitle">价格</div>
                        <form className="rangeBox"
                              onSubmit={this._handlePriceSubmit}>
                            <input type="number" className="priceInput"
                                   {...getFieldProps('price_min', {
                                       initialValue: '',
                                       rules: [{validator: this.checkUsername}],
                                       validateTrigger: 'onBlur',
                                   })}
                                   placeholder="最低价格"
                            />
                            <span className="line"/>
                            <input type="number" className="priceInput"
                                   {...getFieldProps('price_max', {
                                       initialValue: '',
                                       rules: [{validator: this.checkUsername}],
                                       validateTrigger: 'onBlur',
                                   })}
                                   placeholder="最高价格"
                            />
                            <em/>
                            <i className="search"
                               onClick={this._handlePriceSubmit}>查询</i>
                            <i className="iconfont iconlb-cle clearPriceIcon"
                               onClick={this._handleClearValue}/>
                        </form>
                    </div>
                    <div className="drawerItem">
                        <div className="drawerTitle">上架时间</div>
                        <ul className="drawerUl">
                            {[{name: '最近7天', type: '7=days'},
                                {
                                    name: '最近一个月',
                                    type: '1=months'
                                }, {name: '最近三个月', type: '3=months'}, {
                                    name: '最近半年',
                                    type: '6=months'
                                }].map((item, index) => {
                                return (
                                    <li key={index}
                                        className={`drawerLi ${this.selectTime === index ? 'active' : ''}`}
                                        onClick={this._handleSearchTime.bind(this, item.type, index)}
                                    >{item.name}</li>
                                )
                            })}

                        </ul>
                    </div>
                    <div className="drawerItem">
                        <div className="drawerTitle">评价星级</div>
                        <ul className="drawerUl">
                            {
                                ['五星', '四星', '三星', '二星', '一星'].map((item, index) => {
                                    return (
                                        <li key={index}
                                            className={`drawerLi ${cmtStar === 5 - index ? 'active' : ''}`}
                                            onClick={this._handleStar.bind(this, 5 - index)}>{item}</li>

                                    )
                                })
                            }
                        </ul>
                    </div>
                    {
                        designer.length > 0 ? <div className="drawerItem">
                            <div className="drawerTitle">
                                <span className="title">品牌</span>
                                {/*手风琴*/}
                                {
                                    designer.length > NUM_9 ?
                                        <i className={`directionIcon ${designerFlag ? 'pullUp' : ''}`}
                                           onClick={this._handleAccordion.bind(this, 'designer')}/> : null
                                }
                            </div>
                            <ul className="drawerUl">
                                {
                                    designerData.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`drawerLi ${item.isSelectFlag ? 'active' : ''}`}
                                                onClick={this._handleStyle.bind(this, 'designer', index)}>{item.name}</li>

                                        )
                                    })
                                }
                            </ul>
                        </div> : null
                    }
                    {
                        designerBy.length > 0 ? <div className="drawerItem">
                            <div className="drawerTitle">
                                <span className="title">设计师</span>
                                {/*手风琴*/}
                                {
                                    designerBy.length > NUM_9 ?
                                        <i className={`directionIcon ${designerByFlag ? 'pullUp' : ''}`}
                                           onClick={this._handleAccordion.bind(this, 'designerBy')}/> : null
                                }
                            </div>
                            <ul className="drawerUl">
                                {
                                    designerByData.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`drawerLi ${item.isSelectFlag ? 'active' : ''}`}
                                                onClick={this._handleStyle.bind(this, 'designerBy', index)}>{item.name}</li>

                                        )
                                    })
                                }
                            </ul>
                        </div> : null
                    }
                </div>
                {/*数据列表*/}
                <div ref="specialRef" className="productList specialPageH" onScroll={this._handleScroll}>
                    <div className="waterfallWrap" id="main">
                        <div id="waterfallLeft" className="waterfallLeft">
                        </div>
                        <div id="waterfallRight" className="waterfallRight">
                        </div>
                    </div>
                    {
                        isLoading === false && total === 0 ?
                            <div className="noSearchBox specialPageH">
                                <div className="noSearchWrap">
                                    <img className="img" src={noResult} alt="抱歉，未搜罗到相关产品"/>
                                    <p className="text">抱歉，未搜罗到相关产品</p>
                                </div>
                            </div> : null
                    }
                    {/*搜索产品没有结果*/}
                    {/*加载动画*/}
                    {
                        isLoading ? <div className="loading-example">
                            <ActivityIndicator text="Loading..."/>
                        </div> : total <= (page * limit) &&
                            <div className="loading-example">没有更多数据了</div>
                    }
                </div>
                {/*提示通知*/}
                {
                    isNoticeFlag && <NoticeBar className="noticeBarWrap active" mode="link" marqueeProps={{loop: true}}
                                               action={<Link to="/loginCpn"><Button size="small"
                                                                                    type="primary">登录/注册</Button></Link>}>亲~你还未登录，查看优品有限哦！ </NoticeBar>
                }
                {/*右侧的产品详情页面*/}
                {
                    isDetailFlag && <GoodsDetail flag={isDetailFlag} productId={productId} onClose={this._handleClose}/>
                }
                {/*回到顶部*/}
                <span ref="toTopRef" className="toTop" onClick={this._handleScrollTop}/>
            </div>
        );
    }
}

export default createForm()(withRouter(SpecialPage));
