// pages/address/address.js
var util = require('../../utils/util.js');
Page({
/*页面的初始数据*/
  data: {
    uid:'',
    addrss:[],
  },
  // 返回订单详情
  goder: function(e){
    const index = e.currentTarget.dataset.index;
    let addrss = this.data.addrss;
    var adrid = addrss[index].addrid;
    if (wx.getStorageSync('sty')){
      wx.setStorageSync('adrid', adrid);
      wx.redirectTo({
        url: '../confirmorder/confirmorder'
      })
    }
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data
        });
        wx.request({
          url: util.Apis + '/h5/h5address/getUserAddresses',
          method: 'POST',
          data: {
            userid: res.data
          },
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            that.setData({
              addrss: res.data.data.adresses
            })
          }
        })
      }
    })
  },
/* 设为默认地址 */
  setDefault: function (e) {
    const index = e.currentTarget.dataset.index;
    let addrss = this.data.addrss;
    for(var i=0;i<addrss.length;i++){
      addrss[i].isAvalible = 0;
    };
    addrss[index].isAvalible = 1;
    var that = this;
    wx.request({
      url: util.Apis + '/h5/h5address/setDefault',
      method: 'POST',
      data: {
        adrid: addrss[index].addrid
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          addrss: addrss
        })
      }
    })
  },
/*删除地址*/
  delAddress: function (e) {
    const index = e.currentTarget.dataset.index;
    let addrss = this.data.addrss;
    var that = this;
    wx.showModal({
      content: '确定删除该地址吗？',
      showCancel: true,
      cancelColor:'#007aff',
      confirmColor: '#007aff',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: util.Apis + '/h5/h5address/deletUserAddress',
            method: 'POST',
            data: {
              adrid: addrss[index].addrid
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              addrss.splice(index, 1);
              that.setData({
                addrss: addrss
              })
            }
          })
        }
      }
    })
  },
})