
function loadMyTestPage() {
    $.get("student/mytest.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        showMyTestPage();
    });
}
function getAllTestList() {
    var url = protocol + "//" + host + "/test/all/1";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (list) {
            populateMytestTable(list.data);
        }
    });
}


function populateMytestTable(list) {
    if (list.length != 0) {
        var tbody = $("#tblMyTests").find("tbody");
        $(tbody).empty();
        for (var i = 0; i < list.length; i++) {
            var tr = $("<tr>");
            $(tr).attr("isDemo", list[i].isDemo);
            $(tr).attr("testId", list[i].testId);
            $(tr).data("map", list[i]);
            var tdForIndex = $("<td>").html(i + 1);
            $(tr).append(tdForIndex);
            var tdForName = $("<td>").html(list[i].name);
            $(tr).append(tdForName);
            var tdForAction = $("<td>");
            var btnForTest = $("<button>").addClass("btn btn-primary btn-sm").html("Take Test");
            $(tdForAction).append(btnForTest);
            $(tr).append(tdForAction);
            $(tbody).append(tr);
            $(btnForTest).click(function () {
                var testId = $(this).closest("tr").attr("testId");
                var isDemo = $(this).closest("tr").attr("isDemo");
                window.open('startexam.html?testId=' + testId + '&isDemo=' + isDemo, 'mywindow', 'width=1300,height=800')
                setTimeout(function () {
                    getAllTestList();
                },1000);
            });
        }
    }
}