import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {NavBar} from "antd-mobile";
import './index.less'

class NavBarCpn extends Component {
    render() {
        const {title} = this.props;
        return (
            <NavBar className="navBarWrap"
                    mode="light"
                    leftContent={[<i key="1" className="fanhui"/>]}
                    onLeftClick={() => this.props.history.goBack()}
            >{title}</NavBar>
        );
    }
}

export default withRouter(NavBarCpn);