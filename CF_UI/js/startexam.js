var protocol = "http:";
var host = "localhost:8080/cf-restful"
$(document).ready(function () {
    getAllCategoriesOfQUestionPaper(getUrlParameter('testId'));
    $("#examContainer").hide();
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

});
function setCounter(duration) {
    var durationForExam=duration*60*1000;
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
            document.getElementById("demo").innerHTML = "EXPIRED";
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
    $("#examName").html(examMap.name+" - "+examMap.examCode);
    $("#totalNumberOfQuestions").html(examMap.noOfQuestions);
    setCounter(examMap.duration);
    $("#totalTimeAvailable").html(examMap.duration+" min");
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
    $("#examContainer").show();
    $("#examIntroduction").hide();
    var examMap = $("#examContainer").data("examMap");
    populateSections(examMap.questionPaperCategorys);
    populateQuestions(examMap.questionPaperCategorys);
    $("#sectionContainer").find("button:first").trigger("click");

}

function populateSections(sectionsList) {
    var sectionDiv = $("#sectionContainer");
    if (sectionsList.length != 0) {
        for (var i = 0; i < sectionsList.length; i++) {
            var btnForSection = $("<button>").addClass("btn btn-white btn-sm").html(sectionsList[i].category.name);
            $(sectionDiv).append(btnForSection);
            $(btnForSection).attr("categoryId", sectionsList[i].questionPaperCategoryId);
            $(btnForSection).data("categoryData", sectionsList[i]);
            $(btnForSection).click(function () {
                $("#sectionContainer").find("button").removeClass("btn-primary active").addClass("btn-white");
                $(this).addClass("btn-primary active").removeClass("btn-white");
                var categoryData = $(this).data("categoryData");
                selectionOfCategories(categoryData);
            });
        }
    }
    var categoryData = $(sectionDiv).find("button:first").data("categoryData");
}

function selectionOfCategories(categoryData) {
    var subCategoryId = categoryData.questionPaperSubCategorys[0].questionPaperSubCategoryId;
    var firstQuestionNumber = categoryData.questionPaperSubCategorys[0].questions[0].questionNo;
    var totalQuestions = categoryData.questionPaperSubCategorys[0].noOfQuestions;
    showQuestion(firstQuestionNumber);
}
function populateQuestions(categoryList) {
    if (categoryList.length != 0) {
        for (var i = 0; i < categoryList.length; i++) {
            var subCategoryList = categoryList[i].questionPaperSubCategorys;
            for (var subCategory = 0; subCategory < subCategoryList.length; subCategory++) {
                populateQUestionsOfSubCategory(subCategoryList[subCategory], categoryList[i].questionPaperCategoryId);
            }

        }
    }
}
function showQuestion(firstQuestionNumber) {
    $("#questionContainer").find("div.questionDiv").removeClass("hide").addClass("hide");
    var currentQuestionDiv = $("#questionContainer").find("div[questionNumber=" + firstQuestionNumber + "]");
    $(currentQuestionDiv).removeClass("hide");
    var selectedCategory = $(currentQuestionDiv).attr("categoryId");
    $("#sectionContainer").find("button").removeClass("btn-primary active").addClass("btn-white");
    $("#sectionContainer").find("button[categoryId=" + selectedCategory + "]").addClass("btn-primary active").removeClass("btn-white");
    $("#questionContainer").attr("currentQuestion", firstQuestionNumber);
    setStatusForQuestion(firstQuestionNumber);
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
    var divForQuestionNumber = $("<div>").addClass("col-md-12 questionNumberDivision").html("Question No: " + questionData.questionNo);
    $(divForQuestions).append(divForQuestionNumber);
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
    $(li).attr("categoryId", categoryId);
    var divForQuestionHtml = $("<div>").addClass("questionSpan").html(questionMap.question);
    $(divForQuestion).append(divForQuestionHtml);
    $(li).append(divForQuestions);
    populateOptions(questionMap.options, divForQuestion, questionData.questionNo);

}


function populateOptions(optionList, divForQuestion, questionNo) {
    var ulForOptions = $("<ul>");
    $(divForQuestion).append(ulForOptions);
    for (var i = 0; i < optionList.length; i++) {
        var liForOption = $("<li>");
        var labelForOption = $("<label>");
        var inputForOption = $("<input>").attr("type", "radio");
        $(inputForOption).attr("name", "optionFor" + questionNo);
        $(inputForOption).attr("value", optionList[i].optionNo);
        $(labelForOption).append(inputForOption);
        $(labelForOption).append(" " + (i + 1) + ") " + optionList[i].option);
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
    if (type == 1) {
        currentQuestion++;
    } else {
        currentQuestion--;
    }
    showQuestion(currentQuestion);

}

function populateExamStatusTiles(questionsMap, subCategory, categoryId) {
    var spanForStatusTile = $("<span>").addClass("statusTile").html(questionsMap.questionNo);
    $("#statusTable").append(spanForStatusTile);
    $(spanForStatusTile).attr("questionNumber", questionsMap.questionNo);
    $(spanForStatusTile).click(function () {
        var questionNumber = $(this).attr("questionNumber");
        showQuestion(questionNumber)
    });
}

function setStatusForQuestion(firstQuestionNumber, status) {
    if (status) {
        $("#statusTable").find("span[questionNumber=" + firstQuestionNumber + "]").addClass("greenTile");

    } else {
        $("#statusTable").find("span[questionNumber=" + firstQuestionNumber + "]").addClass("redTile");
    }
}

function reviewAndPopulateNextQuestion() {

    var currentQuestion = $("#questionContainer").attr("currentQuestion");
    // var answered = false;
    // var currentQuestionDiv = $("#questionContainer").find("div[questionNumber=" + currentQuestion + "]");
    // $(currentQuestionDiv).find("input:radio[name='optionFor" + currentQuestion + "']").each(function () {
    //     if ($(this).prop("checked")) {
    //         answered = true;
    //     }
    // });
    // if (answered) {
        $("#statusTable").find("span[questionNumber=" + currentQuestion + "]").addClass("violetTile");
    // } else {
    //     $("#statusTable").find("span[questionNumber=" + currentQuestion + "]").addClass("blueTile");
    // }
    populateNextQuestion(1, true);
}