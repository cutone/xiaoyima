const app = getApp()

Page({
  data: {
    nowDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate()),
    start: '',
    end: '',
    type: 'add'
  },
  onLoad: function(options){
    var that = this;
    console.log(typeof options.historyId);
    if(options.historyId != 'undefined'){
      console.log(options.historyId);
      that.setData({
        type: 'edit',
        historyId: options.historyId
      })
      that.historyItem();
    }
    
  },
  bindStartChange: function(e){
    var that = this;
    that.setData({
      start: e.detail.value
    })
  },
  bindEndChange: function (e) {
    var that = this;
    that.setData({
      end: e.detail.value
    })
  },
  addHistory: function(){
    var that = this;
    if (that.data.start == '' || that.data.end == ''){
      wx.showToast({
        title: '请选择开始、结束时间',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    if(that.data.type == 'edit'){
      var url = '/user/updateHistory';
      console.log(that.data.end);
      var params = { 
        userId: wx.getStorageSync("userId"), 
        start: that.data.start, 
        end: that.data.end,
        historyId: that.data.historyId
      }
    } else if (that.data.type == 'add'){
      var url = '/user/addHistory';
      var params = {
        userId: wx.getStorageSync("userId"),
        start: that.data.start,
        end: that.data.end
      }
    }
    app.helper.request.requestLoading(app.globalData.url + url, params , app.globalData.header, ' ',
      function (res) {
        if (res.status == '1') {
          var pages = getCurrentPages();
          var prePage = pages[pages.length - 2];
          prePage.getUserInfo();
          wx.navigateBack({
            delta: 1,
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
  historyItem: function(){
    var that = this;
    app.helper.request.requestLoading(app.globalData.url + '/user/getUserInfo', { userId: wx.getStorageSync("userId")}, app.globalData.header, ' ',
      function (res) {
        if (res.status == '1') {
          res.result.history.forEach(function(item){
            if (item._id == that.data.historyId){
              that.setData({
                start: item.start,
                end: item.end
              })
            }
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
  deleteHistory: function(){
    var that = this;
    app.helper.request.requestLoading(app.globalData.url + '/user/deleteHistory', { userId: wx.getStorageSync("userId"), historyId: that.data.historyId}, app.globalData.header, ' ',
      function (res) {
        if (res.status == '1') {
          wx.navigateBack({
            delta: 1,
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