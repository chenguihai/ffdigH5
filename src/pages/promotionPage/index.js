import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {catData} from '../../config/staticData';
import img1 from '../../img/promotion/1@2x.jpg';
import img2 from '../../img/promotion/2@2x.jpg';
import img3 from '../../img/promotion/3@2x.png';
import img4 from '../../img/promotion/4@2x.jpg';
import img5 from '../../img/promotion/5@2x.jpg';
import img6 from '../../img/promotion/6@2x.jpg';
import img7 from '../../img/promotion/7@2x.jpg';
import img8 from '../../img/promotion/8@2x.jpg';
import img9 from '../../img/promotion/9@2x.jpg';
import img10 from '../../img/promotion/10@2x.jpg';
import img11 from '../../img/promotion/11@2x.png';
import img12 from '../../img/promotion/12@2x.jpg';
import img13 from '../../img/promotion/13.jpg';
import loading from '../../img/loading.gif';
import commonFun from "../../utils/commonFun";
import './index.less'

const imgArr = [img4, img5, img6, img7, img8, img9, img10];

class PromotionPage extends Component {
    timer = null;

    componentDidMount() {
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

    componentWillUnmount() {
        clearTimeout(this.timer);
        window.removeEventListener('scroll', this.handleScroll);
    }

    render() {
        return (
            <div className="promotionWrap">
                <img className="defaultImg" src={img1} alt="推广图片"/>
                <img className="defaultImg" src={img2} alt="推广图片"/>
                <img className="defaultImg" src={img3} alt="推广图片"/>
                {
                    catData.map((item, index) => {
                        return (
                            <div key={index} className="pr">
                                <Link to={`/specialPage/${item.name}/cat/${item.id}`}>
                                    <img className="img lazyLoad" data-src={imgArr[index]} src={loading} alt="推广图片"/>
                                    <span className="seeMore left">查看更多</span>
                                </Link>
                            </div>
                        )
                    })
                }
                <img className="img lazyLoad" data-src={img11} src={loading} alt="推广图片"/>
                <img className="img lazyLoad" data-src={img12} src={loading} alt="推广图片"/>
                <img className="img lazyLoad" data-src={img13} src={loading} alt="推广图片"/>
            </div>
        );
    }
}

export default withRouter(PromotionPage);