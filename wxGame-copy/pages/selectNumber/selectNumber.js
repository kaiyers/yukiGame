//index.js
var util = require('../../utils/util.js');
const app = getApp()
Page({
  data: {
    selectCoinb:'selectCoinb.png',
    vlogo: '../../img/face.png',
    playerName: 'Yuki动漫',
    jetton: 0,
    openid:'',
    peoplefr:'peoplefr.png',
    peoples: 'peoples.png',
    peoplet: 'peoplet.png',
    peoplef: 'peoplef.png',
  },
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu()
    wx.getStorage({
      key: 'Mes',
      success: function (res) {
        that.setData({
          vlogo: res.data.avatarUrl,
          playerName: res.data.nickName,
          openid: res.data.openid,
          accountCoins_quantity: res.data.coin,
          jetton: options.jetton
        })
        console.log(res)
      }
    })
  },
  touchStart:function(e){
    var exp = e.currentTarget.dataset.idx;
    switch (exp) {
      case "1":
        this.setData({
          peoplefr:'peoplefrEnd.png',
        })
        break;
      case "2":
        this.setData({
          peoples: 'peoplesEnd.png',
        })
        break;
      case "3":
        this.setData({
          peoplet: 'peopletEnd.png',
        })
        break;
      case "4":
        this.setData({
          peoplef: 'peoplefEnd.png',
        })
        break;
      default:
        console.log("default");
    }
  },
  touchEnd: function (e) {
    var exp = e.currentTarget.dataset.idx;
    switch (exp) {
      case "1":
        this.setData({
          peoplefr: 'peoplefr.png',
        })
        this.reacTo("2")
        break;
      case "2":
        this.setData({
          peoples: 'peoples.png',
        })
        this.reacTo("4")
        break;
      case "3":
        this.setData({
          peoplet: 'peoplet.png',
        })
        this.reacTo("6")
        break;
      case "4":
        this.setData({
          peoplef: 'peoplef.png',
        })
        this.reacTo("8")
        break;
      default:
        console.log("default");
    }
  },
  //选择人数后跳转
  reacTo:function(num){
    var jetton = this.data.jetton/100
    if(num==2){
      wx.navigateTo({
        url: '../twoPlayer/twoPlayer?jetton=' + jetton
      })
    }else{
      wx.request({
        url: util.Apis + '/h5/game/userLogin/webLogin', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json' // 默认值
        },
        data: {
          openid: this.data.openid
        },
        success: function (res) {
          console.log(res.data)
          wx.navigateTo({
            url: '../MatchingMore/MatchingMore?jetton=' + jetton + '&num=' + num
          })
        }
      })
    }
  }
})
