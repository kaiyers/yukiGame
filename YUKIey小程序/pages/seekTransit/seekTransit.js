// pages/seekTransit/seekTransit.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    histroyDatas:[],
    hotDatas:[],
    histroyShow:false,
    searchinput:'Yuki原创',
    conTab: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: util.Apis + '/h5/h5search/findHotSearchLogList', 
      header: {
        'content-type': 'application/json' // 默认值
      },
      method:'POST',
      success: function (res) {
        that.setData({
          hotDatas: res.data.data.searchLogList
        })
      }
    })
  },
  onShow: function (){
    var that = this
    // 获取本地历史搜索存储
    var historySeach = wx.getStorageSync('histroyDatas') || []
    if (historySeach.length != 0) {
      that.setData({
        histroyDatas: that.repeat(historySeach),
        histroyShow: true
      })
    } else {
      that.setData({
        histroyShow: false
      })
    }
  },
  // 数组去重：
  repeat: function (arr){
      var newArr = [arr[0]];
      for (var i = 1; i < arr.length; i++) {
        　if (newArr.indexOf(arr[i]) == -1) {
            newArr.push(arr[i]);
          }
      }
      return newArr;
  },
  // 删除历史搜索
  delMes:function(){
    wx.removeStorageSync('histroyDatas')
    this.setData({
        histroyShow: false
      })
  },
  //输入内容检测
  textF:function(e) {
    // if (e.detail.value.replace(/(^[a-zA-Z0-9\u4e00-\u9fa5]+$)/g, '')) {
    //   wx.showToast({
    //     title: '只支持中文英文数字输入',
    //     duration: 2000,
    //     image: '../../img/icon/badTost.png'
    //   });
      this.setData({
        searchinput: e.detail.value
      })
    // }
  },
    //聚焦检测
  // methfoc:function(e){
  //   this.setData({
  //     searchinput:''
  //   })
  // },
    //失焦检测
  // methblur:function(e) {
  //   if (e.detail.value == ''){
  //     this.setData({
  //       searchinput: 'Yuki原创'
  //     })
  //   }else{
  //     this.setData({
  //       searchinput: e.detail.value
  //     })
  //   }
  // },
    //搜索按钮
  seachClick:function(){
    var sechtext = this.data.searchinput
    if (sechtext.replace(/(^[a-zA-Z0-9\u4e00-\u9fa5]+$)/g, '')) {
      wx.showToast({
        title: '只支持中文英文数字输入',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
    }else{
      var historySeach = wx.getStorageSync('histroyDatas') || []
      historySeach.push(this.data.searchinput)
      wx.setStorageSync(
        'histroyDatas', historySeach
      )
      wx.navigateTo({
        url: "../seekDetail/seekDetail?seachKey=" + sechtext
      })
    }
  },
  onShow: function () {
    var that = this
    // 获取本地历史搜索存储
    var historySeach = wx.getStorageSync('histroyDatas') || []
    if (historySeach.length != 0) {
      that.setData({
        histroyDatas: that.repeat(historySeach),
        histroyShow: true
      })
    } else {
      that.setData({
        histroyShow: false
      })
    }
  },
})