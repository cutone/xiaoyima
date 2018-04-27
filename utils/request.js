// 发送请求 没有 loading
function request(url, params, header, success, fail) {
  this.requestLoading(url, params, header, "", success, fail)
}
// 发送请求 带 loading
function requestLoading(url, params, header, message, success, fail) {
  wx.showNavigationBarLoading();
  if (message != "") {
    wx.showLoading({
      title: message,
    })
  }
  wx.request({
    url: url,
    data: params,
    header: header,
    method: 'post',
    success: function (res) {
      wx.hideNavigationBarLoading();
      if (message != "") {
        wx.hideLoading()
      }
      success(res.data)
    },
    fail: function (res) {
      console.log('请求失败:' + url);
      console.log(res);
      wx.hideNavigationBarLoading();
      if (message != "") {
        wx.hideLoading()
      }
      fail()
    },
    complete: function (res) { },
  })
}
module.exports = {
  request: request,
  requestLoading: requestLoading
};
