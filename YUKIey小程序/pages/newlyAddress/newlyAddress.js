// pages/alterAddress/alterAddress.js
var util = require('../../utils/util.js');
var address = require('../../utils/city.js')
var animation
Page({

  /* 页面的初始数据*/
  data: {
    uid:'', //用户id
    
    adrName: '', //收件人姓名
    adrPhone: '', //收件人手机号
    adrProvince: '', //	省
    adrCity: '', //	市
    adrDistrict: '', //		区
    adrDetail: '', //	详细地址
    isAvalible: 1, //默认地址填1
    areaInfo:'',
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province: '',
    city: '',
    area: ''
  },

  /* 生命周期函数--监听页面加载*/
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        // success
        that.setData({
          uid: res.data
        })
      }
    })
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
  },
  // 设置默认
  switchChange(e) {
    if(e.detail.value){
      this.setData({
        isAvalible: 1
      })
    }else{
      this.setData({
        isAvalible: 0
      })
    }
  },
  // 点击所在地区弹出选择框
  selectDistrict: function (e) {
    var that = this
    if (that.data.addressMenuIsShow) {
      return
    }
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    var that = this
    if (isShow) {
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ' ' + that.data.citys[value[1]].name + ' ' + that.data.areas[value[2]].name
    that.setData({
      areaInfo:areaInfo,
      adrProvince: that.data.provinces[value[0]].name, //	省
      adrCity: that.data.citys[value[1]].name, //	市
      adrDistrict: that.data.areas[value[2]].name, //		区
    })
  },
  hideCitySelected: function (e) {
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },

  //新增地址
  formSubmit(e) {
    const value = e.detail.value;
    if (value.adrName && value.adrPhone && value.pct && value.adrDetail) {
      if ((/^((1[3,5,8][0-9])|(14[5,7])|(17[0,3,6,7,8])|(19[7]))\d{8}$/.test(value.adrPhone))) {
        var that = this;
        wx.request({
          url: util.Apis + '/h5/h5address/addUserAddress',
          method: 'POST',
          data: {
            'userid': that.data.uid,
            'adrName': value.adrName,
            'adrPhone': value.adrPhone,
            'adrProvince': that.data.adrProvince,
            'adrCity': that.data.adrCity,
            'adrDistrict': that.data.adrDistrict,
            'adrDetail': value.adrDetail,
            'isAvalible': that.data.isAvalible
          },
          header: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }else{
        wx.showModal({
          title: '提示',
          content: '手机号格式错误',
          showCancel: false
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请填写完整资料',
        showCancel: false
      })
    }
  }
})
