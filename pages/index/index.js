 //index.js
//获取应用实例
var date = require('../../utils/dateCount.js')
const app = getApp()

Page({
  data: {
    nowDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate()),
    start_days: 1,
    last_days: 30,
    start_time: '',
    status: 0
  },
  //事件处理函数
  onShow: function () {
    var that = this;
    var userId = wx.getStorageSync("userId");
    if (userId){
      that.getUserInfo(userId)
    }else{
      console.log(2);
      //获取用户状态
      wx.login({
        success: res => {
          wx.getUserInfo({
            success: user => {
              app.globalData.userInfo = user.userInfo
              var params = {
                js_code: res.code, 
                userId: wx.getStorageSync("userId"),
                ...user.userInfo,
                appid: 'wx997f3f7ca9b6f67f',
              }
              //发送 res.code 到后台换取 openId, sessionKey, unionId
              app.helper.request.requestLoading(app.globalData.url + '/user/addUser', params, app.globalData.header, ' ',
                function (res) {
                  if (res.status == '1') {
                    wx.setStorageSync('userId', res.result);
                    app.globalData.userId = res.result;       
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
            }
          })
        }
      })
    }
  },
  bindComingDateChange: function (e) {//调用接口，增加开始记录
    var that = this;
    app.helper.request.requestLoading(app.globalData.url + '/user/periodStart', { periodStart: e.detail.value, userId: wx.getStorageSync("userId")}, app.globalData.header, ' ',
      function (res) {
        if (res.status == '1') {
          that.setData({
            status: 1,
            start_time: e.detail.value,
            start_days: 1
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
  bindLeavingingDateChange: function(e){
    var that = this;
    app.helper.request.requestLoading(app.globalData.url + '/user/periodEnd', { periodEnd: e.detail.value, userId: wx.getStorageSync("userId")}, app.globalData.header, ' ',
      function (res) {
        if (res.status == '1') {
          that.setData({
            status: 0,
            start_time: e.detail.value,
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
  getUserInfo: function (userId){
    var that = this;
    app.helper.request.requestLoading(app.globalData.url + '/user/getUserInfo', { userId: userId}, app.globalData.header, ' ',
      function (res) {
        if (res.status == '1') {
          wx.setStorageSync('userId', res.result.userId);
          app.globalData.userId = res.result.userId;
          that.setData({
            status: res.result.status || 0,
            start_days: date.dateDiff(res.result.periodStart, that.data.nowDate)+1,
            last_days: res.result.periodCycle - date.dateDiff(res.result.periodStart, that.data.nowDate) || res.result.periodCycle,
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
  }
})
