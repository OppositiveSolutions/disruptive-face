function loadBundlesPage(isShow) {
  $.get("superadmin/bundles.html" + postUrl, {
    "_": $.now()
  }, function(data) {
    $("#pageContainer").append(data);
    if (isShow) {
      showBundlesPage();
    }
    $("#btnAddNewBundle").click(function() {
      $("#divAddNewBundlePage").modal("show");
    });
    $("#divAddNewAnoucementPage").on("shown.bs.modal", function() {

    });
    $("#divAddNewAnoucementPage").on("hidden.bs.modal", function() {});
    $("#btnAddNewBundleSave").click(function() {
      var type = $(this).attr("type");
      if (type == "edit") {
        editBundle();
      } else {
        saveBundle();
      }
    });
  });

}

function validateAndReturnBundleInfo() {
  var obj = {};
  var name = $("#txtBundleName").val();
  if (name == "") {
    alert("Please enter a name");
    return;
  }
  obj.name = name;
  var description = $("#txtBundleDescription").val();
  if (description == "") {
    alert("Please enter bundle description");
    return;
  }
  var coachingType = $("#sltBundleCategory").val();
  obj.coachingType = coachingType;
  obj.description = description;
  var mrp = $("#txtBundleMrp").val();
  if (mrp == "") {
    alert("Please enter bundle MRP");
    return;
  }
  obj.mrp = mrp;

  var sellingPrice = $("#txtBundleSellingPrice").val();
  if (sellingPrice == "") {
    alert("Please enter bundle selling price");
    return;
  }
  obj.sellingPrice = sellingPrice;

  var discountPercent = $("#txtBundleDiscountPrice").val();
  if (discountPercent == "") {
    alert("Please enter bundle discount price");
    return;
  }
  obj.discountPercent = discountPercent;
  var imageUrl = $("#txtBundleImageUrl").val();
  if (imageUrl == "") {
    alert("Please enter bundle image URL");
    return;
  }
  obj.imageUrl = imageUrl;
  obj.bundleCategory = {
    "bundleCategoryId": coachingType
  };
  return obj;
}

function saveBundle() {
  var obj = validateAndReturnBundleInfo();
  if (obj == undefined) {
    return;
  }
  $.ajax({
    url: protocol + "//" + host + "/bundle",
    type: "POST",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      getVideoTutorials();
      $("#divAddNewBundlePage").modal("hide");
    }
  });

}

function editBundle() {
  var obj = validateAndReturnBundleInfo();
  if (obj == undefined) {
    return;
  }
  obj.bundleId = $("#btnAddNewBundleSave").attr("bundleId")
  $.ajax({
    url: protocol + "//" + host + "/bundle",
    type: "POST",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      getVideoTutorials();
      $("#divAddNewBundlePage").modal("hide");
    }
  });

}

function showAddNewBundlePage(obj) {
  $("#divAddNewBundlePage").modal("show");
  if (obj != undefined) {
    populateAddNewBundlesPage(obj);
  }

}

function populateAddNewBundlesPage(obj) {
  $("#txtAnouncementName").val(obj.name);
  $("#txtAnouncementDescription").val(obj.description);
  $("#btnAddNewBundleSave").attr("bundleId", obj.bundleId);
  $("#btnAddNewBundleSave").attr("type", "edit");

}
