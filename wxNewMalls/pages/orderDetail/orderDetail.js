const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    userName:'',
    phone:'',
    address:'',
    orderStateText:'',
    orderid:'',
    leaveMessage:'',
    orderPrice:'',
    goodPrice:'',
    freight:'',
    orderNumber:'',
    orderTime:'',
    orderState:'',
    goodsList:[],
    quantity:'',
    ordercode:'',
    leftTime:''
  },
  onLoad: function (options) {
    var that=this
    var aorderid = options.orderid
    that.setData({
      orderid: aorderid
    })
    wx.request({
      url: util.Apis + '/h5/h5order/myOrderDetail',
      data:{
        orderid:that.data.orderid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        let orderMsg = res.data.data.orderBean.order;
        console.log(orderMsg)
        that.setData({
          userName: orderMsg.receiveName,
          phone: orderMsg.receivePhone,
          address: orderMsg.receiveAddress,
          leaveMessage: orderMsg.remarkText,
          orderPrice: orderMsg.totalPriceNow,
          goodPrice: orderMsg.needPay,
          freight: orderMsg.freight,
          orderNumber: orderMsg.ordercode,
          orderTime: orderMsg.createTime,
          orderState: orderMsg.orderStateId,
          goodsList: res.data.data.orderBean.orderItem,
          quantity: res.data.data.orderBean.orderItem.length,
          orderid: orderMsg.orderMsg,
          ordercode: orderMsg.ordercode,
          leftTime: orderMsg.leftTime
        })
        if (that.data.orderState == 8) {
          that.setData({
            orderStateText: '已取消'
          })
        }else{
          that.setData({
            orderStateText: orderMsg.state
          })
        }
      }
    })
  },
  //确认收货confirmReceipt
  confirmReceipt: function () {
    var that = this
    wx.request({
      url: util.Apis + '/h5/h5order/operatorOrder',
      data: {
        orderid: that.data.orderid,
        operator: "take"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        wx.navigateTo({
          url: '../myOrder/myOrder?orderState=0',
        })
      }
    })
  },
  //取消订单
  cancellation: function (e) {
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
              ordercode: that.data.ordercode,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'  // 默认值
            },
            method: 'POST',
            success: function (res) {
              wx.navigateTo({
                url: '../myOrder/myOrder?orderState=0',
              })
            }
          })
        }
      }
    });
  },
  //去支付
  goplay: function (e) {
    var that = this
    wx.request({
      url: util.Apis + '/h5/h5order/myOrderDetail',
      method: 'POST',
      data: {
        orderid: that.data.orderid
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
            url: '../payment/payment?orid=' + that.data.orderid + '&&orderState=0'
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