export const cmiCatData = [
    {
        "cat1_id": "10000019,20000051,20000127,20000060,20000048,20000229",
        "cat1_name_cn": "女装",
        "cat1_name_en": "Women’s Clothing",
        "list": []
    },
    {
        "cat1_id": "10000018,20000261,20000218",
        "cat1_name_cn": "男装",
        "cat1_name_en": "Women’s Clothing",
        "list": []
    },
    {
        "cat1_id": "20000160,20000491,20000494,30002711,20000493",
        "cat1_name_cn": "妈妈&儿童",
        "cat1_name_en": "Women’s Clothing",
        "list": []
    },
    {
        "cat1_id": "10000010,20000181,10000022,20000219,20000018,20000133,20000138,20000179,20000257,20000078",
        "cat1_name_cn": "家居生活",
        "cat1_name_en": "Women’s Clothing",
        "list": []
    },
    {
        "cat1_id": "10000001",
        "cat1_name_cn": "包包&鞋子",
        "cat1_name_en": "Women’s Clothing",
        "list": []
    },
    {
        "cat1_id": "10000025,10000006,10000029,20000249,20000259",
        "cat1_name_cn": "珠宝配饰",
        "cat1_name_en": "Women’s Clothing",
        "list": []
    },
    {
        "cat1_id": "10000024",
        "cat1_name_cn": "户外运动",
        "cat1_name_en": "Women’s Clothing",
        "list": []
    },
];

export const specialData = [
    {name: '时尚服饰', id: '10000019,10000018'},
    // {name: '妈妈&儿童', id: ''},
    {name: '包包&鞋子', id: '10000001'},
    {name: '珠宝首饰', id: '10000025'},
    {name: '家居生活', id: '10000010'},
    // {name: '户外运动', id: ''},
];
export const siteData = [
    'hm',
    'asos',
    'fashionnova',
    'zara',
    'everlane',
    'forever21',
    'net-a-porter',
    'boden',
    'zalora',
    'loft',
    'zappos'
];
export const catData = [
    {name: '女装', id: '10000019,20000051,20000127,20000060,20000048,20000229'},
    {name: '男装', id: '10000018,20000261,20000218'},
    {name: '妈妈&儿童', id: '20000160,20000491,20000494,30002711,20000493'},
    {name: '家居生活', id: '10000010,20000181,10000022,20000219,20000018,20000133,20000138,20000179,20000257,20000078'},
    {name: '包包&鞋子', id: '10000001',color:'#fff'},
    {name: '珠宝首饰', id: '10000025,10000006,10000029,20000249,20000259'},
    {name: '户外运动', id: '10000024',color:'#fff'}
];

export const sortData = [
    {name: '上架时间', sort: 'ondateOnline', sortType: 'asc'},
    {name: '上架时间', sort: 'ondateOnline', sortType: 'desc'},
    {name: '评价星级', sort: 'cmtStar', sortType: 'asc'},
    {name: '评价星级', sort: 'cmtStar', sortType: 'desc'},
    {name: '评价数', sort: 'cmtCount', sortType: 'asc'},
    {name: '评价数', sort: 'cmtCount', sortType: 'desc'},
    {name: '更新时间', sort: 'update_time', sortType: 'asc'},
    {name: '更新时间', sort: 'update_time', sortType: 'desc'},
];
export const initData = {
    "page": 1,
    "limit": 12,
    "keyword": "",
    "site": "",
    "cat_id": 0,
    "price_min": 0,
    "price_max": 0,
    "sort": "", //排序字段 list_price_usd / ondateOnline
    "sort_type": "",  //升序:asc 倒序:desc
    "source_brand": "",//	string 品牌(需支持多个)
    "designer": "",//设计师(需支持多个)
    "cmtStar": 0,//评论星级
    "start_time": 0,//上架时间开始时间(传时间戳)
    "end_time": 0,//上架时间结束时间(传时间戳)
    "currency": "cny",
};





