// page/component/new-pages/cart/cart.js
var util = require('../../utils/util.js');
Page({
  data: {
    uid:'',
    jishu:0,
    edittext: '编辑',
    editoff:false,
    cartslist:[],           // 购物车列表
    guessyoulike:[],        //猜你喜欢
    hasList:false,          // 列表是否有数据
    totalPrice:0.00,           // 总价，初始为0
    selectAllStatus:false,    // 全选状态，默认非全选
    cartidsList:[],         // 购物车id删除用 
    skuidList:[]            //商品类型id提交订单用
  },
  onShow:function() {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          uid: res.data,
          infor: true
        });
      
        if (that.data.uid!= '11111111111a') {
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
              }
              that.setData({
                hasList: true,
                cartslist: datas.cartBeanList,
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
    if (count < kucun){
      count = count + 1;
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
      wx.showModal({
        content: '亲，库存不足了...',
        showCancel: false,
        success: function (res) {
        }
      });
    }
    this.setData({
      cartslist: cartslist
    });
    this.getTotalPrice();
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
    if (count <= 1){
      return false;
    }
    count = count - 1;
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