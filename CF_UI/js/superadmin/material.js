function loadMaterialPage() {
    $.get("superadmin/material.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        showMaterialPage();
        $("#btnAddNewMaterial").click(function () {
          $("#divAddNewMaterials").modal("show");
        });
        $("#saveMaterialUpload").click(function () {
            saveMaterial();
        });
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
    // if ($("#achieverPhotoUpload").val() == "") {
    //     alert("choose achiever image");
    //     return;
    // }
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
    $.ajax({
        url: protocol + "//" + host + "/material/upload",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        data: formdata,
        success: function (obj) {
        }
    });

}