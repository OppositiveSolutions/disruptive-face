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
    populateStateDropdown($("#sltManageCenterState"));
    $("#divAddNewCategoryPage").on("shown.bs.modal", function() {

    });
    $("#btnAddNewCenterSave").click(function() {
      var type = $(this).attr("type");
      if (type == "edit") {
        editCategory();
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
    $(tdForName).append(list[i].name);
    $(tr).append(tdForName);
    var settingsGear = createSettingsGearDiv();
    $(settingsGear).removeClass("pull-right");
    var tdForSettings = $("<td>").html(settingsGear);
    $(tr).append(tdForSettings);
    appendLiForCategorySettings(settingsGear, list[i]);
    $(tbody).append(tr);
  }
  initializeDataTable("tblManageCenter")

}

function validateManageCenterPage() {
  var obj = {};
  var centerName = $("#txtAddNewCenterName").val();
  if (centerName == "") {
    alert("Please enter the center name");
    return;
  }
  obj.centerName = centerName;
  var centerCode = $("#txtAddNewCenterCode").val();
  if (centerCode == "") {
    alert("Please enter the center code");
    return;
  }
  obj.centerCode = centerCode;
  obj.address = {};
  obj.address.state = {
    name: "sdasdas"
  }
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
  obj.centerLatitude = 1233;
  obj.centerLongitude = 1234;
  obj.isFranchise = true;
  obj.landMark = "sadsada";
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
      $("#divAddNewCategoryPage").modal("hide");
    }
  });
}
