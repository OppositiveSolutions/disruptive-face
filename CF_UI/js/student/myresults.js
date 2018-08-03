function loadMyResultsPage() {
    $.get("student/myresults.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        showMyResultPage();
    });
}

function initializeStudentResultPage() {
    google.charts.setOnLoadCallback(drawBarChart);
    getExamList();
    getExamResultList();
}
function getExamList() {
    var url = protocol + "//" + host + "/result/scorecard";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (list) {
            populateExamListLeftMenu(list.data);
        }
    });
}

function populateExamListLeftMenu(list) {
    if (!list.length) {
        return;
    }
    var ul = $("#resultLeftmenu").find("ul");
    $(ul).empty();
    for (var i = 0; i < list.length; i++) {
        var li = $("<li>").html(list[i].examName);
        $(li).data("examData", list[i]);
        $(li).click(function () {
            $("#resultLeftmenu").find("li").removeClass('selection');
            $(this).addClass('selection');
            var examData = $(this).data("examData");
            showMyResultExamResultScoreBoard(examData.examId);
        });
        $(ul).append(li);
        if (i == 0) {
            $(li).addClass("selection");
            showMyResultExamResultScoreBoard(list[i].examId);
        }

    }

}
function showMyResultExamResultScoreBoard(examId) {
    var url = protocol + "//" + host + "/result/" + examId + "/scoregraph";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (list) {
            populateMyResultScoreSheet(list.data);
            populateResultGraph(list.data);
            $("#resultLeftmenu").find("ul").css("height", $("div.myResultContent").height() - 40);
        }
    });
}
function populateResultGraph(list) {

    var graphData = [['Category', 'Total  Mark', 'Right Answer Mark', 'Wrong Answer Mark']];
    for (var i = 0; i < list.length; i++) {
        var categoryDetails = [];
        categoryDetails.push(list[i].categoryName);
        categoryDetails.push(list[i].totalMark);
        categoryDetails.push(list[i].correctMark);
        categoryDetails.push(list[i].negativeMark);
        graphData.push(categoryDetails);
    }

    var options = {
        chart: {
            title: 'Category Summary',
        },
        colors: ['#4385f4', '#269900', '#e61818']
    };
    drawBarChart(graphData, options);

}

function populateMyResultScoreSheet(list) {
    if (!list.length) {
        return;
    }
    myResultPopulateTotalStatus(list);
    var tbody = $("#tblMyResultsStatus").find("tbody");
    $(tbody).empty();
    for (var i = 0; i < list.length; i++) {
        var tr = $('<tr>');
        var tdSection = $('<td>').html(list[i].categoryName);
        $(tr).append(tdSection);
        var tdAttempted = $('<td>').html(list[i].totalAttended + " / " + list[i].noOfQuestions);
        $(tr).append(tdAttempted);
        var tdCorrect = $('<td>').html(list[i].correctMark);
        $(tr).append(tdCorrect);
        var tdWrong = $('<td>').html(list[i].negativeMark);
        $(tr).append(tdWrong);
        var tdScore = $('<td>').html(list[i].totalMark);
        $(tr).append(tdScore);
        var percentage = list[i].totalMark / list[i].totalPossibleMark * 100;
        var tdPercentage = $('<td>').html(percentage);
        $(tr).append(tdPercentage);
        var tdTime = $('<td>').html(list[i].timeTakenMin + "min " + list[i].timeTakenSec + "sec");
        $(tr).append(tdTime);
        $(tbody).append(tr);
    }
    //for()

}
function myResultPopulateTotalStatus(list) {

    var totalAttempted = 0;
    var totalAvailable = 0;
    var totalCorrectAnswer = 0;
    var totalWrongAnswer = 0;
    var totalScore = 0;
    for (var i = 0; i < list.length; i++) {
        totalAttempted += list[i].totalAttended;
        totalAvailable += list[i].noOfQuestions;
        totalCorrectAnswer += list[i].correctMark;
        totalWrongAnswer += list[i].negativeMark;
        totalScore += list[i].totalMark;
    }
    $("#resultTotalAttempted").html(totalAttempted + " / " + totalAvailable);
    $("#resultTotalCorrectAnswer").html(totalCorrectAnswer);
    $("#resultTotalWrongAnswer").html(totalWrongAnswer);
    $("#resultTotalScore").html(totalScore);

}


function getExamResultList() {
    var testId = 1;
    var url = protocol + "//" + host + "/exam/" + testId + "/questions";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (map) {
            console.info(map);
            getAllCategoriesForQuestionPaper(map.data.questionPaperCategorys);
        }
    });
}


