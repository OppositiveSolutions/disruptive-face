var protocol = location.protocol;
var host = location.host + "/cf-restful";
var timerForCategory;
$(document).ready(function () {
    $("#loadingPanelContainer").hide();
    createExamForTest();
    $("#examContainer").hide();
    $("#examControls").hide();
    $("#sectionContainer").hide();
    $("#btnStartExam").click(function () {
        startExam();
    });
    $("#btnNextQuestion").click(function () {
        populateNextQuestion(1);
    });
    $("#btnReviewNextQuestion").click(function () {
        reviewAndPopulateNextQuestion();
    });
    $("#btnPreviousQuestion").click(function () {
        populateNextQuestion(0);
    });
    $("#btnFinishExam").click(function () {
        saveQuestionInExam();
    });
    $("#startExamModelClose").click(function () {
        location.href="/CF_UI/#/mytests";
    });

});
function createExamForTest() {
    var testId = getUrlParameter('testId');
    var isDemo = getUrlParameter('isDemo');
    $.ajax({
        url: protocol + "//" + host + "/exam/" + testId + "/create/" + isDemo,
        type: "POST",
        cache: false,
        success: function (returnMap) {
            var examId = returnMap.data;
            getAllCategoriesOfQUestionPaper(examId);
            $("#examContainerPage").attr("examId", examId);
        }
    });

}
function setCounter(duration) {
    var durationForExam = duration * 60 * 1000;
    var countDownDate = (new Date()).getTime() + durationForExam;

    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (hours.toString().length == 1) {
            hours = "0" + hours;
        }
        if (minutes.toString().length == 1) {
            minutes = "0" + minutes;
        }
        if (seconds.toString().length == 1) {
            seconds = "0" + seconds;
        }
        $("#secondsSpan").fadeOut(500, function () {
            $(this).text(seconds).fadeIn(500);
        });
        $("#minuteSpan").html(minutes);
        $("#hourSpan").html(hours);

        // If the count down is over, write some text 
        if (distance <= 0) {
            clearInterval(x);
            $("#minuteSpan").html("00");
            $("#hourSpan").html("00");
            $("#secondsSpan").fadeOut(500, function () {
                $(this).text("00").fadeIn(500);
            });
        }
    }, 1000);
}

function setCounterForCategory(duration) {
    var durationForExam = duration * 60 * 1000;
    var countDownDate = (new Date()).getTime() + durationForExam;

    timerForCategory = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        if (hours.toString().length == 1) {
            hours = "0" + hours;
        }
        if (minutes.toString().length == 1) {
            minutes = "0" + minutes;
        }
        if (seconds.toString().length == 1) {
            seconds = "0" + seconds;
        }
        $("#secondsSpanCategory").fadeOut(500, function () {
            $(this).text(seconds).fadeIn(500);
        });
        $("#minuteSpanCategory").html(minutes);
        $("#hourSpanCategory").html(hours);

        // If the count down is over, write some text 
        if (distance <= 0) {
            clearInterval(timerForCategory);
            $("#minuteSpanCategory").html("00");
            $("#hourSpanCategory").html("00");
            $("#secondsSpanCategory").fadeOut(500, function () {
                $(this).text("00").fadeIn(500);
            });
            $("#sectionContainer").find("button.active").next().click();
        }
    }, 1000);
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};
function saveQuestionInExam() {
    var answerList = [];
    $("#questionContainer").find("div.questionDiv").each(function () {
        var questionNumber = $(this).attr("questionNumber");
        var questionId = $(this).attr("questionId");
        var status = $(this).attr("status");
        var categoryId = $(this).attr("categoryId");
        var selectedOptionNumber = $(this).find("input:radio:checked").val();
        if (!selectedOptionNumber) {
            selectedOptionNumber = 0;
        }
        var questionAnswerMap = {
            questionNo: +questionNumber,
            questionId: +questionId,
            status: +status,
            optionNo: +selectedOptionNumber,
            categoryId: +categoryId
        }

        answerList.push(questionAnswerMap);
    });
    var examId = $("#examContainerPage").attr("examId");
    $("#loadingPanelContainer").show();
    $.ajax({
        url: protocol + "//" + host + "/exam/saveexam/" + examId,
        type: "POST",
        cache: false,
        data: JSON.stringify(answerList),
        contentType: "application/json; charset=utf-8",
        success: function (returnMap) {
            $("#loadingPanelContainer").hide();
            if (returnMap.data) {
                alert("saved successfully");
                showExamResultScoreBoard(examId);
            }
        }
    });


}
function showExamResultScoreBoard(examId) {
    var url = protocol + "//" + host + "/result/" + examId + "/scoregraph";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (list) {
            populateResultScoreSheet(list.data);

        }
    });
}
function populateResultScoreSheet(list) {
    if (!list.length) {
        return;
    }
    populateTotalStatus(list);
    $("#divShowExamResultStatus").modal('show');
    var tbody = $("#tblSesultStatus").find("tbody");
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
function populateTotalStatus(list) {
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
    $("#totalAttempted").html(totalAttempted + " / " + totalAvailable);
    $("#totalCorrectAnswer").html(totalCorrectAnswer);
    $("#totalWrongAnswer").html(totalWrongAnswer);
    $("#totalScore").html(totalScore);

}
function getAllCategoriesOfQUestionPaper(testId) {
    var url = protocol + "//" + host + "/exam/" + testId + "/questions";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (map) {
            console.info(map);
            populateExamStartPage(map.data);
            $("#examContainer").data("examMap", map.data);
        }
    });
}

