function loadStudentResultPage(isShow) {
    $.get("superadmin/studentresult.html" + postUrl, {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        if (isShow) {
            showStudentResultPage();
        }

    });
}