exports.install = function (Vue) {
  Vue.prototype.$timestamp = function timestamp(timestamp) {
    // console.log(timestamp)
    timestamp=Number(timestamp)
    var date = new Date(timestamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = date.getDate();
    d = d < 10 ? "0" + d : d;
    var h = date.getHours();
    h = h < 10 ? "0" + h : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
  }

  // 比较时间
  Vue.prototype.$nowInDateBetwen = function (d1, d2) {
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateBegin = new Date(d1.replace(/-/g, "/")); //将-转化为/，使用new Date
    var dateEnd = new Date(d2.replace(/-/g, "/")); //将-转化为/，使用new Date
    // var dateBegin = new Date(d1); //将-转化为/，使用new Date
    // var dateEnd = new Date(d2); //将-转化为/，使用new Date
    var dateNow = new Date(); //获取当前时间
    var beginDiff = dateNow.getTime() - dateBegin.getTime(); //时间差的毫秒数       
    // var beginDayDiff = Math.floor(beginDiff / (24 * 3600 * 1000)); //计算出相差天数

    var endDiff = dateNow.getTime() - dateEnd.getTime(); //时间差的毫秒数
    // var endDayDiff = Math.floor(endDiff / (24 * 3600 * 1000)); //计算出相差天数    

    // a==>未开始  b==>已结束 c==>在时间段内
    if (beginDiff < 0) {
      return 'a'
    }
    if (endDiff > 0) {
      return 'b'
    }
    if (beginDiff > 0 && endDiff < 0) {
      return 'c'
    } else {
      return 'd'
    }
  }
};
