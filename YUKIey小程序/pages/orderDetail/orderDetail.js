const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    userName:'',
    phone:'',
    address:'',
    orderStateText:'',
    orderid:'',
    guess_list:[],
    leaveMessage:'',
    orderPrice:'',
    goodPrice:'',
    freight:'',
    orderNumber:'',
    orderTime:'',
    orderState:'',
    goodsList:[]

  },
  onLoad: function (options) {
    var that=this
    var aorderid = options.orderid
    that.setData({
      orderid: aorderid
    })
    wx.request({
      url: util.Apis + '/h5/h5order/myOrderDetail',
      data:{orderid:that.data.orderid},
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: 'POST',
      success: function (res) {
        let orderMsg = res.data.data.orderBean.order;
        that.setData({
          guess_list: res.data.data.guessGoodList, 
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
          goodsList: res.data.data.orderBean.orderItem
        })
        if (that.data.orderState == 8) {
          that.setData({
            orderStateText: '交易失败'
          })
        }else{
          that.setData({
            orderStateText: orderMsg.state
          })
        }
      }
    })
  }
})  