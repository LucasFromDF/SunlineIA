angular.module('starter.controllers', [])
.controller('tabCtrl',function($scope){
  $scope.showItemTab ="";
  window.addEventListener('native.keyboardshow', keyboardShowHandler);
  function keyboardShowHandler(e){
    $scope.showItemTab= "tabs-item-hide";
  }
  window.addEventListener('native.keyboardhide', keyboardHideHandler);
  function keyboardHideHandler(e){
    $scope.showItemTab ="";
  }

})
.controller('pendingWorkCtrl', function($state,$scope,$rootScope,$http,$interval,$ionicPopup,$ionicLoading,tools) {
  $scope.bt1 = true;
  $scope.bt2 = false;
  $scope.bt3 = false;
  $scope.bt4 = false;
  $scope.payAccounts = []; 
  //返回刷新
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.doRefresh();//刷新页面
  });
  //APP服务器获取数据
  var pendingWorkParam = { 
    "login_code": $rootScope.rejectNode,
    "actionName":"getTodoTaskAndNotifys",
    "module_type":"0",
    "pageNumber":"1",
    "pageSize":"6"
};
$scope.sendUrl = function(){
  var param = JSON.stringify(pendingWorkParam);
  CIBH5SDK.SendRequest(param);
  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
  });
  var num = 0;
  var interval = $interval(function () {
      ++num;
      if (getTodoTaskAndNotifys_RESULT) {
        var pendingWorkList = JSON.parse(getTodoTaskAndNotifys_RESULT);
        if(tools.isNull(pendingWorkList.data)){
          var alertPopup = $ionicPopup.alert({
              title: '暂无数据'
            });
          $scope.doneWorks = ""; 
          }
        else{
          $scope.doneWorks = pendingWorkList.data; 			      
        }
        $ionicLoading.hide();
        $interval.cancel(interval);
        
      }
      
      if (num == 20) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '抱歉,暂无数据,请稍候重试!'
        });
      }
  },500,20);
}
$scope.hasValue = true; //到底判定
  $scope.dropDown_doRefresh = function(){
    var alertPopup = $ionicPopup.alert({
      title: '下拉刷新!'
    });
    alertPopup.then(function(res) {
      console.log('Thank you');
      $scope.$broadcast('scroll.refreshComplete'); 

    });
  };
  $scope.hasMore = function () { 
      return $scope.hasValue; 
  } 
  $scope.loadMore = function () { 
    getTodoTaskAndNotifys_RESULT ="";
      $scope.pageIndex=parseInt(pendingWorkParam.pageNumber)+1; 
      pendingWorkParam.pageNumber = $scope.pageIndex+"";
      var param = JSON.stringify(pendingWorkParam);
      CIBH5SDK.SendRequest(param);
      $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
      });
      var num = 0;
      var interval = $interval(function () {
    	    ++num;
    	    if (getTodoTaskAndNotifys_RESULT) {
    	      var pendingWorkList = JSON.parse(getTodoTaskAndNotifys_RESULT);
    	      if(tools.isNull(pendingWorkList.data)){
    	    	  $scope.hasValue = false; 
    	      }
    	      else{	    	  
    	    	  $scope.doneWorks = $scope.doneWorks.concat(pendingWorkList.data); 
    	      }
    	      $scope.$broadcast('scroll.infiniteScrollComplete');
    	      $ionicLoading.hide();
    	      $interval.cancel(interval);  	      
    	    }
    	    if (num == 20) {
    	      $scope.$broadcast('scroll.infiniteScrollComplete');
    	      $ionicLoading.hide();
    	      var alertPopup = $ionicPopup.alert({
    	        title: '抱歉,暂无数据,请稍候重试!'
    	      });
    	    }
    	  },500,20);
      
  }
  $scope.clearCash= function(taskId,busstp,proccd,ispriv,taskType,notifyId,brchcd,procid){
    $state.go('tab.pendingWork-detail', {type:1});
    queryFormDetail_RESULT ="";
    saveFormDetail_RESULT="";
    submitTaskParam_RESULT ="";
	  $rootScope.pending_taskId = taskId;
	  $rootScope.pending_form_id = busstp;
    $rootScope.pending_proccd = proccd;
    $rootScope.pending_ispriv = ispriv;
    $rootScope.pending_taskType = taskType;
    $rootScope.pending_notifyId = notifyId;
    $rootScope.pending_brchcd = brchcd;
    $rootScope.pending_procid =procid;
    // $rootScope.authorizedExaminer = "";
    // $rootScope.meet_host = "";
    // $rootScope.examinant = "";
    // $rootScope.unitExaminant = "";
    // $rootScope.replyExaminant = "";
    // $rootScope.countersigner = "";
    // $rootScope.administrator = "";
    // $rootScope.bankAccount1="";
  }
  $scope.test = function(index){  
    $scope.bt1 = false;
    $scope.bt2 = false;
    $scope.bt4 = false;
    if(index==1){
      $scope.bt1 = true;
      getTodoTaskAndNotifys_RESULT ="";
      //访问全部
      pendingWorkParam.module_type = "0";
      pendingWorkParam.pageNumber = "1";
      $scope.hasValue = true; 
      $scope.sendUrl();
    }
    if(index==2){
      $scope.bt2 = true;
      getTodoTaskAndNotifys_RESULT ="";
      //访问业务申请
      pendingWorkParam.module_type = "1";
      pendingWorkParam.pageNumber = "1";
      $scope.hasValue = true; 
      $scope.sendUrl();
    }
    if(index==4){
      $scope.bt4= true;
      getTodoTaskAndNotifys_RESULT ="";
      //访问付款审批
      pendingWorkParam.module_type = "2";
      pendingWorkParam.pageNumber = "1";
      $scope.hasValue = true; 
      $scope.sendUrl();
    }
  };
  $scope.doRefresh = function(){
      //返回回来时 按钮返回到全部
      $scope.bt2 = false;
      $scope.bt4 = false;
      $scope.bt1 = true;
      getTodoTaskAndNotifys_RESULT ="";
      //访问全部
      pendingWorkParam.module_type = "0";
      pendingWorkParam.pageNumber = "1";
      $scope.hasValue = true; 
      $scope.sendUrl();
  }
})

