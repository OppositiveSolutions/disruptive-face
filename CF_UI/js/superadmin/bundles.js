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
    $("#btnAddedQuestionPaperToBundle").click(function() {
      var questionPaperId = $("#sltBundleQuestionPaper").val();
      var bundleId = $("#sltBundleQuestionPaper").attr("bundleId");
      addQuestionPaperToBunlde(bundleId, questionPaperId)
    })
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
  obj.coachingType = coachingType
  return obj;
}

function saveBundle() {
  var obj = validateAndReturnBundleInfo();
  if (obj == undefined) {
    return;
  }
  var formdata = new FormData();
  var fileName = $("#fileImageBundle").val();
  if (fileName == "") {
    alert("Please select a bunlde image")
  }
  var file = $("#fileImageBundle")[0].files[0];
  formdata.append("file", file);
  formdata.append("bundle", JSON.stringify(obj));
  $.ajax({
    url: protocol + "//" + host + "/bundle",
    type: "POST",
    cache: false,
    data: formdata,
    processData: false,
    contentType: false,
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
  var formdata = new FormData();
  var fileName = $("#fileImageBundle").val();
  if (fileName == "") {
    alert("Please select a bunlde image")
  }
  obj.bundleId = $("#btnAddNewBundleSave").attr("bundleId")
  var file = $("#fileImageBundle")[0].files[0];
  formdata.append("file", file);
  formdata.append("bundle", JSON.stringify(obj));
  $.ajax({
    url: protocol + "//" + host + "/bundle",
    type: "PUT",
    cache: false,
    data: formdata,
    processData: false,
    contentType: false,
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
  var liForQuestionPapers = createAndReturnLiForSettingsGear("Manage Question Papers");
  $(ul).append(liForQuestionPapers);
  $(liForQuestionPapers).click(function() {
    var obj = $(this).closest("tr").data("obj");
    showManageQuestionPaperPage(obj);
  });
}

function showManageQuestionPaperPage(obj) {
  console.info(obj)
  $("#divManageQuestionPaper").modal("show");
  $("#pForBundleName").html(obj.name);
  $("#pForCategoryName").html(obj.category);
  getQuestionPapersForBundle(obj.bundleId, obj.coachingType);
  getAddedQuestionPapersForBundle(obj.bundleId)
  $("#sltBundleQuestionPaper").attr("bundleId", obj.bundleId)
}

function getQuestionPapersForBundle(bundleId, coachingType) {
  $.ajax({
    url: protocol + "//" + host + "/question-paper/list?bundleId" + bundleId,
    type: "GET",
    cache: false,
    success: function(obj) {
      populateQuestionPapersForBundle(obj.data);
    }
  });
}

function getQuestionPaperBundleType() {
  $.ajax({
    url: protocol + "//" + host + "/bundle/coachingtypes",
    type: "GET",
    cache: false,
    success: function(obj) {
      populateQuestionPaperBundleType(obj.data);
    }
  });
}

function populateQuestionPaperBundleType(list) {
  $("#sltBundleCategory").empty();
  for (var i = 0; i < list.length; ++i) {
    var option = $("<option>").val(list[i].coachingTypeId).html(list[i].name);
    $("#sltBundleCategory").append(option);
  }
}

function populateQuestionPapersForBundle(list) {
  $("#sltBundleQuestionPaper").empty();
  for (var i = 0; i < list.length; ++i) {
    var option = $("<option>").val(list[i].qpId).html(list[i].name);
    $("#sltBundleQuestionPaper").append(option);
  }
}

function getAddedQuestionPapersForBundle(bundleId) {
  $.ajax({
    url: protocol + "//" + host + "/bundle/qps/" + bundleId,
    type: "GET",
    cache: false,
    success: function(obj) {
      populateAddedQuestionPapers(obj.data);
    }
  });
}

function populateAddedQuestionPapers(list) {
  var tbody = $("#tblBundleQuestionPaper tbody");
  $(tbody).empty();
  for (var i = 0; i < list.length; ++i) {
    var tr = $("<tr>");
    var td1 = $("<td>").html(list[i].name);
    var img = $("<img>").attr("src", "images/cancel.png");
    $(img).attr("qpId", list[i].question_paper_id)
    $(img).attr("bundleId", list[i].bundle_id)
    $(img).click(function() {
      var qpId = $(this).attr("qpId");
      var bundleId = $(this).attr("bundleId");
      deleteAddedQuestionPaperFromBundle(bundleId, qpId);
    })
    var td2 = $("<td>").append(img);
    $(tr).append(td1);
    $(tr).append(td2)
    $(tbody).append(tr)
  }
  if (list.length == 0) {
    var tr = $("<tr>");
    var td = $("<td>").attr("colspan", 2).html("No Question Papers added");
    $(tr).append(td);
    $(tbody).append(tr)
  }
}

function addQuestionPaperToBunlde(bundleId, questionPaperId) {
  $.ajax({
    url: protocol + "//" + host + "/bundle/" + bundleId + "/addqp/" + questionPaperId,
    type: "GET",
    cache: false,
    success: function(obj) {
      getAddedQuestionPapersForBundle(bundleId)
    }
  });
}

function deleteAddedQuestionPaperFromBundle(bundleId, qpId) {
  $.ajax({
    url: protocol + "//" + host + "/bundle/" + bundleId + "/removeqp/" + qpId,
    type: "DELETE",
    cache: false,
    success: function(obj) {
      getAddedQuestionPapersForBundle(bundleId)
    }
  });
}