function populateExamStartPage(examMap) {
    $("#examName").html(examMap.name + " - " + examMap.examCode);
    $("#totalNumberOfQuestions").html(examMap.noOfQuestions);
    $("#totalTimeAvailable").html(examMap.duration + " min");
    var tbody = $("#tblForExamIntroductionCategoryList").find("tbody");
    $(tbody).empty();
    var categoryList = examMap.questionPaperCategorys;
    if (categoryList.length != 0) {
        for (var i = 0; i < categoryList.length; i++) {
            var tr = $("<tr>");
            var tdForIndex = $("<td>").html(i + 1);
            $(tr).append(tdForIndex);
            var tdForCategoryName = $("<td>").html(categoryList[i].category.name);
            $(tr).append(tdForCategoryName);
            var tdForNumberOfQuestions = $("<td>").html(categoryList[i].noOfQuestions);
            $(tr).append(tdForNumberOfQuestions);
            var tdForMaxScore = $("<td>").html(categoryList[i].correctAnswerMark * categoryList[i].noOfQuestions);
            $(tr).append(tdForMaxScore);
            var tdMarksForCorrectAnswer = $("<td>").html(categoryList[i].correctAnswerMark)
            $(tr).append(tdMarksForCorrectAnswer);
            var tdForNegetiveMark = $("<td>").html(categoryList[i].negativeMark);
            $(tr).append(tdForNegetiveMark);
            $(tbody).append(tr);
        }
    }
}
function startExam() {
    var examId = $("#examContainerPage").attr("examId");
    var url = protocol + "//" + host + "/exam/" + examId + "/startexam/1"
    $.ajax({
        url: url,
        type: "POST",
        cache: false,
        success: function (map) {
            $("#examContainer").show();
            $("#examIntroduction").hide();
            $("#startExamFooter").hide();
            $("#examControls").show();
            $("#sectionContainer").show();
            var examMap = $("#examContainer").data("examMap");
            setCounter(examMap.duration);
            populateSections(examMap.questionPaperCategorys);
            populateQuestions(examMap.questionPaperCategorys);
            $("#sectionContainer").find("button:first").trigger("click");

        }
    });

}

function populateSections(sectionsList) {
    var sectionDiv = $("#sectionContainer");
    $(sectionDiv).empty();
    var totalTime = 0;
    var totalDuration = 0;
    if (sectionsList.length != 0) {
        for (var i = 0; i < sectionsList.length; i++) {
            var btnForSection = $("<button>").addClass("sectionSPan").html(sectionsList[i].category.name);
            $(sectionDiv).append(btnForSection);
            $(btnForSection).attr("categoryId", sectionsList[i].category.categoryId);
            $(btnForSection).data("categoryData", sectionsList[i]);
            $(btnForSection).attr("timeIn", totalDuration);
            $(btnForSection).attr("timeOut", totalDuration);
            $(btnForSection).click(function () {
                var categoryData = $(this).data("categoryData");
                selectionOfCategories(categoryData);
            });
        }
    }
    var categoryData = $(sectionDiv).find("button:first").data("categoryData");
}

