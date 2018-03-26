//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    imgUrls: [],
    listnews:[],
    recommend_list: [],
    guess_list: [],
    indicatorDots: true,
    autoplay: true,
    interval: 2000,
    duration: 1000,
    circular:true,
    limitodayShow:false,
    goodsDetail:[],
    goodId:'',
    limitmsg:'',
    newPrice:"",
    oldPrice:'',
    goodPicUrl:'',
    lefttimer:'',
    durTime:"",
    countdowns:'',
    sk:"",
    userID:''
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: util.Apis + '/h5/h5index/indexPage',
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          imgUrls: res.data.data.banners,
          listnews: res.data.data.newGoodBeanList,
          recommend_list: res.data.data.popularGoodBeanList,
          guess_list: res.data.data.guessGoodList,
        })
      }
    })
  },
  onShow:function(){
    this.getlimitGoods()
  },
  // 跳转至优惠卷
  // tomycoupencc:function(){
  //   wx.navigateTo({
  //     url: '../writeAppraise/writeAppraise?goodId=123'
  //   })
  // },
  tomycoupencc:function(){
    var that=this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userID: res.data,
          infor: true
        });
        if (that.data.userID != '11111111111a'){
          wx.navigateTo({
            url: '../Coupon/Coupon?userId=' + that.data.userID
          })
        }else{
          wx.showModal({
            content: '请先绑定或注册',
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: "../register/register"
              })
            }
          });
        }
      }
    })
  },
  // 限时购买
  getlimitGoods:function() {
    var that = this
    wx.request({
      url: util.Apis + '/h5/timegood/findTimeGoodListByTime',
      data:{
        time: 'today',
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: function (res) {
        if (!res.data.data.timeGoodBeanList){
          that.setData({
            limitodayShow: false,
          })
        }else{
          const goodsMes = res.data.data.timeGoodBeanList[0]
          that.setData({
            limitodayShow: true,
            goodsDetail: goodsMes,
            goodId: goodsMes.goodId,
            limitmsg: goodsMes.goodName,
            newPrice: (goodsMes.newPrice / 100).toFixed(2),
            oldPrice: (goodsMes.oldPrice / 100).toFixed(2),
            goodPicUrl: goodsMes.goodPicUrl,
            durTime: parseInt((res.data.data.endTime - res.data.data.thisTime) / 1000)

          })
          if (that.data.durTime <= 0) {
            that.setData({
              countdowns: '00:00:00'
            })
          } else {
            that.sktime()
            that.data.sk= setInterval(that.sktime, 1000);
          }
        }
     }
    })
  },
  onHide: function (options) {
    clearInterval(this.data.sk);
  },
  sktime() {
    var that = this;
    var sdurTime = that.data.durTime
    that.data.durTime--;
    var h = parseInt(sdurTime / 3600);
    sdurTime %= 3600;
    var m = parseInt(sdurTime / 60);
    var s = sdurTime % 60;
    that.setData({
      countdowns: that.toDou(h) + ':' + that.toDou(m) + ':' + that.toDou(s)
    })
    if (that.data.durTime <= 0) {
      that.setData({
        countdowns: '00:00:00'
      })
      clearInterval(that.data.sk);
    }
  },
  toDou(n) {
    return n < 10 ? '0' + n : '' + n;
  },
  // 点击搜索框跳转
  toSerch:function(){
    wx.navigateTo({
      // url: "../writeAppraise/writeAppraise"
      url: "../seekTransit/seekTransit"
    })
  },
})
