const app = getApp()
var util = require('../../utils/util.js');
Page({
  data:{
    priceCheck:'',
    searchinput:'',
    detailList:[],
    detailListB:false,
    news:[],
    indenx:0,
    maxIndex:1,
    winWidth: '',
    winHeight: '',
    priceSortPic:'../../img/icon/up_down.png',
    totalSortPic:'../../img/icon/checkIcon.png',
    animationData:{},
    minPriceText:'',
    maxPriceText:'',
    poBrands:[],
    trueBrands:[],
    numTrue:true,
    brandString:'',//品牌
    popularSort:'',
    priceSort:'',
    checkIcon:'',
    userID:''
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
  },
  onShow:function(){
    var that=this
    this.setData({
      popularSort: '',
      priceSort: '',
      checkIcon: '',
      priceSortPic: '../../img/icon/up_down.png',
      totalSortPic: '../../img/icon/checkIcon.png',
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userID: res.data,
        });
        that.seachClick()
      }
    })
  },
  //弹窗进来
  popupIn:function(){
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.right("0rpx").step()
    this.setData({
      animationData: animation.export()
    })
  },
  //弹窗出去
  popupOut: function () {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.right("-750rpx").step()
    this.setData({
      animationData: animation.export()
    })
  },
  //图标变色
  iconFun:function(){
    if (!this.data.priceSort) {
      this.setData({
        priceSortPic: '../../img/icon/../../img/icon/up_down.png'
      })
    }
    if (this.data.priceSort=='desc'){
      this.setData({
        priceSortPic:'../../img/icon/subnav_icon_price_up@3x.png'
      })
    }
    if (this.data.priceSort =="asc") {
      this.setData({
        priceSortPic: '../../img/icon/subnav_icon_price_down@3x.png'
      })
    }
    if (!this.data.checkIcon) {
      this.setData({
        totalSortPic: '../../img/icon/../../img/icon/checkIcon.png'
      })
    }
    if (this.data.checkIcon) {
      this.setData({
        totalSortPic: '../../img/icon/icon_filter_p@3x.png'
      })
    }
  },
  //价格点击
  priceSort:function(){
    if (!this.data.priceSort){
      this.setData({
        priceSort:'desc',
      })
    } else if (this.data.priceSort == 'desc'){
      this.setData({
        priceSort:'asc',
      })
    } else if (this.data.priceSort =='asc'){
      this.setData({
        priceSort: 'desc',
      })
    }
    this.setData({
      popularSort:'',
      checkIcon:'',
    })
    this.iconFun()
    this.seachClick()
  },
  //人气点击
  hunmanqi:function(){
    if (!this.data.popularSort) {
      this.setData({
        popularSort: 'desc',
      })
    } else if (this.data.popularSort == 'desc') {
      this.setData({
        popularSort: 'asc',
      })
    } else if (this.data.popularSort == 'asc') {
      this.setData({
        popularSort: 'desc',
      })
    }
    this.setData({
      priceSort: '',
      checkIcon: ''
    })
    this.iconFun()
    this.seachClick()
  },
  //筛选点击
  totalSort:function(){
    this.setData({
      priceSort:'',
      popularSort:''
    })
    this.popupIn()
    if (!this.data.checkIcon) {
      this.setData({
        checkIcon:true
      })
    }
    this.iconFun()
  },
  //输入内容检测
  textF: function (e) {
    var ins= e.currentTarget.dataset.ins
    if (ins == "1"){
      if (e.detail.value.replace(/(^[a-zA-Z0-9\u4e00-\u9fa5]+$)/g, '')) {
        wx.showModal({
          content: '只支持中文英文数字输入',
          showCancel: false,
        });
        this.setData({
          searchinput: 'Yuki原创'
        })
      } else {
        this.setData({
          searchinput: e.detail.value
        })
      }
    }else if(ins=="2"){
      this.setData({
        minPriceText: e.detail.value,
      })
    }else if(ins=="3"){
      this.setData({
        maxPriceText: e.detail.value,
      })
    }
  },
  //聚焦检测
  methfoc: function (e) {
    var ins = e.currentTarget.dataset.ins
    if (ins=="1"){
      this.setData({
        searchinput: ''
      })
    } else if (ins == "2"){
      this.setData({
        minPriceText: ''
      })
    }else{
      this.setData({
        maxPriceText: ''
      })
    }
  },
  //品牌选择
  brankchecks: function (e) {
    var that=this
    var name = e.currentTarget.dataset.name
    var goodId = e.currentTarget.dataset.id
    var idx = e.currentTarget.dataset.ins
    var cboolean=that.data.poBrands[idx].boolean
    if (cboolean==1){
      cboolean=2
    }else{
      cboolean=1
    }
    that.data.poBrands[idx].boolean = cboolean
    that.setData({
      poBrands: that.data.poBrands
    })
  },
  //重置筛选
  clearmsg:function(){
    this.setData({
      minPriceText:'',
      maxPriceText:'',
    })
    for (let i = 0; i < this.data.poBrands.length;i++){
      this.data.poBrands[i].boolean=false
    }
    this.setData({
      poBrands: this.data.poBrands
    })
  },
  //完成按钮搜索
  tabClick:function(){
    this.popupOut();
    this.seachClick
  },
  //enter搜索
  enterClick:function(){
      this.setData({
        priceSort: '',
        popularSort: '',
        checkIcon: ''
      })
      this.iconFun()
      this.seachClick()
  },
  //搜索按钮
  seachClick: function () {
    var minPriceText = parseInt(this.data.minPriceText)
    var maxPriceText = parseInt(this.data.maxPriceText)
    if (maxPriceText < minPriceText){
      wx.showModal({
        content: '请输入正确的价格区间',
        showCancel: false,
      });
    }else if (this.data.searchinput.length==0){
      wx.showModal({
        content: '不能为空且只支持中文英文数字输入',
        showCancel: false,
      });
    }else{
      var that = this
      that.setData({
        indenx: 0,
      })
      var brandStrings=''
      for (let i = 0; i < that.data.poBrands.length;i++){
        if (that.data.poBrands[i].boolean==2){
          brandStrings = brandStrings + that.data.poBrands[i].id + ','
        }
      }             
      brandStrings = brandStrings.substring(0, brandStrings.length-1)       
      that.setData({
        brandString: brandStrings
      })
      var historySeach = wx.getStorageSync('histroyDatas') || []
      historySeach.push(this.data.searchinput)
      wx.setStorageSync(
        'histroyDatas', historySeach
      )
      wx.request({
        url: util.Apis + '/h5/h5search/searchList',
        // url: 'http://ttioowh.nat300.top/h5/h5search/searchList',
        data: {
          userId: that.data.userID,
          goodName: that.data.searchinput,
          index: that.data.indenx,
          size: 10,
          brandidsText: that.data.brandString,
          minPriceText: that.data.minPriceText,
          maxPriceText: that.data.maxPriceText,
          priceSort: that.data.priceSort,
          popularSort: that.data.popularSort
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'  // 默认值
        },
        method: 'POST',
        success: function (res) {
          if (!res.data.data.goodBeanList.length) {
            that.setData({
              detailListB: true,
              detailList: [],
              poBrands: [],
              brandString:'',
              minPriceText:'',
              maxPriceText:'',
              priceSort:''
            })
          } else {
            for (let i = 0; i < res.data.data.goodBeanList.length; i++) {
              that.data.news.push(res.data.data.goodBeanList[i])
            }
            that.setData({
              detailListB: false,
              detailList: that.data.news,
              maxIndex: res.data.data.maxIndex,
              brandString: '',
              minPriceText: '',
              maxPriceText: '',
            })
            that.setData({
              poBrands: that.data.poBrands
            })
          }
        }
      })
    }
  },
  pullUpLoad: function () {
    if (this.data.detailList.length) {
      var that = this
      this.data.indenx++
      if (this.data.indenx >= this.data.maxIndex) {
        wx.showToast({
          title: '没有更多数据啦',
          duration: 2000,
          image: '../../img/icon/badTost.png'
        });
        that.setData({
          moreBoolean: false
        })
        return false
      } else {
        that.setData({
          indexs: that.data.indexs
        })
        wx.request({
          url: util.Apis + '/h5/h5search/searchList',
          // url: 'http://ttioowh.nat300.top/h5/h5search/searchList',
          data: {
            userId: that.data.userID,
            goodName: that.data.searchinput,
            index: that.data.indenx,
            size: 10,
            brandidsText: that.data.brandString,
            minPriceText: that.data.minPriceText,
            maxPriceText: that.data.maxPriceText,
            priceSort: that.data.priceSort,
            popularSort: that.data.popularSort
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'  // 默认值
          },
          method: 'POST',
          success: function (res) {
            if (!res.data.data.goodBeanList.length) {
              that.setData({
                detailListB: true,
                detailList: [],
                poBrands: [],
                brandString: '',
                minPriceText: '',
                maxPriceText: '',
                priceSort: ''
              })
            } else {
              for (let i = 0; i < res.data.data.goodBeanList.length; i++) {
                that.data.news.push(res.data.data.goodBeanList[i])
              }
              that.setData({
                detailListB: false,
                detailList: that.data.news,
                maxIndex: res.data.data.maxIndex,
                brandString: '',
                minPriceText: '',
                maxPriceText: '',
              })
              that.setData({
                poBrands: that.data.poBrands
              })
            }
          }
        })
      }
    } else {
      return false
    }
  }
})