function selectionOfCategories(categoryData) {
    var previousCategoryData = $("#sectionContainer").find("button.active").data("categoryData");
    var previousCategoryNumber = undefined;
    if (previousCategoryData) {
        previousCategoryNumber = previousCategoryData.questionPaperSubCategorys[0].questions[0].questionNo;
    }
    var subCategoryId = categoryData.questionPaperSubCategorys[0].questionPaperSubCategoryId;
    var firstQuestionNumber = categoryData.questionPaperSubCategorys[0].questions[0].questionNo;
    var totalQuestions = categoryData.questionPaperSubCategorys[0].noOfQuestions;

    showQuestion(firstQuestionNumber, previousCategoryNumber);
}
function populateQuestions(categoryList) {
    if (categoryList.length != 0) {
        for (var i = 0; i < categoryList.length; i++) {
            var subCategoryList = categoryList[i].questionPaperSubCategorys;
            for (var subCategory = 0; subCategory < subCategoryList.length; subCategory++) {
                populateQUestionsOfSubCategory(subCategoryList[subCategory], categoryList[i].category.categoryId);
            }

        }
    }
}
function showQuestion(currentQuestion, oldQuestion) {
    var type = 0;
    if (currentQuestion < oldQuestion) {
        type = 1;
    }
    var currentQuestionDiv = $("#questionContainer").find("div[questionNumber=" + currentQuestion + "]");
    var selectedCategory = $(currentQuestionDiv).attr("categoryId");
    var currentCategory = $("#sectionContainer").find("button.active").attr("categoryId");
    var targetCategory = $("#sectionContainer").find("button[categoryId=" + selectedCategory + "]");
    var examMap = $("#examContainer").data("examMap");
    if (currentCategory != selectedCategory && examMap.durationType == 2) {
        if (currentCategory) {
            var tMinute = $("#minuteSpan").html();
            var tHour = $("#hourSpan").html();
            var totalCurrentDuration = examMap.duration - (tHour * 60 + tMinute);
            totalCurrentDuration--;
            var categoryTimeOut = $("#sectionContainer").find("button[categoryid=" + currentCategory + "]").attr("timeout");
            var currentCategoryTimeIn = $("#sectionContainer").find("button[categoryid=" + currentCategory + "]").attr("timeIn");
            var categoryTimeIn = $(targetCategory).attr("timeIn");
            if ((totalCurrentDuration < categoryTimeOut && type == 0) || (categoryTimeIn && totalCurrentDuration < categoryTimeIn)) {
                return;
            }
            if (totalCurrentDuration >= currentCategoryTimeIn && type == 1) {
                return;
            }
        }
    }
    $("#questionContainer").find("div.questionDiv").removeClass("hide").addClass("hide");
    $(currentQuestionDiv).removeClass("hide");
    detectCategoryChanges(selectedCategory);
    $("#questionContainer").attr("currentQuestion", currentQuestion);
    setStatusForQuestion(currentQuestion);

}


function detectCategoryChanges(selectedCategory) {
    var currentCategory = $("#sectionContainer").find("button.active").attr("categoryId");
    var targetCategory = $("#sectionContainer").find("button[categoryId=" + selectedCategory + "]").data("categoryData");
    if (currentCategory != selectedCategory) {
        console.info(targetCategory);
        clearInterval(timerForCategory);
        setCounterForCategory(2);
        addCategoryChange(selectedCategory);
        $("#sectionContainer").find("button").removeClass("active");
        $("#sectionContainer").find("button[categoryId=" + selectedCategory + "]").addClass("active");
        showCurrentCategoryStatus(selectedCategory);
    }
}


function addCategoryChange(selectedCategory) {
    var examId = $("#examContainerPage").attr("examId");
    var url = protocol + "//" + host + "/exam/save/" + examId + "/time/" + selectedCategory;
    $.ajax({
        url: url,
        type: "POST",
        cache: false,
        success: function (map) {
        }
    });
}

function populateQUestionsOfSubCategory(subCategory, categoryId) {
    var questionsList = subCategory.questions
    for (var i = 0; i < questionsList.length; i++) {
        createQuestionElement(questionsList[i], subCategory, categoryId);
        populateExamStatusTiles(questionsList[i], subCategory, categoryId);
    }



}
function createQuestionElement(questionData, subCategory, categoryId) {
    var questionMap = questionData.question;
    var li = $("<div>").addClass("hide questionDiv");
    $("#questionContainer").append(li);
    var divForQuestions = $("<div>").addClass("row");
    var divForQuestionNumber = $("<div>").addClass("col-md-12 questionNumberDivision wellDiv").html(subCategory.description);
    //    		"Question No: " + questionData.questionNo);
    $(divForQuestions).append(divForQuestionNumber);

    if (subCategory.content) {
        try {
            if (subCategory.content) {
                var divForSubContent = $("<div>").addClass("col-sm-12 subContentDiv").html(subCategory.content);
                $(divForQuestions).append(divForSubContent);
                var imgList = subCategory.questionPaperSubCategoryImage;
                if (imgList && imgList.length) {
                    for (var k = 0; k < imgList.length; k++) {
                        var divForImage = $("<div>").addClass("text-center");
                        var imgForContent = $("<img>").attr("src", 'data:image/jpeg;base64,' + imgList[k].image);
                        $(imgForContent).attr("width", "300px");
                        $(divForImage).append(imgForContent);
                        $(divForSubContent).append(divForImage);

                    }
                }
            }
        } catch (e) {

        }
    }

    if (subCategory.direction) {
        var divForQuestion = $("<div>").addClass("col-md-6");
        var divForDescription = $("<div>").addClass("col-md-6 divForDescription");
        $(divForDescription).html(subCategory.direction);
        $(divForQuestions).append(divForDescription);
    } else {
        var divForQuestion = $("<div>").addClass("col-md-12");
    }
    $(divForQuestions).append(divForQuestion);
    $(li).attr("questionNumber", questionData.questionNo);
    $(li).attr("questionId", questionMap.questionId);
    $(li).attr("status", 0);
    $(li).attr("categoryId", categoryId);
    var divForQuestionHtml = $("<div>").addClass("questionSpan").html("<span> " + questionData.questionNo + "</span>" + questionMap.question);
    $(divForQuestion).append(divForQuestionHtml);
    try {
        var ImgMap = questionData.question.questionImage[0];
        var imgForQuestion = $("<img>").attr("src", 'data:image/jpeg;base64,' + ImgMap.image);
        $(imgForQuestion).attr("width", "300px");
        $(divForQuestion).append(imgForQuestion);
    } catch (e) {

    }
    $(li).append(divForQuestions);
    populateOptions(questionMap.options, divForQuestion, questionData.questionNo);

}


