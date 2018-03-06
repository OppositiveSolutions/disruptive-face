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
        });
        $("#materialUpload").change(function () {
            $("#filenameSpanMaterialUpload").html($("#materialUpload")[0].files[0].name)
        });
        $("#saveMaterialUpload").click(function () {
            saveMaterial();
        });
    });
}
function initializeMaterialPage() {
    getAllMaterials();
}
function getAllMaterials() {
    $.ajax({
        url: protocol + "//" + host + "/material/all",
        type: "GET",
        success: function (obj) {
            populateUploadedFiles(obj.data);
        }
    });
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
    var materialType = $("#materialFileType").val();
    $.ajax({
        url: protocol + "//" + host + "/material/upload/" + materialType,
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