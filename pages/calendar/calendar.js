//logs.js
var util = require('../../utils/util.js')
var getDaysArray = require('../../utils/getDaysArray.js')
var dateCount = require('../../utils/dateCount.js')
const app = getApp();

Page({
  data: {
    nowDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + '-' + (new Date().getDate()),
    tomonth: '',
    monthly: false,
    danger: false,
    list: [],
    ymd: "",
    selected_ymd: "",
    selected_action: "",
    month_later: 0,
    periodEndLately: ''
  },
  onShow: function(){
    var that = this
    var tomonth = this.this_month()
    that.setData({
      tomonth: tomonth,
      month_later: 0
    })
    that.getUserInfo();
  },
  prev: function (e) {
    var that = this
    var now = that.data.tomonth;
    var arr = now.split('-');
    var year, month
    if (arr[1] - 1 == 0) {//如果是1月份，则取上一年的12月份
      year = arr[0] - 1;
      month = 12;
    } else {
      year = arr[0];
      month = arr[1] - 1;
    }
    month = (month < 10 ? "0" + month : month);
    var tomonth = year + "-" + month;
    that.setData({
      tomonth: tomonth,
      month_later: that.data.month_later - 1
    })
    that.draw_calendar(tomonth, that.data.month_later);

  },
  next: function (e) {
    var that = this
    var now = that.data.tomonth;
    var arr = now.split('-');
    var year, month
    if (arr[1] - 0 + 1 == 13) {//如果是1月份，则取上一年的12月份
      year = arr[0] - 0 + 1;
      month = 1;
    } else {
      year = arr[0];
      month = arr[1] - 0 + 1;
    }
    month = (month < 10 ? "0" + month : month);
    var tomonth = year + "-" + month;
    that.setData({
      tomonth: tomonth,
      month_later: that.data.month_later + 1
    })
    that.draw_calendar(tomonth, that.data.month_later);
  },
  this_month: function (e) {
    var that = this;
    var date = new Date;
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" + month : month);
    var year = date.getFullYear();
    var tomonth = year + "-" + month;
    return tomonth;
  },
  draw_calendar: function (now,month_later) {
    var arr = now.split('-');
    var year = arr[0];
    var month = arr[1];
    var that = this;
    var list = [];
    var d = new Date(year, month - 1, 1, 1, 1, 1);
    var firstDay = d.getDay();
    var allDate = new Date(d.getFullYear(), (d.getMonth() + 1), 0).getDate();
    var ymd;
    for (var i = 0; i < firstDay; i++) {
      list.push({
        ymd: "",
        date: "",
        love: false,
        danger: false,
        monthly: false,
        today: false,
      })
    }
    var j = 1;
    var k = i;
    for (i; i < allDate + k; i++) {
      var love = false;
      var dd = new Date();
      var y = dd.getFullYear();
      var m = dd.getMonth() + 1;//获取当前月份的日期 
      var d = dd.getDate();
      var ymd = year + "-" + month + "-" + j;
      var today = ''
      if (year == y && month == m && d == j) {
        today = true;
        that.setData({
          ymd: ymd
        })
      } else {
        today = false;
      }
      var item = {
        ymd: ymd,
        date: j,
        love: that.checkLove(ymd),
        danger: false,
        monthly: false,
        safe: false
      }
      list.push(item);
      if (that.data.periodStartLately != ''&& that.compareDate(that.data.nowDate,ymd)&& !item.love && !item.danger && !item.safe){   //获取以后月份的预测
        var aaa = {
          ymd: ymd,
          date: j,
          love: false,
          danger: that.checkFutureDanger(ymd, month_later),
          monthly: that.checkFutureMonthly(ymd, month_later),
          safe: that.checkFutureSafe(ymd, month_later)
        }
        list.splice(list.indexOf(item), 1, aaa);

        if (month_later >= 1 && !aaa.monthly && !aaa.danger && !aaa.safe) {
          var newItem = {
            ymd: ymd,
            date: j,
            love: false,
            danger: that.checkFutureDanger(ymd, month_later - 1),
            monthly: that.checkFutureMonthly(ymd, month_later - 1),
            safe: that.checkFutureSafe(ymd, month_later - 1)
          } 
          list.splice(list.indexOf(aaa), 1, newItem)
          if (month_later > 1 && !newItem.monthly && !newItem.danger && !newItem.safe) {
            var bbb = {
              ymd: ymd,
              date: j,
              love: false,
              danger: that.checkFutureDanger(ymd, month_later + 1),
              monthly: that.checkFutureMonthly(ymd, month_later + 1),
              safe: that.checkFutureSafe(ymd, month_later + 1)
            }
            list.splice(list.indexOf(newItem), 1, bbb)
          }   
        } 
        
      }
      j++;
    }

    var lastDay = new Date(year, month - 1, allDate, 1, 1, 1).getDay();
    var k = i;
    for (i; i < (6 - lastDay + k); i++) {
      list.push({
        ymd: "",
        date: "",
        love: false,
        danger: false,
        monthly: false,
        today: 0,
      })
    }
    that.setData({
      list: list
    })
    
  },
  // selected_day: function (e) {   //选择日期
  //   var ymd = e.currentTarget.dataset.ymd;
  //   this.setData({
  //     ymd: ymd
  //   })
  //   var action = wx.getStorageSync(ymd);
  //   if (action == "monthly") {
  //     this.setData({
  //       monthly: true
  //     })
  //   } else {
  //     this.setData({
  //       monthly: false
  //     })
  //   }
  //   if (action == "love") {
  //     this.setData({
  //       love: true
  //     })
  //   } else {
  //     this.setData({
  //       love: false
  //     })
  //   }
  // },
  compareDate: function(t1, t2){
    var strs1= new Array(); //定义一数组
    strs1=t1.split("-"); //字符分割
    var strs2= new Array(); //定义一数组
    strs2=t2.split("-"); //字符分割
    if (strs1[2].length == 1) {
      strs1[2] = '0' + strs1[2];
    }
    if (strs2[2].length == 1) {
      strs2[2] = '0' + strs2[2];
    }
    if(parseInt(strs1[0])> parseInt(strs2[0])) { return false; }
    else if(parseInt(strs1[0]) <parseInt( strs2[0])) { return true; }
    else{}
    if(parseInt(strs1[1] )> parseInt(strs2[1])) { return false; }
    else if(parseInt(strs1[1]) <parseInt( strs2[1])) { return true; }
    else{}
    if (parseInt(strs1[2]) > parseInt(strs2[2])) { return false; }
    else if (parseInt(strs1[2]) <= parseInt(strs2[2])) { return true; }
    else{}
    return true;
  },
  getUserInfo: function () {
    var that = this;
    app.helper.request.requestLoading(app.globalData.url + '/user/getUserInfo', { userId: wx.getStorageSync("userId") }, app.globalData.header, ' ',
      function (res) {
        if (res.status == '1') {
          that.setData({
            status: res.result.status,
            history: res.result.history,
            periodCycle: res.result.periodCycle,
            periodStart: res.result.periodStart,
            periodEndLately: res.result.periodEndLately,
            periodStartLately: res.result.periodStartLately
          })
          that.draw_calendar(that.data.tomonth, that.data.month_later);
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
  checkLove: function(ymd){//经期
    var that = this;
    var love = false;
    that.data.history.forEach(function (item) {    
      if (that.compareDate(ymd, item.end) && that.compareDate(item.start, ymd)) {
        love = true;
      }
    })
    if (that.data.periodStart!==''){
      if (that.compareDate(ymd, that.data.nowDate) && that.compareDate(that.data.periodStart, ymd)) {
        love = true;
      }
    }
    return love;
  },
  checkFutureMonthly: function (ymd,later) {//预测经期
    var that = this;
    var monthly;
    monthly = false;
    var startDay = dateCount.dateAfter(that.data.periodStartLately, later * that.data.periodCycle);
    var endDay = dateCount.dateAfter(that.data.periodStartLately, later * that.data.periodCycle + 4);
    if (that.compareDate(ymd, endDay) && that.compareDate(startDay, ymd)) {
      monthly = true;
    }
    return monthly;
  },
  checkFutureSafe: function (ymd, later){
    var that = this;
    var safe;
    var firstDays = that.data.periodCycle > 28 ? that.data.periodCycle - 28 + 4 : 4;
    var first_safe_days_start = dateCount.dateAfter(that.data.periodEndLately, that.data.periodCycle * later+1);
    var first_safe_days_end = dateCount.dateAfter(that.data.periodEndLately, that.data.periodCycle * later  + firstDays);
    var second_safe_days_start = dateCount.dateAfter(that.data.periodEndLately, that.data.periodCycle * later + 1 + firstDays + 10);
    var second_safe_days_end = dateCount.dateAfter(that.data.periodEndLately, that.data.periodCycle * later + 1 + firstDays + 10 + 9);
    safe = false;
    if (that.compareDate(ymd, first_safe_days_end) && that.compareDate(first_safe_days_start, ymd)) {
      safe = true;
    } else if (that.compareDate(ymd, second_safe_days_end) && that.compareDate(second_safe_days_start, ymd)) {
      safe = true;
    }
    return safe;
  },
  checkFutureDanger: function(ymd, later){
    var that = this;
    var danger;
    var firstDays = that.data.periodCycle > 28 ? that.data.periodCycle - 28 + 4 : 4;
    var danger_start_date = dateCount.dateAfter(that.data.periodEndLately, that.data.periodCycle * later + 1 + firstDays);
    var danger_end_date = dateCount.dateAfter(that.data.periodEndLately, that.data.periodCycle * later + 1 + firstDays + 9);
    danger = false;
    if (that.compareDate(ymd, danger_end_date) && that.compareDate(danger_start_date, ymd)) {
      danger = true;
    }
    return danger;
  }
})