function getAllCategoriesForQuestionPaper(list) {
    var mainDiv = $("#questionAnswerList").empty();
    if (list.length != 0) {
        for (var i = 0; i < list.length; i++) {
            var index = i + 1;
            var divPanel = $("<div>").addClass("panel panel-default");
            $(mainDiv).append(divPanel);
            var divPanelHeading = $("<div>").addClass("panel-heading");
            $(divPanel).append(divPanelHeading);
            $(divPanelHeading).attr("categoryId", list[i].category.categoryId);
            $(divPanel).attr("categoryId", list[i].category.categoryId);
            var aToggleButton = $("<button>").addClass("btn btn-sm btn-default pull-right btnView").html("view");
            $(divPanelHeading).append(aToggleButton);
            $(aToggleButton).attr("data-toggle", "collapse");
            $(aToggleButton).attr("data-parent", "#questionAnswerList");
            $(aToggleButton).attr("href", "#category" + index + "Condent");
            var h4title = $("<h4>").addClass("panel-title").html(list[i].category.name);
            $(divPanelHeading).append(h4title);
            var divForCategoryCondent = $("<div>").addClass("panel-collapse collapse ");
            $(divForCategoryCondent).attr("id", "category" + index + "Condent");
            $(divPanel).append(divForCategoryCondent);
            var divForPanelCategoryCondent = $("<div>").addClass("panel-body");
            $(divForCategoryCondent).append(divForPanelCategoryCondent);
            getSubCategoryForACategory(list[i].questionPaperSubCategorys, divForPanelCategoryCondent, list[i].correctAnswerMark);
        }
    }
}

function getSubCategoryForACategory(subCategoryList, categoryDiv, correctAnswerMark) {
    if (subCategoryList.length != 0) {
        for (var j = 0; j < subCategoryList.length; j++) {
            var index = j + 1;

            //------------------------------panels for sub category-----------------------//
            var subCategoryPanel = $("<div>").addClass("panel panel-default");
            $(categoryDiv).append(subCategoryPanel);
            var divSubCategoryTop = $("<div>").addClass("panel-heading subCatHead");
            $(subCategoryPanel).append(divSubCategoryTop);
            var h4ForSubHead = $("<h4>").addClass("panel-title").html("Sub Category " + (j + 1) + " ( Mark:" + subCategoryList[j].noOfQuestions + " X " + correctAnswerMark + " )");
            $(divSubCategoryTop).append(h4ForSubHead);
            var divForSubBody = $("<div>").addClass("panel-body subCat");
            $(divForSubBody).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
            $(subCategoryPanel).append(divForSubBody);
            if (subCategoryList[j].description) {
                var spanForDirection = $("<span>").addClass("boldFont").html("Directions:");
                var PforDirection = $("<p>").html("[ " + subCategoryList[j].description + " ]");
                $(divForSubBody).append(spanForDirection);
                $(divForSubBody).append(PforDirection);
            }

            //-------------------collapse buttons------------------------------------------------//

            var btnForCollapse = $("<button>").addClass("btn btn-default contentBtn btn-sm pull-right marginrgtfive").html("-");
            $(btnForCollapse).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
            $(btnForCollapse).click(function () {

                collapseCurrentSubCategoryData($(this));
            });
            $(h4ForSubHead).append(btnForCollapse);

            var btnForExpandCollapse = $("<button>").addClass("btn btn-default contentBtn btn-sm pull-right marginrgtfive").html("+");
            $(btnForExpandCollapse).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
            $(btnForExpandCollapse).click(function () {
                viewCurrentSubCategoryData($(this));
            });
            $(h4ForSubHead).append(btnForExpandCollapse);
            //------------------------------------------------------------------------------//

            var divForContent = $("<div>").addClass("subContent").html(subCategoryList[j].content);
            $(divForSubBody).append(divForContent);
            try {
                var imgList = subCategoryList[j].questionPaperSubCategoryImage;
                if (imgList && imgList.length) {
                    for (var k = 0; k < imgList.length; k++) {
                        var divForImage = $("<div>").addClass("text-center");
                        var imgForContent = $("<img>").attr("src", 'data:image/jpeg;base64,' + imgList[k].image);
                        $(imgForContent).attr("width", "300px");
                        $(divForImage).append(imgForContent);
                        $(divForSubBody).append(divForImage);

                    }
                }
            } catch (e) {

            }
            populateQuestionAndOptions(subCategoryList[j], divForSubBody);
            $(divForSubBody).hide();
        }
    }
}
function viewCurrentSubCategoryData(item) {
    var subCategoryId = $(item).attr("subCategoryId");
    $("#questionAnswerList").find("div.subCat").hide();
    $("#questionAnswerList").find("div.subCat[subCategoryId=" + subCategoryId + "]").show();
    window.scrollTo(0, ($(item).offset().top - 200));
}
function collapseCurrentSubCategoryData(item) {
    var subCategoryId = $(item).attr("subCategoryId");
    $("#questionAnswerList").find("div.subCat[subCategoryId=" + subCategoryId + "]").hide();
}
function deletContentToSUbCategory(subCategoryId) {
    $.ajax({
        url: protocol + "//" + host + "/question-paper/sub-category/" + subCategoryId + "/content",
        type: "DELETE",
        cache: false,
        success: function (obj) {
            refreshQuestionPaperPage();
        }
    });
}


