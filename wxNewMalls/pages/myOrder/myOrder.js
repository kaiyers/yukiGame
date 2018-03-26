const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    userID: '',
    orderState: "",
    orderBtn: false,
    indexs: 0,
    maxIndex: 1,
    orderList: [],
    unPay: [],
    unSend: [],
    unGet: [],
    unJudge: [],
    tipsShow: false,
    news: [],
    currentTab: '',
    moreBoolean: true
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
    var orderState = options.orderState
    that.setData({
      currentTab: orderState
    })
  },
  onShow: function () {
    this.getOrder()
  },
  //监听自定义组件内部时间为零
  onMyEvent: function (e) {
    console.log(e.detail)
    var idx = e.detail.idx
    this.data.orderList[idx].order.leftTime = ''
    this.data.orderList[idx].order.orderStateId = 8
    this.data.orderList[idx].order.state = '交易关闭'
    this.setData({
      orderList: this.data.orderList
    })
    console.log(this.data.orderList)
  },
  //获取订单
  getOrder: function () {
    var that = this
    that.setData({
      orderList: [],
      tipsShow: false
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userID: res.data
        })
        wx.request({
          url: util.Apis + '/h5/h5order/myOrder',
          data: {
            index: 0,
            size: 10,
            state: that.data.currentTab,
            userid: that.data.userID
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'  // 默认值
          },
          method: 'POST',
          success: function (res) {
            console.log(res.data.data.ordersBean)
            var orders = res.data.data.ordersBean
            if (orders.length != 0) {
              that.setData({
                orderList: orders,
                maxIndex: res.data.data.maxIndex,
                tipsShow: false
              })
            } else {
              that.setData({
                orderList: [],
                tipsShow: true
              })
            }
          }
        })
      }
    })
  },
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current,
      moreBoolean: true
    });
    that.getOrder()
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        moreBoolean: true
      })
      that.getOrder()
    }
  },
  pullUpLoad: function () {
    if (this.data.moreBoolean && this.data.orderList.length) {
      var that = this
      this.data.indexs++
      if (this.data.indexs >= this.data.maxIndex) {
        wx.showToast({
          title: '没有更多订单啦',
          duration: 2000,
          image: '../../img/icon/badTost.png'
        });
        that.setData({
          moreBoolean: false
        })
        return false
      } else {
        that.setData({
          indexs: that.data.indexs
        })
        wx.request({
          url: util.Apis + '/h5/h5order/myOrder',
          data: {
            index: that.data.indexs,
            size: 10,
            state: that.data.currentTab,
            userid: that.data.userID
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'  // 默认值
          },
          method: 'POST',
          success: function (res) {
            that.setData({
              news: that.data.orderList
            })
            for (let i = 0; i < res.data.data.ordersBean.length; i++) {
              that.data.news.push(res.data.data.ordersBean[i])
            }
            that.setData({
              orderList: that.data.news,
            })
          }
        })
      }
    } else {
      return false
    }
  },
  //确认收货confirmReceipt
  confirmReceipt: function (e) {
    var that = this
    const index = e.currentTarget.dataset.index;
    var orderList = this.data.orderList;
    var orderid = orderList[index].order.orderid
    wx.request({
      url: util.Apis + '/h5/h5order/operatorOrder',
      data: {
        orderid: orderid,
        operator: "take"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        that.getOrder()
      }
    })
  },
  //取消订单
  cancellation: function (e) {
    const index = e.currentTarget.dataset.index;
    var orderList = this.data.orderList;
    var oderCode = orderList[index].order.ordercode
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要取消订单吗？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: util.Apis + '/h5/h5order/cancelOrder',
            data: {
              ordercode: oderCode,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'  // 默认值
            },
            method: 'POST',
            success: function (res) {
              that.getOrder()
            }
          })
        }
      }
    });
  },
  //去支付
  goplay: function (e) {
    var that = this
    const index = e.currentTarget.dataset.index;
    var orderList = that.data.orderList;
    wx.request({
      url: util.Apis + '/h5/h5order/myOrderDetail',
      method: 'POST',
      data: {
        orderid: orderList[index].order.orderid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var state = res.data.data.orderBean.order.orderStateId
        if (state == 8) {
          return false
        } else {
          wx.navigateTo({
            url: '../payment/payment?orid=' + orderList[index].order.orderid + '&&orderState=' + that.data.currentTab
          })
        }
      }
    })
  },
  //提醒发货
  asktips: function () {
    wx.showModal({
      title: '提示',
      content: '已提醒卖家发货',
      showCancel: false,
      success: function (res) {
      }
    });
  }
})  