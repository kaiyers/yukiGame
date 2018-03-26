//index.js
const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
    confirm:'confirm.png',
    vlogo: '../../img/face.png',
    name: 'Yuki动漫',
    confirm: 'confirm.png',
    peopleNumber:0,
    usefulCoupon:[],
    mask:false,
    lackCoin:false,
    popTips:'您的Y币不足以开启本局',
    popTips:'',
    titleIn:false,
    titleOut: false,
    peopleIn: false,
    peopleOut: false,
    matePeopleIn:false,
    matePeopleOut: false,
    headerIn: false,
    newGoodsContainIn: false,
    game_areaIn: false,
    game_areaOut: false,
    matingBlock: false,
    questionAnswer:false,
    currentPeople:0,
    openid:'',
    machCoin:'',
    progress: 30,
    sdurTime: 10,
    before: false,
    balance: false,
    progress: 0,
    countdowns: 200,
    lackCoin: false,
    winName:'Yuki动漫',
    winFace:'../../img/face.png',
    winProgress:0,
    listnews: [
      {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      }, {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      },
      {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      },
      {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      },
      {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      },
      {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      },
      {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      },
      {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      },
      {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      }, {
        pic: "../../img/face.png",
        name: 'Yuki动漫',
        coin: 300
      },
      {
        name: 'Yuki动漫',
        coin: 300
      }
    ],
    //动画
    qtAnma: {},
    qaaAnma: {},
    accounts: {},
    //按钮图片
    normalBtn: '../../img/images/btn_moren.png',
    clickBtn: '../../img/images/xuanzhong.png',
    correctBtn: '../../img/images/btn_yes.png',
    errBtn: '../../img/images/btn_error.png',
    btnS: [],
    //数据
    jishiShow: true,
    timu_jieshuan_show: true,
    isWin: true,
    num: 30,
    num_show: 10,
    jishu: 0,
    timu: [],//题库
    xuanti: {},//当前题目
    tihao: 0, //题号
    isSelect: true, //是否已选择，默认未选择
    selectedAnswer: -1,
    btnTime:0,
    accountCoins_quantity:100
  },
  onLoad: function (options){
    var that=this
    wx.hideShareMenu()
    that.setData({
      btnS:[
        {
          bg: that.data.normalBtn,
          msg:'a'
        },
        {
          bg: that.data.normalBtn,
          msg:'b'
        }, 
        {
          bg: that.data.normalBtn,
          msg:'c'
        }
      ]
    })
    if (options.peopleNumber){
      that.setData({
        peopleNumber: options.peopleNumber
      })
    }
    if (options.machCoin) {
      var machCoin = parseInt(machCoin)
      that.setData({
        machCoin: machCoin
      })
    }
    this.setData({
      matingBlock: true
    })
    for (let i = 0; i < this.data.peopleNumber;i++){
      this.data.usefulCoupon.push({
        face: "../../img/greyFace.png",
        name: '???',
        sMove: false
      })
    }
    wx.getStorage({
      key: 'accountCoins_quantity',
      success: function (res) {
        var accountCoins_quantity = parseInt(res.data.accountCoins_quantity)
        that.setData({
          accountCoins_quantity: accountCoins_quantity
        })
      }
    })
    wx.getStorage({
      key: 'Mes',
      success: function (res) {
        that.setData({
          vlogo: res.data.avatarUrl,
          name: res.data.nickName,
          openid: res.data.openid
        })
        that.data.usefulCoupon[0] ={
          face: that.data.vlogo,
          name: that.data.name,
          sMove: true
        }
        that.setData({
          usefulCoupon: that.data.usefulCoupon
        })
        for (let i = 0; i < that.data.usefulCoupon.length; i++) {
          if (that.data.usefulCoupon[i].sMove) {
            that.data.currentPeople++
          }
        }
        that.setData({
          currentPeople: that.data.currentPeople
        })
        if (that.data.currentPeople == that.data.peopleNumber) {
          wx.navigateTo({
            url: '../MultipleAnswers/MultipleAnswers?jetton=' + that.data.machCoin+ '&num=' + that.data.peopleNumber
          })
        }
      }
    })
  },
  onReady:function(){
    setTimeout(function(){//配配中的标题出来
      this.setData({
        titleIn: true,
      })
    }.bind(this),500)
    setTimeout(function () {//配配中的头像数组出来
      this.setData({
        peopleIn: true,
      })
    }.bind(this), 2000)
    setTimeout(function () {//配配中的底部文字出来
      this.setData({
        matePeopleIn: true,
      })
    }.bind(this), 2000)
    setTimeout(function () {//配配中的底部文字出来
      this.begainMach()
    }.bind(this), 5000)
  },
  //匹配画面离开，答题画面出来
  begainMach:function(){
    this.setData({
      titleIn: false,
      titleOut:true,
      peopleIn: false,
      peopleOut: true,
      matePeopleIn: false,
      matePeopleOut: true,
    })
      this.questionTypesAnima();
      this.coutDown_rest()
      this.setData({
        matingBlock: false,
        headerIn: true,
        newGoodsContainIn: true,
        game_areaIn: true,
        game_areaOut: false,
      })
      var timu = [
        {
          "question": "题目1",
          "optiona": "a111",
          "optionb": "b111",
          "optionc": "c111",
          "correctOption": "a",
          "level": 1,
          "questiontypes": 7
        },
        {
          "question": "题目2",
          "optiona": "a222",
          "optionb": "b222",
          "optionc": "c222",
          "correctOption": "b",
          "level": 1,
          "questiontypes": 2
        },
        {
          "question": "题目3",
          "optiona": "a",
          "optionb": "b",
          "optionc": "c",
          "correctOption": "c",
          "level": 1,
          "questiontypes": 5
        },
        {
          "question": "题目4",
          "optiona": "a",
          "optionb": "b",
          "optionc": "c",
          "correctOption": "a",
          "level": 1,
          "questiontypes": 6
        },
        {
          "question": "题目5",
          "optiona": "a",
          "optionb": "b",
          "optionc": "c",
          "correctOption": "b",
          "level": 1,
          "questiontypes": 6
        }
      ]
      timu = util.casting(timu)
      timu.forEach((value, index) => {
        switch (value.correctOption) {
          case 'a':
            value.correctOption = 0
            break;
          case 'b':
            value.correctOption = 1
            break;
          case 'c':
            value.correctOption = 2
            break;
        }
      })
      this.setData({
        timu: timu,
        xuanti: timu[0]
      })
      this.resBtn()
  },
  //题目类型动画效果
  questionTypesAnima() {
    if (this.data.tihao < 1) {
      var animationQTA = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
        transformOrigin: "50% 50% 0"
      });
      this.animationQTA = animationQTA//标题出来动画
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
      setTimeout(function () {//题目选项出来动画
        this.setData({
          questionAnswer:true
        })
        this.questionAnswerAnima()
      }.bind(this), 2000);
    }
  },
  //标题离场
  questionTypesAnima_leave() {
    this.animationQTA.scale(0).step({ duration: 300 });
    this.setData({
      qtAnma: this.animationQTA.export(),
    })
  },
  //问题及答案动画
  questionAnswerAnima() {
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
  //题目离场
  questionAnswerAnima_leave() {
    this.animationQAA.left("100vw").step({ duration: 300 });
    this.setData({
      qaaAnma: this.animationQAA.export(),
    })
  },
  //倒计时重置
  coutDown_rest() {
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
    cxt_arc.setLineWidth(6);
    cxt_arc.setStrokeStyle('#a7a1e0');
    cxt_arc.setLineCap('round')
    cxt_arc.beginPath();//开始一个新的路径  
    cxt_arc.arc(32, 30, 25, -Math.PI * 10 / 20, Math.PI * 30 / 20, false);
    cxt_arc.stroke();//对当前路径进行描边  
    cxt_arc.draw();

  },
  // 倒计时
  coutDown() {
    var cxt_arc = wx.createCanvasContext('canvasArc');//创建并返回绘图上下文context对象。
    var num = this.data.num;//30
    var jishu = this.data.jishu;//0
    var num_show = this.data.num_show;//倒计时显示的数字10
    var that = this;
    var timer = setInterval(function () {
      num -= 0.1;
      // 页面渲染完成    
      cxt_arc.setLineWidth(6);
      if (num_show < 6) {
        cxt_arc.setStrokeStyle('#f8a445');
      } else {
        cxt_arc.setStrokeStyle('#a7a1e0');
      }
      cxt_arc.setLineCap('round')
      cxt_arc.clearRect(0, 0, 200, 200)
      cxt_arc.beginPath();//开始一个新的路径  
      cxt_arc.arc(32, 30, 25, -Math.PI * 10 / 20, Math.PI * num / 20, false);
      cxt_arc.stroke();//对当前路径进行描边  
      cxt_arc.draw();
      if (num <= -10) {
        clearInterval(timer);
        that.decide(); //倒计时结束判定答案
        that.setData({
          tihao: that.data.tihao + 1
        })
        console.log('tihao1', that.data.tihao)
        if (that.data.tihao < 1) {
          console.log('tihao2', that.data.tihao)
          setTimeout(function () {
            that.luu() //切换到下一题
          }, 1000)
        } else {
          console.log('答题结束')
          clearInterval(that.timer) //关闭计时器（防止计时器冲突）
          // setTimeout(function () {
          //   that.setData({
          //     balance: true,
          //     before: true
          //   })
          // }, 1000)  
        }
      }
      jishu++
      if (jishu % 40 == 0) {
        num_show--;
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
  },
  //题目切换
  selectAnswer() {
    this.resBtn() // 重置题目背景
    var timu = this.data.timu;//题库
    var tihao = this.data.tihao;
    if (tihao < 5) {
      this.setData({
        xuanti: timu[tihao]
      })
    }
    setTimeout(function () {
      this.questionTypesAnima(); // 题目重新入场
      this.coutDown_rest()
      this.setData({
        jishu: 0,
        num_show: 10
      })
    }.bind(this), 1200);

    this.setData({
      tihao: tihao
    });

  },
  //按钮重置
  resBtn() {
    this.setData({
      btnS: [
        {
          bg: this.data.normalBtn,
          msg: 'a'
        },
        {
          bg: this.data.normalBtn,
          msg: 'b'
        },
        {
          bg: this.data.normalBtn,
          msg: 'c'
        }
      ],
      isSelect: true,
      selectedAnswer: -1
    })
  },
  //按下答案按钮事件
  myAnswer: function (e){
    if (this.data.isSelect){
      var idx = e.currentTarget.dataset.idx;
      this.data.btnS[idx].bg = this.data.clickBtn
      this.setData({
        selectedAnswer: idx,
        isSelect: false,
        btnS: this.data.btnS,
        btnTime: this.data.num_show
      })
    }else{
      console.log('this.data.isSelect', this.data.isSelect)
    }
  },
  // 按下答案按钮以及判定答案综合
  decide() {
    var that=this
    var timu = this.data.timu;//题库
    var tihao = this.data.tihao;//第几题
    var correctNum = timu[tihao].correctOption
    console.log("correctNum+++++++", correctNum, that.data.btnTime)
    if (!that.data.isSelect){
      if (correctNum==that.data.selectedAnswer) {//正确选中
        that.data.btnS[0].bg = that.data.correctBtn
      } else if (correctNum == that.data.selectedAnswer){
        that.data.btnS[1].bg = that.data.correctBtn
      } else if (correctNum ==that.data.selectedAnswer){
        that.data.btnS[2].bg = that.data.correctBtn
      }else{
        that.data.btnS[correctNum].bg = that.data.errBtn
      }
      that.coinRule()
      that.setData({
        btnS: that.data.btnS
      })
    }
  },
  //分数规则
  coinRule: function () {
    var that = this
    var btnTime = parseInt(that.data.btnTime)
    if (btnTime > 8) {
      that.setData({
        progress: that.data.progress + 100,
        accountCoins_quantity: that.accountCoins_quantity+100
      })
    } else if (btnTime > 6) {
      that.setData({
        progress: that.data.progress + 80,
        accountCoins_quantity: that.accountCoins_quantity + 80
      })
    } else if (btnTime > 4) {
      that.setData({
        progress: that.data.progress + 60,
        accountCoins_quantity: that.accountCoins_quantity + 80
      })
    } else if (btnTime > 2) {
      that.setData({
        progress: that.data.progress + 40,
        accountCoins_quantity: that.accountCoins_quantity + 80
      })
    } else if (btnTime > 0) {
      that.setData({
        progress: that.data.progress + 20,
        accountCoins_quantity: that.accountCoins_quantity + 20
      })
    }
    wx.setStorage({
      key: "accountCoins_quantity",
      data: {
        'accountCoins_quantity': that.data.accountCoins_quantity
      }
    })
  },
  //再来一局
  rmrematch() {
    this.accountsAnima_leave()
    wx.getStorage({
      key: 'accountCoins_quantity',
      success: function (res) {
        var accountCoins_quantity = parseInt(res.data.accountCoins_quantity)
        if (accountCoins_quantity < this.data.machCoin){
          if (accountCoins_quantity < 100){
            this.setData({
              lackCoin: true,
              popTips: "您的Y币低于100Y币，无法进行比赛"
            })
          }else{
            this.setData({
              lackCoin: true,
              popTips: "您的Y币不足以开启本局"
            })
          }
        } else {
          //走fastmach接口
        }
      }
    })
    setTimeout(() => {
      wx.redirectTo({
        url: '../twoPlayer/twoPlayer'
      })
    }, 550)
  },
  onHide: function () {
    clearInterval(this.timer) //关闭计时器（防止计时器冲突）
  },
  onUnload: function () {
    clearInterval(this.timer) //关闭计时器（防止计时器冲突）
    wx.navigateBack({
      delta: 4
    })
  },
  //金币不足确定按钮
  touchStart:function (){
    this.setData({
      confirm: 'confirmEnd.png',
    })
  },
  touchEnd:function(){
    this.setData({
      confirm: 'confirm.png',
      lackCoin: false,
    })
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  onShareAppMessage: function (res) {//分享
    return {
      title: '棋逢对手',
      path: '/pages/index/index?inviteId=' + this.data.openid + '&matchCoin' + this.data.matchCoin + '&peopleNumber' + this.data.peopleNumber + '&inviteFace' + vlogo,
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
          success: function () {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        })
      }
    }
  }
})
