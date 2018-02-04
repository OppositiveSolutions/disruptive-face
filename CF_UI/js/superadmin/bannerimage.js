function loadBannerImagePage() {
    $.get("superadmin/bannerimage.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        showAddBannerImagePage();
        $("#saveBannerImage").click(function () {
            saveBannerImage();
        });
        $("#btnAddNewBannerImage").click(function () {
            $("#bannerUploadPIc").val("");
            $("#filenameSpanBanner").html("");
            $("#divAddNewBannerPage").modal("show");
        });
        $("#btnaddAdvertisement").click(function () {
            $("#divAddAdvertisementPage").modal("show");
        });
        $("#saveNewAdvertisement").click(function () {
            saveNewAdvertisement();
        });
        $("#bannerUploadPIc").change(function () {
            $("#filenameSpanBanner").html($("#bannerUploadPIc")[0].files[0].name);
            console.info($("#bannerUploadPIc")[0].files);
            if ($("#bannerUploadPIc")[0].files && $("#bannerUploadPIc")[0].files[0]) {
                var reader = new FileReader();

                reader.onload = function (e) {
                    var imgPreviewBanner = $("<img>");
                    $(imgPreviewBanner).attr('src', e.target.result);
                    $(imgPreviewBanner).attr('width', "100%");
                    $("#filenameSpanBanner").append(imgPreviewBanner)
                };

                reader.readAsDataURL($("#bannerUploadPIc")[0].files[0]);
            }

        });
    });
}

function saveNewAdvertisement() {
    var advertisement = $("#textAdvertisement").val();
    if (!advertisement) {
        alert("Enter a text");
        return;
    }
    var formdata = new FormData();
    formdata.append("file", advertisement);
    $.ajax({
        url: protocol + "//" + host + "/advertisement/announcement",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        data: formdata,
        success: function (obj) {
            $("#divAddAdvertisementPage").modal("hide");
            initializeBannerPage();
        }
    });
}
function initializeBannerPage() {
    getBannerImages();
    getAdvertisements();
}
function getAdvertisements() {
    $.ajax({
        url: protocol + "//" + host + "/advertisement/announcement/all",
        type: "GET",
        success: function (data) {
            populateAdvertisementDetails(data.data);
        }
    });
}
function populateAdvertisementDetails(data) {
    if (!data || !data.length) {
        return;
    }
    var div = $("#addAdvertisement");
    $(div).empty();
    for (var i = 0; i < data.length; i++) {
        var deleteSpan = $("<button>").addClass("btn btn-white btn-sm deleteSPanAdvertisement").html("x");
        $(deleteSpan).attr("announcementId", data[i].sliderAnnouncementId)
        $(deleteSpan).click(function () {
            if (confirm("Are you sure you want to delete the announcement")) {
                deleteAnnouncement($(this).attr("announcementId"));
            }
        });
        var divForAdvertisement = $("<div>").addClass("advertisementDiv").html(deleteSpan);
        $(divForAdvertisement).append(data[i].announcement);
        $(div).append(divForAdvertisement);
    }
}

function deleteAnnouncement(announcementId) {
    $.ajax({
        url: protocol + "//" + host + "/advertisement/announcement/" + announcementId,
        type: "DELETE",
        success: function (obj) {
            getAdvertisements();
        }
    });
}
function getBannerImages() {
    $.ajax({
        url: protocol + "//" + host + "/advertisement/image/all",
        type: "GET",
        success: function (data) {
            populateBannerDetails(data.data);
        }
    });
}
function populateBannerDetails(list) {
    if (!list.length) {
        return;
    }
    var bannerimageContainer = $("#bannerImageContainer").empty();
    for (var i = 0; i < list.length; i++) {
        var divForImage = $("<div>").addClass("col-sm-3");
        var imgBanner = $("<img>").attr("src", "data:image/png;base64," + list[i].image);
        $(imgBanner).addClass("bannerImage")
        $(divForImage).append(imgBanner);
        var spanForImgDelete = $("<span>").addClass("deleteBtnContainer");
        var btnForDelete = $("<button>").addClass("btn btn-sm btn-white deleteBannerBtn").html("Delete");
        $(btnForDelete).attr("imgId", list[i].sliderImageId);
        $(spanForImgDelete).append(btnForDelete);
        $(btnForDelete).click(function () {
            if (confirm("Are you sure you want to delete the banner image")) {
                deleteBannerImage($(this).attr("imgId"));
            }
        });
        $(divForImage).append(spanForImgDelete);
        $(bannerimageContainer).append(divForImage);
    }
}

function deleteBannerImage(imgId) {
    $.ajax({
        url: protocol + "//" + host + "/advertisement/image/" + imgId,
        type: "DELETE",
        success: function (obj) {
            getBannerImages();
        }
    });

}

function validateAndReturnBannerImageInfo() {
    var formdata = new FormData();
    var file = $("#bannerUploadPIc")[0].files[0];
    formdata.append("file", file);
    return formdata;
}
function saveBannerImage() {
    var formdata = validateAndReturnBannerImageInfo();
    if (formdata == undefined) {
        return;
    }
    $.ajax({
        url: protocol + "//" + host + "/advertisement/image",
        type: "POST",
        processData: false,
        contentType: false,
        cache: false,
        data: formdata,
        success: function (obj) {
            $("#divAddNewBannerPage").modal("hide");
            initializeBannerPage();
        }
    });

}
function showFileNameOfSelectedImage() {
    $("#filenameSpan").html($("#achieverPhotoUpload")[0].files[0].name);
    $("#divAddNewBannerPage").modal("hide");
}