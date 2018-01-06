function loadAchieversPage() {
    $.get("superadmin/achievers.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        showAddAchiverPage();
        $("#btnAddNewStudentDetails").click(function () {
            $("#divAddNewAchieverPage").modal("show");
        });
        $("#saveAchiever").click(function () {
            saveAchievement();
        });
        $("#achieverPhotoUpload").change(function () {
            showFileNameOfSelectedImage();
        });
    });
}

function validateAndReturnAchievementInfo() {
    var obj = {};
    var name = $("#achiverName").val();
    if (name == "") {
        alert("Please enter a name");
        return;
    }
    obj.name = name;
    var phnNo = $("#achiverContact").val();
    if (phnNo == "") {
        alert("Please enter achiever description");
        return;
    }
    obj.contact = phnNo;
    var description = $("#achiverDescription").val();
    if (description == "") {
        alert("Please enter achiever description");
        return;
    }
    obj.description = description;
    var formdata = new FormData();
    var file = $("#achieverPhotoUpload")[0].files[0];
    formdata.append("file", file);
    formdata.append("achiever", JSON.stringify(obj));
    return formdata;
}
function saveAchievement() {
    var formdata = validateAndReturnAchievementInfo();
    if (formdata == undefined) {
        return;
    }
    $.ajax({
        url: protocol + "//" + host + "/achievers",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        data: formdata,
        success: function (obj) {

        }
    });

}
function showFileNameOfSelectedImage() {
    $("#filenameSpan").html($("#achieverPhotoUpload")[0].files[0].name);
}