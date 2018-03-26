var util = require('../../utils/util.js');
const app = getApp()
Page({
  data:{
    winWidth: 0,
    winHeight: 0,
    currentTab:1,
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular: true,
    imgUrls:[],
    lefttimer: '',
    durTime: "",
    countdowns: '',
    todayList:[],
    yesterdayList:[],
    tomorrowList:[],
    progressS: [],
    sc:''
  },
  onLoad: function (options) {
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
  },
  onShow: function (options){
    this.getlimitGoodsToday()
  },
  //限时购买昨日
  getlimitGoodsYes: function () {
    var that = this
    wx.request({
      url: util.Apis + '/h5/timegood/findTimeGoodListByTime',
      data: {
        time: 'yesterday',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          yesterdayList: res.data.data.timeGoodBeanList,
        })
      }
    })
  },
  // 限时购买今日
  getlimitGoodsToday: function () {
    var that = this
    var arrS=[]
    wx.request({
      url: util.Apis + '/h5/timegood/findTimeGoodListByTime',
      data: {
        time: 'today',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {
        for (let i = 0; i < res.data.data.timeGoodBeanList.length; i++) {
          if (res.data.data.timeGoodBeanList[i].sellCount==0){
            arrS[i]=0.00
          }else{
            arrS[i] = (res.data.data.timeGoodBeanList[i].stockCount / res.data.data.timeGoodBeanList[i].sellCount * 100).toFixed(2);
          }
        }
        that.setData({
          todayList: res.data.data.timeGoodBeanList,
          imgUrls: res.data.data.banners,
          progressS: arrS,
        })
        const goodsMes = res.data.data.timeGoodBeanList
        that.setData({
          durTime: parseInt((res.data.data.endTime - res.data.data.thisTime) / 1000)
        })
        if (that.data.durTime <= 0) {
          that.setData({
            countdowns: '00:00:00'
          })
        } else {
          that.sktime()
          that.data.sc = setInterval(that.sktime, 1000);
        }
      }
    })
  },
  //限时购买明日
  getlimitGoodsTom: function () {
    var that = this
    wx.request({
      url: util.Apis + '/h5/timegood/findTimeGoodListByTime',
      data: {
        time: 'tomorrow',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          tomorrowList: res.data.data.timeGoodBeanList,
        })
      }
    })
  },
  sktime() {
    var that = this;
    var sdurTime = that.data.durTime
    that.data.durTime--;
    var h = parseInt(sdurTime / 3600);
    sdurTime %= 3600;
    var m = parseInt(sdurTime / 60);
    var s = sdurTime % 60;
    that.data.countdowns = that.toDou(h) + ':' + that.toDou(m) + ':' + that.toDou(s)
    that.setData({
      countdowns: that.toDou(h) + ':' + that.toDou(m) + ':' + that.toDou(s)
    })
    if (that.data.durTime <= 0) {
      that.setData({
        countdowns: '00:00:00'
      })
      clearInterval(that.data.sc);
    }
  },
  toDou(n) {
    return n < 10 ? '0' + n : '' + n;
  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    if (that.data.currentTab == 0) {
      that.getlimitGoodsYes()
    } else if (that.data.currentTab == 2) {
      that.getlimitGoodsTom()
    }
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if (that.data.currentTab == 0) {
        that.getlimitGoodsYes()
      } else if (that.data.currentTab == 2) {
        that.getlimitGoodsTom()
      }
    }
  },
  onUnload: function () {
    clearInterval(this.data.sc);
  },
})