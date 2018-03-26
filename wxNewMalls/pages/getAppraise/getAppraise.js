const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    goodid: '',
    indexs:0,
    maxIndex:1,
    allcount:0,
    goodcount:0,
    midcount:0,
    badcount:0,
    hascount:0,
    tipsShow:false,
    haspic:0,
    level:0,
    proCopyright:[],
    maxIndex:'',
    news:[]
  },
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
    var goodid = options.goodid
    that.setData({
      goodid: goodid
    })
    that.getAppraise()
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var currentIndex = e.target.dataset.index;
    var picArr=[]
    for (let i = 1; i < this.data.proCopyright[currentIndex].picNum+1;i++){
       picArr.push(this.data.proCopyright[currentIndex][('skuPic' + i)])
    }
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: picArr // 需要预览的图片http链接列表
    })
  },
  //获取订单
  getAppraise:function(){
    var that=this
    wx.request({
      url: util.Apis + '/h5/h5goodcomment/getComment',
      data: {
        index: that.data.indexs,
        haspic: that.data.haspic,
        goodid: that.data.goodid,
        level: that.data.level
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: 'POST',
      success: function (res) {
        var appraise = res.data
        that.setData({
          allcount: appraise.allcount,
          goodcount: appraise.goodcount,
          midcount: appraise.midcount,
          badcount: appraise.badcount,
          hascount: appraise.hascount,
          maxIndex: appraise.maxIndex
        })
        if (appraise.comments.length==0) {
          that.setData({
            tipsShow: false
          })
        } else {
          that.setData({
            tipsShow: true,
            proCopyright: appraise.comments
          })
        }
      }
    })
  }, 
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      indexs:0
    });
    if (that.data.currentTab==0){
      that.setData({
        haspic: 0,
        level:0
      });
    } else if (that.data.currentTab == 1){
      that.setData({
        haspic: 0,
        level: 3
      });
    } else if (that.data.currentTab == 2) {
      that.setData({
        haspic: 0,
        level: 2
      });
    } else if (that.data.currentTab == 3) {
      that.setData({
        haspic: 0,
        level: 1
      });
    }else{
      that.setData({
        haspic: 2,
        level: 0
      });
    }
    that.getAppraise()
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        haspic: e.target.dataset.haspic,
        level: e.target.dataset.level,
        indexs:0
      });
      that.getAppraise()
    }
  },
  pullUpLoad:function(){
    var that=this
    this.data.indexs++
    if (this.data.indexs >= this.data.maxIndex) {
      return false
    } else {
    wx.request({
      url: util.Apis + '/h5/h5goodcomment/getComment',
      data: {
        index: that.data.indexs,
        haspic: that.data.haspic,
        goodid: that.data.goodid,
        level: that.data.level
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        var appraise = res.data
        that.setData({
          news: that.data.proCopyright,
          allcount: appraise.allcount,
          goodcount: appraise.goodcount,
          midcount: appraise.midcount,
          badcount: appraise.badcount,
          hascount: appraise.hascount,
          maxIndex: appraise.maxIndex
        })
        for (let i = 0; i < appraise.comments.length; i++) {
          that.data.news.push(appraise.comments[i])
        }
        that.setData({
          proCopyright: that.data.news
        })
      }
    })
    }
  }
})  