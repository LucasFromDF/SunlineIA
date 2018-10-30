angular.module('starter.services', [])
 /**
  * 用户提示信息
  */
.factory("dialogsManager", function($q,$compile,$timeout,$rootScope) {

  //消息模板
  var megTmp="<div class='nspop_megcontainer myactive' >" +
      "<div class='main'>" +
      "<div class='textContent'>{{content}}</div>" +
      "</div>" +
      "</div>";

  var dialog={
      megs:[],
      showMessage:showMessage,
      alert:alert,  //未实现
      confirm:confirm, //未实现
  };

  //消息展示
  function showMessage(content,options) {
      //移除已存在的消息展示
      angular.forEach(dialog.megs, function (item,index) {
          item.remove();
      });
      createMeg(content,options);
  };

  //消息创建
  function createMeg(content,options){
      options = angular.extend({
          bottom: 60, //继续下边距离
          scope: $rootScope.$new(), //创建一个继承自根的作用域
          timeout: 2000  //多少秒后自动隐藏
      }, options);
      //消息文本
      options.scope.content = content;
      var megPromise = $q.when(compileTmp({template: megTmp, scope: options.scope, appendTo: angular.element(document.body)}))
      megPromise.then(function (result) {
          dialog.megs.push(result);
          result.css("bottom", options.bottom + "px");
          $timeout(function () {
              result.remove(); //移除消息展示
              options.scope.$destroy();  //摧毁作用域
          },options.timeout);
      })
  }

  //编译模板
  function compileTmp(options){
      var tem=  $compile(options.template)(options.scope);
      if(options.appendTo){
          options.appendTo.append(tem);
      }
      return tem;
  };
  return dialog;

})
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    title:'XXX收购项目',
    abbreviation:'buy',
    lastText: 'You on your way?',
    subTitle:'业务申请详情',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    title:"XXX处置项目",
    abbreviation:'management',
    lastText: 'Hey, it\'s me',
    subTitle:'业务申请详情',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    title:"XXX资产流转项目",
    abbreviation:'wander',
    lastText: 'I should buy a boat',
    subTitle:'业务申请详情',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    title:"XXX投资项目",
    abbreviation:'investment',
    lastText: 'Look at my mukluks!',
    subTitle:'业务申请详情',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    title:"付款审批",
    abbreviation:'payment',
    lastText: 'This is wicked good ice cream.',
    subTitle:'付款审批详情',
    bonds:[{id:"315300",name:"更新设备",money:"1000万",agent:"张三"},{id:"315301",name:"市场拓展",money:"1000万",agent:"李四"}],
    payAccounts:[],
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].abbreviation === chatId) {
          return chats[i];
        }
      }
      return null;
    }
  };
  
})
.service('tools',function(){
  //非空判断
	this.isNull = function (str){
		var str = (str+"").trim();
    if (str == "null" || str == null || typeof (str) == "undefined" || str == "undefined" || str === "") {
        return true;
    }
    return false;
  }
  /**
  * 千分位转换方法
 * @param num 要转换的数字
 * @param cent  保留的小数位数
 */
  this.toThousands = function(num, cent){
    if(typeof (num) == "undefined") {
      return null;
  }
//    cent = 0;
    var tempNum = num.toString();
    var numArr = num.toString().split('.');
    if(cent == 0){
        return numArr[0].toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }
    else{
        if(!numArr[1]){
        numArr[1] = "";
    }
    if(numArr[1].length < cent){
        for(var i=0,length = cent - numArr[1].length; i<length; i++){
            numArr[1] += "0";
      }
    }
      return numArr[0].toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' +numArr[1].substring(0, cent);
  }
  }
})
.filter('changedate',function(){
  return function(str){
    var path = str+"";
    var year  = path.substr(0,4);
    var month  = path.substr(4,2);
    var day  = path.substr(6,2);
    return year + "-" + month +"-"+ day;
  }
})
/**
 * 千分位转换方法
 * @param num 要转换的数字
 */
.filter('toThousands',['tools',function(tool){
  return function(num){
   if(tool.isNull(num)){
     return null;
   }
   var tempNum = num.toString();
   var numArr = num.toString().split('.');
   return numArr[0].toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  }
}])
//过滤10为以上过滤
.filter('CarouselContentFilter',function(){
  return function(str){
      if(str){
        var carContent = '';
        if(str.length >= 10){
          str.length = 10;
          carContent = str.substring(0,10) + '...';
        }
        else {
          carContent = str
        }
        return carContent;
      }
  }
})
//动态设置ion-srcoll的高度
.directive('scrollHeight',function($window){
  return{
    restrict:'AE',
    link:function(scope,element,attr){
      element[0].style.height=($window.innerHeight-44-58-100-34-80)+'px';
    }
  }
});
