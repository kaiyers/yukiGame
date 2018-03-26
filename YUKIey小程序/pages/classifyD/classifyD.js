var appInstance = getApp();
var util = require('../../utils/util.js');
var oneId = '';
var twoId = '';
Page({
  /* 页面的初始数据*/
  data: {
    open: false,
    priceIcon: '../../img/warehouse/subnav_icon_price@3x.png',
    priceIconUp: '../../img/warehouse/subnav_icon_price_up@3x.png',
    priceIconDown: '../../img/warehouse/subnav_icon_price_down@3x.png',
    screenIcon: '../../img/warehouse/icon_filter_n@3x.png',
    screenIconP: '../../img/warehouse/icon_filter_p@3x.png',
    goodList:[],
    brandList:[],
    minprice:'',
    maxprice:'',
    checkArr:'',
    value:'',
    showModal: false,
    modeldata:{}
  },
  onLoad: function(options){
    var that = this;
    wx.setNavigationBarTitle({
      title: options.ln,
    });
    oneId = options.oneid,
    twoId = options.twoid,
    wx.request({
      url: util.Apis + '/h5/h5good/goodList',
      method: 'POST',
      data: {
        oneLevelTypeId: oneId,
        twoLevelTypeId: twoId,
        index: 0,
        size: 999,
        popularSort: 'asc'
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        res.data.data.brandList.forEach((value, index) => {
         value.checked = false
        });
        var newlist = res.data.data.brandList
        that.setData({
          goodList: res.data.data.goodBeanList,
          brandList: newlist,
        })
        
      }
    })
  },
  /*人气排序 tab = 0*/
  sortByPopularity: function (e) {
    var that = this;
    this.setData({ tab: 0});
    wx.request({
      url: util.Apis + '/h5/h5good/goodList',
      method: 'POST',
      data: {
        oneLevelTypeId: oneId,
        twoLevelTypeId: twoId,
        index: 0,
        size: 999,
        popularSort: 'asc'
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          goodList: res.data.data.goodBeanList,
          brandList: res.data.data.beanList,
        })
      }
    })
  },
  /* 按价格排序 tab = 1*/
  sortByPrice: function (e) {
    var that = this;
    let direction = e.currentTarget.dataset.direction
    if (direction == 0) {
       direction = 1;
       wx.request({
         url: util.Apis + '/h5/h5good/goodList',
         method: 'POST',
         data: {
           oneLevelTypeId: oneId,
           twoLevelTypeId: twoId,
           index: 0,
           size: 999,
           priceSort: 'asc'
         },
         header: {
           'Accept': 'application/json',
           'content-type': 'application/x-www-form-urlencoded'
         },
         success: function (res) {
           that.setData({
             goodList: res.data.data.goodBeanList,
             brandList: res.data.data.beanList,
           })
         }
       })
    } else {
      direction = 0;
      wx.request({
        url: util.Apis + '/h5/h5good/goodList',
        method: 'POST',
        data: {
          oneLevelTypeId: oneId,
          twoLevelTypeId: twoId,
          index: 0,
          size: 999,
          priceSort: 'desc'
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.setData({
            goodList: res.data.data.goodBeanList,
            brandList: res.data.data.beanList,
          })
        }
      })
    };
    this.setData({ tab: 1, direction: direction });
  },
  /* 筛选 tab = 2*/
  sortByScreen: function (e) {
    this.setData({ tab: 2 }); 
    this.setData({ open: true });
  },
  /*输入最小价格 */
  minPr: function (e) {
    this.setData({ minprice: e.detail.value });
  },
  /*输入最大价格 */
  maxPr: function (e) {
    this.setData({ maxprice: e.detail.value });
  },
  /*品牌选择*/
  checkboxChange: function (e) {
    this.setData({
      checkArr: e.detail.value.join(",")
    })
  },
  /*重置*/
  replacement: function () {
    this.setData({
      minprice: '',
      maxprice: '',
    });
    this.setData({ open: false });
  },
  /*确定 */
  determine: function(){
    this.setData({ open: false });
    if (this.data.minprice != '' && this.data.maxprice != '') {
      if (this.data.minprice > this.data.maxprice) {
        var jie = this.data.maxprice;
        this.data.maxprice = this.data.minprice;
        this.data.minprice = jie
      }
    }
    var that = this;
    wx.request({
      url: util.Apis + '/h5/h5good/goodList',
      method: 'POST',
      data: {
        oneLevelTypeId: oneId,
        twoLevelTypeId: twoId,
        index: 0,
        size: 999,
        minPriceText: that.data.minprice*100,
        maxPriceText: that.data.maxprice*100,
        brandidsText: that.data.checkArr,
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          goodList: res.data.data.goodBeanList,
        })
      }
    })
  },
  //去详情页面
  godetail:function(e){
    const index = e.currentTarget.dataset.index;
    var goodList = this.data.goodList;
    wx.navigateTo({
      url: '../details/details?gsid=' + goodList[index].goodId
    })
  },
  gotodeteli: function(){
    wx.navigateTo({
      url: '../details/details?gsid=' + this.data.modeldata.goodId
    })
  },
  /* 弹窗*/
  showDialogBtn: function (e) {
    const index = e.currentTarget.dataset.index;
    var goodList = this.data.goodList;
    this.setData({
      showModal: true,
      modeldata: goodList[index]
    })
  },
  /* 弹出框蒙层截断touchmove事件*/
  preventTouchMove: function () {
  },
  /*隐藏模态对话框*/
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /*对话框取消按钮点击事件*/
  onCancel: function () {
    this.hideModal(); 
  }
})