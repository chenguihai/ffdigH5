import React, {Component} from 'react';
import {ActivityIndicator} from 'antd-mobile';
import axiosHttp from "../../utils/ajax";
import moment from "moment";
import Utils from '../../utils/utils'
import commonFun from '../../utils/commonFun'
import NavBarCpn from "../../components/NavBarCpn";
import {createForm} from 'rc-form';
import noCollect from "../../img/wusoucang.png";
import GoodsDetail from "../goodsDetail";
import emitter from "../../utils/events";
import './index.less'

let NUM_9 = 9;

class MyCollect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: [],
            totalCount: 0,//列表的长度
            dataInit: [],
            TagList: [],
            flagArr: {
                tagFlag: false,
                catFlag: false,
                siteFlag: false,
            },
            CatList: [],
            SiteList: [],
            productId: '', //产品id
            isDetailFlag: false, //是否显示产品详情
            isLoading: false,
            drawerFlag: false, //右边抽屉的展示
        };
    }

    paramObj = {
        page: 1,
        limit: 12,
        startOnline: Utils.momentFormat(moment().subtract(1, "months")),
        endOnline: Utils.momentFormat(moment()),
        site: "", //平台
        cat: "", //分类
        marklabel: '',//标签
        keyword: "",
    };
    TagListIndex = -1;
    CatListIndex = -1;
    SiteListIndex = -1;
    selectTime = -1;

    componentDidMount() {
        const storage = window.sessionStorage;
        const {url, params: {type, catId = ''}} = this.props.match;
        storage.setItem('historyUrl', url);
        if (type === 'keyword') {
            this.paramObj.cat_id = 0;
            this.paramObj[type] = catId === 'keyword' ? '' : catId;
        } else if (type === 'cat_id') {
            this.paramObj[type] = catId;
        }
        this.getProductCollectHttp();
        this.getProductCollectSiteAndCatHttp();
    }

    _handleScroll = (evt) => {
        const {scrollTop, scrollHeight, clientHeight} = evt.target;
        const {isDetailFlag, isLoading, dataList, totalCount} = this.state;
        const {limit} = this.paramObj;
        if (isDetailFlag || isLoading || (totalCount % limit) >= dataList.length) { //出现详情就不应该在滚动了
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
        // if (commonFun.checkScrollSlide()) {
        if (scrollTop + clientHeight + 1000 >= scrollHeight) {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                ++this.paramObj.page;
                this.getProductCollectHttp();
                clearTimeout(this.timer)
            }, 300)
        }
    };

    getProductCollectSiteAndCatHttp = () => { //获取平台和分类
        axiosHttp("api/WebSite/ProductCollect/GetProductCollectSiteAndCat", '', 'GET').then((res) => {
            if (res.code === 200) {
                const {SiteList = [], CatList = [], TagList = []} = res.data;
                this.setState({
                    TagList: Utils.bouncer(TagList),
                    CatList: Utils.bouncer(CatList),
                    SiteList: Utils.bouncer(SiteList),
                });
            }
        }).catch(e => {
            console.log(e);
        })
    };
    _handleOnChange = (e) => {
        this.paramObj.keyword = e.target.value;
    };

    _handleGoodsDetail = (object_id) => {
        let storage = window.sessionStorage;
        storage.setItem('detailPages', 'detailPage');
        storage.setItem('specialTitle', document.title);
        storage.setItem('productId', object_id);
        this.setState({
            isDetailFlag: true,
            productId: object_id
        });
    };
    getProductCollectHttp = () => { //获取商品收藏
        this.setState({
            isLoading: true
        });
        axiosHttp("api/WebSite/ProductCollect/GetProductCollect", this.paramObj).then((res) => {
            if (res.code === 200) {
                const {totalCount = 0, list = [], totalPages = 0} = res.data;
                this.setState({
                    dataList: list,
                    totalCount: totalCount,
                    isLoading: false,
                }, () => {
                    list.length > 0 && commonFun.createElementMyCollectFun(list, this);
                })
            } else {
                this.setState({
                    dataList: [],
                    total: 0,
                    isLoading: false
                })
            }
        }).catch(e => {
            console.log(e);
            this.setState({
                isLoading: false
            });
        })
    };
    _handleSubmit = () => {
        this.props.form.validateFields((error, value) => {
            if (!error) {
                this.searchCommonFun();
            }
        });
    };
    _handleDeleteCtn = () => { //清除输入框的内容
        this.paramObj.keyword = '';
        this.paramObj.page = 1;
        this.props.form.setFieldsValue({
            'keyword': ''
        });
    };
    _handleSearchTime = (type, index) => {
        const [name, value] = type.split('=');
        this.selectTime = this.selectTime === index ? -1 : index;
        this.paramObj.startOnline = moment().subtract(name, value).format('YYYY-MM-DD HH:mm:ss');
        // this.searchCommonFun();
        this.setState({
            drawerFlag: true
        });
    };
    onOpenChange = () => {
        this.setState({drawerFlag: !this.state.drawerFlag});
    };
    _handleStyle = (type, name) => {
        const {cat, site, marklabel} = this.paramObj;
        if (type === 'CatListIndex') {
            this.paramObj.cat = cat === name ? '' : name;
        } else if (type === 'SiteListIndex') {
            this.paramObj.site = site === name ? '' : name;
        } else {
            this.paramObj.marklabel = marklabel === name ? '' : name;
        }
        // this.searchCommonFun();
        this.setState({
            drawerFlag: true
        });
    };
    _handleReset = () => {
        const {keyword} = this.paramObj;
        this.paramObj = {
            page: 1,
            limit: 12,
            startOnline: Utils.momentFormat(moment().subtract(1, "months")),
            endOnline: Utils.momentFormat(moment()),
            site: "", //平台
            cat: "", //分类
            marklabel: '',//标签
            keyword: keyword,
        };
        this.selectTime = -1;
        this.searchCommonFun();
        this.setState({
            drawerFlag: false
        });
    };
    _handleConditionSubmit = () => {
        this.setState({
            drawerFlag: false
        });
        this.searchCommonFun();
    };
    _handleCloseDrawer = (e) => {
        e.stopPropagation();
        this.setState({
            drawerFlag: !this.state.drawerFlag
        })
    };
    searchCommonFun = () => {
        this.removeChildFun();
        this.paramObj.page = 1;
        this.getProductCollectHttp();
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
    handlePressEnter = (e) => {
        if (e.keyCode === 13) {
            this.searchCommonFun();
        }
        // this.searchCommonFun(e.target.value);
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
    _handleScrollTop = () => {
        this.refs.specialRef.scrollTop = 0;
    };
    _handleAccordion = (type) => {
        const {flagArr = {}} = this.state, itemArr = ['site', 'cat', 'tag'];
        for (let i = 0; i < itemArr.length; i++) {
            if (type === itemArr[i]) {
                flagArr[type + 'Flag'] = !(flagArr[type + 'Flag']);
            } else {
                flagArr[itemArr[i] + 'Flag'] = false;
            }
        }
        this.setState({flagArr});
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        const {getFieldProps} = this.props.form;
        const {dataList, isLoading, drawerFlag, SiteList = [], CatList = [], flagArr: {siteFlag, catFlag, tagFlag}, TagList = [], isDetailFlag, productId, totalCount = 0} = this.state;
        const {page, limit, cat, site, marklabel} = this.paramObj;
        const style = {
            displayNone: {display: 'none'}
        };
        let siteData = SiteList.filter((em, index) => index < (siteFlag ? SiteList.length : NUM_9)),
            catData = CatList.filter((em, index) => index < (catFlag ? CatList.length : NUM_9)),
            tagData = TagList.filter((em, index) => index < (tagFlag ? TagList.length : NUM_9));

        return (
            <div className="boxWrap">
                <NavBarCpn title="我的收藏"/>
                <div className="whiteSpace16"/>
                <div className="searchNavBar collect">
                    <div className="middle">
                        <form onSubmit={this._handleSubmit}>
                            <input onKeyDown={this.handlePressEnter} type="text"
                                   placeholder="搜索产品"  {...getFieldProps('keyword', {
                                initialValue: '',
                                onChange: this._handleOnChange,
                                validateTrigger: 'onBlur'
                            })}/>
                            <input id="hiddenText" type="text" style={style.displayNone}/>
                        </form>
                        <i className="searchIcon" onClick={this._handleSubmit}/>
                        <i className="delIcon" onClick={this._handleDeleteCtn}/>
                    </div>
                    <div onClick={this.onOpenChange}>
                        <span>筛选</span> <i
                        className="screenIcon"/>
                    </div>

                </div>
                {/*数据列表*/}
                <div ref="specialRef" className="collectList" onScroll={this._handleScroll}>
                    <div className="waterfallWrap" id="main">
                        <div id="waterfallLeft" className="waterfallLeft">
                        </div>
                        <div id="waterfallRight" className="waterfallRight">
                        </div>
                    </div>
                    {
                        totalCount === 0 ? <div className="noSearchWrap noCollect">
                            <img className="collectImg" src={noCollect} alt="未收藏相关产品"/>
                            <p className="text">您的收藏库空空如也，去搜罗感兴趣的产品吧</p>
                        </div> : null
                    }
                    {/*搜索产品没有结果*/}
                    {/*加载动画*/}
                    {
                        isLoading ? <div className="loading-example">
                            <ActivityIndicator text="Loading..."/>
                        </div> : totalCount <= (page * limit) &&
                            <div className="loading-example">没有更多数据了</div>
                    }
                    <span ref="toTopRef" className="toTop" onClick={this._handleScrollTop}/>
                </div>
                {/*筛选*/}
                <div className="drawerMask" onClick={this._handleCloseDrawer}
                     style={{transform: `${drawerFlag ? 'translateX(0)' : 'translateX(100%)'}`}}/>
                {/*筛选按钮组*/}
                <div className="drawerBtnF"
                     style={{transform: `${drawerFlag ? 'translateX(-100%)' : 'translateX(0)'}`}}>
                    <div className="drawerBtnGroup">
                            <span className="drawerBtn left"
                                  onClick={this._handleReset}>重置</span>
                        <span className="drawerBtn right"
                              onClick={this._handleConditionSubmit}>确定</span>
                    </div>
                </div>
                {/*筛选内容*/}
                <div className="drawerWrap"
                    // onClick={this._handleCloseDrawer}
                     style={{transform: `${drawerFlag ? 'translateX(-100%)' : 'translateX(0)'}`}}>
                    {
                        SiteList.length > 0 ? <div className="drawerItem">
                            <div className="drawerTitle">
                                <span className="title">平台</span>
                                {/*手风琴*/}
                                {
                                    SiteList.length > NUM_9 ?
                                        <i className={`directionIcon ${siteFlag ? 'pullUp' : ''}`}
                                           onClick={this._handleAccordion.bind(this, 'site')}/> : null
                                }
                            </div>
                            <ul className="drawerUl">
                                {
                                    siteData.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`drawerLi ${item === site ? 'active' : ''}`}
                                                onClick={this._handleStyle.bind(this, 'SiteListIndex', item)}>{item}</li>

                                        )
                                    })
                                }
                            </ul>
                        </div> : null
                    }
                    {
                        CatList.length > 0 ? <div className="drawerItem">
                            <div className="drawerTitle">
                                <span className="title">产品分类</span>
                                {/*手风琴*/}
                                {
                                    CatList.length > NUM_9 ?
                                        <i className={`directionIcon ${catFlag ? 'pullUp' : ''}`}
                                           onClick={this._handleAccordion.bind(this, 'cat')}/> : null
                                }
                            </div>
                            <ul className="drawerUl">
                                {
                                    catData.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`drawerLi ${item === cat ? 'active' : ''}`}
                                                onClick={this._handleStyle.bind(this, 'CatListIndex', item)}>{item}</li>

                                        )
                                    })
                                }
                            </ul>
                        </div> : null
                    }
                    {
                        TagList.length > 0 ? <div className="drawerItem">
                            <div className="drawerTitle">
                                <span className="title">我的标签</span>
                                {/*手风琴*/}
                                {
                                    TagList.length > NUM_9 ?
                                        <i className={`directionIcon ${tagFlag ? 'pullUp' : ''}`}
                                           onClick={this._handleAccordion.bind(this, 'tag')}/> : null
                                }
                            </div>
                            <ul className="drawerUl">
                                {
                                    tagData.map((item, index) => {
                                        return (
                                            <li key={index}
                                                className={`drawerLi ${item === marklabel ? 'active' : ''}`}
                                                onClick={this._handleStyle.bind(this, 'TagListIndex', item)}>{item}</li>

                                        )
                                    })
                                }
                            </ul>
                        </div> : null
                    }
                    {/*其他筛选*/}
                    <div className="drawerItem">
                        <div className="drawerTitle">收藏时间</div>
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
                </div>
                {/*右侧的产品详情页面*/}
                {
                    isDetailFlag && <GoodsDetail flag={isDetailFlag} productId={productId} onClose={this._handleClose}/>
                }
            </div>
        );
    }
}


export default createForm()(MyCollect)
