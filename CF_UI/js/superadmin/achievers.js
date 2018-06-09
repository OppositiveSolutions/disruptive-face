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
function initializeAddNewAchiever() {
    $("#filenameSpan").html("");
    $("#achieverPhotoUpload").val("");
    $("#achiverDescription").val("");
    $("#achiverContact").val("");
    $("#achiverName").val("");
    $("#achiverYear").val("");
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
        $(tdForDelete).append(btnForDelete);
        var tdForDelete = $("<td>").append(btnForDelete);
        $(btnForDelete).click(function () {
            if (confirm("Are you sure you want to delete the achiever")) {
                var achieverData = $(this).closest("tr").data("achiever");
                deleteAchiever(achieverData);
            }
        });
        $(tr).append(tdForDelete);
        $(tbody).append(tr);
    }
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
    if ($("#achieverPhotoUpload").val() == "") {
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
    $.ajax({
        url: protocol + "//" + host + "/achievers",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        data: formdata,
        success: function (obj) {
            $("#divAddNewAchieverPage").modal("hide");
            initializeAchiverPage();
        }
    });

}
function showFileNameOfSelectedImage() {
    $("#filenameSpan").html($("#achieverPhotoUpload")[0].files[0].name);
}