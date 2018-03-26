// pages/confirmorder/confirmorder.js
var util = require('../../utils/util.js');
var manJianName = '';
var manJianB = '';
var youhuiName = '';
var youhuiInfo = '';
Page({
  data:{
    uid: '',
    hasAddress: false,
    addrId: '0',
    address: {}, //地址信息
    orders:[], //商品信息
    orderinfo:{}, //商品价格信息
    needpay:'',//总计
    couponsList:[],//优惠券信息
    isfromCar:false, //是否从购物车过来
    skuids:'', //购物车传递的数据
    skuid: '', //商品详情传递的数据
    num: '', //商品详情传递的数据
    leaveMessage: '', // 买家留言
    popShow:false, //是否展示选择优惠券
    youhuiName:'',// 优惠名称
    youhuiInfo: '',// 优惠详情
    orderStateID: '', // 优惠满减ID
    couponID: '', // 优惠券ID
    discount:'', //折扣
    formId:'',
    openidLocal:'',
    access_token:''
  },
  //页面预加载
  onLoad: function (options) {
    var skuids = wx.getStorageSync('skuids')
    if (skuids){
      this.setData({
        isfromCar:true,
        skuids: skuids,
        addrId: wx.getStorageSync('adrid')
      })
    }else{
      this.setData({
        isfromCar: false,
        skuid: wx.getStorageSync('sid'),
        num: wx.getStorageSync('num'),
        addrId: wx.getStorageSync('adrid')
      })
    }
    this.getData()
  },
  getData:function(){
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        // success
        that.setData({
          uid: res.data
        })
        if (that.data.isfromCar) {
          // var that = this;
          wx.request({
            url: util.Apis + '/h5/h5order/toCheck',
            method: 'POST',
            data: {
              skuid: that.data.skuids,
              userId: that.data.uid,
              addrId: that.data.addrId,
              couponId: '-2',
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var datas = res.data.data;
              //商品优惠信息
              if (datas.saleBean) {
                manJianName = datas.saleBean.salesName; // 满减优惠名
                manJianB = datas.saleBean.saleReduce; //减多少
              }
              let couponName = datas.orderBean.sales.couponsName; //优惠券名
              let couponT = datas.orderBean.sales.couponsMeet;
              let couponB = datas.orderBean.sales.couponsReduce;
              if (couponName != null || datas.saleBean) {
                if (manJianB > couponB) {
                  youhuiName = manJianName;
                  youhuiInfo = ' 减 ' + manJianB
                } else {
                  youhuiName = couponName;
                  youhuiInfo = '满 ' + couponT + ' 减 ' + couponB
                }
              } else {
                youhuiName = 'kong';
                youhuiInfo = '无商品折扣'
              }
              that.setData({
                address: datas.orderBean.address,
                orders: datas.orderBean.orderItem,
                orderinfo: datas.orderBean.order,
                needpay: datas.orderBean.order.needPay,
                discount: datas.orderBean.orderItem[0].vip.vipDiscount * 10,
                couponsList: datas.coupons, // 商品优惠券信息
                youhuiName: youhuiName,
                youhuiInfo: youhuiInfo,
                hasAddress: datas.orderBean.address ? true : false,
                orderStateID: datas.orderBean.sales.ordersaleid, // 优惠满减ID
                couponID: datas.orderBean.sales.couponId // 优惠券ID
              })
            }
          })
        } else {
          // var that = this;
          wx.request({
            url: util.Apis + '/h5/h5order/toCheckOrderNew',
            method: 'POST',
            data: {
              skuid: that.data.skuid,
              num: that.data.num,
              userId: that.data.uid,
              // userId: 95,
              addrId: that.data.addrId,
              couponId: '-2',
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var datas = res.data.data;
              //商品优惠信息
              if (datas.saleBean) {
                manJianName = datas.saleBean.salesName; // 满减优惠名
                manJianB = datas.saleBean.saleReduce; //减多少
              }
              let couponName = datas.orderBean.sales.couponsName; //优惠券名
              let couponT = datas.orderBean.sales.couponsMeet;
              let couponB = datas.orderBean.sales.couponsReduce;
              if (couponName != null || datas.saleBean) {
                if (manJianB > couponB) {
                  youhuiName = manJianName;
                  youhuiInfo = ' 减 ' + manJianB
                } else {
                  youhuiName = couponName;
                  youhuiInfo = '满 ' + couponT + ' 减 ' + couponB
                }
              } else {
                youhuiName = 'kong';
                youhuiInfo = '无商品折扣'
              }
              that.setData({
                address: datas.orderBean.address,
                orders: datas.orderBean.orderItem,
                discount: datas.orderBean.orderItem[0].vip.vipDiscount*10,
                orderinfo: datas.orderBean.order,
                needpay: datas.orderBean.order.needPay,
                couponsList: datas.coupons, // 商品优惠券信息
                youhuiName: youhuiName,
                youhuiInfo: youhuiInfo,
                hasAddress: datas.orderBean.address ? true : false,
                orderStateID: datas.orderBean.sales.ordersaleid, // 优惠满减ID
                couponID: datas.orderBean.sales.couponId // 优惠券ID
              })
            }
          })
        }

      }
    })
  },
  // 买家留言
  leaveMessage: function (e) {
    this.setData({ leaveMessage: e.detail.value });
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    let orders = this.data.orders;
    let total = 0;
    for(let i = 0; i < orders.length; i++) {
      total += orders[i].num * orders[i].price;
    }
    this.setData({
      total: total
    })
  },
