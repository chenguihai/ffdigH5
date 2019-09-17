// const dev_baseUrl = "http://10.37.4.188:56771/"; //开发 本地
// const dev_baseUrl = "http://10.28.1.101:56771/"; //开发 测试
// const dev_baseUrl = "http://ffdig-api.gw-ec.com/"; //内网正式库 新
const dev_baseUrl = "http://api.ffdig.com/"; //开发

const prod_baseUrl = "http://api.ffdig.com/"; //正式环境
const serverUrl = "http://m.ffdig.com/"; //正式环境
const appID = "wx1bd63c1df869cfa3"; //正式环境


// const prod_baseUrl = "http://ffdig-api.gw-ec.com/"; //测试环境
// const serverUrl = "http://tm.ffdig.com/"; //测试环境
// const appID = "wxc492478fcdd3fcc3"; //测试环境

const isMock = true;
const is_dev = !(process.env.NODE_ENV === "production");
const imgUrl = is_dev ? "http://10.28.1.101:3000" : "http://image.ffdig.com";
const baseUrl = is_dev ? dev_baseUrl : prod_baseUrl;
export default {
    baseUrl, is_dev, isMock, imgUrl, serverUrl, appID
}


// 测试环境去掉百度统计代码
// 测试环境去掉百度统计代码
// 测试环境去掉百度统计代码
// 测试环境去掉百度统计代码