function loadMaterialPage() {
    $.get("superadmin/material.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        showMaterialPage();
        $("#btnAddNewMaterial").click(function () {
            $("#divAddNewMaterials").modal("show");
            $("#filenameSpanMaterialUpload").html("");
            $("#materialUpload").val("");
            $("#materialFileType").val(0);
            $("#materialFileCategory").empty();
            $("#materialFileSubCategory").empty();
            $("#materialFileSubCategoryUnit").empty();
            $("#divIsfree").find("input:radio").prop("checked", false);
        });
        $("#materialUpload").change(function () {
            $("#filenameSpanMaterialUpload").html($("#materialUpload")[0].files[0].name)
        });
        $("#saveMaterialUpload").click(function () {
            saveMaterial();
        });
        $("#materialFileType").change(function () {
            getCoachingCategoriesForType();
        });
        $("#materialFileCategory").change(function () {
            getCoachingSubCategoriesForType();
        });
        $("#materialFileSubCategory").change(function () {
            getCoachingSubCategoriesUnitForType();
        });
    });
}
function initializeMaterialPage() {
    getAllMaterials();
}
function getAllMaterials() {
    $.ajax({
        url: protocol + "//" + host + "/material",
        type: "GET",
        success: function (obj) {
            populateUploadedFiles(obj.data);
        }
    });
}
function getCoachingCategoriesForType() {
    var typeId = $("#materialFileType").val();
    $.ajax({
        url: protocol + "//" + host + "/material/category/" + typeId,
        type: "GET",
        success: function (obj) {
            populateCategoryForTypes(obj.data);
        }
    });
}

function populateCategoryForTypes(list) {
    $("#materialFileCategory").empty();
    if (!list || (list && !list.length)) {
        return;
    }
    var slctOption = $("<option>").val("0").html("Select");
    $("#materialFileCategory").append(slctOption);
    for (var i = 0; i < list.length; i++) {
        var option = $("<option>").val(list[i].coachingTypeCategoryId).html(list[i].name);
        $("#materialFileCategory").append(option);
    }
}

function getCoachingSubCategoriesForType() {
    var categoryId = $("#materialFileCategory").val();
    if (categoryId == 0) {
        $("#materialFileSubCategory").hide();
        return;
    }
    $.ajax({
        url: protocol + "//" + host + "/material/category/sub/" + categoryId,
        type: "GET",
        success: function (obj) {
            populateSubCategoriesForCategory(obj.data);
        }
    });
}

function populateSubCategoriesForCategory(list) {
    $("#materialFileSubCategory").empty();
    if (!list || (list && !list.length)) {
        return;
    }
    var slctOption = $("<option>").val("0").html("Select");
    $("#materialFileSubCategory").append(slctOption);
    for (var i = 0; i < list.length; i++) {
        var option = $("<option>").val(list[i].coachingTypeCategorySubId).html(list[i].name);
        $("#materialFileSubCategory").append(option);
    }
}

function getCoachingSubCategoriesUnitForType() {
    var categorySubId = $("#materialFileSubCategory").val();
    if (categorySubId == 0) {
        $("#materialFileSubCategoryUnit").hide();
        return;
    }
    $.ajax({
        url: protocol + "//" + host + "/material/category/sub/unit/" + categorySubId,
        type: "GET",
        success: function (obj) {
            populateSubCategoriesUnitForCategory(obj.data);
        }
    });
}

function populateSubCategoriesUnitForCategory(list) {
    $("#materialFileSubCategoryUnit").empty();
    if (!list || (list && !list.length)) {
        return;
    }
    var slctOption = $("<option>").val("0").html("Select");
    $("#materialFileSubCategoryUnit").append(slctOption);
    for (var i = 0; i < list.length; i++) {
        var option = $("<option>").val(list[i].coachingTypeCategorySubUnitId).html(list[i].name);
        $("#materialFileSubCategoryUnit").append(option);
    }
}



