//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    bagCloth:'../../img/icon/logo@3x.png',
    openid:'',
    checkIf:true,
    imgUrls: [],
    listnews:[],
    recommend_list: [],
    guess_list: [],
    indicatorDots: true,
    autoplay: true,
    interval: 4000,
    duration: 500,
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
    userID:'',
    lh:'',
    lm:'',
    ls:'',
    laborGood:{},
    msgList: []
  },
  onLoad: function (options) {
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        if (res.data != '11111111111a') {
          wx.request({
            url: util.Apis + '/h5/h5MyInfo/getUserInfo',
            data: { userId: res.data },
            header: {
              'content-type': 'application/x-www-form-urlencoded'  // 默认值
            },
            method: 'POST',
            success: function (res) {
              var datas = res.data.data.user
              var sum = datas.waitPayOrderCount + datas.waitSendOrderCount + datas.waitReceiveOrderCount + datas.waitCommentOrderCount
              app.globalData.infomationIcon = sum.toString()
            }
          })
        }
      }
    })
    var that = this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userID: res.data,
          // infor: true
        })
        wx.request({
          url: util.Apis + '/h5/h5index/indexPage',
          //url: 'http://ttioowh.nat300.top/h5/h5index/indexPage',
          data: {
            userId: that.data.userID
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: 'POST',
          success: function (res) {
            console.log("indexres", res)
            that.setData({
              msgList: res.data.data.announcement,
              laborGood: res.data.data.laborGood,
              imgUrls: res.data.data.banners,
              listnews: res.data.data.newGoodBeanList,
              recommend_list: res.data.data.popularGoodBeanList,
              guess_list: res.data.data.guessGoodList,
            })
            if (that.data.msgList.length==1){
              that.data.msgList[1] = that.data.msgList[0]
            }
            that.setData({
              msgList: that.data.msgList
            })
          }
        })
      }
    })
    
    if (app.globalData.carIcon == 0){
      wx.removeTabBarBadge({
        index: 2,
      });
    }else{
      wx.setTabBarBadge({
        index: 2,
        text: app.globalData.carIcon
      });
    }
    if (app.globalData.infomationIcon == 0){
      wx.removeTabBarBadge({
        index: 3,
      });
    }else{
      wx.setTabBarBadge({
        index: 3,
        text: app.globalData.infomationIcon
      })
    }
  },
  onShow:function(){
    this.getlimitGoods();
    if (app.globalData.carIcon == 0) {
      wx.removeTabBarBadge({
        index: 2,
      });
    } else {
      wx.setTabBarBadge({
        index: 2,
        text: app.globalData.carIcon
      });
    }
    if (app.globalData.infomationIcon == 0) {
      wx.removeTabBarBadge({
        index: 3,
      });
    } else {
      wx.setTabBarBadge({
        index: 3,
        text: app.globalData.infomationIcon
      })
    }
  },
  //工会
  tradeFun:function(){
    var that=this
    wx.getStorage({
      key: 'openidLocal',
      success: function (res) {
        that.setData({
          openid: res.data,
        })
        wx.request({
          url: util.Apis + '/h5//h5labor/login',
          //url: 'http://ttioowh.nat300.top/h5/h5index/indexPage',
          data: {
            openid: that.data.openid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: 'POST',
          success: function (res) {
            if(res.data.code){
              wx.showToast({
                title: res.data.msg,
                duration: 2000,
                image: '../../img/icon/badTost.png'
              });
            }else{
              wx.navigateTo({
                url: '../trade/trade',
              })
            }
          }
        })
      }
    })
  },
  tomycoupencc:function(){
    var that=this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userID: res.data,
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
  //收藏
  addLike(e) {
    var that = this
    var goodId = e.currentTarget.dataset.goodid
    var isCollected = e.currentTarget.dataset.iscollected
    var idx = e.currentTarget.dataset.idx
    var name = e.currentTarget.dataset.name
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userID: res.data,
          infor: true
        });
        if (that.data.userID != '11111111111a') {
          if (isCollected == '0') {
            if (name == 'listnews') {
              that.data.listnews[idx].isCollected=1
              that.setData({
                listnews: that.data.listnews
              })
            }
            if (name == 'recommend_list') {
              that.data.recommend_list[idx].isCollected = 1
              that.setData({
                recommend_list: that.data.recommend_list
              })
            }
            if (name == 'guess_list') {
              that.data.guess_list[idx].isCollected = 1
              that.setData({
                guess_list: that.data.guess_list
              })
            }
            wx.request({
              url: util.Apis + '/h5/h5collection/addCollection',
              method: 'POST',
              data: {
                goodId: goodId,
                userId: that.data.userID,
              },
              header: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
              },
            })
          } else {
            if (name == 'listnews') {
              that.data.listnews[idx].isCollected = 0
              that.setData({
                listnews: that.data.listnews
              })
            }
            if (name == 'recommend_list') {
              that.data.recommend_list[idx].isCollected = 0
              that.setData({
                recommend_list: that.data.recommend_list
              })
            }
            if (name == 'guess_list') {
              that.data.guess_list[idx].isCollected = 0
              that.setData({
                guess_list: that.data.guess_list
              })
            }
            wx.request({
              url: util.Apis + '/h5/h5collection/deleteCollection',
              method: 'POST',
              data: {
                goodId: goodId,
                userId: that.data.userID,
              },
              header: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
              },
            })
          }
        } else {
          wx.showModal({
            content: '请先绑定或注册',
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: "../register/register"
              })
            }
          })
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
              lh:'00',
              lm:'00',
              ls:'00'
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
      lh: that.toDou(h),
      lm: that.toDou(m),
      ls: that.toDou(s)
    })
    if (that.data.durTime <= 0) {
      that.setData({
        lh: '00',
        lm: '00',
        ls: '00'
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
      url: "../seekTransit/seekTransit"
    })
  },
  onShareAppMessage: function () {
    console.log('shaop')
  }
})
