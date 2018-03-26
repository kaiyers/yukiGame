// pages/collect/collect.js
var util = require('../../utils/util.js');
Page({
/* 页面的初始数据*/
  data: {
    uid:'',
    collectList:[],
    selectAllStatus: false,
    delgoodIds:[], //要删除的商品id
    jishu: 0,
  },
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        // success
        that.setData({
          uid: res.data
        });
        wx.request({
          url: util.Apis + '/h5/h5collection/myCollection',
          method: 'POST',
          data: {
            userId: res.data,
          },
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var datas = res.data.data;
            that.setData({
              collectList: datas.goodBeans
            })
          }
        })
      }
    })
  },
  /* 当前商品选中事件 */
  selectList(e) {
    const index = e.currentTarget.dataset.index;
    let collectList = this.data.collectList;
    const selected = collectList[index].selected;
    collectList[index].selected = !selected;
    if (collectList[index].selected) {
      this.data.jishu = this.data.jishu + 1;
      this.data.delgoodIds.push(collectList[index].goodId);
    } else {
      this.data.jishu = this.data.jishu - 1;
      this.data.delgoodIds.removeByValue(collectList[index].goodId);
    }
    if (this.data.jishu == collectList.length) {
      this.data.selectAllStatus = true;
    } else {
      this.data.selectAllStatus = false;
    }
    this.setData({
      collectList: collectList,
      jishu: this.data.jishu,
      selectAllStatus: this.data.selectAllStatus,
      delgoodIds: this.data.delgoodIds,
    });
  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    let selectAllStatus = this.data.selectAllStatus;
    selectAllStatus = !selectAllStatus;
    let collectList = this.data.collectList;
    if (selectAllStatus) {
      this.data.jishu = collectList.length;
      for (let i = 0; i < collectList.length; i++) {
        this.data.delgoodIds.push(collectList[i].goodId);
      }
    } else {
      this.data.jishu = 0;
      this.data.delgoodIds = [];
    }
    for (let i = 0; i < collectList.length; i++) {
      collectList[i].selected = selectAllStatus;
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      collectList: collectList,
      jishu: this.data.jishu
    });
  },

  /* 删除商品*/
  deleteGoods: function () {
    var that = this;
    var goodId = [...new Set(that.data.delgoodIds)].join(',')
    if (goodId) {
      wx.request({
        url: util.Apis + '/h5/h5collection/deleteCollection',
        method: 'POST',
        data: {
          userId: that.data.uid,
          goodId: goodId
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          that.onShow()
          that.setData({
            delgoodIds: []
          })
        }
      })
    } else {
      wx.showModal({
        content: '亲，请选择要删除的商品...',
        showCancel: false,
        success: function (res) {
        }
      });
    }
  },
/*页面上拉触底事件的处理函数*/
  onReachBottom: function () {
  },
  //去商品详情
  godetail: function (e) {
    const index = e.currentTarget.dataset.index;
    let collectList = this.data.collectList;
    if (collectList[index].sale) {
      wx.navigateTo({
        url: '../details/details?gsid=' + collectList[index].goodId
      })
    }else{
      wx.showModal({
        content: '亲，此商品已下架了...',
        showCancel: false,
        success: function (res) {
        }
      });
    }
  },
})


//删除数组中指定的元素
Array.prototype.removeByValue = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      this.splice(i, 1);
      break;
    }
  }
}