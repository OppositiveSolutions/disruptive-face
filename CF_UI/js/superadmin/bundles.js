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
    $("#divAddNewBundlePage").on("shown.bs.modal", function() {

    });
    $("#divAddNewBundlePage").on("hidden.bs.modal", function() {
      $("#divAddNewBundlePage").find("input").val("");
      $("#divAddNewBundlePage").find("textarea").val("");
    });
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
      getAllBundles();
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
    type: "PUT",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      getAllBundles();
      $("#divAddNewBundlePage").modal("hide");
    }
  });

}

function showAddNewBundlePage(obj) {
  $("#divAddNewBundlePage").modal("show");
  $("#btnAddNewBundleSave").removeAttr("type");
  if (obj != undefined) {
    $("#btnAddNewBundleSave").removeAttr("type", "edit");
    populateAddNewBundlesPage(obj);
  }

}

function populateAddNewBundlesPage(obj) {
  $("#txtBundleName").val(obj.name);
  $("#txtBundleDescription").val(obj.description);
  $("#btnAddNewBundleSave").attr("bundleId", obj.bundleId);
  $("#btnAddNewBundleSave").attr("type", "edit");
  $("#txtBundleMrp").val(obj.mrp);
  $("#txtBundleSellingPrice").val(obj.sellingPrice);
  $("#txtBundleDiscountPrice").val(obj.discountPercent);
  $("#txtBundleImageUrl").val(obj.imageUrl);

}

function getAllBundles() {
  $.ajax({
    url: protocol + "//" + host + "/bundle",
    type: "GET",
    cache: false,
    success: function(obj) {
      var list = obj.data;
      populateBundleDetails(list);
    }
  });
}

function deleteBundle(bundleId) {
  $.ajax({
    url: protocol + "//" + host + "/bundle/delete/" + bundleId,
    type: "DELETE",
    cache: false,
    success: function(obj) {
      getAllBundles();
    }
  });
}



function populateBundleDetails(list) {
  var tbody = $("#tblBundles tbody")[0];
  $(tbody).empty();
  destroyDataTable("tblBundles");
  for (var i = 0; i < list.length; i++) {
    var tr = $("<tr>");
    $("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
    $(tr).data("obj", list[i]);
    var tdForName = $("<td>");
    $(tdForName).append(list[i].name);
    $(tr).append(tdForName);

    var tdEmail = $("<td>");
    $(tdEmail).append(list[i].mrp);
    $(tr).append(tdEmail);

    // var tdForMobile = $("<td>");
    // $(tdForMobile).append(list[i].mobileNo);
    // $(tr).append(tdForMobile);
    // var status = "Active";
    // if (list[i].status == 0) {
    //   status = "Deactive";
    // }
    //
    // var tdForStatus = $("<td>");
    // $(tdForStatus).append(status);
    // $(tr).append(tdForStatus);

    var settingsGear = createSettingsGearDiv();
    $(settingsGear).removeClass("pull-right");
    var tdForSettings = $("<td>").html(settingsGear);
    $(tr).append(tdForSettings);
    appendLiForBundleSettings(settingsGear, list[i]);
    $(tbody).append(tr);
  }
  initializeDataTable("tblBundles")

}

function appendLiForBundleSettings(div, obj) {
  var ul = $(div).find("ul")[0];
  $(ul).empty();
  var liForEdit = createAndReturnLiForSettingsGear("Edit");
  $(ul).append(liForEdit);
  $(liForEdit).click(function() {
    var obj = $(this).closest("tr").data("obj");
    showAddNewBundlePage(obj);
  });
  var liForDelete = createAndReturnLiForSettingsGear("Delete");
  $(ul).append(liForDelete);
  $(liForDelete).click(function() {
    var obj = $(this).closest("tr").data("obj");
    deleteBundle(obj.bundleId);
  });
}
