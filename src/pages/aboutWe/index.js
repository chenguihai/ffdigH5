import React, {Component, Fragment} from 'react';
import NavBarCpn from "../../components/NavBarCpn";
import svglogobai from '../../img/svglogobai.svg';
import sqr from "../../img/detailPage/sqr.png";
import './index.less'

class AboutWe extends Component {
    componentDidMount() {
        let description = document.querySelector('meta[name="description"]'),
            keywords = document.querySelector('meta[name="keywords"]');
        description["content"] = "火联ffdig—网罗全球优品，云集了海量的时尚品类、知名品牌商如Boden、ZALORA、LOFT、Zappos，NET-A-PORTER等、设计师产品等，产品元素多元化，致力于服务电商产品开发者或设计师，电商运营者，时尚产品爱好者。2700个细分品类，涵括女装、男装、童装、珠宝首饰、包包鞋子、家居生活多个领域，供跨境电商产品垂直选品、时尚前沿新品设计提供选品或设计灵感。";
        keywords["content"] = "火联，ffdig，dig，Boden、ZALORA、LOFT，NET-A-PORTER，设计师产品，产品开发、细分品类、垂直选品，跨境电商";
    }

    componentWillUnmount() {
        let description = document.querySelector('meta[name="description"]'),
            keywords = document.querySelector('meta[name="keywords"]');
        description["content"] = "火联ffdig—网罗全球优品，精选热卖产品，供跨境电商产品垂直选品、时尚前沿新品设计提供参考。2700个细分品类，涵括女装、男装、童装、珠宝首饰、包包鞋子、家居生活，云集了海量知名品牌受欢迎的多元素产品，旨在为用户提供优质电商选品服务，挖掘和设计市场最具潜力价值产品。";
        keywords["content"] = "火联，ffdig，dig，垂直选品、细分品类，新品设计、选品服务、跨境电商、电商产品";
    }

    render() {
        return (
            <Fragment>
                <NavBarCpn title="关于我们"/>
                <div className="aboutWeWrap">
                    <img className="logoImg" src={svglogobai} alt="logo图片"/>
                    <p className="webSite">网站访问：www.ffdig.com</p>
                    <div className="titleWrap">
                        <div className="title">
                            火联ffdig，致力于网罗全球优质、市场前沿产品
                        </div>
                    </div>
                    <span className="line"/>
                    <p className="content">为电商运营或开发人员、产品设计师等用户提供产品精选服务，</p>
                    <p className="content">激发产品设计灵感，</p>
                    <p className="content">帮助用户发掘吻合自己需求或最具市场潜力价值产品</p>
                    <img className="codeImg" src={sqr} alt="公众号二维码"/>
                    <p className="text c_C7AD7B">微信扫一扫关注公众号</p>
                    <p className="text">或微信搜索公众号 “<span className="c_C7AD7B">ffdig火联</span>”</p>
                </div>
            </Fragment>
        );
    }
}

export default AboutWe;