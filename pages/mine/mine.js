//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    periodCycleList: Array.from(new Array(361).keys()).slice(1)
  },
  //事件处理函数
  onShow: function () {
    var that = this;
    wx.getUserInfo({
      success: user => {
        that.setData({
          userInfo: user.userInfo
        })
      }
    })
    that.getUserInfo();
  },
  bindPeriodCycleChange: function (e) {
    var that = this;
    app.helper.request.requestLoading(app.globalData.url + '/user/editPeriodCycle', { userId: wx.getStorageSync("userId"), periodCycle: parseInt(e.detail.value)+1}, app.globalData.header, ' ',
      function (res) {
        if (res.status == '1') {
          that.setData({
            periodCycle: parseInt(e.detail.value)+1 || 5,
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
          });
        }
      }, function () {
        wx.showToast({
          title: '失败，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    );
  },
  getUserInfo: function(){
    var that = this;
    app.helper.request.requestLoading(app.globalData.url + '/user/getUserInfo', { userId: wx.getStorageSync("userId")}, app.globalData.header, ' ',
      function (res) {
        if (res.status == '1') {
          that.setData({
            periodCycle: res.result.periodCycle || 5,
            history: res.result.history
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000,
          });
        }
      }, function () {
        wx.showToast({
          title: '失败，请稍后重试！',
          icon: 'none',
          duration: 2000
        })
      }
    );
  },
  toAddHisttory: function(e){
    var historyId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../addHistory/addHistory?historyId='+historyId
    })
  }
})
