const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const casting = function (arr) {
  arr.forEach((value, index) => {
    switch (value.questiontypes) {
      case 1:
        value.questiontypesText = "数学题"
        break;
      case 2:
        value.questiontypesText = "生物题"
        break;
      case 3:
        value.questiontypesText = "历史题"
        break;
      case 4:
        value.questiontypesText = "人文题"
        break;
      case 5:
        value.questiontypesText = "音乐题"
        break;
      case 6:
        value.questiontypesText = "美术题"
        break;
      case 7:
        value.questiontypesText = "游戏题"
        break;
      case 8:
        value.questiontypesText = "动漫题"
        break;
    }
  });
  return arr;
}
const Apis = 'https://wx.yukicomic.com'
module.exports = {
  formatTime: formatTime,
  casting: casting,
  Apis: Apis
}
