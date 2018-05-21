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