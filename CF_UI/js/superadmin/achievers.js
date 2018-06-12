function loadAchieversPage() {
    $.get("superadmin/achievers.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        showAddAchiverPage();
        $("#btnAddNewStudentDetails").click(function () {
            initializeAddNewAchiever();
        });
        $("#saveAchiever").click(function () {
            saveAchievement();
        });
        $("#achieverPhotoUpload").change(function () {
            showFileNameOfSelectedImage();
        });
        $("#achieversYearSelect").change(function () {
            getAchieversByYear();
        });
    });
}
function initializeAchiverPage(callBack) {
    $.ajax({
        url: protocol + "//" + host + "/achievers/years",
        type: "GET",
        success: function (data) {
            populateAchieversYearDropDown(data.data);
            if (callBack)
                callBack();
        }
    });

}

function populateAchieversYearDropDown(list) {
    if (!list || !list.length) {
        return;
    }
    $("#achieversYearSelect").empty();
    for (var i = 0; i < list.length; i++) {
        var option = $("<option>").html(list[i]).val(list[i]);
        $("#achieversYearSelect").append(option);
    }
    getAchieversByYear();
}

function getAchieversByYear() {
    var year = $("#achieversYearSelect").val();
    $.ajax({
        url: protocol + "//" + host + "/achievers/" + year + "/list",
        type: "GET",
        success: function (data) {
            populateAchieversDetails(data.data);
        }
    });
}
function initializeAddNewAchiever() {
    $("#filenameSpan").html("");
    $("#achieverPhotoUpload").val("");
    $("#achiverDescription").val("");
    $("#achiverContact").val("");
    $("#achiverName").val("");
    $("#achiverYear").val("");
    $("#divAddNewAchieverPage").attr("isEdit", false);
    $("#divAddNewAchieverPage").modal("show");

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
        var tdForYear = $("<td>").html(list[i].year);
        $(tr).append(tdForYear);
        var tdFordescription = $("<td>").html(list[i].description);
        $(tr).append(tdFordescription);
        var tdForimgFileName = $("<td>").html(list[i].imgFileName);
        $(tr).append(tdForimgFileName);
        var tdForimg = $("<td>");
        var imgForTd = $("<img>").attr("src", protocol + "//" + host + "/achievers/" + list[i].achieverId + "/image");
        $(imgForTd).attr("width", "100px");
        $(tdForimg).append(imgForTd);
        $(tr).append(tdForimg);
        var btnForDelete = $("<button>").addClass("btn btn-default btn-sm").html("Delete");
        var tdForDelete = $("<td>").append(btnForDelete);
        $(btnForDelete).click(function () {
            if (confirm("Are you sure you want to delete the achiever")) {
                var achieverData = $(this).closest("tr").data("achiever");
                deleteAchiever(achieverData);
            }
        });
        var btnForEdit = $("<button>").addClass("btn btn-default btn-sm").html("Edit");
        $(btnForEdit).click(function () {
            var achieverData = $(this).closest("tr").data("achiever");
            enableEditAchiever(achieverData);
        });
        $(tdForDelete).append(btnForEdit);
        $(tdForDelete).append(btnForDelete);
        $(tr).append(tdForDelete);
        $(tbody).append(tr);
    }
}
function enableEditAchiever(achieverData) {
    initializeAddNewAchiever();
    $("#achiverName").val(achieverData.name);
    $("#achiverId").val(achieverData.achieverId);
    $("#achiverContact").val(achieverData.contact);
    $("#achiverDescription").val(achieverData.description);
    $("#achiverYear").val(achieverData.year);
    $("#divAddNewAchieverPage").attr("isEdit", true);

}

function deleteAchiever(achieverData) {
    if (!achieverData) {
        return;
    }
    $.ajax({
        url: protocol + "//" + host + "/achievers/" + achieverData.achieverId,
        type: "DELETE",
        success: function (obj) {
            initializeAchiverPage();
        }
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
    var achieverId = $("#achiverId").val();
    obj.achieverId = achieverId;
    var phnNo = $("#achiverContact").val();
    if (phnNo == "") {
        alert("Please enter achiever contact info");
        return;
    }
    obj.contact = phnNo;
    var description = $("#achiverDescription").val();
    if (description == "") {
        alert("Please enter achiever description");
        return;
    }
    var year = $("#achiverYear").val();
    if (!year || (year && year.length != 4)) {
        alert("Please enter a valid year");
        return;
    }
    obj.year = year;
    var isEdit = $("#divAddNewAchieverPage").attr("isEdit");
    if ($("#achieverPhotoUpload").val() == "" && !isEdit) {
        alert("choose achiever image");
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
    var isEdit = $("#divAddNewAchieverPage").attr("isEdit");
    if (isEdit) {
        editAchiever(formdata);
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
            $("#divAddNewAchieverPage").modal("hide");
            initializeAchiverPage(function () {
                $("#achieversYearSelect").val(obj.year);
            });
        }
    });

}

function editAchiever(formdata) {
    $.ajax({
        url: protocol + "//" + host + "/achievers",
        type: "PUT",
        processData: false,
        contentType: false,
        cache: false,
        data: formdata,
        success: function (obj) {
            $("#divAddNewAchieverPage").modal("hide");
            initializeAchiverPage(function () {
                $("#achieversYearSelect").val(obj.year);
            });
        }
    });
}
function showFileNameOfSelectedImage() {
    $("#filenameSpan").html($("#achieverPhotoUpload")[0].files[0].name);
}