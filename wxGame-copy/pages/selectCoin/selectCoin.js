//index.js
const app = getApp()
Page({
  data: {
    selectCoinb:'selectCoinb.png',
    vlogo: '../../img/face.png',
    playerName: 'Yuki动漫',
    accountCoins_quantity: 0,
    confirm: 'confirm.png',
    judgingBigBtnfr:'judgingBigBtnfr.png',
    judgingBigBtns: 'judgingBigBtns.png',
    judgingBigBtnt: 'judgingBigBtnt.png',
    judgingBigBtnf: 'judgingBigBtnf.png',
    lackCoin:false,  //金币不足弹出
    popTips:'', //提示语
    fr:'',//判断是不是好友对战openId
    fast:''//判断是不是快速开始
  },
  onLoad: function (options) {
    var that = this;
    wx.hideShareMenu()
    if (options.fr) {//判断是不是点击的好友对战
      that.setData({
        fr: options.fr
      })
    }
    if (options.fast) {//判断是不是快速开始
      that.setData({
        fast: options.fast
      })
    }
    wx.getStorage({
      key: 'Mes',
      success: function (res) {
        that.setData({
          vlogo: res.data.avatarUrl,
          playerName: res.data.nickName,
        })
        console.log(res)
      }
    })
    wx.getStorage({
      key: 'accountCoins_quantity',
      success: function (res) {
        that.setData({
          accountCoins_quantity: res.data.accountCoins_quantity
        })
      }
    })
  },
  touchStart:function(e){
    var exp = e.currentTarget.dataset.idx;
    switch (exp) {
      case "1":
        this.setData({
          judgingBigBtnfr:'judgingBigBtnfrEnd.png',
        })
        break;
      case "2":
        this.setData({
          judgingBigBtns: 'judgingBigBtnsEnd.png',
        })
        break;
      case "3":
        this.setData({
          judgingBigBtnt: 'judgingBigBtntEnd.png',
        })
        break;
      case "4":
        this.setData({
          judgingBigBtnf: 'judgingBigBtnfEnd.png',
        })
        break;
      case "9":
        this.setData({
          confirm: 'confirmEnd.png',
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
          judgingBigBtnfr: 'judgingBigBtnfr.png',
        })
        this.reacTo("100")
        break;
      case "2":
        this.setData({
          judgingBigBtns: 'judgingBigBtns.png',
        })
        this.reacTo("200")
        break;
      case "3":
        this.setData({
          judgingBigBtnt: 'judgingBigBtnt.png',
        })
        this.reacTo("400")
        break;
      case "4":
        this.setData({
          judgingBigBtnf: 'judgingBigBtnf.png',
        })
        this.reacTo("800")
        break;
      case "9":
        this.setData({
          confirm: 'confirm.png',
          lackCoin: false
        })
        if (this.data.accountCoins_quantity<100){
          wx.navigateBack({
            delta: 1
          })
        }
        break;
      default:
        console.log("default");
    }
  },
  reacTo: function (coin) {
    var accountCoins = this.data.accountCoins_quantity;
    if (accountCoins>100){
      if (accountCoins > coin) {
        if(this.data.fr){
          wx.navigateTo({
            url: '../MatchingMore/MatchingMore?machCoin=' + coin +'&peopleNumber=2'//点击的好友对战,
          })
        } else if (this.data.fast){
          wx.navigateTo({
            url: '../MatchingMore/MatchingMore?machCoin=' + coin+'&msg=fast'//点击的快速按钮
          })
        }else{
          wx.navigateTo({
            url: '../selectNumber/selectNumber?jetton=' + coin
          })
        }
      } else {
        this.setData({
          lackCoin: true,
          popTips:"您的Y币不足以开启本局"
        })
      }
    }else{
      this.setData({
        lackCoin: true,
        popTips: "您的Y币低于100Y币，无法进行比赛"
      })
    }
  }
})
