import React from 'react'
// HashRouter
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import App from './App'
import PersonalCenter from './pages/personalCenter'
import LoginCpn from './components/LoginCpn'
import RegisterCpn from './components/RegisterCpn'
import ForgetPasswordCpn from './components/ForgetPasswordCpn'
import ModifyPwdCpn from './components/ModifyPwdCpn'
import AccountInfoCpn from './components/AccountInfoCpn'
import RegisterPhoneCpn from './components/RegisterPhoneCpn'
import MyCollect from './pages/myCollect'
import GoodsDetail from './pages/goodsDetail'
import BindPhone from './pages/bindPhone'
import AboutWe from './pages/aboutWe'
import HomePage from './pages/homePage'
import SpecialPage from './pages/specialPage'
import SearchPage from './pages/searchPage'
import PromotionPage from './pages/promotionPage'
import WomenFashion from './pages/womenFashion'
import SearchListCpn from './components/SearchListCpn'
import GoodsClassifyCpn from './components/GoodsClassifyCpn'
import ModifyNickNameCpn from './components/ModifyNickNameCpn'
import ModifyPhoneCpn from './components/ModifyPhoneCpn'
import ModifyResetPwdCpn from './components/ModifyResetPwdCpn'
import ReactDocumentTitle from './pages/reactDocumentTitle'
import NewProductHeat from './pages/newProductHeat'
import FirstPage from './pages/firstPage'

export default class ERouter extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <ReactDocumentTitle>
                    <Switch>
                        <Route path="/myCollect" component={MyCollect}/>
                        <Route path="/goodsDetail/:productId" component={GoodsDetail}/>
                        <Route path="/loginCpn" component={LoginCpn}/>
                        <Route path="/registerCpn" component={RegisterCpn}/>
                        <Route path="/forgetPasswordCpn" component={ForgetPasswordCpn}/>
                        <Route path="/modifyPwdCpn/:mb/:myPhone" component={ModifyPwdCpn}/>
                        <Route path="/bindPhone" component={BindPhone}/>
                        <Route path="/accountInfoCpn" component={AccountInfoCpn}/>
                        <Route path="/modifyNickNameCpn/:nickName" component={ModifyNickNameCpn}/>
                        <Route path="/modifyPhoneCpn/:mPhone" component={ModifyPhoneCpn}/>
                        <Route path="/modifyResetPwdCpn" component={ModifyResetPwdCpn}/>
                        <Route path="/searchListCpn" component={SearchListCpn}/>
                        <Route path="/registerPhoneCpn" component={RegisterPhoneCpn}/>
                        <Route path="/aboutWe" component={AboutWe}/>
                        <Route path="/searchPage/:type/:value" component={SearchPage}/>

                        <Route path="/" render={() =>
                            <App>
                                <Switch>
                                    <Route path="/personalCenter" component={PersonalCenter}/>
                                    <Route path="/goodsClassifyCpn" component={GoodsClassifyCpn}/>
                                    <Route path="/homePage/:hidden" component={HomePage}/>
                                    <Route path="/promotionPage" component={PromotionPage}/>
                                    <Route path="/womenFashion" component={WomenFashion}/>
                                    <Route path="/firstPage" component={FirstPage}/>
                                    <Route path="/newProductHeat" component={NewProductHeat}/>
                                    <Route path="/specialPage/:name/:type/:index" component={SpecialPage}/>
                                    <Redirect to="/firstPage"/>
                                </Switch>
                            </App>
                        }/>
                    </Switch>
                </ReactDocumentTitle>
            </BrowserRouter>
        );
    }
}
{/*<Redirect to="/globalProducts/index"/>*/
}
{/* <Route component={NoMatch} /> */
}