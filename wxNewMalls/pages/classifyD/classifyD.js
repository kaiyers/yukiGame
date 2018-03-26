var appInstance = getApp();
var util = require('../../utils/util.js');
var oneId = '';
var twoId = '';
Page({
  /* 页面的初始数据*/
  data: {
    open: false,
    oneid:'',
    twoid:'',
    priceIcon: '../../img/icon/up_down.png',
    priceIconUp: '../../img/icon/subnav_icon_price_up@3x.png',
    priceIconDown: '../../img/icon/subnav_icon_price_down@3x.png',
    screenIcon: '../../img/icon/checkIcon.png',
    screenIconP: '../../img/icon/icon_filter_p@3x.png',
    collect: '../../img/newicon/collect_no.png',
    goodList:[],
    brandList:[],
    brandIdList:[],
    typeList:[],
    minprice:'',
    maxprice:'',
    checkArr:'',
    value:'',
    showModal: false,
    showMask: false,
    modeldata:{},
    isLike: '',
    animationTitle:{},
    mindejiao:false,
    maxdejiao: false,
  },
  onLoad: function(options){
    this.setData({
      oneid : options.oneid,
      twoid : options.twoid
    });
  },
  onShow(){
    this.getDataFun("", "", "", "", 'asc')
  },
  /*人气排序 tab = 0*/
  sortByPopularity: function (e) {
    var that = this;
    this.setData({ tab: 0});
    this.getDataFun("", "", "", "", 'asc')
  },
  /* 按价格排序 tab = 1*/
  sortByPrice: function (e) {
    var that = this;
    let direction = e.currentTarget.dataset.direction
    if (direction == 0) {
       direction = 1;
       that.getDataFun('', '', '', 'asc', '')
    } else {
      direction = 0;
      that.getDataFun('', '', '', 'desc', '')
    };
    this.setData({ tab: 1, direction: direction });
  },

  //获取数据的方法
  getDataFun(bIdList, minPri, maxPri, prS, ppS){
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        if (res.data != '11111111111a') {
          wx.request({
            url: util.Apis + '/h5/h5good/goodList',
            method: 'POST',
            data: {
              userId: res.data,
              oneLevelTypeId: that.data.oneid,//	int	是	一级商品分类id
              twoLevelTypeId: that.data.twoid,//	int	是	二级商品分类id
              index: 0,	//int	是	分页页码 从0开始
              size: 9999, //int	是	每页查询数量
              brandidsText: bIdList,//	string	否	品牌id拼接字符串 使用，拼接 如果选中的品牌包含其他 id填入-1 例 1,2,3,-1
              minPriceText: minPri,//	string	否	最低价格字符串
              maxPriceText: maxPri,//	string	否	最高价格字符串
              priceSort: prS,//	string	否	价格排序 升序asc 降序 desc
              popularSort: ppS,//	string	否	人气排序 升序asc 降序 desc
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              res.data.data.brandList.forEach((value, index) => {
                value.checked = false
              });
              var newlist = res.data.data.brandList
              newlist.push({ brandName: '其他', brandid: -1, checked: false })
              res.data.data.goodBeanList.forEach((value, index) => {
                if (value.isCollected) {
                  value.isLike = "show"
                }
              }); 
              res.data.data.typeBean.typeList.forEach((value)=>{
                  value.checked = false;
                if (value.typeId == that.data.twoid){
                  value.checked = true;
                  wx.setNavigationBarTitle({
                    title: value.typeName
                  });
                }
              });
              that.setData({
                goodList: res.data.data.goodBeanList,
                brandList: newlist,
                typeList: res.data.data.typeBean.typeList
              })
            }
          })
        } else {
          wx.request({
            url: util.Apis + '/h5/h5good/goodList',
            method: 'POST',
            data: {
              oneLevelTypeId: that.data.oneid,//	int	是	一级商品分类id
              twoLevelTypeId: that.data.twoid,//	int	是	二级商品分类id
              index: 0,	//int	是	分页页码 从0开始
              size: 9999, //int	是	每页查询数量
              brandidsText: bIdList,//	string	否	品牌id拼接字符串 使用，拼接 如果选中的品牌包含其他 id填入-1 例 1,2,3,-1
              minPriceText: minPri,//	string	否	最低价格字符串
              maxPriceText: maxPri,//	string	否	最高价格字符串
              priceSort: prS,//	string	否	价格排序 升序asc 降序 desc
              popularSort: ppS,//	string	否	人气排序 升序asc 降序 desc
            },
            header: {
              'Accept': 'application/json',
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              res.data.data.brandList.forEach((value, index) => {
                value.checked = false
              });
              var newlist = res.data.data.brandList;
              res.data.data.typeBean.typeList.forEach((value) => {
                value.checked = false;
                if (value.typeId == that.data.twoid) {
                  value.checked = true;
                  wx.setNavigationBarTitle({
                    title: value.typeName
                  });
                }
              })
              that.setData({
                goodList: res.data.data.goodBeanList,
                brandList: newlist,
                typeList: res.data.data.typeBean.typeList
              })
            }
          })
        }
      }
    })
  },

  //筛选条件动画
  title: function () {
    var animation0 = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
      transformOrigin: "50% 50% 0"
    });
    this.animation0 = animation0
    this.animation0.left("140rpx").opacity(1).step({ duration: 500 });
    this.setData({
      animationTitle: this.animation0.export(),
    })
  },
  //离场
  title_leave() {
    this.animation0.left("100%").opacity(0).step({ duration: 500 });
    this.setData({
      animationTitle: this.animation0.export(),
      open:false
    })
  },
  /* 筛选 tab = 2*/
  sortByScreen: function (e) {
    this.setData({ 
      tab: 2, 
      open: true,
      showMask: true,
    }); 
    this.title()
  },
  /*输入最小价格 */
  minPr: function (e) {
    this.setData({ minprice: e.detail.value });
  },
  //获得焦点
  minDejiao(){
    this.setData({
      mindejiao:true
    })
  },
  //失焦
  minShijiao() {
    this.setData({
      mindejiao: false
    })
  },
  /*输入最大价格 */
  maxPr: function (e) {
    this.setData({ maxprice: e.detail.value });
  },
  //获得焦点
  maxDejiao() {
    this.setData({
      maxdejiao: true
    })
  },
  //失焦
  maxShijiao() {
    this.setData({
      maxdejiao: false
    })
  },
  /*品牌选择*/
  chosePinpai(e){
    var idx = e.currentTarget.dataset.index,
      brandList = this.data.brandList,
      brandIdList = this.data.brandIdList;
    if (brandList[idx].checked){
      brandList[idx].checked = false
      //取消选择
      brandIdList.removeByValue(brandList[idx].brandid)
    }else{
      brandList[idx].checked = true
      //添加选择
      brandIdList.push(brandList[idx].brandid)
    }
    console.log(brandIdList)
    this.setData({
      brandList: brandList,
      brandIdList: brandIdList
    })
  },
  //分类选择
  choseType(e){
    var idx = e.currentTarget.dataset.index,
      typeList = this.data.typeList,
      twoid = typeList[idx].typeId;
    typeList.forEach((value)=>{
      value.checked = false
    })
    typeList[idx].checked = true
    this.setData({
      typeList: typeList,
      twoid: twoid
    })
    this.getDataFun("", "", "", "", 'asc')
  },
  /*重置*/
  replacement: function () {
    this.setData({
      minprice: '',
      maxprice: '',
      showMask: false
    });
    this.title_leave()
  },
  hideMask: function () {
    this.setData({
      showMask: false
    });
    this.title_leave()
  },
  /*确定 */
  determine: function(){
    var checkArr = [...new Set(this.data.brandIdList)].join(',')
    this.title_leave()
    if (this.data.minprice != '' && this.data.maxprice != '') {
      if (this.data.minprice > this.data.maxprice) {
        var jie = this.data.maxprice;
        this.data.maxprice = this.data.minprice;
        this.data.minprice = jie
      }
    }
    var minprice = this.data.minprice * 100,
      maxprice = this.data.maxprice * 100
    this.getDataFun(checkArr, minprice, maxprice, '', 'asc')
    this.setData({
      showMask: false
    })
  },
 // 收藏
  addLike(e) {
    var that = this;
    var goodList = that.data.goodList;
    var index = e.currentTarget.dataset.index;
    var gid = goodList[index].goodId;
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
                goodList[index].isLike = "show"
                that.setData({
                  goodList: goodList,
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
                goodList[index].isLike = ""
                that.setData({
                  goodList: goodList
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