function addContentToSUbCategory(subCategoryId, subData) {
    $("#divAddNewSubContentPage").modal("show");
    $("#divAddNewSubContentPage").attr("isEdit", false);
    tinymce.get('txtAreaForSubContent').setContent("");
    $("#divAddImgCOntentForMakeQPaper").find("div.previewDiv").html("");
    $("#questionImageSubContent").val("");
    $("#divAddNewSubContentPage").attr("subCategoryId", subCategoryId);
    try {
        if (subData) {
            $("#divAddNewSubContentPage").attr("isEdit", true);
            tinymce.get('txtAreaForSubContent').setContent(subData.content);
            try {
                if (!subData.questionPaperSubCategoryImage[0]) {
                    return;
                }
                var img = $("<img>").attr("src", "data:image/jpg;base64," + subData.questionPaperSubCategoryImage[0].image).attr("width", "100%");
                $("#divAddImgCOntentForMakeQPaper").find("div.previewDiv").html(img);
                $(img).data("subImgMap", subData.questionPaperSubCategoryImage[0]);
                $('#divAddNewSubContentPage').find("div.previewDiv").find("img").data("subImgMap");
            } catch (e) {

            }
        }
    } catch (e) {

    }
}
function populateQuestionAndOptions(subCategory, targetDiv) {
    $(targetDiv).css("border-top", "1px solid #ddd");
    var questionsList = subCategory.questions;
    var ulForQuestion = $("<ul>").addClass('noPadding QuestionUl');
    $(ulForQuestion).attr("subCategoryId", subCategory.questionPaperSubCategoryId);
    $(targetDiv).append(ulForQuestion);
    if (questionsList.length != 0) {
        for (var k = 0; k < questionsList.length; k++) {
            var divForQuestion = $("<li>").addClass("questionLi");

            var pForNumber = $("<p>").html(questionsList[k].questionNo + ") ");
            $(divForQuestion).append(pForNumber);
            try {
                $(divForQuestion).attr("questionId", questionsList[k].question.questionId);
            } catch (e) {

            }

            try {
                var hasImage = false;
                var ImgMapList = questionsList[k].question.questionImage;
                var divForImg = $("<div>").addClass("text-center");
                for (var i = 0; i < ImgMapList.length; i++) {
                    var ImgMap = ImgMapList[i];
                    if (ImgMap.image) {
                        var imgForQuestion = $("<img>").attr("src", 'data:image/jpeg;base64,' + ImgMap.image);
                        $(imgForQuestion).attr("width", "300px");
                        hasImage = true;
                    }
                    $(divForImg).append(imgForQuestion);
                }
                $(divForQuestion).append(divForImg);
                var pForQuestion = $("<p>").html(questionsList[k].questionNo + ") " + questionsList[k].question.question);
                if (hasImage) {
                    $(pForQuestion).html(questionsList[k].question.question)
                } else {
                    $(pForNumber).remove();
                }
                $(divForQuestion).append(pForQuestion);
            } catch (e) {

            }
            $(ulForQuestion).append(divForQuestion);


            var spanForEditAndDelete = $("<span>").addClass("pull-right editDeleteSpan");
            $(spanForEditAndDelete).attr("subCategroyId", questionsList[k].questionPaperSubCategoryId);
            $(spanForEditAndDelete).data("question", questionsList[k].question);
            $(spanForEditAndDelete).attr("questionNo", questionsList[k].questionNo);
            var editIcon = $("<i>").addClass("fa fa-pencil");
            $(editIcon).click(function () {
                var questionMap = $(this).parent().data("question");
                var subCategoryId = $(this).parent().attr("subCategroyId");
                var questionNo = $(this).parent().attr("questionNo");
                var categoryId = $(this).closest("div.panel").attr("categoryId");
                $("#divAddNewQPaperPage").attr("isEdit", "true");

                showQuestionCreateSection(subCategoryId, questionMap, questionNo, categoryId);
            });
            var deleteIcon = $("<i>").addClass("fa fa-trash-o");
            $(spanForEditAndDelete).append(editIcon);
            $(spanForEditAndDelete).append(deleteIcon);
            $(deleteIcon).click(function () {
                var questionMap = $(this).parent().data("question");
                if (confirm("Are you sure you want to delete the question")) {
                    deleteQuestion(questionMap.questionId);
                }
            });
            $(divForQuestion).append(spanForEditAndDelete);
            var ulForOptions = $("<ul>").addClass("optionsList");
            var optionsList = questionsList[k].question.options;
            if (optionsList) {
                for (var p = 0; p < optionsList.length; p++) {
                    var liForOption = $("<li>").html("<p>" + optionsList[p].optionNo + ") " + optionsList[p].option);
                    $(liForOption).attr("questionNumber", optionsList[p].optionNo);
                    $(liForOption).attr("optionId", optionsList[p].optionId);
                    $(ulForOptions).append(liForOption);
                }
            }
            $(divForQuestion).append(ulForOptions);
            var correctAnswer = $(ulForOptions).find("li[questionNumber=" + questionsList[k].question.correctOptionNo + "]").text();
            var pForAnswer = $("<p>").addClass("answerDiv").html(" Answer: " + correctAnswer);
            $(divForQuestion).append(pForAnswer);

        }
    }
}
