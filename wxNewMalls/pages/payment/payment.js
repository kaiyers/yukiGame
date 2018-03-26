// pages/payment/payment.js
var util = require('../../utils/util.js');
Page({
  data: {
    uid:'',
    orderId:'',//订单id
    orderinfo: {},//订单信息
    goodsinfo: [],//商品信息
    durTime:'',
    countdowns:'',
    sk:'',
    orderState:'',
    prepay_id:'',
    access_token:'',
    creatTime:'',
    nameString:''
  },
  onLoad: function (options) {
    var orderStates = options.orderState||0
    this.setData({
      orderId: options.orid,
      orderState: orderStates
    })
  },
  onShow: function () {
    var that = this;
    var nameString=''
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data
        });
        wx.request({
          url: util.Apis + '/h5/h5order/myOrderDetail',
          method: 'POST',
          data: {
            orderid: that.data.orderId
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var datas = res.data.data.orderBean;
            console.log(res)
            datas.orderItem.forEach((value,index)=>{
              value.skuText = value.skuText[0].split(":")[1]
            })
            that.setData({
              orderinfo: datas.order,
              goodsinfo: datas.orderItem,
              durTime: parseInt(datas.order.leftTime / 1000),
              creatTime: util.newDate(datas.order.createTime, 'Y-M'),
              needPay: datas.order.needPay / 100
            })
            for (let i = 0; i < datas.orderItem.length;i++){
              nameString += datas.orderItem[i].name
            }
            that.setData({
              nameString: nameString
            })
            if (that.data.durTime <= 0) {
              that.setData({
                countdowns: '00分00秒'
              })
              wx.redirectTo({
                url: '../myOrder/myOrder?orderState=0' + that.data.orderState
              })
            } else {
              clearInterval(that.data.sk)
              that.sktime()
              that.data.sk = setInterval(function(){that.sktime()}, 1000);
            }
          }
        })
      }
    })
  },
//倒计时模块
  sktime() {
    var that = this;
    var sdurTime = that.data.durTime
    that.data.durTime--;
    var h = parseInt(sdurTime / 3600);
    sdurTime %= 3600;
    var m = parseInt(sdurTime / 60);
    var s = sdurTime % 60;
    that.setData({
      countdowns: that.toDou(m) + '分' + that.toDou(s) + '秒'
    })
    if (that.data.durTime <= 0) {
      that.setData({
        countdowns: '00分00秒'
      })
      clearInterval(that.data.sk);
    }
  },
  toDou(n) {
    return n < 10 ? '0' + n : '' + n;
  },
// 去支付
  play: function(){
    
    var that=this
    wx.login({
      success: res => {
        wx.request({
          url: util.Apis +'/h5/h5login/xcxlogin', //仅为示例，并非真实的接口地址
          data: {
            code: res.code,
          },
          header: {
             'content-type': 'application/x-www-form-urlencoded'  // 默认值
          },
          method: 'POST',
          success: function (res) {
            var open = res.data.data.openid
            wx.request({
              url: util.Apis +'/h5/h5pay/xcxPay', //仅为示例，并非真实的接口地址
              data: {
                ordercode: that.data.orderinfo.ordercode,
                userId:that.data.uid,
                openid: open
              },
              header: {
                 'content-type': 'application/x-www-form-urlencoded'  // 默认值
              },
              method: 'POST',
              success: function (res) {
                var param=res.data.data
                var prepayID = param.package.split('prepay_id=')[1]+''
                that.setData({
                  prepay_id: prepayID
                })
                wx.requestPayment({
                  timeStamp: param.timestamp,
                  nonceStr: param.nonce_str,
                  package: param.package,
                  signType: param.sign_type,
                  paySign: param.pay_sign,
                  success: function (res) {
                    wx.request({
                      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=APPSECRET',
                      data: {
                        grant_type: 'client_credential',
                        appid: "wxdfbcc0d1eef6ec3b",
                        secret: '3596ccd0099c6e2f5150a1dad5ac541a'
                      },
                      header: {
                         'content-type': 'application/x-www-form-urlencoded'  // 默认值  
                      },
                      method: 'GET',
                      success: function (res) {
                          var accessToken = res.data.access_token
                          that.setData({
                            access_token: accessToken
                          })
                          wx.request({
                            url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + that.data.access_token,
                            data: {
                              "touser": open,
                              "template_id": "igKiPCaftKOIekkSX-zMg52SuDP9GLq3DJT0PF0ZsOM",
                              "page": "pages/myOrder/myOrder?orderState=0",
                              "form_id": that.data.prepay_id,
                              "data": {
                                "keyword1": {
                                  "value": that.data.creatTime,
                                  "color": "#173177"
                                },
                                "keyword2": {
                                  "value": that.data.nameString,
                                  "color": "#173177"
                                }, 
                                "keyword3": {
                                  "value": that.data.orderinfo.ordercode,
                                  "color": "#173177"
                                },
                                "keyword4": {
                                  "value": '￥'+that.data.needPay,
                                  "color": "#173177"
                                } 
                              },
                            },
                            header: {
                              'content-type': 'application/json'
                            },
                            method: 'POST',
                            success: function (res) {
                            }
                          })
                      }
                    })
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 2000
                    })
                    setTimeout(function(){
                      wx.redirectTo({
                        url: '../myOrder/myOrder?orderState=0'
                      })
                    },2000)
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  //取消订单
  cancellation: function () {
    var oderCode = this.data.orderinfo.ordercode
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
              wx.reLaunch ({
                url: '../personal/personal',
              })
            }
          })
        }
      }
    });
  }
})