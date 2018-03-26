Component({
  properties: {
    innerText: {
      type: null,
      value: ''
    },
    timeText: {
      type: null,
      value: ''
    }
  },
  data: {
    cuttonTime: '',
    durTime: '',
    cuttonTimeOr: '',
    idx: ''
  },
  attached: function () {
    var that = this
    that.setData({
      durTime: parseInt(that.properties.innerText / 1000),
      idx: parseInt(that.properties.timeText)
    })
    if (that.data.durTime <= 0) {
      that.setData({
        cuttonTime: '超时',
      })
      that.noTime()
    } else {
      that.sktime()
      that.data.cuttonTimeOr = setInterval(function () { that.sktime() }, 1000);
    }
  },
  detached: function () {
    clearInterval(this.data.cuttonTimeOr)
  },
  methods: {
    sktime: function () {
      var that = this
      var sdurTime = that.data.durTime
      if (!sdurTime) {
        return false
      } else {
        that.data.durTime--
        var h = parseInt(sdurTime / 3600);
        sdurTime %= 3600;
        var min = parseInt(sdurTime / 60);
        var sec = sdurTime % 60;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        that.setData({
          cuttonTime: min + ":" + sec
        })
        if (that.data.durTime <= 0) {
          that.setData({
            cuttonTime: '超时',
          })
          that.noTime()
          clearInterval(that.data.cuttonTimeOr)
        }
      }
    },
    noTime: function () {
      var myEventDetail = { idx: this.data.idx } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    }
  }
})