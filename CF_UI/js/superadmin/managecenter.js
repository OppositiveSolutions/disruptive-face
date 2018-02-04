function loadManageCenterPage(isShow) {
  $.get("superadmin/managecenter.html" + postUrl, {
    "_": $.now()
  }, function(data) {
    $("#pageContainer").append(data);
    if (isShow) {
      showManageCenterPage();
    }
    $("#btnAddNewCenter").click(function() {
      $("#divSuperAdminAddNewCenterPage").modal("show");
    });
    makeNumericTextBox($("#divSuperAdminAddNewCenterPage")[0])
    populateStateDropdown($("#sltManageCenterState"));
    $("#divAddNewCategoryPage").on("shown.bs.modal", function() {

    });
    $("#divAddNewCategoryPage").on("hidden.bs.modal", function() {
      clearManageCenterPage();
    });
    $("#btnAddNewCenterSave").click(function() {
      var type = $(this).attr("type");
      if (type == "edit") {
        editManageCenter();
      } else {
        saveManageCenter();
      }
    });
  });
}


function getCenters() {
  $.ajax({
    url: protocol + "//" + host + "/center",
    type: "GET",
    cache: false,
    success: function(obj) {
      var list = obj.data;
      populateCenters(list);
    }
  });
}

function deleteCategory(id) {
  $.ajax({
    url: protocol + "//" + host + "/category/" + id,
    type: "DELETE",
    cache: false,
    success: function(obj) {
      getCategory();
    }
  });
}

function populateCenters(list) {
  var tbody = $("#tblManageCenter tbody")[0];
  $(tbody).empty();
  destroyDataTable("tblManageCenter");
  for (var i = 0; i < list.length; i++) {
    var tr = $("<tr>");
    $("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
    $(tr).data("obj", list[i]);
    var tdForName = $("<td>");
    $(tdForName).append(list[i].centerCode);
    $(tr).append(tdForName);
    var settingsGear = createSettingsGearDiv();
    $(settingsGear).removeClass("pull-right");
    var tdForSettings = $("<td>").html(settingsGear);
    $(tr).append(tdForSettings);
    appendLiForCenterSettings(settingsGear, list[i]);
    $(tbody).append(tr);
  }
  initializeDataTable("tblManageCenter")

}

function validateManageCenterPage() {
  var obj = {};
  var centerCode = $("#txtAddNewCenterCode").val();
  if (centerCode == "") {
    alert("Please enter the center code");
    return;
  }
  obj.centerCode = centerCode;
  obj.address = {};
  obj.address.state = {}
  var stateId = $("#sltManageCenterState").val();
  if (stateId == "Select") {
    alert("Please enter select the state");
    return;
  }
  obj.address.state.stateId = stateId;
  var city = $("#txtAddNewCenterCity").val();
  if (city == "") {
    alert("Please enter a city");
    return;
  }
  obj.address.city = city;
  var pinCode = $("#txtAddNewCenterPinCode").val();
  if (pinCode == "") {
    alert("Please enter a pin code");
    return;
  }
  obj.address.pinCode = pinCode;
  return obj;
}

function saveManageCenter() {
  var obj = validateManageCenterPage();
  if (obj == undefined) {
    return;
  }
  $.ajax({
    url: protocol + "//" + host + "/center",
    type: "POST",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      console.info(obj);
      getCenters();
      $("#divSuperAdminAddNewCenterPage").modal("hide");
      $("#divAddNewCategoryPage").modal("hide");
    }
  });
}

function editManageCenter() {
  var obj = validateManageCenterPage();
  if (obj == undefined) {
    return;
  }
  obj.centerId = $("#btnAddNewCenterSave").attr("centerId");
  $.ajax({
    url: protocol + "//" + host + "/center",
    type: "PUT",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      console.info(obj);
      getCenters();
      $("#divSuperAdminAddNewCenterPage").modal("hide");
      $("#divAddNewCategoryPage").modal("hide");
    }
  });
}

function appendLiForCenterSettings(div) {
  var ul = $(div).find("ul")[0];
  $(ul).empty();
  var liForEdit = createAndReturnLiForSettingsGear("Edit");
  $(ul).append(liForEdit);
  $(liForEdit).click(function() {
    var obj = $(this).closest("tr").data("obj");
    showAddNewCenterPage(obj);
  });
  var liForDelete = createAndReturnLiForSettingsGear("Delete");
  $(ul).append(liForDelete);
  $(liForDelete).click(function() {
    var obj = $(this).closest("tr").data("obj");
    deleteACenter(obj.centerId);
  });
}

function clearManageCenterPage() {
  $("#divSuperAdminAddNewCenterPage").find("input:text").val("");
  $("#divSuperAdminAddNewCenterPage").find("select").val("Select");
}

function showAddNewCenterPage(obj) {
  $("#divSuperAdminAddNewCenterPage").modal("show");
  $("#btnAddNewCenterSave").removeAttr("centerId")
  $("#btnAddNewCenterSave").removeAttr("type");
  if (obj != undefined) {
    $("#btnAddNewCenterSave").removeAttr("type", "edit");
    populateManageCenterPage(obj);
  }
}

function populateManageCenterPage(obj) {
  $("#txtAddNewCenterName").val(obj.centerName);
  $("#txtAddNewCenterCode").val(obj.centerCode);
  if (obj.address.states != undefined)
    $("#sltManageCenterState").val(obj.address.states.stateId);
  $("#txtAddNewCenterCity").val(obj.address.city);
  $("#txtAddNewCenterPinCode").val(obj.address.pinCode);
  $("#btnAddNewCenterSave").attr("centerId", obj.centerId);
}

function deleteACenter(centerId) {
  $.ajax({
    url: protocol + "//" + host + "/center/" + centerId,
    type: "DELETE",
    cache: false,
    success: function(obj) {
      console.info(obj);
      getCenters();
    }
  });
}