function populateOptions(optionList, divForQuestion, questionNo) {
    var ulForOptions = $("<ul>").addClass("optionUl");
    $(divForQuestion).append(ulForOptions);
    var character = 'a'.charCodeAt(0);
    for (var i = 0; i < optionList.length; i++) {
        var liForOption = $("<li>");
        var labelForOption = $("<label>");
        var inputForOption = $("<input>").attr("type", "radio");
        $(inputForOption).attr("name", "optionFor" + questionNo);
        $(inputForOption).attr("value", optionList[i].optionNo);
        $(labelForOption).append(inputForOption);
        $(labelForOption).append(" &nbsp;" + (String.fromCharCode(character++)) + ". &nbsp;" + optionList[i].option);
        $(liForOption).append(labelForOption);
        $(ulForOptions).append(liForOption);
    }

}
function populateNextQuestion(type, reviewed) {

    var currentQuestion = $("#questionContainer").attr("currentQuestion");
    if (!reviewed) {
        var answered = false;
        var currentQuestionDiv = $("#questionContainer").find("div[questionNumber=" + currentQuestion + "]");
        $(currentQuestionDiv).find("input:radio[name='optionFor" + currentQuestion + "']").each(function () {
            if ($(this).prop("checked")) {
                answered = true;
            }
        });

        setStatusForQuestion(currentQuestion, answered);
    }
    var oldQuestion = currentQuestion;
    if (type == 1) {
        currentQuestion++;
    } else {
        currentQuestion--;
    }

    showQuestion(currentQuestion, oldQuestion);

}

function showCurrentCategoryStatus(categoryId) {

    $("#statusTable").find("span.statusTile").hide();
    $("#statusTable").find("span.statusTile[categoryId=" + categoryId + "]").show();
}

function populateExamStatusTiles(questionsMap, subCategory, categoryId) {
    var spanForStatusTile = $("<span>").addClass("statusTile").html(questionsMap.questionNo);
    $("#statusTable").append(spanForStatusTile);
    $(spanForStatusTile).attr("questionNumber", questionsMap.questionNo);
    $(spanForStatusTile).attr("categoryId", categoryId);
    $(spanForStatusTile).click(function () {
        var questionNumber = $(this).attr("questionNumber");
        var previousCategoryData = $("#sectionContainer").find("button.active").data("categoryData");
        var previousCategoryNumber = undefined;
        if (previousCategoryData) {
            previousCategoryNumber = previousCategoryData.questionPaperSubCategorys[0].questions[0].questionNo;
        }
        showQuestion(questionNumber, previousCategoryNumber);
    });
}

function setStatusForQuestion(currentQuestionNumber, status) {
    if (status) {
        $("#statusTable").find("span[questionNumber=" + currentQuestionNumber + "]").addClass("greenTile");
        $("#questionContainer").find("div.questionDiv[questionNumber=" + currentQuestionNumber + "]").attr("status", 1);
    } else {
        $("#statusTable").find("span[questionNumber=" + currentQuestionNumber + "]").addClass("redTile");
    }
}

function reviewAndPopulateNextQuestion() {

    var currentQuestion = $("#questionContainer").attr("currentQuestion");

    $("#statusTable").find("span[questionNumber=" + currentQuestion + "]").addClass("violetTile");
    $("#questionContainer").find("div.questionDiv[questionNumber=" + currentQuestion + "]").attr("status", 2);
    populateNextQuestion(1, true);
}