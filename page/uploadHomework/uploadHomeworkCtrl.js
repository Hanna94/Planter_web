define(function (require) {
    var app = require('app');

    app.controller('uploadHomeworkCtrl', ['$scope','$http','WebApi','common', function($scope,$http,WebApi,common) {

        var studentId = $.cookie('cookieUserId');
        $scope.init = function () {
        	// getActiveCourse();
        
        	// $("#courseList").html 
        	getCourseList();

        }
  //       function getActiveCourse(){
  //       	alert('sss');
		// }
        //获取学生班级列表
        //    "data": [
    //     {
    //         "c_id": "1a3c5d67-e0d4-400a-8e85-4d8c7da1a994",
    //         "course_name": "口译 0"
    //     },
    //     {
    //         "c_id": "3d87b4fd-b16d-47b1-9ace-cb7576270540",
    //         "course_name": "口译 1"
    //     },
    //     {
    //         "c_id": "41d6f346-ad85-480a-a53f-3796b4174247",
    //         "course_name": "口译 2"
    //     },
    //     {
    //         "c_id": "ad22a584-cdf8-4425-ac72-919805bb90e1",
    //         "course_name": "口译 3"
    //     },
    //     {
    //         "c_id": "acbc2420-ebf7-46ba-a07f-8a31b6f0db02",
    //         "course_name": "口译 4"
    //     },
    //     {
    //         "c_id": "ad06036f-3f0b-48d2-97bd-0ac55c7f47fb",
    //         "course_name": "口译 5"
    //     },
    //     {
    //         "c_id": "57bcf50c-9570-4ab5-a394-4daa52580bc2",
    //         "course_name": "口译 6"
    //     },
    //     {
    //         "c_id": "9f452232-036e-4bcf-8611-ab555f02e4c9",
    //         "course_name": "口译 7"
    //     },
    //     {
    //         "c_id": "784059eb-f097-4ffc-9df3-f0076b5d994c",
    //         "course_name": "口译 8"
    //     },
    //     {
    //         "c_id": "d146e6ac-d6d0-49ba-a003-ba89ef7aa5f3",
    //         "course_name": "口译 9"
    //     }
    // ]
        function getCourseList (){
        	var url = "/web/login/getStudentCourseInfoList";
        	WebApi.Post(url,{
                // c_id: $scope.activeCourse.c_id,
                s_id :studentId
            },function(d){
                if(d.data){
                	$scope.courseList = d.data
                	$scope.getActiveCourse(d.data[0]);;
                }else{
                    // $("#resourceList").html("暂无资源，请先点击上传资源按钮进行资源上传...");
                }

            });
        }		

        //获取当前课程信息
        $scope.getActiveCourse = function(course){
        	$("#modal-courseList").modal("show");
        	$scope.activeCourse = course; 
        	common.Session.activeCourse || (common.Session.activeCourse = course)
        	var url = "/web/homework/getStudentHomeworkInfoList";
        	WebApi.Post(url,{
                c_id: course.c_id,
                s_id :studentId
            },function(d){
                if(d.data){
                	$scope.homeworkList = d.data
                	// $scope.getActiveCourse(d.data[0]);;
                }else{
                    returnMessage("当前课程暂无作业信息，请切换其他课程！")
                }

            });
        }

        //学生选择的课程
        $scope.selectedCourse = function (course){
        	$scope.activeCourse = course;
        	common.Session.activeCourse = course;
        }

        //显示作业详情
        $scope.showHomeworkContent = function(content){
            $scope.homeworkContent = content;
            $("#modal-homeworkContent").modal("show");
        }
         

	    //用户提示弹出框
        function returnMessage(content){
            $("#modal-errorInfo").modal('show');
            $("#infoContent").html(content);
        }


    }]);

});
    