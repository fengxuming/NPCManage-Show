/**
 * Created by pro on 2016/11/11.
 */
angular
  .module('inspinia')
  .filter('splitArr', function() {
    return function(input) {
      if(input){
        return input.join()
      }
    }
  })
  .filter('interval', function() {
    return function(input) {
      var time = parseInt(Math.abs(new Date().getTime() - new Date(input).getTime()) / 1000);
      var result;
      if(time<60) result = '刚刚';
      else if(time < 60*60) result = Math.ceil(time/60) + '分钟前';
      else if(time < 60*60*24) result = Math.ceil(time/(60*60)) + '小时前';
      else if(time < 60*60*24*30) result = Math.ceil(time/(60*60*24)) + '天前';
      else if(time < 60*60*24*60) result = '上个月前';
      else if(time < 60*60*24*90) result = '两个月前';
      else {
        var _months = Math.floor(time/(60*60*24*30));
        result = _months + '个月前';
      }
      return result;
    }
  });
