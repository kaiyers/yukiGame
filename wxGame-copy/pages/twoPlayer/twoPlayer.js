// pages/twoPlayer/twoPlayer.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //动画
    animationBlue:{},
    animationRed: {},
    animationTitle: {},
    loading:{},
    vsAnma:{},
    playerup:{},
    qtAnma:{},
    qaaAnma:{},
    cuanzhuan:{},
    accounts:{},
    //按钮图片
    btnbgi:{
      moren: '../../img/images/btn_moren.png',
      xuanzhong: '../../img/images/xuanzhong.png',
      yes: '../../img/images/btn_yes.png',
      error: '../../img/images/btn_error.png'
    },
    //数据
    roomNo:'', //房间号
    gameAreaShow:false,
    jishiShow:false,
    timu_jieshuan_show:true,
    isWin:true,
    isAgain:false,
    //用户信息
    playerImg: '',
    playerName: '',
    openid: '',
    player01_score:0, //玩家得分
    player01_bar:0, // 玩家分数条
    //对手信息
    player02Img: '',
    player02Name: '',
    openid02: '',
    player02_score:0, //玩家得分
    player02_bar: 0, // 玩家分数条
    num: 30,
    num_show:10,
    jishu: 0,
    timu:[],//题库
    xuanti:{},//当前题目
    tihao:0, //题号
    isSelect:true, //是否已选择，默认未选择
    btnbgiSelctA:'',
    btnbgiSelctB: '',
    btnbgiSelctC: '',
    selectedAnswer:'' ,//所选答案
    socketOpen :false,
    confirm: 'confirm.png',
    lackCoin: false,  //金币不足弹出
    popTips: '', //提示语
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var xuanZhuan = wx.createAnimation({
      duration: 1,
      timingFunction: 'ease',
    })
    xuanZhuan.rotateY(180).step({ duration: 1 });
    this.setData({
      cuanzhuan: xuanZhuan.export(),
    })
    this.resBtn()
    var that = this;
    wx.getStorage({
      key: 'Mes',
      success: function (res) {
        that.setData({
          playerImg: res.data.avatarUrl,
          playerName: res.data.nickName,
          openid: res.data.openid,
        })
        var jetton = parseInt(options.jetton);
        var openid = that.data.openid;
        var people = "2";
        wx.request({
          url: util.Apis + '/h5/game/userLogin/webLogin', 
          header: {
            'content-type': 'application/json' // 默认值
          },
          data: {
            openid: openid
          },
          success: function (res) {
            console.log("建立连接" + res.errMsg)
            //建立连接
            // wx.connectSocket({
            //   url: 'wss://wx.yukicomic.com/h5/webSocket'
            // })
            wx.connectSocket({
              url: 'wss://wx.yukicomic.com/h5/webSocket/',
              header: {
                // 'content-type': 'application/json'
                'content-type':"application/x-www-form-urlencoded"
              },
              method: "GET",
              success: function (res) {
                console.log("创建连接成功,原因因::" + res.errMsg);
              },
              fail: function (res) {
                console.log("创建连接失败,原因因::" + res.errMsg);
              },
              complete: function () {
                console.log("创建连接complete");
              }
            })
            //检测链接成功
            wx.onSocketOpen(function (res) {
              console.log('WebSocket连接已打开！')
              that.setData({
                socketOpen :true
              })
              wx.request({
                url: util.Apis + "/h5/game/match/match",
                // url: 'http://ttioowh.nat300.top/h5/game/match/match',
                method: 'POST',
                data: {
                  gametype: jetton,
                  total: 2,
                  visible: 0,
                  openid: openid
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded' // 默认值
                },
                success: function (res) {
                  console.log("lianjie" + res.data.data)
                  
                  that.setData({
                    roomNo: res.data.data
                  })
                }
              })
            })
            //接收信息
            wx.onSocketMessage(function (data) {
              console.log(data.data)
              if (data.data != "成功建立socket连接"){
                console.log("开始执行本次场景")
                var serverData = JSON.parse(data.data);
                //对手信息及分数
                console.log(serverData)
                if (serverData.openid != openid){
                  console.log("222", serverData.openid)
                  that.setData({
                    player02_score: serverData.score ? value.score : 0,
                    player02_bar: serverData.score / 5 ? value.score / 5 : 0
                  })
                }
                if (serverData.length == 2){
                  serverData.forEach((value) => {
                    if (value.openid != openid) {
                      that.setData({
                        player02Img: value.avatarurl,
                        player02Name: value.nickname,
                        openid02: value.openid,
                        player02_score: value.score ? value.score : 0,
                        player02_bar: value.score / 5 ? value.score / 5 : 0
                      })
                    }
                  })
                }
                if (serverData.length == 5){
                  var timu = util.casting(serverData)
                  that.setData({
                    timu: timu,
                    xuanti: timu[0]
                  })
                  setTimeout(function(){
                    that.matchingComplete()
                  },3000)
                  
                }
              }
            })
            //链接失败
            wx.onSocketError(function (res) {
              console.log('WebSocket连接打开失败，请检查！')
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.loading();
    this.title();
    this.bluePlayer();
    this.redPlayer();
    this.VS();
    this.coutDown_rest()
   // this.matchingComplete()
  },


  //平移动画
  title: function () {
    var animation0 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      transformOrigin: "50% 50% 0"
    });
    this.animation0 = animation0
    setTimeout(function () {
      this.animation0.top(0).step({ duration: 500 });
      this.setData({
        animationTitle: this.animation0.export(),
      })
    }.bind(this), 500)
  },
  //离场
  title_leave(){
    this.animation0.scale(0).opacity(0).step({ duration: 500 });
    this.setData({
      animationTitle: this.animation0.export(),
    })
  },
  //蓝色玩家动画
  bluePlayer:function(){
    var animation1 = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
      transformOrigin: "50% 50% 0"
    });
    setTimeout(function () {
      animation1.translateX(148).step({ duration: 500 });
      this.setData({
        animationBlue: animation1.export(),
      })
    }.bind(this), 750)
  },
  //红色玩家动画
  redPlayer: function () {
    var animation2 = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
      transformOrigin: "50% 50% 0"
    });
    setTimeout(function () {
      animation2.translateX(-148).step({ duration: 500 });
      this.setData({
        animationRed: animation2.export(),
      })
    }.bind(this), 750)
  },
  //匹配中动画
  loading() {
    var animation3 = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
      transformOrigin: "50% 50% 0"
    });
    this.animation3 = animation3
    setTimeout(function () {
      this.animation3.opacity(1).step({ duration: 800 });
      this.setData({
        loading: this.animation3.export(),
      })
    }.bind(this), 850)
  },
  //离场
  loading_leave() {
    this.animation3.translateY(30).opacity(0).step({ duration: 500 });
    this.setData({
      loading: this.animation3.export(),
    })
  },
  //vs动画
  VS() {
    var animation4 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      transformOrigin: "50% 50% 0"
    });
    this.animation4 = animation4
    this.animation4.scale(4).opacity(0).step({ duration: 500 });
    this.setData({
      vsAnma: this.animation4.export(),
    })
    setTimeout(function () {
      this.animation4.scale(1).opacity(1).step({ duration: 500 });
      this.setData({
        vsAnma: this.animation4.export(),
      })
    }.bind(this), 1050)
  },
  //离场
  VS_leave() {
    this.animation4.scale(6).opacity(0).step({ duration: 500 });
    this.setData({
      vsAnma: this.animation4.export()
    })
    setTimeout(function(){
      this.setData({
        jishiShow: true
      })
    }.bind(this),550) 
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu()    //隐藏分享按钮
  },

  //匹配完成
  matchingComplete(){
    console.log("开始")
    this.title_leave();
    this.VS_leave();
    this.loading_leave() ;
    this.playerUp();
    setTimeout(function(){
      this.setData({
        gameAreaShow: true
      })
      this.questionTypesAnima();
    }.bind(this),900)
  },
  //人物上移
  playerUp: function () {
    var animation5 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      transformOrigin: "50% 50% 0"
    });
    animation5.top("10rpx").step({ duration: 500 });
    this.setData({
      playerup: animation5.export(),
    })
  },
  //题目类型动画效果
  questionTypesAnima(){
    if(this.data.tihao<5){
      var animationQTA = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
        transformOrigin: "50% 50% 0"
      });
      this.animationQTA = animationQTA
      this.animationQTA.scale(2).top("120rpx").step({ duration: 500 });
      this.setData({
        qtAnma: this.animationQTA.export(),
      })
      setTimeout(function () {
        this.animationQTA.scale(1).top("-37rpx").step({ duration: 500 });
        this.setData({
          qtAnma: this.animationQTA.export(),
        })
      }.bind(this), 1050);
      setTimeout(function () {
        this.questionAnswerAnima()
      }.bind(this), 2000);
    }else{
// 题目已答完
      clearInterval(this.timer) //关闭计时器（防止计时器冲突）
      this.setData({
        jishiShow:false,
        timu_jieshuan_show:false
      })
      this.accountsAnima()   // 结算动画入场
    }
    
  },
  //离场
  questionTypesAnima_leave() {
    this.animationQTA.scale(0).step({ duration: 300 });
    this.setData({
      qtAnma: this.animationQTA.export(),
    })
  },
  //问题及答案动画
  questionAnswerAnima(){
    clearInterval(this.timer) //关闭计时器（防止计时器冲突）
    var animationQAA = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      transformOrigin: "50% 50% 0"
    });
    this.animationQAA = animationQAA
    this.animationQAA.left(0).step({ duration: 500 });
    this.coutDown(); // 开启计时器
    this.setData({
      qaaAnma: this.animationQAA.export(),
    })
  },
  //离场
  questionAnswerAnima_leave() {
    this.animationQAA.left("100vw").step({ duration: 300 });
    this.setData({
      qaaAnma: this.animationQAA.export(),
    })
  },
  //结算动画
  accountsAnima() {
    var animationAcc = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      transformOrigin: "50% 50% 0"
    });
    this.animationAcc = animationAcc
    this.animationAcc.left(0).step({ duration: 500 });
    this.setData({
      accounts: this.animationAcc.export(),
    })
  },
  //倒计时重置
  coutDown_rest(){
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
    cxt_arc.setLineWidth(10);
    cxt_arc.setStrokeStyle('#a7a1e0');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(32, 30, 25, -Math.PI * 10 / 20, Math.PI * 30 / 20, false);
    cxt_arc.stroke();//对当前路径进行描边  
    cxt_arc.draw();
    cxt_arc.clearRect(0, 0, 200, 200)
  },
  // 倒计时
  coutDown() {
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
    var num = this.data.num;
    var jishu = this.data.jishu;
    var num_show = this.data.num_show;
    var that = this;
    var timer = setInterval(function () {
      num -= 0.1;
      // 页面渲染完成    
      cxt_arc.setLineWidth(10);
      if (num_show<4){
        cxt_arc.setStrokeStyle('#f8a445');
      }else{
        cxt_arc.setStrokeStyle('#a7a1e0');
      }
      
      cxt_arc.setLineCap('round')
      cxt_arc.beginPath();//开始一个新的路径  
      cxt_arc.arc(32, 30, 25, -Math.PI * 10 / 20, Math.PI * num / 20, false);
      cxt_arc.stroke();//对当前路径进行描边  
      cxt_arc.draw();
      cxt_arc.clearRect(0, 0, 200, 200)
      if (num <= -10) {
        clearInterval(timer);
        that.decide(); //倒计时结束判定答案
        setTimeout(function(){
          that.luu() //切换到下一题
        },1000)
       
      }
      jishu++
      if (jishu % 40 == 0) {
        num_show--;
        if (num_show <= 0){
          num_show = "时间到"
        }
        that.setData({
          num_show: num_show
        })
      }
      that.setData({
        jishu: jishu
      })
    }, 25)
    this.timer = timer
  },
  //切换下一题动画效果
  luu() {
    this.questionTypesAnima_leave();
    this.questionAnswerAnima_leave();
    
    setTimeout(function () {
      this.selectAnswer()   //切换题目
    }.bind(this), 600);
    // clearInterval(this.timer)
    // setTimeout(function () {
    //   this.questionTypesAnima();// 题目类型提示
    //   this.setData({
    //     jishu:0,
    //     num_show:10
    //   })
    // }.bind(this), 1200);
  },
  //题目切换
  selectAnswer(){
    this.resBtn() // 重置答题选项
    var timu = this.data.timu;
    var tihao = this.data.tihao;
    tihao++;
    if(tihao<5){
      this.setData({
        xuanti: timu[tihao]
      })
    }
    this.questionTypesAnima_leave(); //题目动画离场
    this.questionAnswerAnima_leave();//题目答案离场
    setTimeout(function () {
      this.questionTypesAnima(); // 题目入场
      this.coutDown_rest()
      this.setData({
        jishu: 0,
        num_show: 10
      })
    }.bind(this), 1200);
  
    this.setData({
      tihao:tihao
    });

  },
  //按钮重置
  resBtn(){
    var btnbgi = this.data.btnbgi
    this.setData({
      btnbgiSelctA: btnbgi.moren,
      btnbgiSelctB: btnbgi.moren,
      btnbgiSelctC: btnbgi.moren,
      isSelect:true,
      selectedAnswer:''
    })
  },
  // 选择答案
  selectA(){
    if (this.data.isSelect){
      var btnbgi = this.data.btnbgi
      this.setData({
        btnbgiSelctA: btnbgi.xuanzhong,
        isSelect: false,
      })
      this.decide("a")
    }
  },
  selectB() {
    if (this.data.isSelect) {
      var btnbgi = this.data.btnbgi
      this.setData({
        btnbgiSelctB: btnbgi.xuanzhong,
        isSelect: false,
      })
      this.decide("b")
    }
  },
  selectC() {
    if (this.data.isSelect) {
      var btnbgi = this.data.btnbgi
      this.setData({
        btnbgiSelctC: btnbgi.xuanzhong,
        isSelect: false,
      })
      this.decide("c")
    }
  },
  // 判定答案
  decide(selectedAnswer){
    var timu = this.data.timu;
    var tihao = this.data.tihao;
    var btnbgi = this.data.btnbgi
    this.setData({
      isSelect: false,
    })
    if (selectedAnswer == timu[tihao].correctOption){
      if (timu[tihao].correctOption == "a") {
        this.setData({
          btnbgiSelctA: btnbgi.yes,
        })
      } else if (timu[tihao].correctOption == "b"){
        this.setData({
          btnbgiSelctB: btnbgi.yes,
        })
      } else if (timu[tihao].correctOption == "c") {
        this.setData({
          btnbgiSelctC: btnbgi.yes,
        })
      }
      this.getTime()
    }else{
      if (selectedAnswer == "a") {
        this.setData({
          btnbgiSelctA: btnbgi.error,
        })
      } else if (selectedAnswer == "b") {
        this.setData({
          btnbgiSelctB: btnbgi.error,
        })
      } else if (selectedAnswer == "c") {
        this.setData({
          btnbgiSelctC: btnbgi.error,
        })
      }
      if (timu[tihao].correctOption == "a") {
        this.setData({
          btnbgiSelctA: btnbgi.yes,
        })
      } else if (timu[tihao].correctOption == "b") {
        this.setData({
          btnbgiSelctB: btnbgi.yes,
        })
      } else if (timu[tihao].correctOption == "c") {
        this.setData({
          btnbgiSelctC: btnbgi.yes,
        })
      }
    }
  },
  //与服务器通讯
  setInfomation(score){
    var roomId = this.data.roomNo;
    var openid = this.data.openid;
    console.log("发送数据" + roomId, openid, score)
    // var params = [];
    // params.push({ "roomNo": roomNo, "openid": openid, "score": score });
    // var json = JSON.stringify(params);  

    // var json = [];
    // var j = {};
    // j.roomNo = roomNo;
    // j.openid = openid;
    // j.score = score;
    // json.push(j);
    // var a = JSON.stringify(json);
    // console.log(json,a)
    var json = '{\"roomId\":\"' + roomId + '\",\"openid\": \"' + openid + '\",\"score\":\"' + score + '\"}'
    if (this.data.socketOpen){
      //向服务器发送数据
      wx.sendSocketMessage({
        data: json
      })
    }
  },
  //获取倒计时时间并计算得分
  getTime() {
    var num_show = this.data.num_show; 
    var player01_score = this.data.player01_score;
    var player01_bar = this.data.player01_bar;
    if (num_show>8){
      player01_score += 100;
    } else if (num_show > 6){
      player01_score += 80;
    } else if (num_show > 4) {
      player01_score += 60;
    } else if (num_show > 2) {
      player01_score += 40;
    }else{
      player01_score += 20;
    } 
    player01_bar = player01_score/5
    this.setInfomation(player01_score);
    this.setData({
      player01_score: player01_score,
      player01_bar:player01_bar
    })
  },
  //再来一局
  rmrematch(){
    this.setData({
      isAgain:true
    })
    wx.redirectTo({
      url: '../twoPlayer/twoPlayer'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearInterval(this.timer) //关闭计时器（防止计时器冲突）
    if (this.data.socketOpen){
      wx.closeSocket()
      console.log("监听页面隐藏")
    }
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.timer) //关闭计时器（防止计时器冲突）
    if (!this.data.isAgain){
      wx.navigateBack({
        delta: 2
      })
    }
    if (this.data.socketOpen) {
      wx.closeSocket()
      console.log("监听页面卸载")
    }
    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
    })
  },
  onShareAppMessage: function (res) {//分享
    return {
      title: '棋逢对手',
      path: '/pages/index/index?inviteId=' + this.data.openid + '&matchCoin' + this.data.matchCoin + '&peopleNumber' +this.data.peopleNumber + '&inviteFace' + vlogo,
      imageUrl: '../../img/images/biaoti01_02.png',
      success: function (res) {
        if (that.data.openid) {
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
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }
          })
        }
      },
      fail: function (err) {
        wx.showToast({
          title: '您的本次分享未能成功',
          icon: 'none',
          duration: 1000,
          success:function(){
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        })
      }
    }
  }
})