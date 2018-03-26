const app = getApp()
var util = require('../../utils/util.js');
Page({
  data:{
    searchinput:'',
    detailList:[],
    detailListB:false,
    conTab:true,
    news:[],
    indenx:0,
    maxIndex:1,
    winWidth: '',
    winHeight: ''
  },
  onLoad: function (options) {
    var that = this
    var sKey = options.seachKey
    that.setData({
      searchinput: sKey
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    })
    this.seachClick()
  },
  //输入内容检测
  textF: function (e) {
    if (e.detail.value.replace(/(^[a-zA-Z0-9\u4e00-\u9fa5]+$)/g, '')) {
      wx.showModal({
        content: '只支持中文英文数字输入',
        showCancel: false,
      });
      this.setData({
        searchinput: 'Yuki原创'
      })
    }else{
      this.setData({
        searchinput: e.detail.value
      })
    }
  },
  //聚焦检测
  methfoc: function (e) {
    this.setData({
      searchinput: ''
    })
  },
  //失焦检测
  // methblur: function (e) {
  //   if (e.detail.value == '') {
  //     this.setData({
  //       searchinput: 'Yuki原创'
  //     })
  //   } else {
  //     this.setData({
  //       searchinput: e.detail.value
  //     })
  //   }
  // },
  //搜索按钮
  seachClick: function () {
    if (this.data.searchinput.length==0){
      wx.showModal({
        content: '不能为空且只支持中文英文数字输入',
        showCancel: false,
      });
      // wx.showToast({
      //   title: '只支持中文英文数字输入',
      //   duration: 2000,
      //   image: '../../img/icon/badTost.png'
      // });
    }else{
      var that = this
      that.setData({
        indenx: 0
      })
      if (this.data.conTab) {
        var historySeach = wx.getStorageSync('histroyDatas') || []
        historySeach.push(this.data.searchinput)
        wx.setStorageSync(
          'histroyDatas', historySeach
        )
        wx.request({
          url: util.Apis + '/h5/h5search/searchList',
          data: {
            goodName: that.data.searchinput,
            index: 0,
            size: 10
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'  // 默认值
          },
          method: 'POST',
          success: function (res) {
            if (!res.data.data.goodBeanList) {
              that.setData({
                detailListB: true,
                detailList: []
              })
            } else {
              that.setData({
                detailListB: false,
                detailList: res.data.data.goodBeanList,
                maxIndex: res.data.data.maxIndex
              })
            }
          }
        })
        this.data.conTab = false;
        setTimeout(function () {
          that.data.conTab = true
        }, 2000)
      } else {
        wx.showToast({
          title: '您搜索过于频繁',
          duration: 2000,
          image: '../../img/icon/badTost.png'
        });
      } 
    }
  },
  //上拉加载专用搜索
  moreSeach: function () {
    var that = this
    wx.request({
      url: util.Apis + '/h5/h5search/searchList',
      data: {
        goodName: that.data.searchinput,
        index: that.data.indenx,
        size: 10
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'  // 默认值
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          news: that.data.detailList
        })
        for (let i = 0; i < res.data.data.goodBeanList.length; i++) {
          that.data.news.push(res.data.data.goodBeanList[i])
        }
        that.setData({
          detailList: that.data.news
        })
      }
    })
  },
  pullUpLoad: function () {
    this.data.indenx++
    if (this.data.indenx >= this.data.maxIndex){
      // wx.showToast({
      //   title: '没有个更多啦',
      //   duration: 2000,
      //   image: '../../img/icon/badTost.png'
      // });
      return false
    }else{
      this.moreSeach()
    }
  }
})