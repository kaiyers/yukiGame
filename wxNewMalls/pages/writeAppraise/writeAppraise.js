const app = getApp()
var util = require('../../utils/util.js');
Page({
  data: {
   maxlength:200,
   orderid:'',
   userId:'',
   look:[],//评分
   comment:[],//评论
   pics:[],//图片
   dePic:[],//删除图片控制
   picsNum:[],
   orderPrice:'',
   goodsList:[],
   picTotal: [],//处理后的总图片数组
   count:-1,//间隔显示与否开关
   imgArr:[],//图片上传服务器返回数据组
   goodIds: [],//商品goodIds集合
   skuIds: [],//skuIds集合
   mask:false//蒙版
  },
  onLoad: function (options) {
    var that = this
    var orderid = options.orderid
    that.setData({
      orderid: orderid
    })
    wx.getStorage({
      key: 'userId',
      success: function (res) {
        that.setData({
          userId: res.data
        });
        wx.request({
          url: util.Apis + '/h5/h5order/myOrderDetail',
          data: {
            orderid: that.data.orderid
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'POST',
          success: function (res) {
            let orderMsg = res.data.data.orderBean.order;
            for (let i = 0; i < res.data.data.orderBean.orderItem.length;i++){
              that.data.look[i]=3//评分
              that.data.comment[i]=""//评论
              that.data.pics[i] = []//图片
              that.data.dePic[i] = true//删除开关
              that.data.picsNum[i] = 0//图片数量
              that.data.skuIds[i] = (res.data.data.orderBean.orderItem)[i].skuid,
              that.data.goodIds[i] = (res.data.data.orderBean.orderItem)[i].goodId
            }
            that.data.count = res.data.data.orderBean.orderItem.length - 1
            that.setData({
              orderid: orderMsg.orderid,//订单ID
              orderPrice: orderMsg.totalPriceNow,//订单价格
              goodsList: res.data.data.orderBean.orderItem,
              pics: that.data.pics,
              look:that.data.look,
              comment: that.data.comment,
              dePic: that.data.dePic,
              picsNum: that.data.picsNum,
              count: that.data.count,
              skuIds: that.data.skuIds,
              goodIds: that.data.goodIds,
            })
            console.log(that.data.pics)
          }
        })
      }
    })
  },
  //改变表情
  swichNav:function(e){
    var index = e.currentTarget.dataset.index
    var current = e.currentTarget.dataset.current
    var cur = e.currentTarget.dataset.cur
    if (this.data.look[index] == cur){
      return false
    }else{
      this.data.look[index] = cur
      this.setData({
        look: this.data.look
      })
    }
  },
  //写评论
  textF:function(e){
    var that = this
    var index = e.currentTarget.dataset.index
    var value = e.detail.value
    var currentLegth = parseInt(value.length)
    if (currentLegth > that.data.maxlength) {
      return false
    }
    that.data.comment[index] = value 
    that.setData({
      comment: that.data.comment
    })
  },
  //上传图片
  upload: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    wx.chooseImage({
      count: 5 - that.data.pics[index].length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFiles = res.tempFiles
        console.log(tempFiles)
        for (let i = 0; i < tempFiles.length;i++){
          if (tempFiles[i].size>3145728){
            wx.showToast({
              title: '单张超过3M了哦',
              duration: 2000,
              image: '../../img/icon/badTost.png'
            });
            continue
          }
          that.data.pics[index].push(tempFiles[i].path)
        }
        that.setData({
          pics: that.data.pics,
        })
        that.data.picsNum[index] = that.data.pics[index].length
        that.setData({
          picsNum: that.data.picsNum
        })
        if (that.data.pics[index].length == 5) {
          that.data.dePic[index]=false
          that.setData({
            dePic: that.data.dePic
          })
        }
      }
    })
  },
  //删除图片
  decparent:function(e){
    var that=this
    var curparent = e.currentTarget.dataset.curparent
    var index = e.currentTarget.dataset.index
    that.data.pics[index].splice(curparent, 1)
    that.data.dePic[index]=true
    that.setData({
      pics: that.data.pics,
      dePic: that.data.dePic
    })
  },
  //预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var curparent=e.currentTarget.dataset.index
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: this.data.pics[curparent] // 需要预览的图片http链接列表
    })
  },
  //评论文字
  bindFormSubmit:function(){
    var that=this
    for (let i = 0; i < that.data.pics.length;i++){
      for (let j = 0; j < that.data.pics[i].length; j++){
        that.data.picTotal.push(that.data.pics[i][j])
      }
    }
    for (let i = 0; i < that.data.comment.length; i++) {
      if (that.data.comment[i].length==0) {
        that.data.comment[i]='轻轻的我走了，不留下只言片语'
      }
    }
    that.setData({
      picTotal: that.data.picTotal
    })
    that.setData({
      mask:true
    })
    that.uploadimg({
      url: util.Apis + '/h5/h5goodcomment/xcxupload',//这里是你图片上传的接口
      path: that.data.picTotal,//这里是选取的图片的地址数组
      imgArr: that.data.imgArr,
      skuIds: (that.data.skuIds).join(','),
      goodIds: (that.data.goodIds).join(','),
      orderId: that.data.orderid,
      userId: that.data.userId,
      commentTexts: (that.data.comment).join('@@@'),
      levels: (that.data.look).join(','),
      picNums: that.data.picsNum,
      mask: that.data.mask
    });
  },
  uploadimg: function (data) {
    var that = this,
      path = data.path,
      imgArr = data.imgArr,
      skuIds = data.skuIds,
      goodIds = data.goodIds,
      orderId = data.orderId,
      userId = data.userId,
      commentTexts = data.commentTexts,
      levels = data.levels,
      picNums = data.picNums,
      i = data.i ? data.i : 0,
      success = data.success ? data.success : 0,
      fail = data.fail ? data.fail : 0;
    if (data.path.length == 0) {
      imgArr = ',,'
      wx.request({
        url: util.Apis + '/h5/h5goodcomment/xcxdoComment',
        data: {
          skuIds: skuIds,
          goodIds: goodIds,
          orderId: orderId,
          userId: userId,
          commentTexts: commentTexts,
          levels: levels,
          picNums: picNums,
          img: imgArr
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            mask: false
          })
          wx.redirectTo({
            url: "../myOrder/myOrder?orderState=0"
          })
        }
      })
    } else {
      const uploadTask=wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'img',
        formData: null,
        success: (resp) => {
          imgArr.push(JSON.parse(resp.data).data)
          success++;
        },
        fail: (res) => {
          that.setData({
            mask: false
          })
          fail++;
        },
        complete: () => {
          i++;
          if (i == data.path.length) {   //当图片传完时，停止调用
            wx.request({
              url: util.Apis + '/h5/h5goodcomment/xcxdoComment',
              data: {
                skuIds: skuIds,
                goodIds: goodIds,
                orderId: orderId,
                userId: userId,
                commentTexts: commentTexts,
                levels: levels,
                picNums: picNums,
                img: imgArr.join(',')
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              success: function (res) {
                that.setData({
                  mask: false
                })
                wx.redirectTo({
                  url: "../myOrder/myOrder?orderState=0"
                })
              }
            })
          } else {//若图片还没有传完，则继续调用函数
            data.i = i;
            data.success = success;
            data.fail = fail;
            that.uploadimg(data);
          }
        }
      });
    }
  },
})  