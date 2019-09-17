import React, {Fragment} from "react";
import moment from "moment";
import loading from "../img/loading.gif";
import {sortData} from "../config/staticData";

export default {
    createElementCommonFun(dataList, that) {
        let waterfallLeft = document.getElementById('waterfallLeft'),
            waterfallRight = document.getElementById('waterfallRight'),
            fragLeft = document.createDocumentFragment(),
            fragRight = document.createDocumentFragment(),
            oBox = null,
            oPic = null,
            oImgBox = null,
            oImg = null,
            oTitle = null,
            oPrice = null,
            oPriceSPan = null,
            oTimer = null,
            oFrom = null,
            oStar = null,
            oComment = null,
            oCommentI = null,
            oCommentSpan = null,
            oStarDark = null,
            oStarBright = null;
        for (let i = 0; i < dataList.length; i++) {
            oBox = document.createElement('div');
            oPic = document.createElement('div');
            oImgBox = document.createElement('div');
            oImg = document.createElement('img');
            oTitle = document.createElement('p');
            oPrice = document.createElement('div');
            oPriceSPan = document.createElement('span');
            oTimer = document.createElement('span');
            oFrom = document.createElement('div');
            oStar = document.createElement('div');
            oComment = document.createElement('div');
            oCommentI = document.createElement('i');
            oCommentSpan = document.createElement('span');

            oBox.className = 'imgListWrap';
            oBox.onclick = that._handleGoodsDetail.bind(this, dataList[i].object_id);
            if (i % 2 === 0) {
                fragLeft.appendChild(oBox);
            } else {
                fragRight.appendChild(oBox)
            }
            oPic.className = 'pic';
            oBox.appendChild(oPic);
            // 图片盒子
            oImgBox.className = 'imgBox';
            oPic.appendChild(oImgBox);
            oImg.setAttribute('src', dataList[i]._350.path);
            oImg.className = 'larry_waterfall_img';
            oImgBox.appendChild(oImg);
            // 标题
            oTitle.className = 'title';
            oTitle.innerText = dataList[i][`title_${dataList[i].lang}`];
            oPic.appendChild(oTitle);

            // 价格
            if (dataList[i].list_price_cny) {
                oPrice.className = 'price';
                oPriceSPan.innerText = `¥ ${dataList[i].list_price_cny.toFixed(2)}`;
                // 更新时间
                oTimer.className = 'timer';
                oTimer.innerText = `${moment(dataList[i].update_time * 1000).format('YYYY.MM.DD')} 更新`;
                oPrice.appendChild(oPriceSPan);
                oPrice.appendChild(oTimer);
                oPic.appendChild(oPrice);
            }

            // 星星/评论数
            let cmtStar = Math.round(dataList[i].cmtStar),
                cmtCount = Math.round(dataList[i].cmtCount),
                cmtStars = Math.round(isNaN(dataList[i].cmtStars) ? 0 : dataList[i].cmtStars);
            if (cmtStar || cmtCount > 0) {
                let brightStar = new Array(cmtStar).fill(0),
                    darkStars = new Array(cmtStars - cmtStar).fill(0);
                oStar.className = 'starWrap';
                // 高亮星星
                for (let j = 0; j < brightStar.length; j++) {
                    oStarBright = document.createElement('i');
                    oStarBright.className = 'brightStar';
                    oStar.appendChild(oStarBright);
                }
                // 灰暗星星
                for (let j = 0; j < darkStars.length; j++) {
                    oStarDark = document.createElement('i');
                    oStarDark.className = 'darkStars';
                    oStar.appendChild(oStarDark);
                }
                if (cmtCount > 0) {
                    oComment.className = 'infoIconWrap';
                    oCommentI.className = `infoIcon ${cmtStar > 0 ? 'active' : ''}`;
                    oCommentSpan.className = 'infoText';
                    oCommentSpan.innerText = cmtCount;
                    oComment.appendChild(oCommentI);
                    oComment.appendChild(oCommentSpan);
                    oStar.appendChild(oComment);
                }
                oPic.appendChild(oStar);
            }
            // 地址
            oFrom.className = 'from';
            oFrom.innerText = dataList[i].site;
            oPic.appendChild(oFrom);
        }
        waterfallLeft.appendChild(fragLeft);
        waterfallRight.appendChild(fragRight);
    },
    createElementMyCollectFun(dataList, that) {
        let waterfallLeft = document.getElementById('waterfallLeft'),
            waterfallRight = document.getElementById('waterfallRight'),
            fragLeft = document.createDocumentFragment(),
            fragRight = document.createDocumentFragment(),
            oBox = null,
            oPic = null,
            oImgBox = null,
            oImg = null,
            oTitle = null,
            oPrice = null,
            oPriceSPan = null,
            oTimer = null,
            oFrom = null,
            oStar = null,
            oComment = null,
            oCommentI = null,
            oCommentSpan = null,
            oStarBright = null,
            oStarDark = null;
        for (let i = 0; i < dataList.length; i++) {
            let imgArr = JSON.parse(dataList[i].img);
            oBox = document.createElement('div');
            oPic = document.createElement('div');
            oImgBox = document.createElement('div');
            oImg = document.createElement('img');
            oTitle = document.createElement('p');
            oPrice = document.createElement('div');
            oPriceSPan = document.createElement('span');
            oTimer = document.createElement('span');
            oFrom = document.createElement('div');
            oStar = document.createElement('div');
            oComment = document.createElement('div');
            oCommentI = document.createElement('i');
            oCommentSpan = document.createElement('span');

            oBox.className = 'imgListWrap';
            oBox.onclick = that._handleGoodsDetail.bind(this, dataList[i].productId);
            if (i % 2 === 0) {
                fragLeft.appendChild(oBox);
            } else {
                fragRight.appendChild(oBox)
            }
            oPic.className = 'pic';
            oBox.appendChild(oPic);
            // 图片盒子
            oImgBox.className = 'imgBox';
            oPic.appendChild(oImgBox);
            oImg.setAttribute('src', imgArr[0].url);
            oImg.className = 'larry_waterfall_img';
            oImgBox.appendChild(oImg);
            // 标题
            oTitle.className = 'title';
            oTitle.innerText = dataList[i].name;
            oPic.appendChild(oTitle);
            // 价格
            if (dataList[i].listPriceCny) {
                oPrice.className = 'price';
                oPriceSPan.innerText = `¥ ${dataList[i].listPriceCny.toFixed(2)}`;
                // 更新时间
                oTimer.className = 'timer';
                oTimer.innerText = `${moment(dataList[i].updateTime).format('YYYY.MM.DD')} 更新`;
                oPrice.appendChild(oPriceSPan);
                oPrice.appendChild(oTimer);
                oPic.appendChild(oPrice);
            }
            // 星星/评论数
            let cmtStar = Math.round(dataList[i].cmtStar),
                cmtCount = Math.round(dataList[i].cmtCount),
                cmtStars = Math.round(isNaN(dataList[i].cmtStars) ? 0 : dataList[i].cmtStars);
            if (cmtStar || cmtCount > 0) {
                let brightStar = new Array(cmtStar).fill(0),
                    darkStars = new Array(cmtStars - cmtStar).fill(0);
                oStar.className = 'starWrap';
                for (let j = 0; j < brightStar.length; j++) {
                    oStarBright = document.createElement('i');
                    oStarBright.className = 'brightStar';
                    oStar.appendChild(oStarBright);
                }
                // 灰暗星星
                for (let j = 0; j < darkStars.length; j++) {
                    oStarDark = document.createElement('i');
                    oStarDark.className = 'darkStars';
                    oStar.appendChild(oStarDark);
                }
                if (cmtCount > 0) {
                    oComment.className = 'infoIconWrap';
                    oCommentI.className = `infoIcon ${cmtStar > 0 ? 'active' : ''}`;
                    oCommentSpan.className = 'infoText';
                    oCommentSpan.innerText = cmtCount;
                    oComment.appendChild(oCommentI);
                    oComment.appendChild(oCommentSpan);
                    oStar.appendChild(oComment);
                }
                oPic.appendChild(oStar);
            }
            // 地址
            oFrom.className = 'from';
            oFrom.innerText = dataList[i].site;
            oPic.appendChild(oFrom);
        }
        waterfallLeft.appendChild(fragLeft);
        waterfallRight.appendChild(fragRight);
    },
    checkScrollSlide() {
        let scrollTop = document.body.scrollTop || document.documentElement.scrollTop,
            clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        return scrollTop + window.innerHeight + 1000 > clientHeight;
    },
    checkoutPhoneBlur(rule, value, callback) { //验证手机号码是否存在
        let flag = /^1[0-9]{10}$/.test(value);
        if (!value) {
            callback('手机号码不能为空');
        } else if (!flag) {
            callback('11位数字');
        } else {
            callback();
        }
    },
    lazyLoadImgFun() { //懒加载图片
        let detailImage = document.querySelectorAll(".lazyLoad");
        for (let i = 0; i < detailImage.length; i++) {
            if (detailImage[i].getAttribute("data-isLoading") === null) {
                let rect = detailImage[i].getBoundingClientRect();
                if (rect.top <= window.innerHeight) {
                    detailImage[i].setAttribute("src", detailImage[i].getAttribute("data-src") || loading);
                    detailImage[i].setAttribute("data-isLoading", 1);
                }
            }
        }
    },
    lazyLoadBgImgFun() { //懒加载背景图片
        // console.log('lazyLoadBgImgFun');
        let detailImage = document.querySelectorAll(".lazyLoadBg");
        for (let i = 0; i < detailImage.length; i++) {
            if (!detailImage[i].getAttribute("data-isLoading")) {
                let rect = detailImage[i].getBoundingClientRect();
                if (rect.top <= window.innerHeight) {
                    detailImage[i].style.backgroundImage = `url('${detailImage[i].getAttribute("data-src")}')`;
                    detailImage[i].setAttribute("data-isLoading", 1);
                }
            }
        }
    },
    clearLazyImgAttFun() { //清除懒加载背景图片属性
        // console.log('lazyLoadBgImgFun');
        let detailImage = document.querySelectorAll(".lazyLoadBg");
        for (let i = 0; i < detailImage.length; i++) {
            if (detailImage[i].getAttribute("data-isLoading") === '1') {
                detailImage[i].setAttribute("data-isLoading", '');
            }
        }
    },
    sortCommonFun(defaultFlag, that) { //排序公共的部分
        const {sort, sort_type, price_min, price_max, source_brand, start_time, cmtStar, designer} = that.pageInfo;
        let weight = price_min || price_max || source_brand || start_time || cmtStar || designer;

        return (
            <ul className="sortWrap">
                <li className="active"
                    onClick={that._handleResetHomepage}>
                    <span>{that.sortName}&nbsp;</span>
                    <i className={`active ${that.sortName === '默认' ? '' : sort_type === 'asc' ? 'ascIcon' : 'descIcon'}`}/>
                    <i className="arrowDownIcon"/>
                </li>
                <li className={`${sort === 'list_price_usd' ? 'active' : ''}`} onClick={that._handlePrice}>
                    <span>价格</span> <i
                    className={`${sort === 'list_price_usd' && sort_type === 'asc' ? 'ascIcon' : 'descIcon'} ${sort === 'list_price_usd' ? 'active' : ''}`}/>
                </li>
                <li className={`${weight ? 'active' : ''}`}
                    onClick={that.onOpenChange}><span>筛选</span> <i
                    className="screenIcon"/></li>
                {/*排序*/}
                {
                    defaultFlag && <Fragment>
                        <div className="sortMask" onClick={that._handleCloseSort}/>
                        <div className="sortBox">
                            <ul className="sortItem">
                                <li className="sortLi fw-bold" onClick={that._handleCloseSort}><span>请选择</span> <i
                                    className="fr
箭头
arrowUpIcon"/></li>
                                <li className="sortLi" onClick={that._handleDefault}><span>默认</span></li>
                                {
                                    sortData.map((item, index) => {
                                        return (
                                            <li className="sortLi" key={index}
                                                onClick={that._handleOnlineTime.bind(that, item)}>
                                                <span>{item.name} </span><i
                                                className={`${item.sortType}Icon ${sort_type === item.sortType && sort === item.sort ? 'active' : ''}`}/>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </Fragment>
                }
            </ul>
        )
    },
    drawerMaskCommonFun(open, that) { //筛选遮罩/按钮组
        return (
            <Fragment>
                {/*筛选*/}
                <div className="drawerMask" onClick={that._handleCloseDrawer}
                     style={{transform: `${open ? 'translateX(0)' : 'translateX(100%)'}`}}/>
                {/*筛选按钮组*/}
                <div className="drawerBtnF" style={{transform: `${open ? 'translateX(-100%)' : 'translateX(0)'}`}}>
                    <div className="drawerBtnGroup">
                            <span className="drawerBtn left"
                                  onClick={that._handleReset}>重置</span>
                        <span className="drawerBtn right"
                              onClick={that._handleSubmit}>确定</span>
                    </div>
                </div>
            </Fragment>
        )
    },
    ErrorWrap(getFieldError, type) {
        return (
            <div className="errorWrap">
                {(getFieldError(type) || []).join(', ')}
            </div>
        )
    }
}