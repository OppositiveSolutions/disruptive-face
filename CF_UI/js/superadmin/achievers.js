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
function initializeAchiverPage() {
    $.ajax({
        url: protocol + "//" + host + "/achievers",
        type: "GET",
        success: function (data) {
            populateAchieversDetails(data.data);
        }
    });
}
function populateAchieversDetails(list) {
    if (!list.length) {
        return;
    }
    var tbody = $("#tblAchieversDetails").find("tbody")[0];
    $(tbody).empty();
    for (var i = 0; i < list.length; i++) {
        var tr = $("<tr>").data("achiever", list[i]);
        var tdForNo = $("<td>").html(i + 1);
        $(tr).append(tdForNo);
        var tdForName = $("<td>").html(list[i].name);
        $(tr).append(tdForName);
        var tdForContact = $("<td>").html(list[i].contact);
        $(tr).append(tdForContact);
        var tdFordescription = $("<td>").html(list[i].description);
        $(tr).append(tdFordescription);
        var tdForimgFileName = $("<td>").html(list[i].imgFileName);
        $(tr).append(tdForimgFileName);
        var tdForimg = $("<td>");
        var imgForTd = $("<img>").attr("src", protocol + "//" + host + "/achievers/" + list[i].achieverId + "/image");
        $(imgForTd).attr("width", "100px");
        $(tdForimg).append(imgForTd);
        $(tr).append(tdForimg);
        $(tbody).append(tr);
    }
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