function populateUploadedFiles(list) {
    if (!list.length) {
        return;
    }
    $("#uploadedMaterials").empty();

    for (var i = 0; i < list.length; i++) {
        var divForRow = $("<div>").addClass("row");
        var divForCategory = $("<div>").addClass("col-md-12 materialDiv");
        $(divForRow).append(divForCategory);
        var h4ForCategory = $("<h4>").html(list[i].name);
        $(divForCategory).append(h4ForCategory);
        var divForMaterials = $("<div>").addClass("col-md-12");
        $("#uploadedMaterials").append(divForRow);
        $(divForMaterials).html("No materials Available");
        if (list[i].materials && list[i].materials.length) {
            populateFilesInDiv(list[i].materials, divForMaterials);
        }
        $(divForRow).append(divForMaterials);
    }
}
function populateFilesInDiv(materials, div) {
    $(div).empty();
    for (var i = 0; i < materials.length; i++) {
        var divForFile = $("<div>").addClass("fileDiv");
        $(div).append(divForFile);
        var spanForIcon = $("<span>").addClass("fileIconSPan").html('<i class="fa fa-file"></i>');
        $(divForFile).append(spanForIcon)
        $(divForFile).append(materials[i].fileName.substring(0, 20));
        var btnDivForFile = $("<div>").addClass("deleteFileBtnDiv");
        var btnForDelete = $("<button>").addClass("btn btn-sm btn-white").html("Delete");
        $(btnDivForFile).append(btnForDelete);
        $(btnForDelete).attr("documentId", materials[i].id);
        $(btnForDelete).click(function () {
            var documentId = $(this).attr("documentId");
            if (confirm("Are you sure you want to delete the file")) {
                deleteUploadedDocument(documentId);
            }
        });
        $(divForFile).append(btnDivForFile);
    }
}

function deleteUploadedDocument(documentId) {
    $.ajax({
        url: protocol + "//" + host + "/material/" + documentId,
        type: "DELETE",
        success: function (obj) {
            getAllMaterials();
        }
    });
}
function validateAndReturnMaterialInfo() {
    var obj = {};
    // var name = $("#achiverName").val();
    // if (name == "") {
    //     alert("Please enter a name");
    //     return;
    // }
    // obj.name = name;
    // var phnNo = $("#achiverContact").val();
    // if (phnNo == "") {
    //     alert("Please enter achiever contact info");
    //     return;
    // }
    // obj.contact = phnNo;
    // var description = $("#achiverDescription").val();
    // if (description == "") {
    //     alert("Please enter achiever description");
    //     return;
    // }
    if ($("#materialFileType").val() == "0") {
        alert("Select Coaching type");
        return;
    }

    if ($("#materialUpload").val() == "") {
        alert("choose material document");
        return;
    }
    // obj.description = description;
    var formdata = new FormData();
    var file = $("#materialUpload")[0].files[0];
    formdata.append("file", file);
    // formdata.append("achiever", JSON.stringify(obj));
    return formdata;
}
function saveMaterial() {
    var formdata = validateAndReturnMaterialInfo();
    if (formdata == undefined) {
        return;
    }

    var isFree = $("#divIsfree").find("input:radio:checked").val();
    if (isFree == undefined || isFree == null) {
        alert("Select Material Type");
        return;
    }
    formdata.append("isFree", isFree);

    var coachingTypeId = $("#materialFileType").val();
    var categoryId = $("#materialFileCategory").val();
    var subCategoryId = $("#materialFileSubCategory").val();
    var subCategoryUnitId = $("#materialFileSubCategoryUnit").val();

    var url = protocol + "//" + host + "/material/upload/" + coachingTypeId;
    if (categoryId && categoryId != 0 && categoryId != "0") {
        url = protocol + "//" + host + "/material/upload/category/" + categoryId;
    }
    if (subCategoryId && subCategoryId != 0 && subCategoryId != "0") {
        url = protocol + "//" + host + "/material/upload/category/sub/" + subCategoryId;
    }
    if (subCategoryUnitId && subCategoryUnitId != 0 && subCategoryUnitId != "0") {
        url = protocol + "//" + host + "/material/upload/category/sub/unit/" + subCategoryUnitId;
    }
    url += "?isFree=" + isFree;
    $.ajax({
        url: url,
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        data: formdata,
        success: function (obj) {
            $("#divAddNewMaterials").modal("hide");
            getAllMaterials();
        }
    });

}