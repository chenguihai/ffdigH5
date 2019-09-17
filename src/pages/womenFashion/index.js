import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import img1 from '../../img/womenFashion/1@2x.jpg';
import img2 from '../../img/womenFashion/2@2x.jpg';
import img3 from '../../img/womenFashion/3@2x.jpg';
import img4 from '../../img/womenFashion/4@2x.jpg';
import img5 from '../../img/womenFashion/5@2x.jpg';
import img6 from '../../img/womenFashion/6@2x.jpg';
import img7 from '../../img/womenFashion/7@2x.jpg';
import img8 from '../../img/womenFashion/8@2x.jpg';
import img9 from '../../img/womenFashion/9@2x.jpg';
import img10 from '../../img/womenFashion/10@2x.jpg';
import img11 from '../../img/womenFashion/11@2x.jpg';
import hoverImg from '../../img/womenFashion/hover@2x.png';
import loading from '../../img/loading.gif';
import commonFun from "../../utils/commonFun";
import './index.less'

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
                <img className="img lazyLoad" data-src={img4} src={loading} alt="推广图片"/>
                <img className="img lazyLoad" data-src={img5} src={loading} alt="推广图片"/>
                <img className="img lazyLoad" data-src={img6} src={loading} alt="推广图片"/>
                <img className="img lazyLoad" data-src={img7} src={loading} alt="推广图片"/>
                <img className="img lazyLoad" data-src={img8} src={loading} alt="推广图片"/>
                <img className="img lazyLoad" data-src={img9} src={loading} alt="推广图片"/>
                <img className="img lazyLoad" data-src={img10} src={loading} alt="推广图片"/>
                <img className="img lazyLoad" data-src={img11} src={loading} alt="推广图片"/>
                <Link to="/specialPage/女装/cat/10000019,20000051,20000127,20000060,20000048,20000229"><img
                    className="fixedImg" src={hoverImg} alt="推广图片"/></Link>
            </div>
        );
    }
}

export default withRouter(PromotionPage);