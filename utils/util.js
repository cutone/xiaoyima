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

const resp = res => {
  let status = res.status;
  let msg = res.msg;
  if (status != 200) {
    if (status == 604) {
      // 提示未登录
      wx.clearStorageSync();
      wx.redirectTo({
        url: '../index/index'
      })
    }
    return res;
  } else {
    return res;
  }
};

module.exports = {
  formatTime: formatTime,
  resp: resp,
}
// 处理返回数据

