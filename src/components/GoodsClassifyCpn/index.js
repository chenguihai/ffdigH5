import React, {Component, Fragment} from 'react';
import {Link,withRouter} from "react-router-dom";
import {cmiCatData} from '../../config/staticData'
import axiosHttp from "../../utils/ajax";
import config from "../../config/config";
import placeholder from '../../img/placeholder.jpg';
import './index.less'

class GoodsClassifyCpn extends Component {
    state = {
        cmiCat: [],
        cmiCat2: [],
        cmiCat3: [],
        cat1Index: 0,
    };

    componentDidMount() {
        this.GetClassifyMsgHttp();
    }

    GetClassifyMsgHttp = () => { //获取首页数据
        this.setState({
            loading: true,
        });
        axiosHttp("api/WebSite/Classify/GetClassifyMsg", '', "GET").then((res) => {
            if (res.code === 200) {
                let cmi_cat = res.data, cmi_catData = JSON.parse(JSON.stringify(cmiCatData));
                for (let i = 0; i < cmi_cat.length; i++) {
                    // 女装 0
                    if (cmi_cat[i].cat1_id === '10000019') {
                        cmi_catData[0].list = cmi_cat[i].list.concat(cmi_catData[0].list);
                    } else if (cmi_cat[i].cat1_id === '10000009') {
                        cmi_catData[0].list = cmi_catData[0].list.concat(cmi_cat[i].list.filter((item) => item.cat2_id !== '20000249' && item.cat2_id !== '20000259'));
                        cmi_catData[5].list = cmi_catData[5].list.concat(cmi_cat[i].list.filter((item) => item.cat2_id === '20000249' || item.cat2_id === '20000259'));
                    }
                    // 男装 1
                    if (cmi_cat[i].cat1_id === '10000018') {
                        cmi_catData[1].list = cmi_catData[1].list.concat(cmi_cat[i].list);
                    }
                    // 家居生活 3
                    if (cmi_cat[i].cat1_id === '10000010') {
                        cmi_catData[3].list = cmi_catData[3].list.concat(cmi_cat[i].list);
                    } else if (cmi_cat[i].cat1_id === '10000022') {
                        cmi_catData[3].list = cmi_catData[3].list.concat(cmi_cat[i].list);
                    }
                    // 包包&鞋子 4
                    if (cmi_cat[i].cat1_id === '10000001') {
                        cmi_catData[4].list = cmi_catData[4].list.concat(cmi_cat[i].list);
                    }
                    // 珠宝配饰 5
                    if (cmi_cat[i].cat1_id === '10000025') {
                        cmi_catData[5].list = cmi_cat[i].list.concat(cmi_catData[5].list);
                    } else if (cmi_cat[i].cat1_id === '10000006') {
                        cmi_catData[5].list = cmi_catData[5].list.concat(cmi_cat[i].list);
                    } else if (cmi_cat[i].cat1_id === '10000029') {
                        cmi_catData[5].list = cmi_catData[5].list.concat(cmi_cat[i].list);
                    }
                    // 户外运动 6
                    if (cmi_cat[i].cat1_id === '10000024') {
                        cmi_catData[6].list = cmi_catData[6].list.concat(cmi_cat[i].list);
                    }
                    for (let j = 0; j < cmi_cat[i].list.length; j++) {
                        let cat2Data = cmi_cat[i].list[j];
                        // 女装 0
                        if (cat2Data.cat2_id === '20000051') {
                            cmi_catData[0].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000127') {
                            cmi_catData[0].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000060') {
                            cmi_catData[0].list.push(cat2Data);
                        }
                        // 男装 1
                        if (cat2Data.cat2_id === '20000261') {
                            cmi_catData[1].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000218') {
                            cmi_catData[1].list.push(cat2Data);
                        }
                        // 妈妈&儿童 2
                        if (cat2Data.cat2_id === '20000160') {
                            cmi_catData[2].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000491') {
                            cmi_catData[2].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000494') {
                            cmi_catData[2].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000493') {
                            cmi_catData[2].list.push(cat2Data);
                        }
                        // 家居生活 3
                        if (cat2Data.cat2_id === '20000219') {
                            cmi_catData[3].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000018') {
                            cmi_catData[3].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000133') {
                            cmi_catData[3].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000138') {
                            cmi_catData[3].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000179') {
                            cmi_catData[3].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000257') {
                            cmi_catData[3].list.push(cat2Data);
                        } else if (cat2Data.cat2_id === '20000078') {
                            cmi_catData[3].list.push(cat2Data);
                        }
                    }
                }
                let cat1Index = window.sessionStorage.getItem('cat1Index') || 0,
                    list = cmi_catData[cat1Index].list;
                this.setState({
                    cmiCat: cmi_catData,
                    cmiCat2: list,
                    cmiCat3: list.length > 0 && list[0].list,
                    loading: false,
                    cat1Index: cat1Index
                });
            } else {
                this.setState({
                    hotProductCat: [],
                    cmiCat: [],
                    cmiCat2: [],
                    cmiCat3: [],
                    loading: false
                })
            }
        }).catch(e => {
            console.log(e);
        })
    };
    _handleCat1Click = (item, index) => {
        this.setState({
            cmiCat2: item,
            cat1Index: index,
        });
        window.sessionStorage.setItem('cat1Index', index);
    };
    _handleCat3Click = (cat3Id, cat2Id, name) => {
        const {cmiCat = [], cat1Index} = this.state;
        let storage = window.sessionStorage;
        storage.setItem('cat2Id', cat2Id);
        storage.setItem('cat1Id', cmiCat[cat1Index].cat1_id);
        storage.setItem('cat3Name', name);
        this.props.history.push('/searchPage/cat_id/' + cat3Id);
    };
    _handleAccordion = (index) => {
        const {cmiCat2} = this.state;
        let cmiCat = cmiCat2.map((item, subIndex) => {
            if (subIndex === index) {
                item.isSelectFlag = !cmiCat2[index].isSelectFlag;
            } else {
                item.isSelectFlag = false;
            }
            return item;
        });
        this.setState({
            cmiCat2: cmiCat
        })

    };

