//index.js
const app = getApp()
Page({
  data: {
    inviteId:'',
    matchCoin:'600',
    roomId:'',
    inviteFace:'../../img/face.png',
    inviteName:'张三',
    roomPeople:'2',
    reciveInvite:false,
    gameFriend:'gameFriend.png',
    quickEnter:'quickEnter.png',
    gifts:'gifts.png',
    expect:'expect.png',
    gamePeoples: 'gamePeoples.png',
    Ytree: 'Ytree.png',
    rangs: 'rangs.png',
    vlogo:'../../img/face.png',
    vlogoIn:'../../img/face.png',
    confirm:'confirm.png',
    name:'Yuki动漫',
    nameIn:'Yuki动漫',
    back:'back.png',
    smove:{},//小球移动
    accountCoins_quantity:6000000,
    login:false,
    lackCoin:false,
    inviteFriend:false,
    dayGetGod:1000,
    animationData:{},
    nickName:'',
    avatarUrl:'',
    city:'',
    gender:'',
    exp:'-1',
    clickEND:true,
    bool:false,
    currentCoin:500,
    countdowns:"05:00:00",
    clickTime:"123",
    openid:'',
    progress:100,
    clickData:'',
    clickFalse:0,
    durTime:'',
    sk:'',
    popTips:'您的Y币不足以开启本局',
  },
  onLoad:function(options){
    if (options.inviteId){
      this.setData({
        inviteId: options.inviteId
      })
    }
    if (options.matchCoin){
      this.setData({
        matchCoin: options.matchCoin
      })
    }
    if (options.roomId) {
      this.setData({
        roomId: options.roomId
      })
    }
    if (options.inviteFace){
      this.setData({
        inviteFace: options.inviteFace
      })
    }
    this.indexFun()
  },
  onUnload: function () {
    clearInterval(this.data.sk) 
  },
  indexFun:function(){
    var nickName
    var avatarUrl
    var gender
    var city
    var userInfo
    var that = this
    //判断有没有授权, 如果用户已经同意小程序获取用户信息功能，后续调用接口不会弹窗询问
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          console.log('开始获取信息')
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              console.log('授权')
              that.getUser(nickName, avatarUrl, gender, city, userInfo)
            }
          })
        } else {
          console.log('已经存在用户信息')
          that.getUser(nickName, avatarUrl, gender, city, userInfo)
        }
      }
    })
  },
  //第一步事件：获取用户头像、昵称
  getUser: function (nickName, avatarUrl, gender, city, userInfo) {
    var that = this
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        var userInfo = res.userInfo
        nickName = userInfo.nickName
        avatarUrl = userInfo.avatarUrl
        gender = userInfo.gender //性别 0：未知、1：男、2：女
        city = userInfo.city
        console.log('开始第一步交互+++++')
        that.getcode(nickName, avatarUrl, gender, city)
      }
    })
  },
  //第二步事件：获取用户唯一标识以及Y币数量
  getcode: function (nickName, avatarUrl, gender, city) {
    var that=this
    console.log('获取openID')
    wx.login({
      success: res => {
        console.log('得到code++++')
        wx.request({
          url: "https://wx.yukicomic.com/h5/game/wechat/login",
          data: {
            code: res.code,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'  // 默认值
          },
          method: 'POST',
          success: function (res) {
            console.log("openID回来了++++",res)
            var open = JSON.parse(res.data).openid
            wx.setStorage({
              key: "openid",
              data: open
            })
            that.setData({
              openid: open
            })
            console.log(open)
            wx.request({
              url: "https://wx.yukicomic.com/h5/game/userLogin/register",//注册的同时判断是不是通过邀请码进来的，是，给邀请人增加金币
              data: {
                openid: open,
                nickName: nickName,
                avatarUrl: avatarUrl,
                gender: gender,
                city: city,
                inviteId: that.data.inviteId
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'  // 默认值
              },
              method: 'POST',
              success: function (res) {
                console.log('第三步注册事件结果+++++', res)
                wx.request({
                  url: "https://wx.yukicomic.com/h5/game/userLogin/receive",
                  data: {
                    openid: open,
                    type:1
                  },
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'  // 默认值
                  },
                  method: 'POST',
                  success: function (res) {
                    console.log('第四步判断是否是每日第一次登陆',res.data.code)
                    if (res.data.code==0){
                      that.setData({
                        login:true
                      })
                    }
                    wx.request({
                      url: "https://wx.yukicomic.com/h5/game/userLogin/search",
                      data: {
                        openid: open,
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'  // 默认值
                      },
                      method: 'POST',
                      success: function (res) {
                        console.log('第五步获取金钱事件结果+++++', res)
                        console.log('-------', res.data.data.growthTime)
                        if (that.data.clickFalse == 0) {
                          that.setData({
                            clickData: Date.parse(new Date()),
                          })
                        }
                        that.setData({
                          durTime: parseInt((that.data.clickData - res.data.data.growthTime) / 1000),
                        })
                        if (that.data.durTime >= 18000) {
                          that.setData({
                            countdowns: '05:00:00',
                            currentCoin: 500,
                            progress: 100
                          })
                        } else {
                          console.log('定时器开启')
                          that.sktime()
                          that.data.sk = setInterval(that.sktime, 1000);
                        }
                        wx.setStorage({
                          key: "Mes",
                          data: {
                            'nickName': nickName,
                            "avatarUrl": avatarUrl,
                            "openid": open,
                          }
                        })
                        that.setData({
                          vlogo: avatarUrl,
                          name: nickName,
                          accountCoins_quantity: res.data.data.score,
                          clickclickTime: res.data.data.growthTime,
                        })
                        wx.setStorage({
                          key: "accountCoins_quantity",
                          data: {
                            'accountCoins_quantity': that.data.accountCoins_quantity
                          }
                        })
                        
                        // wx.request({
                        //   url: "https://wx.yukicomic.com/h5/game/match/join",
                        //   data: {
                        //     openid: open,
                        //     roomId: '123'
                        //   },
                        //   header: {
                        //     'content-type': 'application/x-www-form-urlencoded'  // 默认值
                        //   },
                        //   method: 'POST',
                        //   success: function (res) {
                        //     console.log('接受邀请同时判断房间号存在不存在+++++', res)
                        //   }
                        // })
                        that.switchFun()
                      }
                    })
                  }
                })               
              }
            }) 
          }
        })
      }
    })
  },
  sktime() {//倒计时
    var that = this;
    var sdurTime = that.data.durTime
    that.data.durTime++;
    that.setData({
      currentCoin: parseInt(sdurTime/18000*500),
      progress: sdurTime / 18000 * 100
    })
    var h = parseInt(sdurTime / 3600);
    sdurTime %= 3600;
    var m = parseInt(sdurTime / 60);
    var s = sdurTime % 60;
    that.setData({
      countdowns: that.toDou(h) + ':' + that.toDou(m) + ':' + that.toDou(s)
    })
    if (that.data.durTime >=18000) {
      that.setData({
        countdowns: '05:00:00',
        currentCoin: 500,
        progress: 100
      })
      clearInterval(that.data.sk);
    }
  },
  toDou(n) {
    return n < 10 ? '0' + n : '' + n;
  },
  //click第一件事
  ckickFun:function(e){
    var nickName
    var avatarUrl
    var gender
    var city
    var userInfo
    var that=this
    that.setData({
      exp: e.currentTarget.dataset.idx
    })
    if (that.exp == 10) {
      that.setData({
        reciveInvite: true,
      })
    } else {
      that.setData({
        reciveInvite: false,
      })
    }
    that.setData({
      clickFalse:1,
      clickData: Date.parse(new Date())
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.showModal({
            title: '玩家您好',
            content: '检测到您未打开全民答题的获取用户信息权限，是否去设置打开',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    wx.authorize({
                      scope: 'scope.userInfo',
                      success() {
                        console.log('点击开始授权')
                        that.getUser(nickName, avatarUrl, gender, city, userInfo)
                      }
                    })
                  }
                })
              } else if (res.cancel) {
                console.log('用户拒绝把设置打开')
                that.switchFun()
              }
            }
          })
        }else{
          that.switchFun()
        }
      }
    })
  },
  //手指点击抬起最后事件
  switchFun: function () {
    var that = this
    switch (that.data.exp) {
      case "1"://跳到与好友对战页面
        if (that.data.openid) {
          wx.navigateTo({
            url: '../selectCoin/selectCoin?fr=' + that.data.openid,
          })
        }
        break;
      case "2"://快速对战
        if (that.data.openid) {
          wx.navigateTo({
            url: '../selectCoin/selectCoin?fast=1',
          })
        }
        break;
      case "3":
        if (that.data.openid) {
          wx.navigateTo({
            url: '../twoPlayer/twoPlayer',
          })
        }
        break;
      case "4":
        wx.navigateTo({
          url: '../MatchingMore/MatchingMore',
        })
        break;
      case "5"://与大家对战
        if (that.data.openid) {
          wx.navigateTo({
            url: '../selectCoin/selectCoin',
          })
        }
        break;
      case "6":
        that.setData({
          clickEND: true,
        })
        if(that.data.openid){
          wx.request({
            url: "https://wx.yukicomic.com/h5/game/load/score",
            data: {
              openid: that.data.openid,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'  // 默认值
            },
            method: 'POST',
            success: function (res) {
              // that.setData({
              //   currentCoin:res.data.data
              // })
              var currentCoins = parseInt(res.data.data)
              console.log('第五步更新Y币树事件+++++', currentCoins, that.data.clickclickTime)
              that.setData({
                progress: 0,
                durTime: 0,
                currentCoin:0,
                accountCoins_quantity: parseInt(that.data.accountCoins_quantity) + currentCoins
              })
              wx.setStorage({
                key: "accountCoins_quantity",
                data: {
                  'accountCoins_quantity': that.data.accountCoins_quantity
                }
              })
              clearInterval(that.data.sk)
              that.sktime()
              that.data.sk = setInterval(that.sktime, 1000);
            }
          })
        }
        break;
      case "7"://排行榜单
        if (that.data.openid) {
          wx.navigateTo({
            url: '../rankingList/rankingList'
          })
        }
        break;
      case "8":
        this.setData({
          login: false
        })
        break;
      case "9":
        this.setData({
          lackCoin:false
        })
        break;
      case "10":
        var selfCoin = parseInt(that.data.accountCoins_quantity)
        var friendCoin = parseInt(that.data.matchCoin)
        if (selfCoin < 100){
          this.setData({
            lackCoin: true,
            popTips: "您的Y币低于100Y币，无法进行比赛"
          })
        } else if (selfCoin < friendCoin){
          this.setData({
            lackCoin: true,
            popTips: "您的Y币不足以开启本局"
          })
        }else{
          if (that.data.roomId && that.data.reciveInvite) {
            //index地址中带房间号字段，请求后台判断房间号存在与否，存在就直接跳转到两人对局，跳转地址后面加金币
            wx.request({
              url: "https://wx.yukicomic.com/h5/game/match/join",
              data: {
                openid: open,
                roomId: that.data.roomId
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'  // 默认值
              },
              method: 'POST',
              success: function (res) {
                console.log('接受邀请同时判断房间号存在不存在+++++', res)
                //不存在
                wx.redirectTo({
                  url: '../../MatchingMore/MatchingMore?',
                })
              }
            })
          } 
        }
        this.setData({
          inviteFriend:false,
        })
        break;
      case "11":
        this.setData({
          inviteFriend: false,
        })
        break;
    }
  },
  touchStart:function(e){
    var exp = e.currentTarget.dataset.idx;
    switch (exp) {
      case "1":
        this.setData({
          gameFriend:'gameFriendEnd.png'
        })
        break;
      case "2":
        this.setData({
          quickEnter: 'quickEnterEnd.png'
        })
        break;
      case "3":
        this.setData({
          gifts: 'giftsEnd.png'
        })
        break;
      case "4":
        this.setData({
          expect: 'expectEnd.png'
        })
        break;
      case "5":
        this.setData({
          gamePeoples: 'gamePeoplesEnd.png'
        })
        break;
      case "6":
        this.setData({
          Ytree: 'YtreeEnd.gif',
          clickEND:false
        })
        break;
      case "7":
        this.setData({
          rangs: 'rangsEnd.png'
        })
        break;
      case "8":
        this.setData({
          confirm: 'confirmEnd.png',
        })
        break;
      case "9":
        this.setData({
          confirm: 'confirmEnd.png',
        })
        break;
      case "10":
        this.setData({
          confirm: 'confirmEnd.png'
        })
        break;
      case "11":
        this.setData({
          back: 'backEnd.png',
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
          gameFriend: 'gameFriend.png'
        })
        break;
      case "2":
        this.setData({
          quickEnter: 'quickEnter.png'
        })
        break;
      case "3":
        this.setData({
          gifts: 'gifts.png'
        })
        break;
      case "4":
        this.setData({
          expect: 'expect.png'
        })
        break;
      case "5":
        this.setData({
          gamePeoples: 'gamePeoples.png'
        })
        break;
      case "6":
        this.setData({
          Ytree: 'Ytree.png',
        })
        break;
      case "7":
        this.setData({
          rangs: 'rangs.png'
        })
        break;
      case "8":
        this.setData({
          confirm: 'confirm.png',
        })
        break;
      case "9":
        this.setData({
          confirm: 'confirm.png',
        })
        console.log(123)
        break;
      case "10":
        this.setData({
          confirm: 'confirm.png'
        })
        break;
      case "11":
        this.setData({
          back: 'back.png',
        })
        break;
      default:
        console.log("default");
    }
  },
  onShareAppMessage: function (res) {
    var that=this
    return {
      title: '棋逢对手',
      path: '/pages/index/index?inviteName='+that.data.openid,
      imageUrl: '../../img/images/biaoti01_02.png',
      success: function (res) {
        if (that.data.openid){
          wx.request({
            url: "https://wx.yukicomic.com/h5/game/userLogin/receive",//每天分享前三次每次领取300金币
            data: {
              openid: that.data.openid,
              type: 0
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'  // 默认值
            },
            method: 'POST',
            success: function (data) {
              console.log(data)
             if(data.data.code==0){
               var newCoin = parseInt(that.data.accountCoins_quantity)+300
               that.setData({
                 accountCoins_quantity: newCoin
               })
             }
            },
            fail: function (err) {
              wx.showToast({
                title: '您的本次分享未能成功',
                icon: 'none',
                duration: 1000,
                success: function () {
                  wx.reLaunch({
                    url: '/pages/index/index'
                  })
                }
              })
            }
          })
        }    
      }
    }
  }
})
