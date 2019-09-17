import React, {Component, Fragment} from 'react';
import {Link, withRouter} from 'react-router-dom';
import './App.less'

class TabBarExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'firstPage',
        };
    }

    componentDidMount() {
        this.selectedTabCommonFun();
        this.props.history.listen((e) => {
            this.selectedTabCommonFun(e.pathname);
        });
    }

    selectedTabCommonFun = (pathname) => {
        let pathName = pathname || this.props.location.pathname, selectedTab = '';
        if (pathName.indexOf('goodsClassifyCpn') >= 0) {
            selectedTab = 'goodsClassifyCpn';
        } else if (pathName === '/' ||pathName.indexOf('firstPage') >= 0) {
            selectedTab = 'firstPage';
        } else if (pathName.indexOf('personalCenter') >= 0) {
            selectedTab = 'personalCenter';
        }
        this.setState({
            selectedTab
        });
    };
    _handleHotProducts = () => {
        this.setState({
            selectedTab: 'goodsClassifyCpn'
        });
    };
    _handleGlobalProducts = () => {
        this.setState({
            selectedTab: 'firstPage'
        });
        window.sessionStorage.setItem('cat3Name', '');
    };
    _handlePersonalCenter = () => {
        this.setState({
            selectedTab: 'personalCenter'
        });
    };

    render() {
        const {selectedTab} = this.state;
        return (
            <Fragment>
                {this.props.children}
                <div className="tabBarWrap">
                    <ul className="tabBarUl">
                        <li className={`tabBarItem ${selectedTab === 'firstPage' ? 'active' : ''}`}
                            onClick={this._handleGlobalProducts}>
                            <Link to="/firstPage" className="link" title="首页">
                                <div className="globalIcon"/>
                                <p className="text">首页</p>
                            </Link>
                        </li>
                        <li className={`tabBarItem ${selectedTab === 'goodsClassifyCpn' ? 'active' : ''}`}
                            onClick={this._handleHotProducts}>
                            <Link to="/goodsClassifyCpn" className="link" title="产品分类">
                                <div className="hotIcon"/>
                                <p className="text">产品分类</p>
                            </Link>
                        </li>
                        <li className={`tabBarItem ${selectedTab === 'personalCenter' ? 'active' : ''}`}
                            onClick={this._handlePersonalCenter}>
                            <Link to="/personalCenter" className="link" title="个人中心">
                                <div className="personalIcon"/>
                                <p className="text">个人中心</p>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Fragment>
        );
    }
}

export default withRouter(TabBarExample);