    render() {
        const {cmiCat = [], cmiCat2 = [], cat1Index} = this.state;
        return (
            <Fragment>
                <div className="singleSearch">
                    <div className="pr">
                        <input type="text" placeholder="搜索产品"
                               onFocus={() => this.props.history.push('/searchListCpn')}/>
                        <i className="searchIcon"/>
                    </div>
                    {/*搜索的内容*/}
                </div>
                <div className="classifyWrap">
                    <ul className="left">
                        {
                            cmiCat.map((item, index) => {
                                return (
                                    <li className={`item ${+cat1Index === index ? 'active' : ''}`} key={item.cat1_id}
                                        onClick={this._handleCat1Click.bind(this, item.list, index)}>
                                        <span className="text">{item.cat1_name_cn}</span>
                                        <i className="blockIcon"/>
                                    </li>)
                            })
                        }
                    </ul>
                    <div className="right">
                        <div className="whiteSpace16"/>
                        {
                            cmiCat2.map((item, index) => {
                                let num = item.isSelectFlag ? item.list.length : 9,
                                    data = item.list.filter((em, index) => index < num);
                                return (
                                    <div key={item.cat2_id} className="threeItem">
                                        <div className='title active'>{item.cat2_name_cn}</div>
                                        <ul className="threeWrap">
                                            {
                                                // item.list
                                                data.map((subItem) => {
                                                    return (
                                                        <li className="item" key={subItem.cat3_id}
                                                            onClick={this._handleCat3Click.bind(this, subItem.cat3_id, item.cat2_id, subItem.cat3_name_cn)}>
                                                            {/*<Link to={`/searchPage/cat_id/${subItem.cat3_id}`}>*/}
                                                                <img className="img"
                                                                     src={`${config.imgUrl}/cat/${subItem.cat3_id}-${subItem.cat3_name_cn}.jpg`}
                                                                     onError={(e) => {
                                                                         e.target.onerror = null;
                                                                         e.target.src = `${placeholder}`
                                                                     }} alt={subItem.cat3_name_cn}/><span
                                                                className="text">{subItem.cat3_name_cn}</span>
                                                            {/*</Link>*/}
                                                        </li>)
                                                })
                                            }
                                        </ul>
                                        {/*手风琴*/}
                                        {
                                            item.list.length > 9 ?
                                                <div className={`directionIcon ${item.isSelectFlag ? 'pullUp' : ''}`}
                                                     onClick={this._handleAccordion.bind(this, index)}/> : null
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(GoodsClassifyCpn);