// 提交订单
  toPay(e) {
    var that=this
    var formId = e.detail.formId
    that.setData({
      formId: formId
    })
    if (this.data.isfromCar){
      var carids = [];
      for (var i = 0; i < this.data.orders.length;i++){
        carids.push(this.data.orders[i].cartid)
      };
      var catid = carids.join(',')
      if (!this.data.hasAddress) {
        wx.showModal({
          content: '亲，你还未选择收货地址哦...',
          showCancel: false,
          success: function (res) {
          }
        });
        return;
      }
      this.subOrder(0, 0, catid);
    }else{
      var carids = [];
      for (var i = 0; i < this.data.orders.length; i++) {
        carids.push(this.data.orders[i].cartid)
      }
      if (!this.data.hasAddress) {
        wx.showModal({
          content: '亲，你还未选择收货地址哦...',
          showCancel: false,
          success: function (res) {
          }
        });
        return;
      }
      this.subOrder(this.data.skuid, this.data.num, 0);
    }
  },
  //提交订单方法
  subOrder: function(sid,num,cid){
    var that = this;
    wx.getStorage({
      key: 'openidLocal',
      success: function (res) {
        that.setData({
          openidLocal: res.data
        });
        if (that.data.orderStateID == null) {
          that.data.orderStateID = 0;
        }
        if (that.data.couponID == null) {
          that.data.couponID = 0;
        }
        wx.request({
          url: util.Apis + '/h5/h5order/subOrderNew',
          method: 'POST',
          data: {
            'userId': that.data.uid,
            //个人-地址信息
            'addrId': that.data.addrId,
            'receiveName': that.data.address.name,
            'receivePhone': that.data.address.phone,
            'receiveAddress': that.data.address.address,
            //商品信息
            'totalPriceNow': that.data.orderinfo.totalPriceNow, // 现在的总价
            'freight': that.data.orderinfo.freight,//运费
            'needPay': that.data.needpay, // 应付金额
            'skuid': sid, // 类型id
            'num': num,  // 购买数量
            'cartid': cid,
            'saleorderid': that.data.orderStateID,// 满减id
            'remarkText': that.data.leaveMessage, // 买家留言
            'couponId': that.data.couponID, // 优惠券ID
          },
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var oidS = res.data.data.orderBean.order.orderid
            var goodNames="" //商品名字
            var orderItem = res.data.data.orderBean.orderItem
            for (let i = 0; i < orderItem.length;i++){
              goodNames+=orderItem[i].name
            }
            var orderMes = res.data.data.orderBean.order
            var ordercode = orderMes.ordercode//订单号
            var createTime = util.newDate(orderMes.createTime, 'Y-M')//下单时间
            var needPay = orderMes.needPay/100//金额
            var toastMes = '请在' + util.newDate((orderMes.createTime + 1800000), 'HM')+'之前完成支付'//截至时间
            wx.request({
              url: 'https://api.weixin.qq.com/cgi-bin/token',
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
                    "touser": that.data.openidLocal,
                    "template_id": "z-EL5eCPRPwFgIe6IjGZj9bAAzX3qKRxgoQU_w4v7Vk",
                    "page": 'pages/payment/payment?orid=' + oidS,
                    "form_id": that.data.formId,
                    "data": {
                      "keyword1": {
                        "value": ordercode,
                        "color": "#173177"
                      },
                      "keyword2": {
                        "value": createTime,
                        "color": "#173177"
                      },
                      "keyword3": {
                        "value": '￥'+needPay,
                        "color": "#173177"
                      },
                      "keyword4": {
                        "value": toastMes,
                        "color": "#173177"
                      },
                      "keyword5": {
                        "value": goodNames,
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
            wx.removeStorageSync('skuids')
            wx.removeStorageSync('sid')
            wx.removeStorageSync('num')
            wx.navigateTo({
              url: '../payment/payment?orid=' + oidS
            })
          }
        })
      }
    })
    
  },
  //弹出选择优惠券
  actionSheetTap: function(){
    if (this.data.couponsList.length != 0) {
      this.setData({
        popShow: true
      })
    }
  },
  //关闭选择优惠券
  coloser: function () {
    this.setData({
      popShow: false
    })
  },

//选择优惠条件
  radiogroupBindchange: function (e) {
    let coupenVal = e.detail.value
    if (coupenVal == 'manjian'){
      this.manjianYou()
    }else{
      this.youhuiquanYu(coupenVal)
    }
  },
//满减优惠
  manjianYou:function() {
    if (this.data.isfromCar) {
      var that = this;
      wx.request({
        url: util.Apis + '/h5/h5order/toCheck',
        method: 'POST',
        data: {
          skuid: that.data.skuids,
          userId: that.data.uid,
          addrId: that.data.addrId,
          couponId: '0',
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var datas = res.data.data;
          //商品优惠信息
          let manJianName = datas.orderBean.sales.salesName; //满减名
          let manJianT = datas.orderBean.sales.salesMeet;
          let manJianB = datas.orderBean.sales.salesReduce;
          youhuiName = manJianName;
          youhuiInfo = '满 ' + manJianT + ' 减 ' + manJianB;
          //运费  合计
          let summation = datas.orderBean.order.needPay; // 合计
          let orderStateID = datas.orderBean.sales.ordersaleid; // 优惠满减ID
          let couponID = datas.orderBean.sales.couponId // 优惠券ID
          that.setData({
            needpay: summation,
            youhuiName: youhuiName,
            youhuiInfo: youhuiInfo,
            orderStateID: orderStateID, // 优惠满减ID
            couponID: couponID // 优惠券ID
          })
        }
      })
    } else {
      var that = this;
      wx.request({
        url: util.Apis + '/h5/h5order/toCheckOrderNew',
        method: 'POST',
        data: {
          skuid: that.data.skuid,
          num: that.data.num,
          userId: that.data.uid,
          addrId: that.data.addrId,
          couponId: '0',
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var datas = res.data.data;
          //商品优惠信息
          let manJianName = datas.orderBean.sales.salesName; //满减名
          let manJianT = datas.orderBean.sales.salesMeet;
          let manJianB = datas.orderBean.sales.salesReduce;
          youhuiName = manJianName;
          youhuiInfo = '满 ' + manJianT + ' 减 ' + manJianB;
          //运费  合计
          let summation = datas.orderBean.order.needPay; // 合计
          let orderStateID = datas.orderBean.sales.ordersaleid; // 优惠满减ID
          let couponID = datas.orderBean.sales.couponId // 优惠券ID
          that.setData({
            needpay: summation,
            youhuiName: youhuiName,
            youhuiInfo: youhuiInfo,
            orderStateID: orderStateID, // 优惠满减ID
            couponID: couponID // 优惠券ID
          })
        }
      })
    }
  },
//优惠券优惠
  youhuiquanYu:function(id) {
    this.orderStateID = id;
    if (this.data.isfromCar) {
      var that = this;
      wx.request({
        url: util.Apis + '/h5/h5order/toCheck',
        method: 'POST',
        data: {
          skuid: that.data.skuids,
          userId: that.data.uid,
          addrId: that.data.addrId,
          couponId: id,
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var datas = res.data.data;
          //商品优惠信息
          let couponName = datas.orderBean.sales.couponsName; //优惠券名
          let couponT = datas.orderBean.sales.couponsMeet;
          let couponB = datas.orderBean.sales.couponsReduce;
          youhuiName = couponName;
          youhuiInfo = '满 ' + couponT + ' 减 ' + couponB;
          //运费  合计
          let summation = datas.orderBean.order.needPay; // 合计
          let orderStateID = datas.orderBean.sales.ordersaleid; // 优惠满减ID
          let couponID = datas.orderBean.sales.couponId // 优惠券ID
          that.setData({
            needpay: summation,
            youhuiName: youhuiName,
            youhuiInfo: youhuiInfo,
            orderStateID: orderStateID, // 优惠满减ID
            couponID: couponID // 优惠券ID
          })
        }
      })
    } else {
      var that = this;
      wx.request({
        url: util.Apis + '/h5/h5order/toCheckOrderNew',
        method: 'POST',
        data: {
          skuid: that.data.skuid,
          num: that.data.num,
          userId: that.data.uid,
          addrId: that.data.addrId,
          couponId: id,
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var datas = res.data.data;
          //商品优惠信息
          let couponName = datas.orderBean.sales.couponsName; //优惠券名
          let couponT = datas.orderBean.sales.couponsMeet;
          let couponB = datas.orderBean.sales.couponsReduce;
          youhuiName = couponName;
          youhuiInfo = '满 ' + couponT + ' 减 ' + couponB;
          //运费  合计
          let summation = datas.orderBean.order.needPay; // 合计
          let orderStateID = datas.orderBean.sales.ordersaleid; // 优惠满减ID
          let couponID = datas.orderBean.sales.couponId // 优惠券ID
          that.setData({
            needpay: summation,
            youhuiName: youhuiName,
            youhuiInfo: youhuiInfo,
            orderStateID: orderStateID, // 优惠满减ID
            couponID: couponID // 优惠券ID
          })
        }
      })
    }
  },
  //去选地址
  goAddress: function(){
    wx.setStorageSync('sty', true);
    wx.redirectTo({
      url: '../address/address'
    })
  }
})