.controller('pendingWorkDetailCtrl', function($scope, $stateParams,$state,$rootScope,$ionicPopup,tools,$ionicLoading,$interval,$ionicHistory) {
  //二级标题按钮
  $scope.form_del = true;
  $scope.app_pro = false;
  $scope.majors=[{id:"00",name:"-请选择-"},{id:"01",name:"是"},{id:"02",name:"否"}];
  $scope.results=[{id:"00",name:"-请选择-"},{id:"01",name:"同意"},{id:"02",name:"否决"},{id:"03",name:"再议"}];
  $scope.votes = [{id:"00",name:"-请选择-"},{id:"01",name:"同意"},{id:"02",name:"否决"},{id:"03",name:"再议"},{id:"04",name:"再不表决"}];
  $scope.ways = [{id:"00",name:"-请选择-"},{id:"01",name:"拍卖"},{id:"02",name:"协议转让"},{id:"03",name:"债务重组"},{id:"04",name:"其他"},{id:"05",name:"要约邀请公开竞价"},{id:"06",name:"网上竞价"}];
  $scope.whethers= [{id:"00",name:"默认否"},{id:"01",name:"是"},{id:"02",name:"否"}];
  $scope.payAccounts = []; 
  $scope.pending_ispriv=$rootScope.pending_ispriv; //获取pending_ispriv
  $scope.isNotify=$rootScope.pending_taskType;    //获取isNotify
  $rootScope.administrator = "";//将传过来的会办加签人员初始化
  $rootScope.countersigner = "";
  $rootScope.countersigner_usercode = "";
  $rootScope.administrator_usercode = "";
  $scope.administrator= "";
  $scope.countersigner= "";//将传过来的会办加签人员初始化
  //将下划线 初始化
  $scope.business_view_Class ="item listFont1";
  $scope.business_censor_view_Class ="item item-input item-select";
  $scope.is_meetresolution_Class="item listFont1 pos_rel";
  $scope.meet_issue_Class="item listFont1 pos_rel";
  $scope.hostName_Class = "item item-input item-select";
  $scope.vote_conclusion_Class = "item listFont1";
  $scope.vote_situation_Class = "item item-input item-select";
  $scope.reply_conclusion_Class = "item listFont1";
  $scope.meet_date_Class = "item listFont1 pos_rel";
  $scope.summary_issuing_date_Class ="item item-input item-select";
  $scope.bugorsold_Class ="item listFont1";
  $scope.max_purchasing_price_Class = "item item-input item-select";
  $scope.vote_result_Class = "item listFont1 pos_rel";
  $scope.transfer_base_time_Class = "item item-input item-select";
  $scope.meet_dispose_way_c_Class = "item listFont1";
  $scope.meet_recycle_cash_Class = "item listFont1";
  $scope.meet_recycle_asset_Class ="item listFont1";
  $scope.is_finan_sector_filing_Class = "item item-input item-select";
  $scope.is_publicity_Class = "item item-input item-select";
  $scope.is_preemption_Class = "item item-input item-select";
  $scope.is_auction_Class = "item item-input item-select";
  $scope.is_circul_dept_Class = "item listFont1";
  $scope.invest_amount_Class = "item listFont1";
  $scope.yield_rate_Class ="item listFont1";
  $scope.meet_issue_Class = "item listFont1";
  $scope.examinantName_Class = "item listFont1 pos_rel";
  $scope.unitExaminantName_Class = "item listFont1 pos_rel";
  $scope.net_amount_Class = "item listFont1";
  $scope.added_value_tax_Class = "item listFont1 pos_rel";
  $scope.payment_bank_account_Class = "item22 listFont1";
  $scope.pay_amount_Class = "item22 listFont1";




  var rejectNode = "";
  var current_TaskName = "";
  var fileName ="";
  //返回刷新
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.doRefresh();//刷新页面
  });
  $scope.in = {};
  
  //主体对象日期插件
   $scope.datepickerObjectEnd1 = {
    titleLabel: '选择日期',  //可选
    todayLabel: '今天',  //可选
    closeLabel: '关闭',  //可选
    setLabel: '确认',  //可选
    setButtonType: 'button-positive',  //可选
    todayButtonType: 'button-positive',  //可选
    closeButtonType: 'button-positive',  //可选
    inputDate: new Date(),  //可选，输入值
    mondayFirst: false,  //可选,星期一开头
    disabledDates: disabledDates, //可选
    weekDaysList: weekDaysList, //可选
    monthList: monthList, //可选
    templateType: 'popup', //可选i.e.的模式 modal or popup(兼容模式？)
    showTodayButton: 'true', //可选
    modalHeaderColor: 'bar-positive', //可选
    modalFooterColor: 'bar-positive', //可选
    from: new Date(1900, 1, 1), //可选
    to: new Date(2100, 12, 31),  //可选
    callback: function (val) {  //Mandatory
      datePickerCallbacke1(val);
    },
    dateFormat: 'yyyy-MM-dd', //可选
    closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
  };
  $scope.datepickerObjectEnd2 = {
    titleLabel: '选择日期',  //可选
    todayLabel: '今天',  //可选
    closeLabel: '关闭',  //可选
    setLabel: '确认',  //可选
    setButtonType: 'button-positive',  //可选
    todayButtonType: 'button-positive',  //可选
    closeButtonType: 'button-positive',  //可选
    inputDate: new Date(),  //可选，输入值
    mondayFirst: false,  //可选,星期一开头
    disabledDates: disabledDates, //可选
    weekDaysList: weekDaysList, //可选
    monthList: monthList, //可选
    templateType: 'popup', //可选i.e.的模式 modal or popup(兼容模式？)
    showTodayButton: 'true', //可选
    modalHeaderColor: 'bar-positive', //可选
    modalFooterColor: 'bar-positive', //可选
    from: new Date(1900, 1, 1), //可选
    to: new Date(2100, 12, 31),  //可选
    callback: function (val) {  //Mandatory
      datePickerCallbacke2(val);
    },
    dateFormat: 'yyyy-MM-dd', //可选
    closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
  };
  $scope.datepickerObjectEnd3 = {
    titleLabel: '选择日期',  //可选
    todayLabel: '今天',  //可选
    closeLabel: '关闭',  //可选
    setLabel: '确认',  //可选
    setButtonType: 'button-positive',  //可选
    todayButtonType: 'button-positive',  //可选
    closeButtonType: 'button-positive',  //可选
    inputDate: new Date(),  //可选，输入值
    mondayFirst: false,  //可选,星期一开头
    disabledDates: disabledDates, //可选
    weekDaysList: weekDaysList, //可选
    monthList: monthList, //可选
    templateType: 'popup', //可选i.e.的模式 modal or popup(兼容模式？)
    showTodayButton: 'true', //可选
    modalHeaderColor: 'bar-positive', //可选
    modalFooterColor: 'bar-positive', //可选
    from: new Date(1900, 1, 1), //可选
    to: new Date(2100, 12, 31),  //可选
    callback: function (val) {  //Mandatory
      datePickerCallbacke3(val);
    },
    dateFormat: 'yyyy-MM-dd', //可选
    closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
  };
  $scope.datepickerObjectEnd4 = {
    titleLabel: '选择日期',  //可选
    todayLabel: '今天',  //可选
    closeLabel: '关闭',  //可选
    setLabel: '确认',  //可选
    setButtonType: 'button-positive',  //可选
    todayButtonType: 'button-positive',  //可选
    closeButtonType: 'button-positive',  //可选
    inputDate: new Date(),  //可选，输入值
    mondayFirst: false,  //可选,星期一开头
    disabledDates: disabledDates, //可选
    weekDaysList: weekDaysList, //可选
    monthList: monthList, //可选
    templateType: 'popup', //可选i.e.的模式 modal or popup(兼容模式？)
    showTodayButton: 'true', //可选
    modalHeaderColor: 'bar-positive', //可选
    modalFooterColor: 'bar-positive', //可选
    from: new Date(1900, 1, 1), //可选
    to: new Date(2100, 12, 31),  //可选
    callback: function (val) {  //Mandatory
      datePickerCallbacke4(val);
    },
    dateFormat: 'yyyy-MM-dd', //可选
    closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
  };
  //切换表单详情 ----  审批流程
  $scope.test = function(index){  
    $scope.form_del = false;
    $scope.app_pro = false;
    if(index==1){
      $scope.form_del = true;
    }
    if(index==2){
      $scope.app_pro =true; 
    }
  };
  //文件下载
  $scope.downLoadMethod = function(absolute_url,file_name){
    var fileDownloadParam = {
      login_code: $rootScope.rejectNode,
      actionName:"fileDownload",
      path:absolute_url
    };
    fileName = file_name;
    $scope.sendUrl(fileDownloadParam);
  }
  //意见将驳回置空
    $scope.getIdea = function(){
      $scope.in.isReject="";
      $scope.rejectPosition = "";
      rejectNode = "";
      $scope.doneWork.fpRemark=$scope.in.choose;

    }
  //加签
  $scope.countersigne=function(){
    $scope.administrator="";
    $rootScope.administrator = "";
    $scope.in.isAdministrat = "";
    $rootScope.administrator_usercode = "";
  }
  //会办
  $scope.administrat=function(){
    $scope.countersigner="";
    $rootScope.countersigner = "";
    $scope.in.isCountersigne = "";
    $rootScope.countersigner_usercode = "";
  }
  //驳回
  $scope.rejectParm = function(){
    $scope.doneWork.fpRemark="";
    $scope.in.isCountersigne="";
    $scope.in.isAdministrat = "";

    $scope.administrator= "";
    $rootScope.administrator = "";
    $scope.countersigner= "";
    $rootScope.countersigner = "";
    $scope.rejectPosition = "";
    rejectNode = "";
    $rootScope.countersigner_usercode = "";
    $rootScope.administrator_usercode = "";
  }
  //数据发送获取
  var pendingDetailParam = { 
    "login_code": $rootScope.rejectNode,
    "actionName":"queryFormDetail",
    "proccd":$rootScope.pending_proccd,
    "form_id":$rootScope.pending_form_id,
    "taskId":$rootScope.pending_taskId
};
$scope.sendUrl = function(jsParam){
  //所有公共返回结果初始化
  queryFormDetail_RESULT="";
  saveFormDetail_RESULT="";
  submitTaskParam_RESULT = "";
  addTasks_RESULT = "";
  jointlyTasks_RESULT = "";
  queryRetuanable_RESULT = "";
  returnTask_RESULT = "";
  queryRouteList_RESULT ="";
  fileDownload_RESULT = ""
  var param = JSON.stringify(jsParam);
  CIBH5SDK.SendRequest(param);
  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
  });
  var num = 0;
  var interval = $interval(function () {
      ++num;
      if (queryFormDetail_RESULT) {
        var pendingDetailList = JSON.parse(queryFormDetail_RESULT);
        if(tools.isNull(pendingDetailList.data)){
          var alertPopup = $ionicPopup.alert({
              title: '暂无数据'
            });
          $scope.doneWork = ""; 
          }
        else{
          $scope.doneWork = pendingDetailList.data[0]; 
          
          //换行处理
          if(pendingDetailList.data[0].type == "01" || pendingDetailList.data[0].type == "02" || pendingDetailList.data[0].type == "03" || pendingDetailList.data[0].type == "06"){
            $scope.doneWork.business_view = pendingDetailList.data[0].business_view.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.business_censor_view = pendingDetailList.data[0].business_censor_view.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.prj_plan_detail_desc = pendingDetailList.data[0].prj_plan_detail_desc.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.asset_remark = pendingDetailList.data[0].asset_remark.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.other_description = pendingDetailList.data[0].other_description.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.vote_situation = pendingDetailList.data[0].vote_situation.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.approval_opinion = pendingDetailList.data[0].approval_opinion.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.council_summary_report = pendingDetailList.data[0].council_summary_report.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.project_background = pendingDetailList.data[0].project_background.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.program_compare = pendingDetailList.data[0].program_compare.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.other = pendingDetailList.data[0].other.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.talk_content = pendingDetailList.data[0].talk_content.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.project_background = pendingDetailList.data[0].project_background.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.capital_source = pendingDetailList.data[0].capital_source.replace(/<br\/>/g, "\n"); 
          }
          else{
            $scope.doneWork.fkabstract = pendingDetailList.data[0].fkabstract.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.completion = pendingDetailList.data[0].completion.replace(/<br\/>/g, "\n"); 
            $scope.doneWork.memo = pendingDetailList.data[0].memo.replace(/<br\/>/g, "\n");
            $scope.payAccounts = pendingDetailList.data[0].listBank;
            $scope.doneWork.payAccounts = $scope.payAccounts;
            if(tools.isNull(pendingDetailList.data[0].listFile) == false){
              $scope.Enclosures = pendingDetailList.data[0].listFile;
              $scope.Enclosures.forEach(function(i,index){
                var str =i.file_name.length;
                if(str>22){
                  i.Enclosure_isLength = "3";
                }
                else if(str>12 && str <= 22){
                  i.Enclosure_isLength = "2";
                }
                else{
                  i.Enclosure_isLength = "1";
                }
              })
            }
            if(tools.isNull(pendingDetailList.data[0].listAssets) == false){
              $scope.listAssets = pendingDetailList.data[0].listAssets;
              $scope.listAssets.forEach(function(i,index){
                i.data.forEach(function(j,id){
                  var val =j.value;
                  var len = 0;
                  for (var i = 0; i < val.length; i++) {
                      var a = val.charAt(i);
                      if (a.match(/[^\x00-\xff]/ig) != null) {//\x00-\xff→GBK双字节编码范围
                          len += 1;
                      }
                      else {
                          len += 0.5;
                      }
                  }
                  if(len>8){
                    j.listAsset_isLength = "true";
                  }
                  else{
                    j.listAsset_isLength = "false";
                  }
                })
              })
            }
          }       
          //控制下划线颜色
          if(tools.isNull($scope.doneWork.app_node) == false){
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='deptMgr')) == false){
              $scope.business_view_Class ="item115 listFont1";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='reviewDirecto')) == false){
              $scope.business_censor_view_Class ="item115 item-input item-select";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='reviewLeadership')) == false){
              $scope.is_meetresolution_Class ="item115 listFont1 pos_rel";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='handle1')) == false){
              $scope.is_meetresolution_Class ="item117 listFont1 pos_rel";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='handle1')) == false){
              $scope.meet_issue_Class ="item115 listFont1 pos_rel";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='handle1')) == false){
              $scope.hostName_Class ="item115 item-input item-select";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='handle1')) == false){
              $scope.vote_conclusion_Class = "item115 listFont1";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='handle1')) == false){
              $scope.vote_situation_Class = "item115 item-input item-select";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='youquan')) == false){
              $scope.reply_conclusion_Class = "item116 listFont1";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='handle2')) == false){
              $scope.meet_date_Class = "item115 listFont1 pos_rel";
              $scope.summary_issuing_date_Class ="item115 item-input item-select";
              $scope.bugorsold_Class ="item115 listFont1";
              $scope.max_purchasing_price_Class = "item115 item-input item-select";
              $scope.vote_result_Class = "item115 listFont1 pos_rel";
              $scope.transfer_base_time_Class = "item115 item-input item-select";
              $scope.meet_dispose_way_c_Class = "item115 listFont1";
              $scope.meet_recycle_cash_Class = "item115 listFont1";
              $scope.meet_recycle_asset_Class ="item115 listFont1";
              $scope.is_finan_sector_filing_Class = "item115 item-input item-select";
              $scope.is_publicity_Class = "item115 item-input item-select";
              $scope.is_preemption_Class = "item115 item-input item-select";
              $scope.is_auction_Class = "item115 item-input item-select";
              $scope.is_circul_dept_Class = "item115 listFont1";
              $scope.invest_amount_Class = "item115 listFont1";
              $scope.yield_rate_Class ="item115 listFont1";
              $scope.meet_issue_Class = "item116 listFont1";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='zonghegang')) == false){
              $scope.examinantName_Class = "item115 listFont1 pos_rel";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='yewuzonghe')) == false){
              $scope.unitExaminantName_Class = "item115 listFont1 pos_rel";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='yewupifu')) == false){
              $scope.unitExaminantName_Class = "item117 listFont1 pos_rel";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='3')) == false){
              $scope.net_amount_Class = "item115 listFont1";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='3')) == false){
              $scope.added_value_tax_Class = "item116 listFont1 pos_rel";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='3')) == false){
              $scope.payment_bank_account_Class = "item115 listFont1";
            }
            if((($scope.editableBusinessForm_button == 'false')|| ($scope.doneWork.app_node!='3')) == false){
              $scope.pay_amount_Class = "item117 listFont1";
            }
            

            


          }
          if(tools.isNull($scope.doneWork.is_meetresolution) == false){
            $scope.in.is_meetresolution=$scope.majors[($scope.doneWork.is_meetresolution.substring(1,2))];
          }
          else{
            $scope.in.is_meetresolution=$scope.majors[0];
          }
          if(tools.isNull($scope.doneWork.vote_conclusion) == false){
            $scope.in.vote_conclusion=$scope.results[($scope.doneWork.vote_conclusion.substring(1,2))];
          }
          else{
            $scope.in.vote_conclusion=$scope.results[0];
          }
          if(tools.isNull($scope.doneWork.reply_conclusion) == false){
            $scope.in.reply_conclusion=$scope.results[($scope.doneWork.reply_conclusion.substring(1,2))];
          }
          else{
            $scope.in.reply_conclusion=$scope.results[0];
          }
          if(tools.isNull($scope.doneWork.bugorsold) == false){
            $scope.in.bugorsold=$scope.majors[($scope.doneWork.bugorsold.substring(1,2))];
          }
          else{
            $scope.in.bugorsold=$scope.majors[0];
          }
          if(tools.isNull($scope.doneWork.vote_result) == false){
            $scope.in.vote_result=$scope.votes[($scope.doneWork.vote_result.substring(1,2))];
          }
          else{
            $scope.in.vote_result=$scope.votes[0];
          }
          if(tools.isNull($scope.doneWork.meet_dispose_way_c) == false){
            $scope.in.meet_dispose_way_c=$scope.ways[($scope.doneWork.meet_dispose_way_c.substring(1,2))];
          }
          else{
            $scope.in.meet_dispose_way_c=$scope.ways[0];
          }
          if(tools.isNull($scope.doneWork.is_finan_sector_filing) == false){
            $scope.in.is_finan_sector_filing=$scope.whethers[($scope.doneWork.is_finan_sector_filing.substring(1,2))];
          }
          else{
            $scope.in.is_finan_sector_filing=$scope.whethers[2];
          }
          if(tools.isNull($scope.doneWork.is_publicity) == false){
            $scope.in.is_publicity=$scope.whethers[($scope.doneWork.is_publicity.substring(1,2))];
          }
          else{
            $scope.in.is_publicity=$scope.whethers[2];
          }
          if(tools.isNull($scope.doneWork.is_preemption) == false){
            $scope.in.is_preemption=$scope.whethers[($scope.doneWork.is_preemption.substring(1,2))];
          }
          else{
            $scope.in.is_preemption=$scope.whethers[2];
          }
          if(tools.isNull($scope.doneWork.is_auction) == false){
            $scope.in.is_auction=$scope.whethers[($scope.doneWork.is_auction.substring(1,2))];
          }
          else{
            $scope.in.is_auction=$scope.whethers[2];
          }
          if(tools.isNull($scope.doneWork.is_circul_dept) == false){
            $scope.in.is_circul_dept=$scope.whethers[($scope.doneWork.is_circul_dept.substring(1,2))];
          }
          else{
            $scope.in.is_circul_dept=$scope.whethers[2];
          }
            //判断要去什么流程 给页面传值
          if(pendingDetailList.data[0].type == "01"){
            $scope.pendingWorkId = "management";
            $scope.detail_title ="资产处置";
          }
          else if(pendingDetailList.data[0].type == "02"){
            $scope.pendingWorkId = "buy";
            $scope.detail_title ="资产收购";
          }
          else if(pendingDetailList.data[0].type == "03"){
            $scope.pendingWorkId = "investment";
            $scope.detail_title ="投资项目";
          } 
          else if(pendingDetailList.data[0].type == "06"){
            $scope.pendingWorkId = "wander";
            $scope.detail_title ="资产流转";
          }
          else if(pendingDetailList.data[0].type == "07"){
            $scope.pendingWorkId = "fundInvestment";
            $scope.detail_title ="基金投资";
          }
          else{
            $scope.pendingWorkId = "payment";		    		  
            $scope.detail_title ="付款审批";
          }     
        }
        //发送获取流程列表请求
        var queryRouteListParam = {
          login_code: $rootScope.rejectNode,
          actionName:"queryRouteList",
          proccd:$rootScope.pending_proccd+"",
          busstp:$rootScope.pending_form_id+"",
          brchcd:$rootScope.pending_brchcd+"",
          taskId:$rootScope.pending_taskId+"",
          notifyId:$rootScope.pending_notifyId+"",
          procid:$rootScope.pending_procid+"",
          taskType:$rootScope.pending_taskType+""
        };
        $scope.sendUrl(queryRouteListParam);
        $ionicLoading.hide();
        $interval.cancel(interval);
        
      }
      else if(saveFormDetail_RESULT){
        var saveFormDetailList = JSON.parse(saveFormDetail_RESULT);
        if(tools.isNull(saveFormDetailList.data)== false){
          var alertPopup = $ionicPopup.alert({
            title: saveFormDetailList.data[0].retMessage
          });
        }
        else{
          var alertPopup = $ionicPopup.alert({
            title: "没有数据返回"
          });
        }
        $ionicLoading.hide();
        $interval.cancel(interval);
      }
      else if(submitTaskParam_RESULT){ 
        var submitTaskList = JSON.parse(submitTaskParam_RESULT);
        if(submitTaskList.data.retCode == "0"){
          var alertPopup = $ionicPopup.alert({
            title: '操作成功'
          });
          $ionicHistory.goBack();
        }
        else if(submitTaskList.data.retCode == "1"){
          var alertPopup = $ionicPopup.alert({
            title: '任务ID为空'
          });
        }
        else if(submitTaskList.data.retCode == "2"){
          var alertPopup = $ionicPopup.alert({
            title: '不是任务办理人'
          });
        }
        else if(submitTaskList.data.retCode == "3"){
          var alertPopup = $ionicPopup.alert({
            title: '找不到下一审批节点'
          });
        }
        else if(submitTaskList.data.retCode == "4"){
          var alertPopup = $ionicPopup.alert({
            title: '流程提交错误'
          });
        }       
        $ionicLoading.hide();
        $interval.cancel(interval);
      }
      else if(addTasks_RESULT){
        var addTasksParam = JSON.parse(addTasks_RESULT);
        if(addTasksParam.data.returnCode == "0"){
          var alertPopup = $ionicPopup.alert({
            title: '操作成功'
          });
          $ionicHistory.goBack();
        }
        else if(addTasksParam.data.returnCode == "-1"){
          var alertPopup = $ionicPopup.alert({
            title: '当前节点无加签权限'
          });
        }
        else if(addTasksParam.data.returnCode == "1"){
          var alertPopup = $ionicPopup.alert({
            title: '任务实例不可为空'
          });
        }
        else if(addTasksParam.data.returnCode == "2"){
          var alertPopup = $ionicPopup.alert({
            title: '任务实例ID错误'
          });
        }
        else if(addTasksParam.data.returnCode == "3"){
          var alertPopup = $ionicPopup.alert({
            title: '不是当前处理人'
          });
        }
        else if(addTasksParam.data.returnCode == "4"){
          var alertPopup = $ionicPopup.alert({
            title: '价钱列表参数为空或者长度不一致'
          });
        }
        else if(addTasksParam.data.returnCode == "5"){
          var alertPopup = $ionicPopup.alert({
            title: '流程提交错误'
          });
        }
        $ionicLoading.hide();
        $interval.cancel(interval);
      }
      else if(jointlyTasks_RESULT){
        var jointlyTasksParam = JSON.parse(jointlyTasks_RESULT);
        if(jointlyTasksParam.data.returnCode == "0"){
          var alertPopup = $ionicPopup.alert({
            title: '操作成功'
          });
          $ionicHistory.goBack();
        }
        else if(jointlyTasksParam.data.returnCode == "-1"){
          var alertPopup = $ionicPopup.alert({
            title: '当前节点无加签权限'
          });
        }
        else if(jointlyTasksParam.data.returnCode == "1"){
          var alertPopup = $ionicPopup.alert({
            title: '任务实例不可为空'
          });
        }
        else if(jointlyTasksParam.data.returnCode == "2"){
          var alertPopup = $ionicPopup.alert({
            title: '任务实例ID错误'
          });
        }
        else if(jointlyTasksParam.data.returnCode == "3"){
          var alertPopup = $ionicPopup.alert({
            title: '不是当前处理人'
          });
        }
        else if(jointlyTasksParam.data.returnCode == "4"){
          var alertPopup = $ionicPopup.alert({
            title: '价钱列表参数为空或者长度不一致'
          });
        }
        else if(jointlyTasksParam.data.returnCode == "5"){
          var alertPopup = $ionicPopup.alert({
            title: '流程提交错误'
          });
        }
        $ionicLoading.hide();
        $interval.cancel(interval);
      }
      else if(queryRetuanable_RESULT){
        var queryRetuanableParam = JSON.parse(queryRetuanable_RESULT);
        $scope.Tasks = queryRetuanableParam.data; 
        $ionicLoading.hide();
        $interval.cancel(interval);
        var myPopup1 = $ionicPopup.show({
          template: '<ion-radio class="listFont4" ng-repeat="Task in Tasks"ng-model="pop.rejectPosition" name="reject" ng-value="Task">{{Task.taskna}}</ion-radio>',
          title: '请选择驳回节点',
          scope: $scope,
          buttons: [
            { text: '取消' },
            {
              text: '<b>保存</b>',
              type: 'button-positive',
              onTap: function(e) {
                return $scope.pop.rejectPosition;
              }
            },
          ]
        });
        myPopup1.then(function(res) {
          $scope.rejectPosition = res.taskna;
          rejectNode = res.tasknd;
        });
      }
      else if(returnTask_RESULT){
        var returnTaskParam = JSON.parse(returnTask_RESULT);
        if(returnTaskParam.data.returnCode == "0"){
          var alertPopup = $ionicPopup.alert({
            title: '操作成功'
          });
          $ionicHistory.goBack();
        }
        else if(returnTaskParam.data.returnCode == "-1"){
          var alertPopup = $ionicPopup.alert({
            title: '当前节点无驳回权限'
          });
        }
        else if(returnTaskParam.data.returnCode == "1"){
          var alertPopup = $ionicPopup.alert({
            title: '任务ID为空'
          });
        }
        else if(returnTaskParam.data.returnCode == "2"){
          var alertPopup = $ionicPopup.alert({
            title: '驳回节点错'
          });
        }
        else if(returnTaskParam.data.returnCode == "3"){
          var alertPopup = $ionicPopup.alert({
            title: '不是当前处理人'
          });
        }
        else if(returnTaskParam.data.returnCode == "4"){
          var alertPopup = $ionicPopup.alert({
            title: '找不到下一流程节点'
          });
        }
        else if(returnTaskParam.data.returnCode == "5"){
          var alertPopup = $ionicPopup.alert({
            title: '流程提交错误'
          });
        }
        $ionicLoading.hide();
        $interval.cancel(interval);
      }
      else if(queryRouteList_RESULT){
        var queryRouteListParam = JSON.parse(queryRouteList_RESULT);
        $scope.circuits = queryRouteListParam.data[0].todoList;
        if(tools.isNull($scope.circuits) == false){
          $scope.circuits.forEach(function(s,index){
            s.comment =s.comment.replace(/<br\/>/g, "\n"); 
          });
          $scope.circuits.forEach(function(i,index){
            if(i.comment.indexOf('不同意')> -1){
              i.color = "fc_red";
            }
            else{
              i.color = "fc_green";
            }
            var str =i.comment.length;
            if(str>8){
              i.isLong = "true";
            }
            else{
              i.isLong = "false";
            }
          })
        }
        if(tools.isNull($scope.circuits) == false){
          queryRouteListParam.data[0].todoList.forEach(function(i,index){
            if(i.isCurrent == "true"){
              current_TaskName = i.taskna;
            }
          });
        }
        $scope.addTask_button = queryRouteListParam.data[0].OpratorPriv[0].addTask; //是否可加签、会办  控制是否显示加签会办按钮显示  值为true时显示
        $scope.submitable_button = queryRouteListParam.data[0].OpratorPriv[0].submitable;//是否可提交 控制提交按钮显示 
        $scope.returnable_button = queryRouteListParam.data[0].OpratorPriv[0].returnable;// 是否可驳回 控制驳回按钮显示  值为true时显示
        $scope.editableBusinessForm_button = queryRouteListParam.data[0].OpratorPriv[0].editableBusinessForm;// 是否可修改表单数据 控制保存按钮显示  值为true时显示
        $scope.starter_button = queryRouteListParam.data[0].OpratorPriv[0].starter;//是否开始节点 控制保存、驳回、提交、加签、会办  值为true时不显示
        $ionicLoading.hide();
        $interval.cancel(interval);
      }
      else if(fileDownload_RESULT){
        var downLoadFileParam =JSON.parse(fileDownload_RESULT);

        CIBH5SDK.showTheAttachmentPathTitle(downLoadFileParam.url+"",fileName);
        $ionicLoading.hide();
        $interval.cancel(interval);
      }
      if (num == 20) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '抱歉,暂无数据,请稍候重试!'
        });
      }
  },500,20);
}
$scope.sendUrl(pendingDetailParam);
//去除空对象
$scope.deleteEmptyProperty = function(obj){
  for ( var key in obj) {
    if (obj.hasOwnProperty(key)&& (obj[key] == null || obj[key] == undefined || obj[key] == '' ||obj[key] == 'undefined')) {
    delete obj[key];
    }
  }
    return obj;
};
  //提交数据
  $scope.Signin = function(){
    
    var is_meetresolution_id ="";//是否上会
    var vote_conclusion_id ="";//上会表决结论
    var reply_conclusion_id ="";
    var bugorsold_id ="";
    var vote_result_id ="";
    var meet_dispose_way_c_id = "";
    var is_finan_sector_filing_id ="";
    var is_publicity_id = "";
    var is_preemption_id = "";
    var is_auction_id ="";
    var is_circul_dept_id = "";
     
    if(tools.isNull($scope.in.is_meetresolution)== false){
      if($scope.in.is_meetresolution.id !="00"){
        is_meetresolution_id = $scope.in.is_meetresolution.id;
      }
    }  
    if(tools.isNull($scope.in.vote_conclusion)== false){
      if($scope.in.vote_conclusion.id !="00"){
        vote_conclusion_id = $scope.in.vote_conclusion.id;
      }
    }
    if(tools.isNull($scope.in.reply_conclusion)== false){
      if($scope.in.reply_conclusion.id !="00"){
        reply_conclusion_id = $scope.in.reply_conclusion.id;
      }
    }
    if(tools.isNull($scope.in.bugorsold)== false){
      if($scope.in.bugorsold.id !="00"){
        bugorsold_id = $scope.in.bugorsold.id;
      }
    }  
    if(tools.isNull($scope.in.vote_result)== false){
      if($scope.in.vote_result.id !="00"){
        vote_result_id = $scope.in.vote_result.id;
      }
    }
    if(tools.isNull($scope.in.meet_dispose_way_c)== false){
      if($scope.in.meet_dispose_way_c.id !="00"){
        meet_dispose_way_c_id = $scope.in.meet_dispose_way_c.id;
      }
    }

    if(tools.isNull($scope.in.is_finan_sector_filing)== false){
      if($scope.in.is_finan_sector_filing.id !="02"){
        is_finan_sector_filing_id = $scope.in.is_finan_sector_filing.id;
      }
    }
    if(tools.isNull($scope.in.is_publicity)== false){
      if($scope.in.is_publicity.id !="02"){
        is_publicity_id = $scope.in.is_publicity.id;
      }
    }
    if(tools.isNull($scope.in.is_preemption)== false){
      if($scope.in.is_preemption.id !="02"){
        is_preemption_id = $scope.in.is_preemption.id;
      }
    }
    if(tools.isNull($scope.in.is_auction)== false){
      if($scope.in.is_auction.id !="02"){
        is_auction_id = $scope.in.is_auction.id;
      }
    }
    if(tools.isNull($scope.in.is_circul_dept)== false){
      if($scope.in.is_circul_dept.id !="02"){
        is_circul_dept_id = $scope.in.is_circul_dept.id;
      } 
    }
    var flag = true;
    //检验业务部门意见
    if($scope.doneWork.app_node == "deptMgr" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.business_view)){
      var alertPopup = $ionicPopup.alert({
        title: '请输入业务部门意见!'
      });
      flag = false;
      $scope.business_view_Class ="item113 listFont1";
    }
    
    //检验业务审查部门意见
    if($scope.doneWork.app_node == "reviewDirecto" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.business_censor_view)){
      var alertPopup = $ionicPopup.alert({
        title: '请输入业务审查部门意见!'
      });
      $scope.business_censor_view_Class ="item113 item-input item-select";
      flag = false;
    }
    //检验是否上会
    if($scope.doneWork.app_node == "reviewLeadership" && $scope.pendingWorkId != "payment" && $scope.in.is_meetresolution.id == "00"){
      var alertPopup = $ionicPopup.alert({
        title: '请选择是否上会!'
      });
      flag = false;
      $scope.is_meetresolution_Class ="item113 listFont1 pos_rel";
    }
    //检验有权审批人
    if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.examineOperatorName)){
      var alertPopup = $ionicPopup.alert({
        title: '请选择有权审批人!'
      });
      flag = false;
      $scope.is_meetresolution_Class ="item112 listFont1 pos_rel";
    }
    //检验会议期次
    else if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.meet_issue)){
      var alertPopup = $ionicPopup.alert({
        title: '请输入会议期次!'
      });
      flag = false;
      $scope.meet_issue_Class ="item113 listFont1 pos_rel";
    }
    //检验主持人
    else if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.hostName)){
      var alertPopup = $ionicPopup.alert({
        title: '请选择主持人!'
      });
      flag = false;
      $scope.hostName_Class ="item113 item-input item-select";
    }
    //检验上会表决结论
    else if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && $scope.in.vote_conclusion.id == "00"){
      var alertPopup = $ionicPopup.alert({
        title: '请选择上会表决结论!'
      });
      flag = false;
      $scope.vote_conclusion_Class = "item113 listFont1";
    }
    //检验上会表决情况
    else if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.vote_situation)){
      var alertPopup = $ionicPopup.alert({
        title: '请输入上会表决情况!'
      });
      flag = false;
      $scope.vote_situation_Class = "item113 item-input item-select";
    }
    //检验有权审批人意见
    if($scope.doneWork.app_node == "youquan" && $scope.pendingWorkId != "payment" && $scope.in.reply_conclusion.id == "00"){
      var alertPopup = $ionicPopup.alert({
        title: '请选择有权审批人意见!'
      });
      flag = false;
      $scope.reply_conclusion_Class = "item112 listFont1";
    }
    //检验上会日期
    if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.meet_date)){
      var alertPopup = $ionicPopup.alert({
        title: '请选择上会日期!'
      });
      flag = false;
      $scope.meet_date_Class = "item113 listFont1 pos_rel";
    }
    //检验是否收购加处置
    else if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId == "buy" && $scope.in.bugorsold.id == "00"){
      var alertPopup = $ionicPopup.alert({
        title: '请选择是否收购加处置!'
      });
      flag = false;
      $scope.bugorsold_Class ="item113 listFont1";
    }
    //检验批复结论
    else if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId != "payment" && $scope.in.vote_result.id == "00"){
      var alertPopup = $ionicPopup.alert({
        title: '请选择批复结论!'
      });
      flag = false;
      $scope.vote_result_Class = "item113 listFont1 pos_rel";
    }
    //检验上会决议处置方式
    else if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId == "management" && $scope.in.meet_dispose_way_c.id == "00"){
      var alertPopup = $ionicPopup.alert({
        title: '请选择上会决议处置方式!'
      });
      flag = false;
      $scope.meet_dispose_way_c_Class = "item113 listFont1";
    }
    //检验其中上会决议回收现金
    else if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId == "management" && tools.isNull($scope.doneWork.meet_recycle_cash)){
      var alertPopup = $ionicPopup.alert({
        title: '请输入其中上会决议回收现金!'
      });
      flag = false;
      $scope.meet_recycle_cash_Class = "item113 listFont1";
    }
    //检验业务审查部业务审查审查员
    if($scope.doneWork.app_node == "zonghegang" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.examinantName)){
      var alertPopup = $ionicPopup.alert({
        title: '请选择业务审查部业务审查审查员!'
      });
      flag = false;
      $scope.examinantName_Class = "item113 listFont1 pos_rel";
    }
    //检验业务审查部综合意见经办
    if($scope.doneWork.app_node == "yewuzonghe" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.unitExaminantName)){
      var alertPopup = $ionicPopup.alert({
        title: '请选择业务审查部综合意见经办!'
      });
      flag = false;
      $scope.unitExaminantName_Class = "item113 listFont1 pos_rel";
    }
    //检验业务审查部项目批复经办
    if($scope.doneWork.app_node == "yewupifu" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.replyExaminantName)){
      var alertPopup = $ionicPopup.alert({
        title: '请选择业务审查部项目批复经办!'
      });
      flag = false;
      $scope.unitExaminantName_Class = "item112 listFont1 pos_rel";
    }
    //检验付款金额(剔税)
    if( $scope.pendingWorkId == "payment" && tools.isNull($scope.doneWork.net_amount)){
      var alertPopup = $ionicPopup.alert({
        title: '请输入付款金额!'
      });
      flag = false;
      $scope.net_amount_Class = "item113 listFont1";
    }
    //检验增值税专用发票税额
    else if( $scope.pendingWorkId == "payment" && tools.isNull($scope.doneWork.added_value_tax)){
      flag = false;
      var alertPopup = $ionicPopup.alert({
        title: '请输入增值税专用发票税额!'
      });
      $scope.added_value_tax_Class = "item113 listFont1 pos_rel";
    }
    //检验增值税专用发票+付款金额(剔税) == 付款金额
    else if( $scope.pendingWorkId == "payment" && tools.isNull($scope.doneWork.net_amount)==false &&  tools.isNull($scope.doneWork.added_value_tax)==false){
      var sum = $scope.doneWork.net_amount+$scope.doneWork.added_value_tax-$scope.doneWork.payment_amount;
      if(sum != 0){
        $scope.added_value_tax_Class = "item112 listFont1 pos_rel";
        flag = false;
        var alPopup = $ionicPopup.alert({
          title: '检验增值税专用发票与付款金额(剔税)之和不等于付款金额，请重输'
        }); 
      }
      
    }
    // //检验实际付款日期
    else if( $scope.pendingWorkId == "payment" && tools.isNull($scope.doneWork.actual_pay_date)){
      var alertPopup = $ionicPopup.alert({
        title: '请选择实际付款日期!'
      });
      flag = false;
      $scope.added_value_tax_Class = "item112 listFont1 pos_rel";
    }
    //检验付款银行账号
    if( $scope.pendingWorkId == "payment" ){
      if(tools.isNull($scope.doneWork.payAccounts)== false){
        $scope.doneWork.payAccounts.forEach(function(i,index){
          if(tools.isNull(i.payment_bank_account)){
            var alertPopup = $ionicPopup.alert({
              title: '请选择付款银行账号!'
            });
            flag = false;
            $scope.payment_bank_account_Class = "item113 listFont1";
          }
          else if(tools.isNull(i.pay_amount)){
            var alertPopup = $ionicPopup.alert({
              title: '请输入付款金额!'
            });
            flag = false;
            $scope.pay_amount_Class = "item112 listFont1";
          }
        });
        var pay_amount=0//付款总和
        $scope.doneWork.payAccounts.forEach(function(i,index){
          pay_amount=pay_amount+parseFloat(i.pay_amount);
        })
        if(pay_amount!=$scope.doneWork.payment_amount){
          flag = false;
          var alertPopup = $ionicPopup.alert({
            title: '银行账号付款金额之和不等于付款金额，请重输'
          });     
          $scope.pay_amount_Class = "item112 listFont1";
        }
      }
      else{
        var alertPopup = $ionicPopup.alert({
          title: '请添加您的银行账号!'
        });
        flag = false;
        $scope.payment_bank_account_Class = "item113 listFont1";
      }
    }
    if(flag){
      //恢复本来面貌
      $scope.business_view_Class ="item listFont1";
      $scope.business_censor_view_Class ="item item-input item-select";
      $scope.is_meetresolution_Class="item listFont1 pos_rel";
      $scope.meet_issue_Class="item listFont1 pos_rel";
      $scope.hostName_Class = "item item-input item-select";
      $scope.vote_conclusion_Class = "item listFont1";
      $scope.vote_situation_Class = "item item-input item-select";
      $scope.reply_conclusion_Class = "item listFont1";
      $scope.meet_date_Class = "item listFont1 pos_rel";
      $scope.summary_issuing_date_Class ="item item-input item-select";
      $scope.bugorsold_Class ="item listFont1";
      $scope.max_purchasing_price_Class = "item item-input item-select";
      $scope.vote_result_Class = "item listFont1 pos_rel";
      $scope.transfer_base_time_Class = "item item-input item-select";
      $scope.meet_dispose_way_c_Class = "item listFont1";
      $scope.meet_recycle_cash_Class = "item listFont1";
      $scope.meet_recycle_asset_Class ="item listFont1";
      $scope.is_finan_sector_filing_Class = "item item-input item-select";
      $scope.is_publicity_Class = "item item-input item-select";
      $scope.is_preemption_Class = "item item-input item-select";
      $scope.is_auction_Class = "item item-input item-select";
      $scope.is_circul_dept_Class = "item listFont1";
      $scope.invest_amount_Class = "item listFont1";
      $scope.yield_rate_Class ="item listFont1";
      $scope.meet_issue_Class = "item listFont1";
      $scope.examinantName_Class = "item listFont1 pos_rel";
      $scope.unitExaminantName_Class = "item listFont1 pos_rel";
      $scope.net_amount_Class = "item listFont1";
      $scope.added_value_tax_Class = "item listFont1 pos_rel";
      $scope.payment_bank_account_Class = "item22 listFont1";
      $scope.pay_amount_Class = "item22 listFont1";


      queryFormDetail_RESULT="";
      saveFormDetail_RESULT="";
      submitTaskParam_RESULT = "";
      addTasks_RESULT = "";
      jointlyTasks_RESULT = "";
      var payment_bank_account="";//付款银行账号
      var bank_name="";//付款开户行名称
      var bank_account_name="";//付款账户名称
      var pay_amount="";//对应银行账号付款金额
      //在app_node='3'可以修改节点
      if($scope.doneWork.app_node == "3" && $scope.pendingWorkId == "payment"){
        $scope.doneWork.payAccounts.forEach(function(i,index){
          payment_bank_account=payment_bank_account+","+i.payment_bank_account;
        })
        payment_bank_account = payment_bank_account.substr(1);
        $scope.doneWork.payAccounts.forEach(function(i,index){
          bank_name=bank_name+","+i.bank_name;
        })
        bank_name = bank_name.substr(1);
        $scope.doneWork.payAccounts.forEach(function(i,index){
          bank_account_name=bank_account_name+","+i.bank_account_name;
        })
        bank_account_name = bank_account_name.substr(1);
        $scope.doneWork.payAccounts.forEach(function(i,index){
          pay_amount=pay_amount+","+i.pay_amount;
        })
        pay_amount = pay_amount.substr(1);
      }
      //提交
      var saveFormParam ={
        login_code: $rootScope.rejectNode,
        actionName:"saveFormDetail",
        proccd:$rootScope.pending_proccd+"",
        busstype:$rootScope.pending_form_id+"",
        busstp:$rootScope.pending_form_id+"",

        business_view:$scope.doneWork.business_view+"",
        business_censor_view:$scope.doneWork.business_censor_view+"",
        is_meetresolution:is_meetresolution_id+"",
        examineOperator:$rootScope.authorizedExaminer_usercode+"",
        meet_issue:$scope.doneWork.meet_issue+"",
        meet_host:$rootScope.meet_host_usercode+"",
        vote_conclusion:vote_conclusion_id+"",
        vote_situation:$scope.doneWork.vote_situation+"",
        reply_conclusion:reply_conclusion_id+"",
        approval_opinion:$scope.doneWork.approval_opinion+"",
        meet_date:$scope.doneWork.meet_date+"",
        summary_issuing_date:$scope.doneWork.summary_issuing_date+"",
        bugorsold:bugorsold_id+"",
        vote_result:vote_result_id+"",
        invest_amount:$scope.doneWork.invest_amount+"",
        yield_rate:$scope.doneWork.yield_rate+"",
        deadline:$scope.doneWork.deadline+"",
        
        transfer_base_time:$scope.doneWork.transfer_base_time+"",
        meet_dispose_way_c:meet_dispose_way_c_id+"",
        meet_dispose_res_price:($scope.doneWork.meet_recycle_cash+$scope.doneWork.meet_recycle_asset)+"",
        meet_recycle_cash:$scope.doneWork.meet_recycle_cash+"",
        meet_recycle_asset:$scope.doneWork.meet_recycle_asset+"",
        is_finan_sector_filing:is_finan_sector_filing_id+"",
        is_publicity:is_publicity_id+"",
        is_preemption:is_preemption_id+"",
        is_auction:is_auction_id+"",
        is_circul_dept:is_circul_dept_id+"",
        payment_amount:$scope.doneWork.payment_amount+"",
        net_amount:$scope.doneWork.net_amount+"",
        ADDED_VALUE_TAX:$scope.doneWork.added_value_tax +"",
        actual_pay_date:$scope.doneWork.actual_pay_date+"",
        payment_bank_account:payment_bank_account+"",
        bank_name:bank_name+"",
        bank_account_name:bank_account_name+"",
        pay_amount:pay_amount+"",


      max_purchasing_price:$scope.doneWork.max_purchasing_price+"",
      council_summary_report:$scope.doneWork.council_summary_report+"",
      examinant:$rootScope.examinant_usercode+"",
      unitExaminant:$rootScope.unitExaminant_usercode+"",
      replyExaminant:$rootScope.replyExaminant_usercode+""
      };
      
      $scope.sendUrl($scope.deleteEmptyProperty(saveFormParam));
      console.log(str);
    }
  }
  //审批提交
  $scope.Signout = function(){  
    var is_meetresolution_id ="";//是否上会
    var vote_conclusion_id ="";//上会表决结论
    var reply_conclusion_id ="";
    var bugorsold_id ="";
    var vote_result_id ="";
    var meet_dispose_way_c_id = "";
    var is_finan_sector_filing_id ="";
    var is_publicity_id = "";
    var is_preemption_id = "";
    var is_auction_id ="";
    var is_circul_dept_id = "";
    if(tools.isNull($scope.in.is_meetresolution)== false){
      if($scope.in.is_meetresolution.id !="00"){
        is_meetresolution_id = $scope.in.is_meetresolution.id;
      }
    }  
    if(tools.isNull($scope.in.vote_conclusion)== false){
      if($scope.in.vote_conclusion.id !="00"){
        vote_conclusion_id = $scope.in.vote_conclusion.id;
      }
    }
    if(tools.isNull($scope.in.reply_conclusion)== false){
      if($scope.in.reply_conclusion.id !="00"){
        reply_conclusion_id = $scope.in.reply_conclusion.id;
      }
    }
    if(tools.isNull($scope.in.bugorsold)== false){
      if($scope.in.bugorsold.id !="00"){
        bugorsold_id = $scope.in.bugorsold.id;
      }
    }  
    if(tools.isNull($scope.in.vote_result)== false){
      if($scope.in.vote_result.id !="00"){
        vote_result_id = $scope.in.vote_result.id;
      }
    }
    if(tools.isNull($scope.in.meet_dispose_way_c)== false){
      if($scope.in.meet_dispose_way_c.id !="00"){
        meet_dispose_way_c_id = $scope.in.meet_dispose_way_c.id;
      }
    }

    if(tools.isNull($scope.in.is_finan_sector_filing)== false){
      if($scope.in.is_finan_sector_filing.id !="02"){
        is_finan_sector_filing_id = $scope.in.is_finan_sector_filing.id;
      }
    }
    if(tools.isNull($scope.in.is_publicity)== false){
      if($scope.in.is_publicity.id !="02"){
        is_publicity_id = $scope.in.is_publicity.id;
      }
    }
    if(tools.isNull($scope.in.is_preemption)== false){
      if($scope.in.is_preemption.id !="02"){
        is_preemption_id = $scope.in.is_preemption.id;
      }
    }
    if(tools.isNull($scope.in.is_auction)== false){
      if($scope.in.is_auction.id !="02"){
        is_auction_id = $scope.in.is_auction.id;
      }
    }
    if(tools.isNull($scope.in.is_circul_dept)== false){
      if($scope.in.is_circul_dept.id !="02"){
        is_circul_dept_id = $scope.in.is_circul_dept.id;
      } 
    }
    var flag = true;
    if(tools.isNull($scope.in.isReject)){
      //检验业务部门意见
      if($scope.doneWork.app_node == "deptMgr" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.business_view)){
        var alertPopup = $ionicPopup.alert({
          title: '请输入业务部门意见!'
        });
        flag = false;
        $scope.business_view_Class ="item113 listFont1";
      }    
      //检验业务审查部门意见
      if($scope.doneWork.app_node == "reviewDirecto" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.business_censor_view)){
        var alertPopup = $ionicPopup.alert({
          title: '请输入业务审查部门意见!'
        });
        flag = false;
        $scope.business_censor_view_Class ="item113 item-input item-select";
      }
      //检验是否上会
      if($scope.doneWork.app_node == "reviewLeadership" && $scope.pendingWorkId != "payment" && $scope.in.is_meetresolution.id == "00"){
        var alertPopup = $ionicPopup.alert({
          title: '请选择是否上会!'
        });
        flag = false;
        $scope.is_meetresolution_Class ="item113 listFont1 pos_rel";
      }
      //检验有权审批人
      if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.examineOperatorName)){
        var alertPopup = $ionicPopup.alert({
          title: '请选择有权审批人!'
        });
        flag = false;
        $scope.is_meetresolution_Class ="item112 listFont1 pos_rel";
      }
      //检验会议期次
      else if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.meet_issue)){
        var alertPopup = $ionicPopup.alert({
          title: '请输入会议期次!'
        });
        flag = false;
        $scope.meet_issue_Class ="item113 listFont1 pos_rel";
      }
      //检验主持人
      else if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.hostName)){
        var alertPopup = $ionicPopup.alert({
          title: '请选择主持人!'
        });
        flag = false;
        $scope.hostName_Class ="item113 item-input item-select";
      }
      //检验上会表决结论
      else if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && $scope.in.vote_conclusion.id == "00"){
        var alertPopup = $ionicPopup.alert({
          title: '请选择上会表决结论!'
        });
        flag = false;
        $scope.vote_conclusion_Class = "item113 listFont1";
      }
      //检验上会表决情况
      else if($scope.doneWork.app_node == "handle1" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.vote_situation)){
        var alertPopup = $ionicPopup.alert({
          title: '请输入上会表决情况!'
        });
        flag = false;
        $scope.vote_situation_Class = "item113 item-input item-select";
      }
      //检验有权审批人意见
      if($scope.doneWork.app_node == "youquan" && $scope.pendingWorkId != "payment" && $scope.in.reply_conclusion.id == "00"){
        var alertPopup = $ionicPopup.alert({
          title: '请选择有权审批人意见!'
        });
        flag = false;
        $scope.reply_conclusion_Class = "item112 listFont1";
      }
      //检验上会日期
      if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.meet_date)){
        var alertPopup = $ionicPopup.alert({
          title: '请选择上会日期!'
        });
        flag = false;
        $scope.meet_date_Class = "item113 listFont1 pos_rel";
      }
      //检验是否收购加处置
      else if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId == "buy" && $scope.in.bugorsold.id == "00"){
        var alertPopup = $ionicPopup.alert({
          title: '请选择是否收购加处置!'
        });
        flag = false;
        $scope.bugorsold_Class ="item113 listFont1";
      }
      //检验批复结论
      else if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId != "payment" && $scope.in.vote_result.id == "00"){
        var alertPopup = $ionicPopup.alert({
          title: '请选择批复结论!'
        });
        flag = false;
        $scope.vote_result_Class = "item113 listFont1 pos_rel";
      }
      //检验上会决议处置方式
      else if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId == "management" && $scope.in.meet_dispose_way_c.id == "00"){
        var alertPopup = $ionicPopup.alert({
          title: '请选择上会决议处置方式!'
        });
        flag = false;
        $scope.meet_dispose_way_c_Class = "item113 listFont1";
      }
      //检验其中上会决议回收现金
      else if($scope.doneWork.app_node == "handle2" && $scope.pendingWorkId == "management" && tools.isNull($scope.doneWork.meet_recycle_cash)){
        var alertPopup = $ionicPopup.alert({
          title: '请输入其中上会决议回收现金!'
        });
        flag = false;
        $scope.meet_recycle_cash_Class = "item113 listFont1";
      }
      //检验业务审查部业务审查审查员
      if($scope.doneWork.app_node == "zonghegang" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.examinantName)){
        var alertPopup = $ionicPopup.alert({
          title: '请选择业务审查部业务审查审查员!'
        });
        flag = false;
        $scope.examinantName_Class = "item113 listFont1 pos_rel";
      }
      //检验业务审查部综合意见经办
      if($scope.doneWork.app_node == "yewuzonghe" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.unitExaminantName)){
        var alertPopup = $ionicPopup.alert({
          title: '请选择业务审查部综合意见经办!'
        });
        flag = false;
        $scope.unitExaminantName_Class = "item113 listFont1 pos_rel";
      }
      //检验业务审查部项目批复经办
      if($scope.doneWork.app_node == "yewupifu" && $scope.pendingWorkId != "payment" && tools.isNull($scope.doneWork.replyExaminantName)){
        var alertPopup = $ionicPopup.alert({
          title: '请选择业务审查部项目批复经办!'
        });
        flag = false;
        $scope.unitExaminantName_Class = "item112 listFont1 pos_rel";
      }
      //检验付款金额(剔税)
      if( $scope.doneWork.app_node == "3" && $scope.pendingWorkId == "payment" && tools.isNull($scope.doneWork.net_amount)){
        var alertPopup = $ionicPopup.alert({
          title: '请输入付款金额!'
        });
        flag = false;
        $scope.net_amount_Class = "item113 listFont1";
      }
      //检验增值税专用发票税额
      else if(  $scope.doneWork.app_node == "3" && $scope.pendingWorkId == "payment" && tools.isNull($scope.doneWork.added_value_tax)){
        flag = false;
        var alertPopup = $ionicPopup.alert({
          title: '请输入增值税专用发票税额!'
        });
        $scope.added_value_tax_Class = "item113 listFont1 pos_rel";
      }
      //检验增值税专用发票+付款金额(剔税) == 付款金额
      else if(  $scope.doneWork.app_node == "3" && $scope.pendingWorkId == "payment" && tools.isNull($scope.doneWork.net_amount)==false &&  tools.isNull($scope.doneWork.added_value_tax)==false){
        var sum = $scope.doneWork.net_amount+$scope.doneWork.added_value_tax-$scope.doneWork.payment_amount;
        if(sum != 0){
          $scope.added_value_tax_Class = "item112 listFont1 pos_rel";
          flag = false;
          var alPopup = $ionicPopup.alert({
            title: '检验增值税专用发票与付款金额(剔税)之和不等于付款金额，请重输'
          }); 
        }
        
      }
      // //检验实际付款日期
      else if(  $scope.doneWork.app_node == "3" && $scope.pendingWorkId == "payment" && tools.isNull($scope.doneWork.actual_pay_date)){
        var alertPopup = $ionicPopup.alert({
          title: '请选择实际付款日期!'
        });
        flag = false;
        $scope.added_value_tax_Class = "item112 listFont1 pos_rel";
      }
      //检验付款银行账号
      if( $scope.doneWork.app_node == "3" && $scope.pendingWorkId == "payment" &&tools.isNull($scope.doneWork.payAccounts)== false){
        $scope.doneWork.payAccounts.forEach(function(i,index){
          if(tools.isNull(i.payment_bank_account)){
            var alertPopup = $ionicPopup.alert({
              title: '请选择付款银行账号!'
            });
            flag = false;
            $scope.payment_bank_account_Class = "item113 listFont1";
          }
          else if(tools.isNull(i.pay_amount)){
            var alertPopup = $ionicPopup.alert({
              title: '请输入付款金额!'
            });
            flag = false;
            $scope.pay_amount_Class = "item112 listFont1";
          }
        });
        var pay_amount=0//付款总和
        $scope.doneWork.payAccounts.forEach(function(i,index){
          pay_amount=pay_amount+parseFloat(i.pay_amount);
        })
        if(pay_amount!=$scope.doneWork.payment_amount){
          flag = false;
          var alertPopup = $ionicPopup.alert({
            title: '银行账号付款金额之和不等于付款金额，请重输'
          }); 
          $scope.pay_amount_Class = "item112 listFont1";
        }
      }
      //校验选择加签
      if(tools.isNull($scope.in.isCountersigne) == false){
        if(tools.isNull($scope.countersigner)){
          var alertPopup = $ionicPopup.alert({
            title: '请选择加签人员!'
          });
          flag = false;

        }      
      }
      //校验选择会办
      if(tools.isNull($scope.in.isAdministrat) == false){
        if(tools.isNull($scope.administrator)){
          var alertPopup = $ionicPopup.alert({
            title: '请选择会办人员!'
          });
          flag = false;
        }      
      }
    }
    if(flag){
      //恢复本来面貌
      $scope.business_view_Class ="item listFont1";
      $scope.business_censor_view_Class ="item item-input item-select";
      $scope.is_meetresolution_Class="item listFont1 pos_rel";
      $scope.meet_issue_Class="item listFont1 pos_rel";
      $scope.hostName_Class = "item item-input item-select";
      $scope.vote_conclusion_Class = "item listFont1";
      $scope.vote_situation_Class = "item item-input item-select";
      $scope.reply_conclusion_Class = "item listFont1";
      $scope.meet_date_Class = "item listFont1 pos_rel";
      $scope.summary_issuing_date_Class ="item item-input item-select";
      $scope.bugorsold_Class ="item listFont1";
      $scope.max_purchasing_price_Class = "item item-input item-select";
      $scope.vote_result_Class = "item listFont1 pos_rel";
      $scope.transfer_base_time_Class = "item item-input item-select";
      $scope.meet_dispose_way_c_Class = "item listFont1";
      $scope.meet_recycle_cash_Class = "item listFont1";
      $scope.meet_recycle_asset_Class ="item listFont1";
      $scope.is_finan_sector_filing_Class = "item item-input item-select";
      $scope.is_publicity_Class = "item item-input item-select";
      $scope.is_preemption_Class = "item item-input item-select";
      $scope.is_auction_Class = "item item-input item-select";
      $scope.is_circul_dept_Class = "item listFont1";
      $scope.invest_amount_Class = "item listFont1";
      $scope.yield_rate_Class ="item listFont1";
      $scope.meet_issue_Class = "item listFont1";
      $scope.examinantName_Class = "item listFont1 pos_rel";
      $scope.unitExaminantName_Class = "item listFont1 pos_rel";
      $scope.net_amount_Class = "item listFont1";
      $scope.added_value_tax_Class = "item listFont1 pos_rel";
      $scope.payment_bank_account_Class = "item22 listFont1";
      $scope.pay_amount_Class = "item22 listFont1";

      var payment_bank_account="";//付款银行账号
      var bank_name="";//付款开户行名称
      var bank_account_name="";//付款账户名称
      var pay_amount="";//对应银行账号付款金额
      //在app_node='3'可以修改节点
      if($scope.doneWork.app_node == "3" && $scope.pendingWorkId == "payment"){
        $scope.doneWork.payAccounts.forEach(function(i,index){
          payment_bank_account=payment_bank_account+","+i.payment_bank_account;
        })
        payment_bank_account = payment_bank_account.substr(1);
        $scope.doneWork.payAccounts.forEach(function(i,index){
          bank_name=bank_name+","+i.bank_name;
        })
        bank_name = bank_name.substr(1);
        $scope.doneWork.payAccounts.forEach(function(i,index){
          bank_account_name=bank_account_name+","+i.bank_account_name;
        })
        bank_account_name = bank_account_name.substr(1);
        $scope.doneWork.payAccounts.forEach(function(i,index){
          pay_amount=pay_amount+","+i.pay_amount;
        })
        pay_amount = pay_amount.substr(1);
      }
      
      //加签
      if($scope.in.isCountersigne == "加签"){
        var addTasksParam ={
          login_code: $rootScope.rejectNode,
          actionName:"addTasks",          
          proccd:$rootScope.pending_proccd+"",
          busstp:$rootScope.pending_form_id+"",
          busstype:$rootScope.pending_form_id+"",
          fpRemark:$scope.doneWork.fpRemark,
          taskId:$rootScope.pending_taskId,
          ispriv:$rootScope.pending_ispriv,
          
          business_view:$scope.doneWork.business_view+"",
          business_censor_view:$scope.doneWork.business_censor_view+"",
          is_meetresolution:is_meetresolution_id+"",
          examineOperator:$rootScope.authorizedExaminer_usercode+"",
          meet_issue:$scope.doneWork.meet_issue+"",
          meet_host:$rootScope.meet_host_usercode+"",
          vote_conclusion:vote_conclusion_id+"",
          vote_situation:$scope.doneWork.vote_situation+"",
          reply_conclusion:reply_conclusion_id+"",
          approval_opinion:$scope.doneWork.approval_opinion+"",
          meet_date:$scope.doneWork.meet_date+"",
          summary_issuing_date:$scope.doneWork.summary_issuing_date+"",
          bugorsold:bugorsold_id+"",
          vote_result:vote_result_id+"",
          invest_amount:$scope.doneWork.invest_amount+"",
          yield_rate:$scope.doneWork.yield_rate+"",
          deadline:$scope.doneWork.deadline+"",
          
          transfer_base_time:$scope.doneWork.transfer_base_time+"",
          meet_dispose_way_c:meet_dispose_way_c_id+"",
          meet_dispose_res_price:$scope.doneWork.meet_dispose_res_price+"",
          meet_recycle_cash:$scope.doneWork.meet_recycle_cash+"",
          meet_recycle_asset:$scope.doneWork.meet_recycle_asset+"",
          is_finan_sector_filing:is_finan_sector_filing_id+"",
          is_publicity:is_publicity_id+"",
          is_preemption:is_preemption_id+"",
          is_auction:is_auction_id+"",
          is_circul_dept:is_circul_dept_id+"",
          payment_amount:$scope.doneWork.payment_amount+"",
          net_amount:$scope.doneWork.net_amount+"",
          ADDED_VALUE_TAX:$scope.doneWork.added_value_tax +"",
          actual_pay_date:$scope.doneWork.actual_pay_date+"",
          payment_bank_account:payment_bank_account+"",
          bank_name:bank_name+"",
          bank_account_name:bank_account_name+"",
          pay_amount:pay_amount+"",


          max_purchasing_price:$scope.doneWork.max_purchasing_price+"",
          council_summary_report:$scope.doneWork.council_summary_report+"",
          examinant:$rootScope.examinant_usercode+"",
          unitExaminant:$rootScope.unitExaminant_usercode+"",
          replyExaminant:$rootScope.replyExaminant_usercode+"",
          adduserCode:$rootScope.countersigner_usercode
        };
        $scope.sendUrl($scope.deleteEmptyProperty(addTasksParam));
      }
      //会办
      if ($scope.in.isAdministrat == "会办"){
        var jointlyTasksParam ={
          login_code: $rootScope.rejectNode,
          actionName:"jointlyTasks",
          proccd:$rootScope.pending_proccd+"",
          busstp:$rootScope.pending_form_id+"",
          busstype:$rootScope.pending_form_id+"",
          fpRemark:$scope.doneWork.fpRemark,
          taskId:$rootScope.pending_taskId,
          ispriv:$rootScope.pending_ispriv,
          currentTaskName:current_TaskName,

          business_view:$scope.doneWork.business_view+"",
          business_censor_view:$scope.doneWork.business_censor_view+"",
          is_meetresolution:is_meetresolution_id+"",
          examineOperator:$rootScope.authorizedExaminer_usercode+"",
          meet_issue:$scope.doneWork.meet_issue+"",
          meet_host:$rootScope.meet_host_usercode+"",
          vote_conclusion:vote_conclusion_id+"",
          vote_situation:$scope.doneWork.vote_situation+"",
          reply_conclusion:reply_conclusion_id+"",
          approval_opinion:$scope.doneWork.approval_opinion+"",
          meet_date:$scope.doneWork.meet_date+"",
          summary_issuing_date:$scope.doneWork.summary_issuing_date+"",
          bugorsold:bugorsold_id+"",
          vote_result:vote_result_id+"",
          invest_amount:$scope.doneWork.invest_amount+"",
          yield_rate:$scope.doneWork.yield_rate+"",
          deadline:$scope.doneWork.deadline+"",
          
          transfer_base_time:$scope.doneWork.transfer_base_time+"",
          meet_dispose_way_c:meet_dispose_way_c_id+"",
          meet_dispose_res_price:$scope.doneWork.meet_dispose_res_price+"",
          meet_recycle_cash:$scope.doneWork.meet_recycle_cash+"",
          meet_recycle_asset:$scope.doneWork.meet_recycle_asset+"",
          is_finan_sector_filing:is_finan_sector_filing_id+"",
          is_publicity:is_publicity_id+"",
          is_preemption:is_preemption_id+"",
          is_auction:is_auction_id+"",
          is_circul_dept:is_circul_dept_id+"",
          payment_amount:$scope.doneWork.payment_amount+"",
          net_amount:$scope.doneWork.net_amount+"",
          ADDED_VALUE_TAX:$scope.doneWork.added_value_tax +"",
          actual_pay_date:$scope.doneWork.actual_pay_date+"",
          payment_bank_account:payment_bank_account+"",
          bank_name:bank_name+"",
          bank_account_name:bank_account_name+"",
          pay_amount:pay_amount+"",


          max_purchasing_price:$scope.doneWork.max_purchasing_price+"",
          council_summary_report:$scope.doneWork.council_summary_report+"",
          examinant:$rootScope.examinant_usercode+"",
          unitExaminant:$rootScope.unitExaminant_usercode+"",
          replyExaminant:$rootScope.replyExaminant_usercode+"",
          adduserCode:$rootScope.administrator_usercode
        };
        $scope.sendUrl($scope.deleteEmptyProperty(jointlyTasksParam));
      }
      //驳回
      if($scope.in.isReject == "applyNode" || $scope.in.isReject == "lastNode" ){
        var returnTaskParam ={
          login_code: $rootScope.rejectNode,
          actionName:"returnTask",
          taskId:$rootScope.pending_taskId,
          returnType:$scope.in.isReject,
          fpRemark:$scope.doneWork.fpRemark
        };
        $scope.sendUrl($scope.deleteEmptyProperty(returnTaskParam));
      }
      else if($scope.in.isReject == "anyNode"){
        var returnTaskParam ={
          login_code: $rootScope.rejectNode,
          actionName:"returnTask",
          taskId:$rootScope.pending_taskId,
          returnType:$scope.in.isReject,
          returnTaskKey:rejectNode,
          fpRemark:$scope.doneWork.fpRemark
        };
        $scope.sendUrl($scope.deleteEmptyProperty(returnTaskParam));
      }
      //普通提交提交
      if($scope.in.isAdministrat != "会办" && $scope.in.isCountersigne != "加签" && tools.isNull($scope.in.isReject)){
        
        var submitTaskParam ={
            login_code: $rootScope.rejectNode,
            actionName:"submitTask",
            proccd:$rootScope.pending_proccd+"",
            busstp:$rootScope.pending_form_id+"",
            busstype:$rootScope.pending_form_id+"",
            fpRemark:$scope.doneWork.fpRemark,
            taskId:$rootScope.pending_taskId,
            ispriv:$rootScope.pending_ispriv,

            business_view:$scope.doneWork.business_view+"",
            business_censor_view:$scope.doneWork.business_censor_view+"",
            is_meetresolution:is_meetresolution_id+"",
            examineOperator:$rootScope.authorizedExaminer_usercode+"",
            meet_issue:$scope.doneWork.meet_issue+"",
            meet_host:$rootScope.meet_host_usercode+"",
            vote_conclusion:vote_conclusion_id+"",
            vote_situation:$scope.doneWork.vote_situation+"",
            reply_conclusion:reply_conclusion_id+"",
            approval_opinion:$scope.doneWork.approval_opinion+"",
            meet_date:$scope.doneWork.meet_date+"",
            summary_issuing_date:$scope.doneWork.summary_issuing_date+"",
            bugorsold:bugorsold_id+"",
            vote_result:vote_result_id+"",
            invest_amount:$scope.doneWork.invest_amount+"",
            yield_rate:$scope.doneWork.yield_rate+"",
            deadline:$scope.doneWork.deadline+"",
            
            transfer_base_time:$scope.doneWork.transfer_base_time+"",
            meet_dispose_way_c:meet_dispose_way_c_id+"",
            meet_dispose_res_price:$scope.doneWork.meet_dispose_res_price+"",
            meet_recycle_cash:$scope.doneWork.meet_recycle_cash+"",
            meet_recycle_asset:$scope.doneWork.meet_recycle_asset+"",
            is_finan_sector_filing:is_finan_sector_filing_id+"",
            is_publicity:is_publicity_id+"",
            is_preemption:is_preemption_id+"",
            is_auction:is_auction_id+"",
            is_circul_dept:is_circul_dept_id+"",
            payment_amount:$scope.doneWork.payment_amount+"",
            net_amount:$scope.doneWork.net_amount+"",
            ADDED_VALUE_TAX:$scope.doneWork.added_value_tax +"",
            actual_pay_date:$scope.doneWork.actual_pay_date+"",
            payment_bank_account:payment_bank_account+"",
            bank_name:bank_name+"",
            bank_account_name:bank_account_name+"",
            pay_amount:pay_amount+"",


            max_purchasing_price:$scope.doneWork.max_purchasing_price+"",
            council_summary_report:$scope.doneWork.council_summary_report+"",
            examinant:$rootScope.examinant_usercode+"",
            unitExaminant:$rootScope.unitExaminant_usercode+"",
            replyExaminant:$rootScope.replyExaminant_usercode+""
          };
          $scope.sendUrl($scope.deleteEmptyProperty(submitTaskParam));
      } 
    }
  }
  //date 转化(yyyy-mm--dd)
  var formatDateTime = function(timeStamp){
    var date = new Date(timeStamp);
    var y = date.getFullYear();        
    var m = date.getMonth() + 1;        
    m = m < 10 ? ('0' + m) : m;        
    var d = date.getDate();        
    d = d < 10 ? ('0' + d) : d;              
    return y + '-' + m + '-' + d;  
  };
    // 上会日期选择后的回调函数
  
  var datePickerCallbacke1 = function (val) {

    if (typeof (val) === 'undefined') {
    } 
    else {
      $scope.doneWork.meet_date = formatDateTime(val);//更新日期。
    }
  };

  // 批复日期选择后的回调函数
  var datePickerCallbacke2 = function (val) {

    if (typeof (val) === 'undefined') {
    } 
    else {
      $scope.doneWork.summary_issuing_date = formatDateTime(val);//更新日期。
    }
  };
  // 实际付款日期选择后的回调函数
  var datePickerCallbacke3 = function (val) {

    if (typeof (val) === 'undefined') {
    } 
    else {
      $scope.doneWork.actual_pay_date = formatDateTime(val);//更新日期。
    }
  };
  //转让基准日选择后的回调函数
  var datePickerCallbacke4 = function (val) {

    if (typeof (val) === 'undefined') {
    } 
    else {
      $scope.doneWork.transfer_base_time = formatDateTime(val);//更新日期。
    }
  };
  $scope.searchPeope1 = function (){
    $state.go('tab.personnelSelection', {type:1});
  }
  $scope.searchPeope2 = function (){
    $state.go('tab.personnelSelection', {type:2});
  }
  $scope.searchPeope3 = function (){
    $state.go('tab.personnelSelection', {type:3});
  }
  $scope.searchPeope4 = function (){
    $state.go('tab.personnelSelection', {type:4});
  }
  $scope.searchPeope5 = function (){
    $state.go('tab.personnelSelection', {type:5});
  }
  $scope.searchPeope6 = function (){
    $state.go('tab.personnelSelection', {type:6});
  }
  $scope.searchPeope7 = function (){
    $state.go('tab.personnelSelection', {type:7});
  }
  //返回刷新
  $scope.doRefresh = function (){
    if($rootScope.authorizedExaminer!=null){
      $scope.doneWork.examineOperatorName = $rootScope.authorizedExaminer;
    }
    if($rootScope.meet_host!=null){
      $scope.doneWork.hostName = $rootScope.meet_host;
    }
    if($rootScope.examinant!=null){
      $scope.doneWork.examinantName = $rootScope.examinant;
    }
    if($rootScope.unitExaminant!=null){
      $scope.doneWork.unitExaminantName = $rootScope.unitExaminant;
    }
    if($rootScope.replyExaminant!=null){
      $scope.doneWork.replyExaminantName = $rootScope.replyExaminant;
    }
    
    $scope.countersigner = $rootScope.countersigner;
    $scope.administrator = $rootScope.administrator;
    if(tools.isNull($rootScope.bankAccount1) == false){
      console.log("id=="+$rootScope.bankAccount1.id);
      $scope.doneWork.payAccounts.forEach(function (i,index){
        if(i.id == $rootScope.bankAccount1.id)
        {
          console.log("doRefresh===="+index);
          $scope.doneWork.payAccounts[index]=$rootScope.bankAccount1;
        }
      })
    }
  }
  $scope.pop ={rejectPosition : ""};
  $scope.rejectObj = function(){
    $scope.doneWork.fpRemark="";
    $scope.in.isCountersigne="";
    $scope.in.isAdministrat = "";

    $scope.administrator= "";
    $rootScope.administrator = "";
    $scope.countersigner= "";
    $rootScope.countersigner = "";
    $rootScope.countersigner_usercode = "";
    $rootScope.administrator_usercode = "";
    //发送获取可驳回节点请求
    var queryRetuanableParam = {
      login_code: $rootScope.rejectNode,
      actionName:"queryRetuanableNodes",
      proccd:$rootScope.pending_proccd+"",
      taskId:$rootScope.pending_taskId
    };
    $scope.sendUrl(queryRetuanableParam);
  }
  //付款审批--新增
  var payAccount_id = -1; //新增为对象id 赋值
  var chooseIndex = -2; //删除选择下标
  $scope.isActiveId = -2; //删除选择变色下标
  $scope.create = function(){
    payAccount_id ++;
    $scope.content = {id:payAccount_id,number:"",accountName:"",accountTitle:"",money:""};
    $scope.payAccounts.push($scope.content);
    $scope.doneWork.payAccounts=$scope.payAccounts;
  }
  $scope.delete = function(){
    console.log("payAccount_id=="+payAccount_id);
      if (payAccount_id >= 0) {
        $scope.doneWork.payAccounts.splice(payAccount_id, 1);
        payAccount_id --;
      }
  }
  $scope.searchAccount = function (accountId){
    $state.go('tab.accountSelection', {type:accountId});
  }
  //付款审批--删除选择
  $scope.choose = function(index){
    chooseIndex = index;
    console.log("chooseIndex"+chooseIndex);
    if($scope.isActiveId != index){
      $scope.isActiveId = index;  
    }
  }
   //付款审批--删除
  $scope.delete1 = function(){
    var needIndex ;

    $scope.doneWork.payAccounts.forEach(function(i,index){
      if(i.id==chooseIndex){
        needIndex = index;
        return index;
      }
    });
    if(tools.isNull(needIndex) == false){
      $scope.doneWork.payAccounts.splice(needIndex, 1);
    }
    
  }
})
.controller('doneWorkCtrl', function($state,$scope,$rootScope,$http,$interval,$ionicPopup,$ionicLoading,tools) {
  $scope.bt1 = true;
  $scope.bt2 = false;
  $scope.bt3 = false;
  $scope.bt4 = false;
  $scope.payAccounts = []; 
  //返回刷新
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.doRefresh();//刷新页面
  });
  //APP服务器获取数据
  var pendingWorkParam = { 
		  "login_code": $rootScope.rejectNode,
		  "actionName":"queryCompletedTask",
		  "module_type":"0",
		  "pageNumber":"1",
		  "pageSize":"6"
  };
  $scope.sendUrl = function(){
	  var param = JSON.stringify(pendingWorkParam);
	  CIBH5SDK.SendRequest(param);
	  $ionicLoading.show({
	      content: 'Loading',
	      animation: 'fade-in',
	      showBackdrop: true,
	      maxWidth: 200,
	      showDelay: 0
	  });
	  var num = 0;
	  var interval = $interval(function () {
		    ++num;
		    if (queryCompletedTask_RESULT) {
		      var pendingWorkList = JSON.parse(queryCompletedTask_RESULT);
		      if(tools.isNull(pendingWorkList.data)){
		    	  var alertPopup = $ionicPopup.alert({
				        title: '暂无数据'
				      });
		    	  $scope.doneWorks = ""; 
    	      }
		      else{
		    	  $scope.doneWorks = pendingWorkList.data; 			      
		      }
		      $ionicLoading.hide();
		      $interval.cancel(interval);
		      
		    }
		    
		    if (num == 20) {
		      $ionicLoading.hide();
		      var alertPopup = $ionicPopup.alert({
		        title: '抱歉,暂无数据,请稍候重试!'
		      });
		    }
	  },500,20);
  }
  $scope.hasValue = true; //到底判定
  $scope.dropDown_doRefresh = function(){
    var alertPopup = $ionicPopup.alert({
      title: '下拉刷新!'
    });
    alertPopup.then(function(res) {
      console.log('Thank you');
      $scope.$broadcast('scroll.refreshComplete'); 

    });
  };
  $scope.hasMore = function () { 
      return $scope.hasValue; 
  } 
  $scope.loadMore = function () { 
      console.log("ion-infinite-scroll"); 
      queryCompletedTask_RESULT ="";
      $scope.pageIndex=parseInt(pendingWorkParam.pageNumber)+1; 
      pendingWorkParam.pageNumber = $scope.pageIndex+"";
      var param = JSON.stringify(pendingWorkParam);
      CIBH5SDK.SendRequest(param);
      $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
      });
      var num = 0;
      var interval = $interval(function () {
    	    ++num;
    	    if (queryCompletedTask_RESULT) {
    	      var pendingWorkList = JSON.parse(queryCompletedTask_RESULT);
    	      if(tools.isNull(pendingWorkList.data)){
    	    	  $scope.hasValue = false; 
    	      }
    	      else{	    	  
    	    	  $scope.doneWorks = $scope.doneWorks.concat(pendingWorkList.data); 
    	      }
    	      $scope.$broadcast('scroll.infiniteScrollComplete');
    	      $ionicLoading.hide();
    	      $interval.cancel(interval);  	      
    	    }
    	    if (num == 20) {
    	      $scope.$broadcast('scroll.infiniteScrollComplete');
    	      $ionicLoading.hide();
    	      var alertPopup = $ionicPopup.alert({
    	        title: '抱歉,暂无数据,请稍候重试!'
    	      });
    	    }
    	  },500,20);
      
  }

  
  $scope.clearCash= function(taskId,busstp,proccd,ispriv,taskType,notifyId,brchcd,procid){
    $state.go('tab.doneWork-detail', {type:1});
    queryFormDetail_RESULT ="";
    saveFormDetail_RESULT="";
    submitTaskParam_RESULT ="";
	  $rootScope.done_taskId = taskId;
	  $rootScope.done_form_id = busstp;
    $rootScope.done_proccd = proccd;
    $rootScope.done_ispriv = ispriv;
    $rootScope.done_taskType = taskType;
    $rootScope.done_notifyId = notifyId;
    $rootScope.done_brchcd = brchcd;
    $rootScope.done_procid = procid;
  }
  
  $scope.doRefresh = function(){
    //返回回来时 按钮退到全部
    $scope.bt2 = false;
    $scope.bt4 = false;
    $scope.bt1 = true;
    getTodoTaskAndNotifys_RESULT ="";
    //访问全部
    pendingWorkParam.module_type = "0";
    pendingWorkParam.pageNumber = "1";
    $scope.hasValue = true; 
    $scope.sendUrl();
}
  $scope.test = function(index){  
    $scope.bt1 = false;
    $scope.bt2 = false;
    $scope.bt3 = false;
    $scope.bt4 = false;
    if(index==1){
      $scope.bt1 = true;
      queryCompletedTask_RESULT ="";
      //访问全部
      pendingWorkParam.module_type = "0";
      pendingWorkParam.pageNumber = "1";
      $scope.hasValue = true; 
      $scope.sendUrl();
    }
    if(index==2){
      $scope.bt2 = true;
      queryCompletedTask_RESULT ="";
      //访问业务申请
      pendingWorkParam.module_type = "1";
      pendingWorkParam.pageNumber = "1";
      $scope.hasValue = true; 
      $scope.sendUrl();
    }
    if(index==3){
      $scope.bt3 = true;
    }
    if(index==4){
      $scope.bt4= true;
      queryCompletedTask_RESULT ="";
      //访问付款审批
      pendingWorkParam.module_type = "2";
      pendingWorkParam.pageNumber = "1";
      $scope.hasValue = true; 
      $scope.sendUrl();
    }
  };
})
.controller('doneWorkDetailCtrl', function($scope, $stateParams,$state,$rootScope,$ionicPopup,tools,$ionicLoading,$interval) {
  //二级标题按钮
  $scope.form_del = true;
  $scope.app_pro = false;
  $scope.majors=[{id:"00",name:"-请选择-"},{id:"01",name:"是"},{id:"02",name:"否"}];
  $scope.results=[{id:"00",name:"-请选择-"},{id:"01",name:"同意"},{id:"02",name:"否决"},{id:"03",name:"再议"}];
  $scope.votes = [{id:"00",name:"-请选择-"},{id:"01",name:"同意"},{id:"02",name:"否决"},{id:"03",name:"再议"},{id:"04",name:"再不表决"}];
  $scope.ways = [{id:"00",name:"-请选择-"},{id:"01",name:"拍卖"},{id:"02",name:"协议转让"},{id:"03",name:"债务重组"},{id:"04",name:"其他"},{id:"05",name:"要约邀请公开竞价"},{id:"06",name:"网上竞价"}];
  $scope.whethers= [{id:"00",name:"默认否"},{id:"01",name:"是"},{id:"02",name:"否"}];
  $scope.Enclosures=[{name:"附件1",creater:"系统管理员"},{name:"附件1",creater:"系统管理员"}];
  $scope.payAccounts = []; 
  var fileName = "";
  //返回刷新
  $scope.$on('$ionicView.beforeEnter', function () {
    $scope.doRefresh();//刷新页面
  });
  $scope.in = {};
  
  //主体对象日期插件
   $scope.datepickerObjectEnd1 = {
    titleLabel: '选择日期',  //可选
    todayLabel: '今天',  //可选
    closeLabel: '关闭',  //可选
    setLabel: '确认',  //可选
    setButtonType: 'button-positive',  //可选
    todayButtonType: 'button-positive',  //可选
    closeButtonType: 'button-positive',  //可选
    inputDate: new Date(),  //可选，输入值
    mondayFirst: false,  //可选,星期一开头
    disabledDates: disabledDates, //可选
    weekDaysList: weekDaysList, //可选
    monthList: monthList, //可选
    templateType: 'popup', //可选i.e.的模式 modal or popup(兼容模式？)
    showTodayButton: 'true', //可选
    modalHeaderColor: 'bar-positive', //可选
    modalFooterColor: 'bar-positive', //可选
    from: new Date(1900, 1, 1), //可选
    to: new Date(2100, 12, 31),  //可选
    callback: function (val) {  //Mandatory
      datePickerCallbacke1(val);
    },
    dateFormat: 'yyyy-MM-dd', //可选
    closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
  };
  $scope.datepickerObjectEnd2 = {
    titleLabel: '选择日期',  //可选
    todayLabel: '今天',  //可选
    closeLabel: '关闭',  //可选
    setLabel: '确认',  //可选
    setButtonType: 'button-positive',  //可选
    todayButtonType: 'button-positive',  //可选
    closeButtonType: 'button-positive',  //可选
    inputDate: new Date(),  //可选，输入值
    mondayFirst: false,  //可选,星期一开头
    disabledDates: disabledDates, //可选
    weekDaysList: weekDaysList, //可选
    monthList: monthList, //可选
    templateType: 'popup', //可选i.e.的模式 modal or popup(兼容模式？)
    showTodayButton: 'true', //可选
    modalHeaderColor: 'bar-positive', //可选
    modalFooterColor: 'bar-positive', //可选
    from: new Date(1900, 1, 1), //可选
    to: new Date(2100, 12, 31),  //可选
    callback: function (val) {  //Mandatory
      datePickerCallbacke2(val);
    },
    dateFormat: 'yyyy-MM-dd', //可选
    closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
  };
  $scope.datepickerObjectEnd3 = {
    titleLabel: '选择日期',  //可选
    todayLabel: '今天',  //可选
    closeLabel: '关闭',  //可选
    setLabel: '确认',  //可选
    setButtonType: 'button-positive',  //可选
    todayButtonType: 'button-positive',  //可选
    closeButtonType: 'button-positive',  //可选
    inputDate: new Date(),  //可选，输入值
    mondayFirst: false,  //可选,星期一开头
    disabledDates: disabledDates, //可选
    weekDaysList: weekDaysList, //可选
    monthList: monthList, //可选
    templateType: 'popup', //可选i.e.的模式 modal or popup(兼容模式？)
    showTodayButton: 'true', //可选
    modalHeaderColor: 'bar-positive', //可选
    modalFooterColor: 'bar-positive', //可选
    from: new Date(1900, 1, 1), //可选
    to: new Date(2100, 12, 31),  //可选
    callback: function (val) {  //Mandatory
      datePickerCallbacke3(val);
    },
    dateFormat: 'yyyy-MM-dd', //可选
    closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
  };
  $scope.datepickerObjectEnd4 = {
    titleLabel: '选择日期',  //可选
    todayLabel: '今天',  //可选
    closeLabel: '关闭',  //可选
    setLabel: '确认',  //可选
    setButtonType: 'button-positive',  //可选
    todayButtonType: 'button-positive',  //可选
    closeButtonType: 'button-positive',  //可选
    inputDate: new Date(),  //可选，输入值
    mondayFirst: false,  //可选,星期一开头
    disabledDates: disabledDates, //可选
    weekDaysList: weekDaysList, //可选
    monthList: monthList, //可选
    templateType: 'popup', //可选i.e.的模式 modal or popup(兼容模式？)
    showTodayButton: 'true', //可选
    modalHeaderColor: 'bar-positive', //可选
    modalFooterColor: 'bar-positive', //可选
    from: new Date(1900, 1, 1), //可选
    to: new Date(2100, 12, 31),  //可选
    callback: function (val) {  //Mandatory
      datePickerCallbacke4(val);
    },
    dateFormat: 'yyyy-MM-dd', //可选
    closeOnSelect: true, //可选,设置选择日期后是否要关掉界面。呵呵，原本是false。
  };
  //切换表单详情 ----  审批流程
  $scope.test = function(index){  
    $scope.form_del = false;
    $scope.app_pro = false;
    if(index==1){
      $scope.form_del = true;
    }
    if(index==2){
      $scope.app_pro =true;
    }
  
  };
  //文件下载
  $scope.downLoadMethod = function(absolute_url,file_name){
    var fileDownloadParam = {
      login_code: $rootScope.rejectNode,
      actionName:"fileDownload",
      path:absolute_url
    };
    fileName = file_name;
    $scope.sendUrl(fileDownloadParam);
  }
  //数据发送获取
  var doneDetailParam = { 
		  "login_code": $rootScope.rejectNode,
		  "actionName":"queryFormDetail",
		  "proccd":$rootScope.done_proccd ,
      "form_id":$rootScope.done_form_id ,
      "doneWorkLastFlow":"true",
		  "taskId":$rootScope.done_taskId
  };
  $scope.sendUrl = function(jsParam){
    //所有公共返回结果初始化
    queryFormDetail_RESULT="";
    saveFormDetail_RESULT="";
    submitTaskParam_RESULT = "";
    addTasks_RESULT = "";
    jointlyTasks_RESULT = "";
    queryRetuanable_RESULT = "";
    returnTask_RESULT = "";
    queryRouteList_RESULT ="";
    fileDownload_RESULT = "";
	  var param = JSON.stringify(jsParam);
	  CIBH5SDK.SendRequest(param);
	  $ionicLoading.show({
	      content: 'Loading',
	      animation: 'fade-in',
	      showBackdrop: true,
	      maxWidth: 200,
	      showDelay: 0
	  });
	  var num = 0;
	  var interval = $interval(function () {
        ++num;
		    if (queryFormDetail_RESULT) {
          var pendingDetailList = JSON.parse(queryFormDetail_RESULT);
		      if(tools.isNull(pendingDetailList.data)){
		    	  var alertPopup = $ionicPopup.alert({
				        title: '暂无数据'
				      });
		    	  $scope.doneWork = ""; 
    	      }
		      else{       
            $scope.doneWork = pendingDetailList.data[0]; 
            
            //换行处理
            if(pendingDetailList.data[0].type == "01" || pendingDetailList.data[0].type == "02" || pendingDetailList.data[0].type == "03" || pendingDetailList.data[0].type == "06"){
              $scope.doneWork.business_view = pendingDetailList.data[0].business_view.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.business_censor_view = pendingDetailList.data[0].business_censor_view.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.prj_plan_detail_desc = pendingDetailList.data[0].prj_plan_detail_desc.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.asset_remark = pendingDetailList.data[0].asset_remark.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.other_description = pendingDetailList.data[0].other_description.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.vote_situation = pendingDetailList.data[0].vote_situation.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.approval_opinion = pendingDetailList.data[0].approval_opinion.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.council_summary_report = pendingDetailList.data[0].council_summary_report.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.project_background = pendingDetailList.data[0].project_background.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.program_compare = pendingDetailList.data[0].program_compare.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.other = pendingDetailList.data[0].other.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.talk_content = pendingDetailList.data[0].talk_content.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.project_background = pendingDetailList.data[0].project_background.replace(/<br\/>/g, "\n"); 
            }
            else{
              $scope.doneWork.fkabstract = pendingDetailList.data[0].fkabstract.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.completion = pendingDetailList.data[0].completion.replace(/<br\/>/g, "\n"); 
              $scope.doneWork.memo = pendingDetailList.data[0].memo.replace(/<br\/>/g, "\n");
              $scope.payAccounts = pendingDetailList.data[0].listBank;
              $scope.doneWork.payAccounts = $scope.payAccounts;
              if(tools.isNull(pendingDetailList.data[0].listFile) == false){
                $scope.Enclosures = pendingDetailList.data[0].listFile;
                $scope.Enclosures.forEach(function(i,index){
                  var str =i.file_name.length;
                  if(str>22){
                    i.Enclosure_isLength = "3";
                  }
                  else if(str>12 && str <= 22){
                    i.Enclosure_isLength = "2";
                  }
                  else{
                    i.Enclosure_isLength = "1";
                  }
                })
              }
              if(tools.isNull(pendingDetailList.data[0].listAssets) == false){
                $scope.listAssets = pendingDetailList.data[0].listAssets;
                $scope.listAssets.forEach(function(i,index){
                  i.data.forEach(function(j,id){
                    var val =j.value;
                    var len = 0;
                    for (var i = 0; i < val.length; i++) {
                        var a = val.charAt(i);
                        if (a.match(/[^\x00-\xff]/ig) != null) {//\x00-\xff→GBK双字节编码范围
                            len += 1;
                        }
                        else {
                            len += 0.5;
                        }
                    }
                    if(len>8){
                      j.listAsset_isLength = "true";
                    }
                    else{
                      j.listAsset_isLength = "false";
                    }
                  })
                })
              }
            }      
            if(tools.isNull($scope.doneWork.is_meetresolution) == false){
              $scope.in.is_meetresolution=$scope.majors[($scope.doneWork.is_meetresolution.substring(1,2))];
            }
            else{
              $scope.in.is_meetresolution=$scope.majors[0];
            }
            if(tools.isNull($scope.doneWork.vote_conclusion) == false){
              $scope.in.vote_conclusion=$scope.results[($scope.doneWork.vote_conclusion.substring(1,2))];
            }
            else{
              $scope.in.vote_conclusion=$scope.results[0];
            }
            if(tools.isNull($scope.doneWork.reply_conclusion) == false){
              $scope.in.reply_conclusion=$scope.results[($scope.doneWork.reply_conclusion.substring(1,2))];
            }
            else{
              $scope.in.reply_conclusion=$scope.results[0];
            }
            if(tools.isNull($scope.doneWork.bugorsold) == false){
              $scope.in.bugorsold=$scope.majors[($scope.doneWork.bugorsold.substring(1,2))];
            }
            else{
              $scope.in.bugorsold=$scope.majors[0];
            }
            if(tools.isNull($scope.doneWork.vote_result) == false){
              $scope.in.vote_result=$scope.votes[($scope.doneWork.vote_result.substring(1,2))];
            }
            else{
              $scope.in.vote_result=$scope.votes[0];
            }
            if(tools.isNull($scope.doneWork.meet_dispose_way_c) == false){
              $scope.in.meet_dispose_way_c=$scope.ways[($scope.doneWork.meet_dispose_way_c.substring(1,2))];
            }
            else{
              $scope.in.meet_dispose_way_c=$scope.ways[0];
            }
            if(tools.isNull($scope.doneWork.is_finan_sector_filing) == false){
              $scope.in.is_finan_sector_filing=$scope.whethers[($scope.doneWork.is_finan_sector_filing.substring(1,2))];
            }
            else{
              $scope.in.is_finan_sector_filing=$scope.whethers[2];
            }
            if(tools.isNull($scope.doneWork.is_publicity) == false){
              $scope.in.is_publicity=$scope.whethers[($scope.doneWork.is_publicity.substring(1,2))];
            }
            else{
              $scope.in.is_publicity=$scope.whethers[2];
            }
            if(tools.isNull($scope.doneWork.is_preemption) == false){
              $scope.in.is_preemption=$scope.whethers[($scope.doneWork.is_preemption.substring(1,2))];
            }
            else{
              $scope.in.is_preemption=$scope.whethers[2];
            }
            if(tools.isNull($scope.doneWork.is_auction) == false){
              $scope.in.is_auction=$scope.whethers[($scope.doneWork.is_auction.substring(1,2))];
            }
            else{
              $scope.in.is_auction=$scope.whethers[2];
            }
            if(tools.isNull($scope.doneWork.is_circul_dept) == false){
              $scope.in.is_circul_dept=$scope.whethers[($scope.doneWork.is_circul_dept.substring(1,2))];
            }
            else{
              $scope.in.is_circul_dept=$scope.whethers[2];
            }
              //判断要去什么流程 给页面传值
            if(pendingDetailList.data[0].type == "01"){
              $scope.pendingWorkId = "management";
              $scope.detail_title ="资产处置";
            }
            else if(pendingDetailList.data[0].type == "02"){
              $scope.pendingWorkId = "buy";
              $scope.detail_title ="资产收购";
            }
            else if(pendingDetailList.data[0].type == "03"){
              $scope.pendingWorkId = "investment";
              $scope.detail_title ="投资项目";
            } 
            else if(pendingDetailList.data[0].type == "06"){
              $scope.pendingWorkId = "wander";
              $scope.detail_title ="资产流转";
            }
            else if(pendingDetailList.data[0].type == "07"){
              $scope.pendingWorkId = "fundInvestment";
              $scope.detail_title ="基金投资";
            }
            else{
              $scope.pendingWorkId = "payment";		    		  
              $scope.detail_title ="付款审批";
            }     
          }
          //发送获取流程列表请求
        var queryRouteListParam = {
          login_code: $rootScope.rejectNode,
          actionName:"queryRouteList",
          proccd:$rootScope.done_proccd+"",
          busstp:$rootScope.done_form_id+"",
          brchcd:$rootScope.done_brchcd+"",
          taskId:$rootScope.done_taskId+"",
          notifyId:$rootScope.done_notifyId+"",
          procid:$rootScope.done_procid+"",
          taskType:$rootScope.done_taskType+""
        };
        $scope.sendUrl(queryRouteListParam);
		      $ionicLoading.hide();
		      $interval.cancel(interval);		      
		    }
		    else if(queryRouteList_RESULT){
          var queryRouteListParam = JSON.parse(queryRouteList_RESULT);
          $scope.circuits = queryRouteListParam.data[0].todoList;
          if(tools.isNull($scope.circuits) == false){
            $scope.circuits.forEach(function(s,index){
              s.comment =s.comment.replace(/<br\/>/g, "\n"); 
            });
            $scope.circuits.forEach(function(i,index){
              if(i.comment.indexOf('不同意')> -1){
                i.color = "fc_red";
              }
              else{
                i.color = "fc_green";
              }
              var str =i.comment.length;
              if(str>8){
                i.isLong = "true";
              }
              else{
                i.isLong = "false";
              }
            });
          }
          $ionicLoading.hide();
          $interval.cancel(interval);
        }
        else if(fileDownload_RESULT){
          var downLoadFileParam =JSON.parse(fileDownload_RESULT);
  
          CIBH5SDK.showTheAttachmentPathTitle(downLoadFileParam.url+"",fileName);
          $ionicLoading.hide();
          $interval.cancel(interval);
        }
		    if (num == 20) {
		      $ionicLoading.hide();
		      var alertPopup = $ionicPopup.alert({
		        title: '抱歉,暂无数据,请稍候重试!'
		      });
		    }
	  },500,20);
  }
  //date 转化(yyyy-mm--dd)
  var formatDateTime = function(timeStamp){
    var date = new Date(timeStamp);
    var y = date.getFullYear();        
    var m = date.getMonth() + 1;        
    m = m < 10 ? ('0' + m) : m;        
    var d = date.getDate();        
    d = d < 10 ? ('0' + d) : d;              
    return y + '-' + m + '-' + d;  
  };
    // 上会日期选择后的回调函数
  
  var datePickerCallbacke1 = function (val) {

    if (typeof (val) === 'undefined') {
    } 
    else {
      $scope.doneWork.meet_date = formatDateTime(val);//更新日期。
    }
  };

  // 批复日期选择后的回调函数
  var datePickerCallbacke2 = function (val) {

    if (typeof (val) === 'undefined') {
    } 
    else {
      $scope.doneWork.summary_issuing_date = formatDateTime(val);//更新日期。
    }
  };
  // 实际付款日期选择后的回调函数
  var datePickerCallbacke3 = function (val) {

    if (typeof (val) === 'undefined') {
    } 
    else {
      $scope.doneWork.actual_pay_date = formatDateTime(val);//更新日期。
    }
  };
  //转让基准日选择后的回调函数
  var datePickerCallbacke4 = function (val) {

    if (typeof (val) === 'undefined') {
    } 
    else {
      $scope.doneWork.transfer_base_time = formatDateTime(val);//更新日期。
    }
  };
  $scope.searchPeope1 = function (){
    $state.go('tab.personnelSelection', {type:1});
  }
  $scope.searchPeope2 = function (){
    $state.go('tab.personnelSelection', {type:2});
  }
  $scope.searchPeope3 = function (){
    $state.go('tab.personnelSelection', {type:3});
  }
  $scope.searchPeope4 = function (){
    $state.go('tab.personnelSelection', {type:4});
  }
  $scope.searchPeope5 = function (){
    $state.go('tab.personnelSelection', {type:5});
  }
  $scope.searchPeope6 = function (){
    $state.go('tab.personnelSelection', {type:6});
  }
  $scope.searchPeope7 = function (){
    $state.go('tab.personnelSelection', {type:7});
  }
  //返回刷新
  $scope.doRefresh = function (){
    $scope.sendUrl(doneDetailParam);
  }
  $scope.pop ={rejectPosition : ""};
  $scope.rejectObj = function(){
    var myPopup = $ionicPopup.show({
      template: '<ion-radio class="listFont4" ng-model="pop.rejectPosition" name="reject" value="提交">提交</ion-radio><ion-radio class="listFont4" ng-model="pop.rejectPosition" name="reject" value="协办">协办</ion-radio><ion-radio class="listFont4" ng-model="pop.rejectPosition" name="reject" value="部门负责人">部门负责人</ion-radio>',
      title: '请选择驳回节点',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.pop.rejectPosition) {
              //不允许用户关闭，除非他键入wifi密码
              e.preventDefault();
            } else {
              return $scope.rejectPosition;
            }
          }
        },
      ]
    });
    myPopup.then(function(res) {
      console.log("myPopup");
      myPopup.close();
    });
  }
  //付款审批--新增
  var payAccount_id = -1; //新增为对象id 赋值
  var chooseIndex = -2; //删除选择下标
  $scope.isActiveId = -2; //删除选择变色下标
  $scope.create = function(){
    payAccount_id ++;
    $scope.content = {id:payAccount_id,number:"",accountName:"",accountTitle:"",money:""};
    $scope.payAccounts.push($scope.content);
    $scope.doneWork.payAccounts=$scope.payAccounts;
  }
  $scope.searchAccount = function (accountId){
    $state.go('tab.accountSelection', {type:accountId});
  }
  //付款审批--删除选择
  $scope.choose = function(index){
    chooseIndex = index;
    console.log("chooseIndex"+chooseIndex);
    if($scope.isActiveId != index){
      $scope.isActiveId = index;  
    }
  }
   //付款审批--删除
  $scope.delete1 = function(){
    var needIndex ;

    $scope.doneWork.payAccounts.forEach(function(i,index){
      if(i.id==chooseIndex){
        needIndex = index;
        return index;
      }
    });
    if(tools.isNull(needIndex) == false){
      $scope.doneWork.payAccounts.splice(needIndex, 1);
    }
    
  }
})
.controller('aboutSoftwareCtrl', function($scope,$stateParams,$interval,tools,$rootScope,$ionicLoading,$ionicHistory,$ionicPopup) {
})
.controller('accountSelectionCtrl', function($scope,$stateParams,$interval,tools,$rootScope,$ionicLoading,$ionicHistory,$ionicPopup) {
  $scope.input ={};
  var normal;

  // $scope.bankAccounts = [{id:0,name:"兴业银行温州分行营业部",department:"3558801100225436976",accountName:"张三"},{id:1,name:"中国银行福州市市中支行营业部",department:"419574640601",accountName:"李四"},{id:2,name:"中国工商银行",department:"123456789",accountName:"王五"},{id:3,name:"中国农业银行",department:"0987654321",accountName:"朱六"}];

  //向服务端获取数据
  var creditActorParam = {
    "login_code": $rootScope.rejectNode,
    "actionName":"creditActor",
    "RECEIVE_BANK_ACCOUNT":"",
    "pageNumber":"1",
    "pageSize":"50"};
$scope.sendUrl = function(){
  var param = JSON.stringify(creditActorParam);
  CIBH5SDK.SendRequest(param);
  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
  });
  var num = 0;
  var interval = $interval(function () {
      ++num;
      if (creditActor_RESULT) {
        var creditActorList = JSON.parse(creditActor_RESULT);
        if(tools.isNull(creditActorList.data)){
          var alertPopup = $ionicPopup.alert({
              title: '暂无数据'
            });
          $scope.bankAccounts = ""; 
          normal = $scope.bankAccounts;
          }
        else{
          $scope.bankAccounts = creditActorList.data; 
          normal = $scope.bankAccounts;      
        }
        $ionicLoading.hide();
        $interval.cancel(interval);
        
      }
      
      if (num == 20) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '抱歉,暂无数据,请稍候重试!'
        });
      }
  },500,20);
}
$scope.sendUrl();
$scope.$on('$ionicView.beforeEnter', function () {
  $scope.doRefresh();//刷新页面
});
$scope.doRefresh = function (){
  console.log("res");
}
  //返回 按钮
  $scope.back = function(){
    $ionicHistory.goBack();
  }
  //按住行列表 选定
  $scope.choose = function (bankAccount){
    $scope.input.bank_name =bankAccount.BANK_NAME;
    $scope.input.payment_bank_account = bankAccount.RECEIVE_BANK_ACCOUNT;
    $scope.input.bank_account_name = bankAccount.ACCOUNT_NAME;
    if($scope.isActiveAccount != bankAccount.ROWNUM_){
      $scope.isActiveAccount = bankAccount.ROWNUM_;  
    }
  }
   
  $scope.select = function (){
    var tt =$scope.bankAccounts.filter(function(i){
      return ((i.BANK_NAME).indexOf($scope.input.bank_name) != -1 );
    })
    if( tools.isNull($scope.input.bank_name)){
      $scope.bankAccounts = normal;
    }
    else{
      $scope.bankAccounts = tt;
    }
  };
  $scope.next = function (){    
    $rootScope.bankAccount1 = $scope.input;
    $rootScope.bankAccount1.id = $stateParams.type;
    console.log("bankAccount1.id===="+$rootScope.bankAccount1.id);
    $ionicHistory.goBack();
  }
})
.controller('personnelSelectionCtrl', function($scope,$stateParams,$interval,tools,$rootScope,$ionicLoading,$ionicHistory,$ionicPopup) {
  $scope.input ={};
  var normal;
  //向服务端获取数据
  var getUserParam = { 
    "login_code": $rootScope.rejectNode,
    "actionName":"getUser",
    "queryUserCodeOrName":""
};
$scope.sendUrl = function(){
  var param = JSON.stringify(getUserParam);
  CIBH5SDK.SendRequest(param);
  $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
  });
  var num = 0;
  var interval = $interval(function () {
      ++num;
      if (getUser_RESULT) {
        var getUserList = JSON.parse(getUser_RESULT);
        if(tools.isNull(getUserList.data)){
          var alertPopup = $ionicPopup.alert({
              title: '暂无数据'
            });
          $scope.clerks = ""; 
          normal = $scope.clerks;
          }
        else{
          $scope.clerks = getUserList.data; 
          normal = $scope.clerks;      
        }
        $ionicLoading.hide();
        $interval.cancel(interval);
        
      }
      
      if (num == 20) {
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '抱歉,暂无数据,请稍候重试!'
        });
      }
  },500,20);
}
$scope.sendUrl();
$scope.$on('$ionicView.beforeEnter', function () {
  $scope.doRefresh();//刷新页面
});
$scope.doRefresh = function (){
  console.log("res");
}
  //返回 按钮
  $scope.back = function(){
    $ionicHistory.goBack();
  }
  //按住行列表 选定
  var usercode ;
  $scope.choose = function (clerk){
    $scope.input.name =clerk.username;
    usercode=clerk.usercode;
    console.log($scope.input.name);
    if($scope.isActiveId != clerk.usercode){
      $scope.isActiveId = clerk.usercode;  
    }
  }
   
  $scope.select = function (){
    var patt1=    /^[0-9]+/;//正则表达式
    if(!patt1.test($scope.input.name)){
      console.log("名字");
      var tt =$scope.clerks.filter(function(i){
        return ((i.username).indexOf($scope.input.name) != -1 );
      })
      if( tools.isNull($scope.input.name)){
        $scope.clerks = normal;
      }
      else{
        $scope.clerks = tt;
      }
    }
    else{
      console.log("编号");
      var tt =$scope.clerks.filter(function(i){
        return ((i.usercode).indexOf($scope.input.name) != -1 );
      })
      if( tools.isNull($scope.input.name)){
        $scope.clerks = normal;
      }
      else{
        $scope.clerks = tt;
      }
    }
  };
  $scope.next = function (){
    if($stateParams.type == "1"){
      $rootScope.authorizedExaminer = $scope.input.name;
      $rootScope.authorizedExaminer_usercode = usercode;

    }
    if($stateParams.type == "2"){
      $rootScope.meet_host = $scope.input.name;
      $rootScope.meet_host_usercode = usercode;
    }
    if($stateParams.type == "3"){
      $rootScope.examinant = $scope.input.name;
      $rootScope.examinant_usercode = usercode;

    }
    if($stateParams.type == "4"){
      $rootScope.unitExaminant = $scope.input.name;
      $rootScope.unitExaminant_usercode = usercode;
    }
    if($stateParams.type == "5"){
      $rootScope.replyExaminant = $scope.input.name;
      $rootScope.replyExaminant_usercode = usercode;
    }
    if($stateParams.type == "6"){
      $rootScope.countersigner = $scope.input.name;
      $rootScope.countersigner_usercode = usercode;
    }
    if($stateParams.type == "7"){
      $rootScope.administrator = $scope.input.name;
      $rootScope.administrator_usercode = usercode;
    }
    $ionicHistory.goBack();
  }
})
.controller('loginCtrl', function($scope,tools,$state,$interval,$ionicLoading,$ionicPopup,$ionicSlideBoxDelegate,$rootScope) {
  $scope.items=[
                {prizeList:[
                    {name:'Q币',col1Src:'img/core.jpg',col2Src:'img/5.png',price:'15',url:'tab.pendingWork'},
                    {name:'京东E卡',col1Src:'img/5.png',col2Src:'img/5.png',price:'11'},
                    {name:'京东E卡',col1Src:'img/5.png',col2Src:'img/5.png',price:'11'},
                    {name:'Q币',col1Src:'img/5.png',col2Src:'img/5.png',price:'15'}]},
                {prizeList:[
                    {name:'电话费',col1Src:'img/5.png',col2Src:'img/5.png',price:'12'},
                    {name:'京东E卡',col1Src:'img/5.png',col2Src:'img/5.png',price:'11'},
                    {name:'京东E卡',col1Src:'img/5.png',col2Src:'img/5.png',price:'11'},
                    {name:'Q币',col1Src:'img/5.png',col2Src:'img/5.png',price:'15'}]},
                {prizeList:[
                    {name:'空气净化器',col1Src:'img/5.png',col2Src:'img/5.png',price:'1000'},
                    {name:'电冰箱',col1Src:'img/5.png',col2Src:'img/5.png',price:'700'},
                    {name:'电冰箱',col1Src:'img/5.png',col2Src:'img/5.png',price:'700'},
                    {name:'电冰箱',col1Src:'img/5.png',col2Src:'img/5.png',price:'700'}]}
        ];
  $scope.pop ={rejectPosition : ""};
  var chooseUrl = "";
  $scope.sendUrl = function(jsParam){
      var param = JSON.stringify(jsParam);
      CIBH5SDK.SendRequest(param);
      $ionicLoading.show({
          content: 'Loading',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 0
      });
      var num = 0;
      var interval = $interval(function () {
          ++num;
          if (organActor_RESULT) {
            var organActorList = JSON.parse(organActor_RESULT);
            if(tools.isNull(organActorList.data)){
              var alertPopup = $ionicPopup.alert({
                  title: '暂无数据'
                });
              $scope.Tasks = ""; 
              }
            else{
              $scope.Tasks = organActorList.data;  
              var myPopup1 = $ionicPopup.show({
                template: '<ion-radio class="listFont4" ng-repeat="Task in Tasks"ng-model="pop.rejectPosition" name="reject" ng-value="Task">{{Task.deptcode}}</ion-radio>',
                title: '请选择所属机构',
                scope: $scope,
                buttons: [
                  { text: '取消' },
                  {
                    text: '<b>确定</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                      return $scope.pop.rejectPosition;
                    }
                  },
                ]
              });
              myPopup1.then(function(res) {
                if(tools.isNull(res) == false){
                  $rootScope.rejectNode = res.organcode;
                  $state.go(chooseUrl, {type:7});
                }
              });   
            }
            $ionicLoading.hide();
            $interval.cancel(interval);
            
          }
          
          if (num == 20) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: '抱歉,暂无数据,请稍候重试!'
            });
          }
      },500,20);
  }
  $scope.next = function(url){
    var organActorParam = {
      "actionName":"organActor"
    };
    chooseUrl = url;
    $scope.sendUrl(organActorParam);
  }
  $scope.articles = [{id: 0, avatar: 1, img: 2, title: 3, des: 4, see: 5},
    {id: 1, avatar: 1, img: 2, title: 3, des: 4, see: 5}];
  //为了验证属性active-slide定义的模型，angularjs是mvc模式
  $scope.model = {
    activeIndex: 0
  };
  //滑动图片的点击事件
  $scope.coverFlowClick = function () {
    var index = $ionicSlideBoxDelegate.currentIndex();
    console.log("coverFlowClick index = ", index);
  }
  //此事件对应的是pager-click属性，当显示图片是有对应数量的小圆点，这是小圆点的点击事件
  $scope.pageClick = function (index) {
    //alert(index);
    console.log("pageClick index = ", index);
    $scope.model.activeIndex = index;
  };

  //当图片切换后，触发此事件，注意参数
  $scope.slideHasChanged = function ($index) {
    //alert($index);
    //console.log("slideHasChanged index = ", $index);
  };
  //这是属性delegate-handle的验证使用的，其实没必要重定义，直接使用$ionicSlideBoxDelegate就可以
  $scope.delegateHandle = $ionicSlideBoxDelegate;
});
