import React, {Component,Fragment} from 'react';
import { withRouter} from 'react-router-dom';
import {createForm} from 'rc-form';
import './index.less'

const labelMark = ["连衣裙", "上衣", "牛仔裤", "毛衣", "裤子", "套衫", "夹克", "紧身服", "衬衫", "牛仔服"];

class SearchListCpn extends Component {
    keyword = '';

    _handleSearchLabelMark = (label) => { //根据标签搜索列表
        this.props.history.push('/searchPage/keyword/' + label);
    };

    _handleSearchList = () => {
        let params = this.keyword.trim();
        if (params) {
            this.props.history.push('/searchPage/keyword/' + params);
        }
    };
    _handleOnChange = (e) => {
        this.keyword = e.target.value;
    };
    _handleDeleteCtn = () => { //清除输入框的内容
        this.props.form.setFieldsValue({
            'keyword': ''
        });
    };

    render() {
        const {getFieldProps} = this.props.form;

        return (
            <Fragment>
                <div className="searchNavBar">
                    <i className="fanhui" onClick={() => this.props.history.goBack()}/>
                    <div className="middle">
                        <form onSubmit={this._handleSearchList}>
                            <input type="text" placeholder="搜索产品"  {...getFieldProps('keyword', {
                                initialValue: '',
                                onChange: this._handleOnChange,
                                validateTrigger: 'onBlur'
                            })}/>
                        </form>
                        <i className="searchIcon"/>
                        <i className="delIcon" onClick={this._handleDeleteCtn}/>
                    </div>
                    <span className="text" onClick={this._handleSearchList}>搜索</span>
                </div>
                <div className="searChListWrap height">
                    <div className="searchTitle"><span className="title">热门搜索</span>
                    </div>
                    <ul className="searchUl">
                        {
                            labelMark.map((item, index) => {
                                return (
                                    <li key={index} className="searchItem"
                                        onClick={this._handleSearchLabelMark.bind(this, item)}>{item}</li>

                                )
                            })
                        }
                    </ul>
                </div>
            </Fragment>
        );
    }
}

export default createForm()(withRouter(SearchListCpn));