// pages/details/details.js
var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
var app = getApp()
Page({
  data: {
    uid:'',
    goodsID:'',
    isLike: '',
    bannerList: [],
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
    goodsName: '',
    goodSecondName:'',
    goodsTag: '',
    orderSale: '',
    goodsH5: '',
    goodsPrice: '',
    popupShow:false,
    enterShow: true,
    singleComment:{},//商品评价
    singleCommentNum: 0,//商品评价
    goodsPropertyList1: [], // 商品样式1
    goodsPropertyList2: [], // 商品样式2
    goodsPropertyList3: [], // 商品样式3
    goodsPropertyList4: [], // 商品样式4
    goodsPropertyList5: [], // 商品样式5
    hb1: '',
    hb2: '',
    hb3: '',
    hb4: '',
    hb5: '',
    goodsSkuList: [], // 样式对比
    // input默认是1 
    num: 1,
    // 使用data数据对象设置样式名 
    minusStatus: 'minDisabled',
    maxusStatus: 'maxNormal',
    currentItem1:'',
    currentItem2: '',
    currentItem3: '',
    currentItem4: '',
    currentItem5: '',
    // 动态改变弹窗商品信息
    skprices: '',
    skclassifys: '',
    skclassimgs: '',
    skstockNum: '',
    isTimebuy:'',
    skuid:'',
    durTime:'',
    countdowns:'',
    countdownsH: '',
    countdownsM: '',
    countdownsS: '',
    descShow:false,
    showModal: false,
    carIcon:'',
    isNowbuy:false,
    idx:'',
    salePrice:'',
    goodMinPrice:''
  },
  onShow:function(){
    this.setData({
      carIcon: app.globalData.carIcon
    })
    console.log(app.globalData.carIcon)
  },
  //页面预加载
  onLoad: function (options) {
    var that = this;
    that.setData({
      goodsID: options.gsid,
    })
    if (options.idx){
      that.setData({
        idx: options.idx
      })
    }
    if (options.goodMinPrice) {
      that.setData({
        goodMinPrice: options.goodMinPrice
      })
    }
    if (options.salePrice) {
      that.setData({
        salePrice: options.salePrice
      })
    }
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data,
          infor: true
        });
        if (that.data.uid != '11111111111a') {
          wx.request({
            url: util.Apis + '/h5/h5good/findGoodDetail',
            method: 'POST',
            data: {
              goodid: that.data.goodsID,
              userid: that.data.uid,
              sortText: 'desc'
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log("数据",res)
              //循环最大最小价格
              var jiaGe = [];
              var maxPrice = 0;
              var minPrice = 0;
              var showsPrice = '';
              var kucun = 0;
              res.data.data.goodDetailBean.skuList.forEach((value, index) => {
                jiaGe.push(value.nowPrice);
                kucun += parseInt(value.stockNum)
              });
           
              maxPrice = Math.max.apply(null, jiaGe);
              minPrice = Math.min.apply(null, jiaGe);
              if (maxPrice == minPrice) {
                showsPrice = (minPrice / 100).toFixed(2)
              } else {
                showsPrice = (minPrice / 100).toFixed(2) + "~" + (maxPrice / 100).toFixed(2)
              };
              // 用来判断所选的商品类型类别
              var newsSkuList = [];
              res.data.data.goodDetailBean.skuList.forEach(function (value) {
                newsSkuList[value.skuidText] = value
              });
              // 提取商品类型
              var propertyList_0 = [];
              var propertyList_1 = [];
              var propertyList_2 = [];
              var propertyList_3 = [];
              var propertyList_4 = [];
              //提取第一个类型做判断
              propertyList_0.push(res.data.data.goodDetailBean.propertyList[0]);
              //提取第二个类型做判断
              if (res.data.data.goodDetailBean.propertyList[1] !== undefined) {
                propertyList_1.push(res.data.data.goodDetailBean.propertyList[1])
              }
              //提取第三个类型做判断
              if (res.data.data.goodDetailBean.propertyList[2] !== undefined) {
                propertyList_2.push(res.data.data.goodDetailBean.propertyList[2])
              }
              //提取第四个类型做判断
              if (res.data.data.goodDetailBean.propertyList[3] !== undefined) {
                propertyList_3.push(res.data.data.goodDetailBean.propertyList[3])
              }
              //提取第五个类型做判断
              if (res.data.data.goodDetailBean.propertyList[4] !== undefined) {
                propertyList_4.push(res.data.data.goodDetailBean.propertyList[4])
              }
              console.log(res.data.data.goodDesc)
              if (res.data.data.goodDesc){
                var goodXiang = res.data.data.goodDesc.split('</p>')
                var numkl = goodXiang.length - 3
                var dsecgood = goodXiang.splice(1, numkl).join('</p>')
                /* html解析示例 */
                var article = dsecgood
                WxParse.wxParse('article', 'html', article, that, 0);
              }
              var singleComments = res.data.data.singleComment
              if (singleComments){
                singleComments.userName = that.mstr(singleComments.userName)
                that.setData({
                  singleComment: singleComments
                })
              }else{
                that.setData({
                  singleComment: false
                })
              }
             console.log(res)
              //默认显示款式
              var ssd = res.data.data.goodDetailBean.skuList
              that.setData({
                singleCommentNum: res.data.data.allcount,
                bannerList: res.data.data.goodDetailBean.picList,
                goodsName: res.data.data.goodDetailBean.goodName,
                goodSecondName: res.data.data.goodDetailBean.goodSecondName,
                goodsTag: res.data.data.goodDetailBean.goodTag,
                orderSale: res.data.data.orderSale == null ? '' : res.data.data.orderSale,
                singleComment: res.data.data.singleComment ? res.data.data.singleComment : false,
                goodsH5: res.data.data.goodDetailBean.goodDescUrl,
                goodsPrice: showsPrice,
                goodsPropertyList1: propertyList_0,
                goodsPropertyList2: propertyList_1,
                goodsPropertyList3: propertyList_2,
                goodsPropertyList4: propertyList_3,
                goodsPropertyList5: propertyList_4,
                goodsSkuList: newsSkuList,
                skprices: showsPrice,
                skclassifys: '规格属性',
                skclassimgs: ssd[0].skuPic,
                skstockNum: kucun,
                isTimebuy: res.data.data.isTimeGood,
                durTime: parseInt((res.data.data.endTime - res.data.data.thisTime) / 1000),
                isLike: res.data.data.goodDetailBean.userCollectionState
              })
              if (that.data.durTime <= 0) {
                that.setData({
                  countdowns: '00:00:00'
                })
              } else {
                that.sktime()
                var sk = setInterval(that.sktime, 1000);
              }
            }
          })
        }else{
          wx.request({
            url: util.Apis + '/h5/h5good/findGoodDetail',
            method: 'POST',
            data: {
              goodid: that.data.goodsID,
              sortText: 'asc'
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
            
              //循环最大最小价格
              var jiaGe = [];
              var maxPrice = 0;
              var minPrice = 0;
              var showsPrice = '';
              res.data.data.goodDetailBean.skuList.forEach((value, index) => {
                jiaGe.push(value.nowPrice)
              });
              maxPrice = Math.max.apply(null, jiaGe);
              minPrice = Math.min.apply(null, jiaGe);
              if (maxPrice == minPrice) {
                showsPrice = (minPrice / 100).toFixed(2)
              } else {
                showsPrice = (minPrice / 100).toFixed(2) + "~" + (maxPrice / 100).toFixed(2)
              };
              // 用来判断所选的商品类型类别
              var newsSkuList = [];
              res.data.data.goodDetailBean.skuList.forEach(function (value) {
                newsSkuList[value.skuidText] = value
              });
              // 提取商品类型
              var propertyList_0 = [];
              var propertyList_1 = [];
              var propertyList_2 = [];
              var propertyList_3 = [];
              var propertyList_4 = [];
              //提取第一个类型做判断
              propertyList_0.push(res.data.data.goodDetailBean.propertyList[0]);
              //提取第二个类型做判断
              if (res.data.data.goodDetailBean.propertyList[1] !== undefined) {
                propertyList_1.push(res.data.data.goodDetailBean.propertyList[1])
              }
              //提取第三个类型做判断
              if (res.data.data.goodDetailBean.propertyList[2] !== undefined) {
                propertyList_2.push(res.data.data.goodDetailBean.propertyList[2])
              }
              //提取第四个类型做判断
              if (res.data.data.goodDetailBean.propertyList[3] !== undefined) {
                propertyList_3.push(res.data.data.goodDetailBean.propertyList[3])
              }
              //提取第五个类型做判断
              if (res.data.data.goodDetailBean.propertyList[4] !== undefined) {
                propertyList_4.push(res.data.data.goodDetailBean.propertyList[4])
              }
              if (res.data.data.goodDesc) {
                var goodXiang = res.data.data.goodDesc.split('</p>')
                var numkl = goodXiang.length - 3
                var dsecgood = goodXiang.splice(1, numkl).join('</p>')
                /* html解析示例 */
                var article = dsecgood
                WxParse.wxParse('article', 'html', article, that, 0);
              }
              //默认显示款式
              var ssd = res.data.data.goodDetailBean.skuList
              that.setData({
                bannerList: res.data.data.goodDetailBean.picList,
                goodsName: res.data.data.goodDetailBean.goodName,
                goodSecondName: res.data.data.goodDetailBean.goodSecondName,
                goodsTag: res.data.data.goodDetailBean.goodTag,
                orderSale: res.data.data.orderSale == null ? '' : res.data.data.orderSale,
                singleComment: res.data.data.singleComment ? res.data.data.singleComment : false,
                goodsH5: res.data.data.goodDetailBean.goodDescUrl,
                goodsPrice: showsPrice,
                goodsPropertyList1: propertyList_0,
                goodsPropertyList2: propertyList_1,
                goodsPropertyList3: propertyList_2,
                goodsPropertyList4: propertyList_3,
                goodsPropertyList5: propertyList_4,
                goodsSkuList: newsSkuList,
                skprices: showsPrice,
                skclassifys: '规格属性',
                skclassimgs: ssd[0].skuPic,
                skstockNum: kucun,
                isTimebuy: res.data.data.isTimeGood,
                durTime: parseInt((res.data.data.endTime - res.data.data.thisTime) / 1000),
                isLike: res.data.data.goodDetailBean.userCollectionState
              })
              if (that.data.durTime <= 0) {
                that.setData({
                  countdowns: '00:00:00'
                })
              } else {
                that.sktime()
                var sk = setInterval(that.sktime, 1000);
              }
            }
          })
        }
      }
    })
    /*初始化emoji设置*/
    WxParse.emojisInit('[]', "/wxParse/emojis/", {
      "00": "00.gif",
      "01": "01.gif",
      "02": "02.gif",
      "03": "03.gif",
      "04": "04.gif",
      "05": "05.gif",
      "06": "06.gif",
      "07": "07.gif",
      "08": "08.gif",
      "09": "09.gif",
      "09": "09.gif",
      "10": "10.gif",
      "11": "11.gif",
      "12": "12.gif",
      "13": "13.gif",
      "14": "14.gif",
      "15": "15.gif",
      "16": "16.gif",
      "17": "17.gif",
      "18": "18.gif",
      "19": "19.gif",
    });
  },
  onUnload: function () {
    var backisCollected=''
    if (this.data.isLike){
      backisCollected=1
    }else{
      backisCollected = 0
    }
    app.globalData.backisCollected = backisCollected
    if(this.data.idx){
      app.globalData.backidx = this.data.idx
    }
    console.log('1111111111111112343',app.globalData.backisCollected, app.globalData.backidx)
  },
  //处理名字
  mstr:function (val) {
    var str = val.toString()
    var str1 = str.substring(1, str.length - 1)
    var str2 = ""
    for (var i = 0; i < str1.length; i++) {
      str2 += '*'
    }
    var newstr = str.substring(0, 1) + str2 + str.substring(str.length - 1);
    return newstr
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
      wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.bannerList // 需要预览的图片http链接列表  
    })
  },
  // 收藏
  addLike() {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data,
          infor: true
        });
        if (that.data.uid != '11111111111a') {
          if (!that.data.isLike) {
            that.setData({
              isLike: !that.data.isLike
            });
            wx.request({
              url: util.Apis + '/h5/h5collection/addCollection',
              method: 'POST',
              data: {
                goodId: that.data.goodsID,
                userId: that.data.uid,
              },
              header: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
              },
            })
          } else {
            that.setData({
              isLike: !that.data.isLike
            });
            wx.request({
              url: util.Apis + '/h5/h5collection/deleteCollection',
              method: 'POST',
              data: {
                goodId: that.data.goodsID,
                userId: that.data.uid,
              },
              header: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
              },
            })
          }
        }else{
          wx.showModal({
            content: '请先绑定或注册',
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: "../register/register"
              })
            }
          });
        }
      }
    })
  },
  /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减 
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态 
    var minusStatus = num <= 1 ? 'minDisabled' : 'minNormal';
    var maxusStatus = num <= this.data.skstockNum ? 'maxNormal' : 'maxDisabled'
    // 将数值与状态写回 
    this.setData({
      num: num,
      minusStatus: minusStatus,
      maxusStatus: maxusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    if (this.data.skuid){
      var num = this.data.num;
      // 不作过多考虑自增1 
      num++;
      // 只有大于一件的时候，才能normal状态，否则disable状态 
      var minusStatus = num > 1 ? 'minNormal' : 'minDisabled';
      var maxusStatus = num > this.data.skstockNum ? 'maxDisabled' : 'maxNormal';
      if (num > this.data.skstockNum) {
        num = this.data.skstockNum;
        wx.showModal({
          content: '亲，库存不足了...',
          showCancel: false,
          success: function (res) {
          }
        });
      }
      // 将数值与状态写回 
      this.setData({
        num: num,
        minusStatus: minusStatus,
        maxusStatus: maxusStatus
      });
    }else{
      wx.showModal({
        content: '亲，请先选择样式哦...',
        showCancel: false,
        success: function (res) {
        }
      });
    }
  },
  // 显示选择款式
  chooseStyle() {
    this.setData({ 
      subStyle: true,
      popupShow: true,
      enterShow: false 
    });
  },
  // 关闭弹窗
  popClose() {
    this.setData({ 
      popupShow: false,
      enterShow: true
    });
  },
  // 选择款式1
  checkChange1: function (e) {
    console.log(e)
    var that = this;
    var oneId = e.currentTarget.dataset.hl;
    var twoId = e.target.dataset.hi;
    var id = e.target.dataset.id;
    var hb1 = oneId + ':' + twoId + '/'
    //设置当前样式
    that.setData({
      'currentItem1': id,
      hb1: hb1
    })
    this.pipei();
  },
  // 选择款式2
  checkChange2: function (e) {
    var that = this;
    var oneId = e.currentTarget.dataset.hl;
    var twoId = e.target.dataset.hi;
    var id = e.target.dataset.id;
    var hb2 = oneId + ':' + twoId + '/'
    //设置当前样式
    that.setData({
      'currentItem2': id,
      hb2: hb2
    })
    this.pipei();
  },
  // 选择款式3
  checkChange3: function (e) {
    var that = this;
    var oneId = e.currentTarget.dataset.hl;
    var twoId = e.target.dataset.hi;
    var id = e.target.dataset.id;
    var hb3 = oneId + ':' + twoId + '/'
    //设置当前样式
    that.setData({
      'currentItem3': id,
      hb3: hb3
    })
    this.pipei();
  },
  // 选择款式4
  checkChange4: function (e) {
    var that = this;
    var oneId = e.currentTarget.dataset.hl;
    var twoId = e.target.dataset.hi;
    var id = e.target.dataset.id;
    var hb4 = oneId + ':' + twoId + '/'
    //设置当前样式
    that.setData({
      'currentItem4': id,
      hb4: hb4
    })
    this.pipei();
  },
  // 选择款式5
  checkChange5: function (e) {
    var that = this;
    var oneId = e.currentTarget.dataset.hl;
    var twoId = e.target.dataset.hi;
    var id = e.target.dataset.id;
    var hb5 = oneId + ':' + twoId + '/'
    //设置当前样式
    that.setData({
      'currentItem5': id,
      hb5: hb5
    })
    this.pipei();
  },
  // 款式匹配
  pipei: function () {
    var hb = this.data.hb1.toString() + (this.data.hb2.toString() ? this.data.hb2 : "") + (this.data.hb3.toString() ? this.data.hb3 : "") + (this.data.hb4.toString() ? this.data.hb4 : "") + (this.data.hb5.toString() ? this.data.hb5 : "");
    if (this.data.goodsSkuList.indexOf(hb) && this.data.goodsSkuList[hb] !== undefined) {
      var kuanshi = this.data.goodsSkuList[hb].skuDesc;
      var arr = kuanshi.split(' ');
      var arr1 = []
      for (var i = 0; i < arr.length - 1; i++) {
        arr1.push(arr[i].split(':')[1])
      }
      var arr2 = arr1.join(' ')
      this.setData({
        skprices: (this.data.goodsSkuList[hb].nowPrice / 100).toFixed(2),
        skclassifys: arr2,
        skclassimgs: this.data.goodsSkuList[hb].skuPic,
        skstockNum: this.data.goodsSkuList[hb].stockNum,
        skuid: this.data.goodsSkuList[hb].skuid
      })
    }
  },
  //购买
  nowBuy(){
    var that = this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data,
          infor: true
        });
        if (that.data.uid != '11111111111a') {
            that.setData({ 
              popupShow: true,
              isNowbuy: true, 
            });
        } else {
          wx.showModal({
            content: '请先绑定或注册',
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: "../register/register"
              })
            }
          });
        }
      }
    })      
  },
  //加购物车
  addToCar() {
    var that = this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data,
          infor: true
        });
        if (that.data.uid != '11111111111a') {
          that.setData({
            popupShow: true,
            isNowbuy: false,
          });
        } else {
          wx.showModal({
            content: '请先绑定或注册',
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: "../register/register"
              })
            }
          });
        }
      }
    })
  },
  // 立即购买
  immeBuy() {
    var that=this
    wx.removeStorageSync('skuids')
    wx.removeStorageSync('sid')
    wx.removeStorageSync('num')
    if (that.data.skuid) {
      if (that.data.skstockNum != 0) {
        wx.setStorageSync('sid', that.data.skuid);
        wx.setStorageSync('num', that.data.num);
        wx.setStorageSync('adrid', 0);
        wx.redirectTo({
          url: '../confirmorder/confirmorder'
        })
      } else {
        wx.showToast({
          title: '商品库存不足',
          duration: 2000,
          image: '../../img/icon/badTost.png'
        });
      }
    } else {
      wx.showToast({
        title: '请选择商品属性',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
    }
  },
  // 加入购物车
  addCar() {
    var that=this
    if (that.data.skuid) {
      if (that.data.skstockNum != 0) {
        wx.request({
          url: util.Apis + '/h5/h5goodcart/addUserGoodCart',
          method: 'POST',
          data: {
            count: that.data.num,
            userid: that.data.uid,
            skuid: that.data.skuid
          },
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.showToast({
              title: '已添加至购物车',
              icon: 'success',
              duration: 2000
            });
            var jdjd = that.data.carIcon ++
            app.globalData.carIcon = (jdjd+1).toString()
          },
        })
      } else {
        wx.showToast({
          title: '商品库存不足',
          duration: 2000,
          image: '../../img/icon/badTost.png'
        });
      }
    } else {
      wx.showToast({
        title: '请选择商品属性',
        duration: 2000,
        image: '../../img/icon/badTost.png'
      });
    }
  },
  //确定---购买或加入购物车
  enterBuyOrAdd(){
    if (this.data.isNowbuy){
      this.immeBuy()
    }else{
      this.addCar()
    }
  },
  // 倒计时模块
  sktime() {
    var that = this;
    var sdurTime = that.data.durTime
    that.data.durTime--;
    var h = parseInt(sdurTime / 3600);
    sdurTime %= 3600;
    var m = parseInt(sdurTime / 60);
    var s = sdurTime % 60;
    that.setData({
      countdownsH: that.toDou(h),
      countdownsM: that.toDou(m),
      countdownsS: that.toDou(s)
    })
    if (that.data.durTime <= 0) {
      that.setData({
        countdowns: '00:00:00'
      })
      clearInterval(sk);
    }
  },
  toDou(n) {
    return n < 10 ? '0' + n : '' + n;
  },
  // 跳到购物车
  toCar() {
    var that=this
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data,
          infor: true
        });
        if (that.data.userID != '11111111111a') {
          that.setData({ popupShow: true });
          wx.switchTab({
            url: '/pages/cart/cart'
          })
        } else {
          wx.showModal({
            content: '请先绑定或注册',
            showCancel: false,
            success: function (res) {
              wx.navigateTo({
                url: "../register/register"
              })
            }
          });
        }
      }
    })
  },
  preventTouchMove: function (e) {

  },

  /* 弹窗*/
  showDialogBtn: function () {
    this.setData({
      showModal: true,
    })
  },
  /* 弹出框蒙层截断touchmove事件*/
  preventTouchMove: function () {
  },
  /*隐藏模态对话框*/
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.descShow) {
      wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 2000
      })
      this.setData({ descShow: true });
    }
  },

   /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('shaop')
  }
})