define(function (require) {
    var app = require('app');

    app.controller('resourceCtrl', ['$scope','$http','WebApi','common','$fileUploader', function($scope,$http,WebApi,common,$fileUploader) {

        var teacherId = $.cookie('cookieUserId');
    	//添加公告
        $scope.showNotice = function (){
        	$("#modal-addNotice").modal("show");
        }

        $scope.init = function () {
            $scope.activeCourse = common.Session.activeCourse;
            $scope.activeCourseTime = common.Session.activeCourseTime;
            getResourceList();
        }

        //获取资源列表
        function getResourceList() {
        	var url = "/web/resource/getResourceList";
        	WebApi.Post(url,{
                c_id: $scope.activeCourse.c_id,
                t_id :teacherId
            },function(d){
                if(d.data){
                    $scope.resourceList = d.data;
                }else{
                    $("#resourceList").html("暂无资源，请先点击上传资源按钮进行资源上传...");
                }
            });
        }

        //删除资源
        $scope.deleteResource = function(resource){
            var url = "/web/resource/delete";
            WebApi.Post(url,{
                resource_id: $scope.activeResource.resource_id,
                c_id: $scope.activeCourse.c_id,
                t_id :teacherId
            },function(d){
                if(d.data.resource_file_delete_status == 1){
                    returnMessage("资源删除成功！");
                     getResourceList();
                }else{
                    returnMessage("资源删除失败，请重新删除！");
                }
            });
        }

        //删除确认弹出框
        $scope.deleteConform = function(resource){
            $("#modal-deleteConform").modal("show");
            $scope.activeResource = resource;
        }

        //用户提示弹出框
        function returnMessage(content){
            $("#modal-errorInfo").modal('show');
            $("#infoContent").html(content);
        }

        //上传资源
        //插件ajaxfileupload.js
        $('#uploadResource').diyUpload({
	        url:'/FileUpload/fileUpload_ajax',
	        success:function( data ) {
	            console.info( data );
	            //完成上传后再次获取资源列表
	            //getResourceList();
	        },
	        error:function( err ) {
	            console.info( err );    
	        },
	        buttonText : "上传资源 <i class='glyphicon glyphicon-open icon-color'><i/>",
	        chunked:true,
	        // 分片大小
	        chunkSize:512 * 1024,
	        //最大上传的文件数量, 总文件大小,单个文件大小(单位字节);
	        fileNumLimit:50,
	        fileSizeLimit:500000 * 1024,
	        fileSingleSizeLimit:50000 * 1024,
	        accept: {}
	    });

        //文件上传插件
        var vm = $scope.vm = {};
            vm.uploader = $fileUploader.create({
            scope: $scope,
            url: 'http://192.168.235.50:8080/FileUpload/fileUpload_ajax',
            headers: {'Content-Type':'text/html'},
            autoUpload: true,   // 自动开始上传
            formData: [          // 和文件内容同时上传的form参数
              { id: 'file_AjaxFile' }
            ],
            filters: [           // 过滤器，可以对每个文件进行处理
              function (item) {
                console.info('filter1', item);
                $scope.fileName && ($scope.fileName += ' ' + item.name)
                $scope.fileName || ($scope.fileName = item.name)
                // $scope.fileUpload.PathName = nameSplit[0].substring(0,nameSplit[0].length-4);
                // $scope.addFunctionUrl();
                // $scope.getAllMenuList();
                // getAllAccessByMenu();
                return true;
              }
            ]
        });

    }]);

});
    