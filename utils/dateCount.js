function dateDiff(sDate1, sDate2) {    //sDate1和sDate2是2002-12-18格式  ,两日期相差天数
  var aDate, oDate1, oDate2, iDays
  aDate = sDate1.split("-")
  oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2002格式  
  aDate = sDate2.split("-")
  oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
  iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数  
  return iDays
}

function dateAfter(start,days) {
  var startDate = new Date(start);
  var intValue = 0;
  var endDate = null;

  intValue = startDate.getTime();
  intValue += days * (24 * 3600 * 1000);
  endDate = new Date(intValue);
  return endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate();
}

module.exports = {
  dateDiff: dateDiff,
  dateAfter: dateAfter
}