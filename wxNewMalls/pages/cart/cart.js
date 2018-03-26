// page/component/new-pages/cart/cart.js
var util = require('../../utils/util.js');
var app = getApp();
Page({
  data: {
    uid:'',
    jishu:0,
    edittext: '编辑',
    editoff:false,
    cartslist:[],           // 购物车列表
    xiaJia:[],              //下架商品
    guessyoulike:[],        //猜你喜欢
    hasList:false,          // 列表是否有数据
    totalPrice:0.00,           // 总价，初始为0
    selectAllStatus:false,    // 全选状态，默认非全选
    cartidsList:[],         // 购物车id删除用 
    skuidList:[],            //商品类型id提交订单用
    isLike: '',
    popupShow:false,

    // 使用data数据对象设置样式名 
    num: 1,
    minusStatus: 'minDisabled',
    maxusStatus: 'maxNormal',
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
    skprices: '',
    skclassifys: '规格属性',
    skclassimgs: '',
    skstockNum: '',
    popGoodId: '',
    popCatId: '',
    skuid:''
  },
  onShow:function() {
   this.getData();
    wx.removeTabBarBadge({
      index: 2,
    });
    app.globalData.carIcon = 0;
    if (app.globalData.infomationIcon == 0) {
      wx.removeTabBarBadge({
        index: 3,
      });
    } else {
      wx.setTabBarBadge({
        index: 3,
        text: app.globalData.infomationIcon
      })
    }
  },
  //获取页面数据
  getData(){
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data,
          infor: true
        });
        if (that.data.uid != '11111111111a') {
          wx.request({
            url: util.Apis + '/h5/h5goodcart/findUserGoodCart',
            method: 'POST',
            data: {
              userid: that.data.uid
              //userid: 16129
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              var datas = res.data.data;
              var cartslist = datas.cartBeanList;
              var xiaJia = [];
              var zaiShou = [];
              cartslist.forEach((value, index) => {
                if (value.goodState) {
                  zaiShou.push(value)
                } else {
                  xiaJia.push(value)
                }
              })
              zaiShou.forEach((value, index) => {
                value.show = true;
                value.isSmall = 0;
                value.isBig = 0;
                if (value.count == 1) {
                  value.isSmall = 1
                }
                if (value.count == value.skuStock) {
                  value.isBig = 1
                }
              });
              datas.guessGoodList.forEach((value, index) => {
                if (value.isCollected) {
                  value.isLike = "show"
                }
              });
              that.setData({
                hasList: true,
                xiaJia: xiaJia,
                cartslist: zaiShou,
                guessyoulike: datas.guessGoodList,
              })
            }
          })
        } else {
          wx.showToast({
            title: '请先绑定或注册',
            icon: 'success',
            duration: 1000,
            success: function () {
              wx.redirectTo({
                url: "../register/register"
              })
            }
          })
        }
      }
    })
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    if (!this.data.editoff) {
      const index = e.currentTarget.dataset.index;
      let cartslist = this.data.cartslist;
      var cartslist1 = []
      for (let i = 0; i < cartslist.length; i++) {
        if (cartslist[i].goodState) {
          if (cartslist[i].skuStock != 0) {
            cartslist1.push(cartslist[i]);
          }
        }
      }
      if (cartslist[index].goodState) {
        if (cartslist[index].skuStock != 0) {
          const selected = cartslist[index].selected;
          cartslist[index].selected = !selected;
          if (cartslist[index].selected) {
            this.data.jishu = this.data.jishu + 1;
            this.data.cartidsList.push(cartslist[index].cartid);
            this.data.skuidList.push(cartslist[index].skuid)
          } else {
            this.data.jishu = this.data.jishu - 1;
            this.data.cartidsList.removeByValue(cartslist[index].cartid);
            this.data.skuidList.removeByValue(cartslist[index].skuid)
          }
          if (this.data.jishu == cartslist1.length) {
            this.data.selectAllStatus = true;
          } else {
            this.data.selectAllStatus = false;
          }
          this.setData({
            cartslist: cartslist,
            jishu: this.data.jishu,
            selectAllStatus: this.data.selectAllStatus,
            cartidsList: this.data.cartidsList,
            skuidList: this.data.skuidList
          });
        }
      }
      this.getTotalPrice();
    }else{
      const index = e.currentTarget.dataset.index;
      let cartslist = this.data.cartslist;
     
      const selected = cartslist[index].selected;
      cartslist[index].selected = !selected;
      if (cartslist[index].selected) {
        this.data.jishu = this.data.jishu + 1;
        this.data.cartidsList.push(cartslist[index].cartid);
        this.data.skuidList.push(cartslist[index].skuid)
      } else {
        this.data.jishu = this.data.jishu - 1;
        this.data.cartidsList.removeByValue(cartslist[index].cartid);
        this.data.skuidList.removeByValue(cartslist[index].skuid)
      }
      if (this.data.jishu == cartslist.length) {
        this.data.selectAllStatus = true;
      } else {
        this.data.selectAllStatus = false;
      }
      this.setData({
        cartslist: cartslist,
        jishu: this.data.jishu,
        selectAllStatus: this.data.selectAllStatus,
        cartidsList: this.data.cartidsList,
        skuidList: this.data.skuidList
      });
    }
  },
  /**
   * 购物车全选事件
   */
  selectAll(e) {
    if (!this.data.editoff){
      let selectAllStatus = this.data.selectAllStatus;
      selectAllStatus = !selectAllStatus;
      let cartslist = this.data.cartslist;
     
      var cartslist1 = []
      for (let i = 0; i < cartslist.length; i++) {
        if (cartslist[i].goodState) {
          if (cartslist[i].skuStock != 0) {
            cartslist1.push(cartslist[i]);
          }
        }
      }
      if (selectAllStatus) {
        this.data.jishu = cartslist1.length;
        for (let i = 0; i < cartslist1.length; i++) {
          this.data.cartidsList.push(cartslist1[i].cartid);
          this.data.skuidList.push(cartslist1[i].skuid)
        }
      } else {
        this.data.jishu = 0;
        this.data.cartidsList = [];
        this.data.skuidList = []
      }
      for (let i = 0; i < cartslist.length; i++) {
        if (cartslist[i].goodState) {
          if (cartslist[i].skuStock != 0) {
            cartslist[i].selected = selectAllStatus;
          }
        }
      }
      this.setData({
        selectAllStatus: selectAllStatus,
        cartslist: cartslist,
        jishu: this.data.jishu
      });
      this.getTotalPrice();
    }else{
      let selectAllStatus = this.data.selectAllStatus;
      selectAllStatus = !selectAllStatus;
      let cartslist = this.data.cartslist;
      if (selectAllStatus) {
        this.data.jishu = cartslist.length;
        for (let i = 0; i < cartslist.length; i++) {
          this.data.cartidsList.push(cartslist[i].cartid);
          this.data.skuidList.push(cartslist[i].skuid)
        }
      } else {
        this.data.jishu = 0;
        this.data.cartidsList = [];
        this.data.skuidList = []
      }
      for (let i = 0; i < cartslist.length; i++) {
       cartslist[i].selected = selectAllStatus;
      }
      this.setData({
        selectAllStatus: selectAllStatus,
        cartslist: cartslist,
        jishu: this.data.jishu
      });
    }
    
  },

  /**
   * 绑定加数量事件
   */
  addCount(e) {
    const index = e.currentTarget.dataset.index;
    let cartslist = this.data.cartslist;
    let count = cartslist[index].count;
    let kucun = cartslist[index].skuStock;
    let catId = cartslist[index].cartid;
    var that = this;
    count = count + 1;
    if (count < kucun){
      
      cartslist[index].isSmall = 0;
      cartslist[index].count = count;
      wx.request({
        url: util.Apis + '/h5/h5goodcart/updateUserGoodCart',
        method: 'POST',
        data: {
          userid: that.data.uid,
          cartid: catId,
          type: 'plus',
          skuid: 0,
          count: 0
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
        }
      })
    }else{
      count = kucun;
      cartslist[index].count = count;
      cartslist[index].isBig = 1;
    }
    this.setData({
      cartslist: cartslist
    });
    this.getTotalPrice();
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
    if (this.data.skuid) {
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
    } else {
      wx.showModal({
        content: '亲，请先选择样式哦...',
        showCancel: false,
        success: function (res) {
        }
      });
    }
  },
 
  // 关闭弹窗
  popClose() {
    this.setData({
      popupShow: false,
      num:1
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
  //展示商品详情
  choseGoodSt(e){
    var that = this,
      idx = e.currentTarget.dataset.index, //序号
      cartslist = that.data.cartslist,   //商品列表
      catId = cartslist[idx].cartid,
      goodid = cartslist[idx].goodid;    //商品Id
    if (cartslist[idx].count == 1){
      that.setData({
        num: cartslist[idx].count,
        minusStatus: 'minDisabled'
      })
    }else{
      that.setData({
        num: cartslist[idx].count,
        minusStatus: 'minNormal'
      })
    }
    wx.request({
      url: util.Apis + '/h5/h5goodcart/findGoodDetail',
      method: 'POST',
      data: {
        goodid: goodid
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
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
        //默认显示款式
        var ssd = res.data.data.goodDetailBean.skuList
        that.setData({
          popupShow: true,
          goodsPropertyList1: propertyList_0,
          goodsPropertyList2: propertyList_1,
          goodsPropertyList3: propertyList_2,
          goodsPropertyList4: propertyList_3,
          goodsPropertyList5: propertyList_4,
          goodsSkuList: newsSkuList,
          skprices: (ssd[0].nowPrice / 100).toFixed(2),
          skclassifys: '规格属性',
          skclassimgs: ssd[0].skuPic,
          popGoodId: goodid,
          popCatId: catId
        })
        wx.hideTabBar({
          animation: false,
        })
      }
    })
  },
  //确认修改商品属性
  enterBuyOrAdd(){
    var goodid = this.data.popGoodId,
      cartid = this.data.popCatId,
      count = this.data.num,
      userid = this.data.uid,
      skuid = this.data.skuid;
    console.log(goodid, cartid, count, skuid, userid)
    var that = this;
    wx.request({
      url: util.Apis + '/h5/h5goodcart/updateGoodCartGood',
      method: 'POST',
      data: {
        cartid: cartid,
        count : count,
        userid: userid,
        skuid: skuid
      },
      header: {
        'Accept': 'application/json',
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.request({
          url: util.Apis + '/h5/h5goodcart/findUserGoodCart',
          method: 'POST',
          data: {
            userid: that.data.uid
            //userid: 16129
          },
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            var datas = res.data.data;
            var cartslist = datas.cartBeanList;
            var xiaJia = [];
            var zaiShou = [];
            cartslist.forEach((value, index) => {
              if (value.goodState) {
                zaiShou.push(value)
              } else {
                xiaJia.push(value)
              }
            })
            zaiShou.forEach((value, index) => {
              value.show = false;
              value.isSmall = 0;
              value.isBig = 0;
              if (value.count == 1) {
                value.isSmall = 1
              }
              if (value.count == value.skuStock) {
                value.isBig = 1
              }
            });
            datas.guessGoodList.forEach((value, index) => {
              if (value.isCollected) {
                value.isLike = "show"
              }
            });
            that.setData({
              hasList: true,
              xiaJia: xiaJia,
              cartslist: zaiShou,
              guessyoulike: datas.guessGoodList,
              edittext: '完成',
              editoff: true,
            })
          }
        })
        that.popClose() 
      }
    })
  },
  /**
   * 绑定减数量事件
   */
  minusCount(e) {
    const index = e.currentTarget.dataset.index;
    const obj = e.currentTarget.dataset.obj;
    let cartslist = this.data.cartslist;
    let count = cartslist[index].count;
    let catId = cartslist[index].cartid;
    count = count - 1;
    cartslist[index].isBig = 0;
    if (count < 1){
      count = 1;
    }else{
      cartslist[index].count = count;
      var that = this;
      wx.request({
        url: util.Apis + '/h5/h5goodcart/updateUserGoodCart',
        method: 'POST',
        data: {
          userid: that.data.uid,
          cartid: catId,
          type: 'less',
          skuid: 0,
          count: 0
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
        }
      })
    }
    if (count==1){
      cartslist[index].isSmall = 1;
    }
    this.setData({
      cartslist: cartslist
    });
    this.getTotalPrice();
  },
  //去商品详情
  godetail: function(e){
    const index = e.currentTarget.dataset.index;
    let cartslist = this.data.cartslist;
   
    if (cartslist[index].goodState) {
      wx.navigateTo({
        url: '../details/details?gsid=' + cartslist[index].goodid
      })
    }
  },
  /**
   * 计算总价
   */
  getTotalPrice() {
    let cartslist = this.data.cartslist;                  // 获取购物车列表
    let total = 0;
    for (let i = 0; i < cartslist.length; i++) {         // 循环列表得到每个数据
      if (cartslist[i].selected) {                     // 判断选中才会计算价格
        total += cartslist[i].count * cartslist[i].priceNow;   // 所有价格加起来
      }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
      cartslist: cartslist,
      totalPrice: (total/100).toFixed(2)
    });
  },
  //编辑购物车
  editcat: function () {
    var cartslist = this.data.cartslist;
    for (let i = 0; i < cartslist.length; i++) {
     cartslist[i].selected = false;
    }
   
    if (this.data.editoff) {
      for (let i = 0; i < cartslist.length; i++) {
        if (cartslist[i].goodState) {
          if (cartslist[i].skuStock != 0) {
            cartslist[i].show = true;
          }
        }
      }
      this.setData({
        edittext: '编辑',
        editoff: false,
        cartidsList: [],         // 购物车id删除用 
        jishu: 0,
        selectAllStatus: false,    // 全选状态，默认全选
        skuidList: [],
        totalPrice: 0.00,
        cartslist: cartslist 
      })
    } else {
      for (let i = 0; i < cartslist.length; i++) {
        if (cartslist[i].goodState) {
          if (cartslist[i].skuStock != 0) {
            cartslist[i].show = false;
          }
        }
      }
      this.setData({
        edittext: '完成',
        editoff: true,
        cartidsList: [],         // 购物车id删除用 
        jishu: 0,
        selectAllStatus: false,    // 全选状态，默认全选
        skuidList: [],
        totalPrice: 0.00,
        cartslist: cartslist   
      })
    }
  },
  /* 删除商品*/
  deleteGoods: function () {
    var that = this;
    let cartslist = this.data.cartslist;
    var cartID = [...new Set(that.data.cartidsList)].join(',')
    if (cartID){
      wx.showModal({
        title: '提示',
        content: '亲，真的要删除吗？',
        showCancel: true,
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: util.Apis + '/h5/h5goodcart/delUserGoodCart',
              method: 'POST',
              data: {
                userid: that.data.uid,
                cartids: cartID
              },
              header: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                that.setData({
                  cartidsList: [],         // 购物车id删除用 
                  jishu: 0,
                  selectAllStatus: false,    // 全选状态，默认全选
                  skuidList: []
                })
                wx.request({
                  url: util.Apis + '/h5/h5goodcart/findUserGoodCart',
                  method: 'POST',
                  data: {
                    userid: that.data.uid
                    // userid: 16129
                  },
                  header: {
                    'Accept': 'application/json',
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    var datas = res.data.data;
                    var cartslist = datas.cartBeanList;
                    for (let i = 0; i < cartslist.length; i++) {
                      cartslist[i].show = true;
                      if (cartslist[i].goodState) {
                        if (cartslist[i].skuStock != 0) {
                          cartslist[i].show = false;
                        }
                      }
                    }
                    that.setData({
                      hasList: true,
                      cartslist: datas.cartBeanList,
                    })
                  }
                })
              }
            })
          }
        }
      })
    }else{
      wx.showModal({
        content: '亲，请选择要删除的商品...',
        showCancel: false,
        success: function (res) {
        }
      });
    }
  },

  //结算
  toBuy: function () {
    wx.removeStorageSync('skuids')
    wx.removeStorageSync('sid')
    wx.removeStorageSync('num')
    var that = this;
    var skuID = [...new Set(that.data.skuidList)].join(',')
    if (skuID) {
      wx.setStorageSync('skuids', skuID);
      wx.setStorageSync('adrid', 0);
      wx.request({
        url: util.Apis + '/h5/h5order/toCheck',
        method: 'POST',
        data: {
          skuid: skuID,
          userId: that.data.uid,
          addrId: '0',
          couponId: '-2',
        },
        header: {
          'Accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.data.state == 'error') {
            wx.showModal({
              content: '您所选的商品中含有库存不足的商品，请修改您的商品数量。',
              showCancel: false,
              success: function (res) {
              }
            });
          } else {
            wx.navigateTo({
              url: '../confirmorder/confirmorder'
            })
          }
        }
      });
    } else {
      wx.showModal({
        content: '亲，请选择要购买的商品...',
        showCancel: false,
        success: function (res) {
        }
      });
    }
  },
  //删除失效的商品
  deleteAllShixiao(){
    var deleteAllId = [];
    this.data.xiaJia.forEach((value)=>{
      deleteAllId.push(value.cartid)
    })
    var cartID = [...new Set(deleteAllId)].join(',')
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定清空失效商品？',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: util.Apis + '/h5/h5goodcart/delUserGoodCart',
            method: 'POST',
            data: {
              userid: that.data.uid,
              cartids: cartID
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              that.setData({
                xiaJia: []
              })
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      cartidsList: [],         // 购物车id删除用 
      jishu: 0,
      selectAllStatus: false,    // 全选状态，默认全选
      skuidList: [],
      totalPrice: 0.00 ,
      editoff:false,
      edittext:'编辑'
    })
  },
  // 收藏
  addLike(e) {
    var that = this;
    var guessyoulike = that.data.guessyoulike;
    var index = e.currentTarget.dataset.index;
    var gid = guessyoulike[index].goodId;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        if (that.data.uid != '11111111111a') {
          if (!that.data.isLike) {
            that.setData({
              isLike: !that.data.isLike
            });
            wx.request({
              url: util.Apis + '/h5/h5collection/addCollection',
              method: 'POST',
              data: {
                goodId: gid,
                userId: res.data,
              },
              header: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                guessyoulike[index].isLike = "show"
                that.setData({
                  guessyoulike: guessyoulike,
                });
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
                goodId: gid,
                userId: res.data,
              },
              header: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                guessyoulike[index].isLike = ""
                that.setData({
                  guessyoulike: guessyoulike
                });
              },
            })
          }
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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
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