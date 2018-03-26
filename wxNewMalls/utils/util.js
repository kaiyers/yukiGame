const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const mstr = function (val) {
  var str = val.toString()
  var str1 = str.substring(1, str.length - 1)
  var str2 = ""
  for (let i = 0; i < str1.length; i++) {
    str2 += '*'
  }
  var newstr = str.substring(0, 1) + str2 + str.substring(str.length - 1);
  return newstr
}
const newDate = function (value, type) {
  var dataTime = "";
  var data = new Date();
  data.setTime(value);
  var year = data.getFullYear();
  var month = data.getMonth() + 1;
  var day = data.getDate();
  var hour = data.getHours();
  var minute = data.getMinutes();
  var second = data.getSeconds();
  month = month > 9 ? month : '0' + month;
  day = day > 9 ? day : '0' + day;
  hour = hour > 9 ? hour : '0' + hour;
  minute = minute > 9 ? minute : '0' + minute;
  second = second > 9 ? second : '0' + second;
  if (type == "YMD") {
    dataTime = year + "年" + month + "月" + day + "日";
  } else if (type == "YMDHMS") {
    dataTime = year + "年" + month + "月" + day + "日 " + hour + ":" + minute + ":" + second;
  } else if (type == "HMS") {
    dataTime = hour + ":" + minute + ":" + second;
  } else if (type == "YM") {
    dataTime = year + "年" + month + "月";
  } else if (type == "Y-M") {
    dataTime = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  } else if (type == "MM-SS") {
    dataTime = minute + "分" + second + "秒";
  } else if (type == "HM"){
    dataTime = hour + ":" + minute;
  }
  return dataTime;//将格式化后的字符串输出到前端显示
};
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const Apis ='https://wx.yukicomic.com'
//const Apis ="http://ttioowh.nat300.top"
module.exports = {
  formatTime: formatTime,
  Apis: Apis,
  newDate: newDate
}
