function loadStaffDetailsPage(isShow) {
  $.get("superadmin/staffdetailspage.html" + postUrl, {
    "_": $.now()
  }, function(data) {
    $("#pageContainer").append(data);
    if (isShow) {
      showStaffDetailsPage();
    }
    $("#btnAddNewStaffDetails").click(function() {
      $("#divAddNewStaffDetailsPage").modal("show");
    });
    makeNumericTextBox($("#divAddNewStaffDetailsPage")[0])
    $("#divAddNewStaffDetailsPage").on("shown.bs.modal", function() {

    });
    populateStateDropdown($("#sltManageStaffStates"));
    populateManageStaffCenter();
    attachDatePickers($("#divAddNewStaffDetailsPage")[0]);
    $("#btnStaffDetailsSave").click(function() {
      var type = $(this).attr("type");
      if (type == "edit") {
        editStaffDetails();
      } else {
        saveStaffDetails();
      }
    });
  });
}

function clearStaffManagementPage() {
  $("#divAddNewStaffDetailsPage").find("input:text").val("");
  $("#divAddNewStaffDetailsPage").find("select").val("Select");
}

function saveStaffDetails() {
  var obj = validateAndReturnStaffInfo();
  if (obj == undefined) {
    return;
  }
  $.ajax({
    url: protocol + "//" + host + "/staff",
    type: "POST",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      console.info(obj);
      getStaff();
      $("#divAddNewStaffDetailsPage").modal("hide");
    }
  });

}

function editStaffDetails() {
  var obj = validateAndReturnStaffInfo();
  if (obj == undefined) {
    return;
  }
  var userId = $("#btnStaffDetailsSave").attr("userId");
  obj.userId = userId;
  $.ajax({
    url: protocol + "//" + host + "/staff",
    type: "PUT",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      console.info(obj);
      getStaff();
      $("#divAddNewStaffDetailsPage").modal("hide");
    }
  });

}

function validateAndReturnStaffInfo() {
  var obj = {};
  var centerCode = $("#sltManageStaffCenterName").val();
  if (centerCode == "Select") {
    alert("Please select the center code");
    return;
  }
  obj.center = {};
  obj.centerId = centerCode;
  obj.center.centerCode = centerCode
  var firstName = $("#txtStaffFirstName").val();
  if (firstName == "") {
    alert("Please enter first name");
    return;
  }
  obj.firstName = firstName;
  var lastName = $("#txtStaffLastName").val();
  if (lastName == "") {
    alert("Please enter last name");
    return;
  }
  obj.lastName = lastName;
  var gender = $("input:radio[name='Staffgendername']:checked").val();
  if (gender == "" || gender == undefined || gender == null) {
    alert("Please enter gender");
    return;
  }
  obj.gender = gender;
  var dob = $("#txtStaffDob").val();
  if (dob == "") {
    alert("Please enter DOB");
    return;
  }
  obj.dob = dob;
  var qualification = $("#txtStaffQualification").val();
  if (qualification == "") {
    alert("Please enter qualification");
    return;
  }
  obj.qualification = qualification;
  var salary = $("#sltManageStaffSalary").val();
  if (salary == "") {
    alert("Please enter salary");
    return;
  }
  obj.salary = salary;
  var emailId = $("#txtStaffEmailId").val();
  if (emailId == "") {
    alert("Please enter emailId");
    return;
  }
  if (!isEmail(emailId)) {
    alert("Please enter a valid emailId")
    return;
  }
  var confirmEmailId = $("#txtStaffConfirmEmailId").val();
  if (confirmEmailId == "") {
    alert("Please enter the email id again to confirm");
    return;
  }
  if (emailId != confirmEmailId) {
    alert("confirm email id not matching");
    return;
  }
  obj.emailId = emailId;



  var stateId = $("#sltManageStaffStates").val();
  if (stateId == "Select") {
    alert("Please enter select the state");
    return;
  }
  obj.stateId = stateId;
  var city = $("#txtManageStaffCity").val();
  if (city == "") {
    alert("Please enter a city");
    return;
  }
  obj.city = city;
  var address = $("#sltManageStaffAddress").val();

  obj.address = address;
  var pinCode = $("#txtManageStaffPinCode").val();
  if (pinCode == "") {
    alert("Please enter a pin code");
    return;
  }
  obj.pinCode = pinCode;



  // var city = $("#city").val();
  // if (city == "") {
  // 	alert("Please enter city");
  // 	return;
  // }
  // obj.city = city;
  // var state = $("#state").val();
  // if (state == "") {
  // 	alert("Please enter city");
  // 	return;
  // }
  // obj.state = state;
  // var pinCode = $("#pinCode").val();
  // if (pinCode == "") {
  // 	alert("Please enter city");
  // 	return;
  // }
  // obj.pinCode = pinCode;
  // var emailId = $("#emailId").val();
  // if (emailId == "") {
  // 	alert("Please enter city");
  // 	return;
  // }
  // obj.emailId = emailId;
  // var mobileNo = $("#mobileNo").val();
  // if (mobileNo == "") {
  // 	alert("Please enter city");
  // 	return;
  // }
  // obj.mobileNo = mobileNo;
  // var centerId = $("#centerId").val();
  // if (centerId == "") {
  // 	alert("Please enter city");
  // 	return;
  // }
  // obj.centerId = centerId;
  return obj;
}

function populateManageStaffCenter() {
  $.ajax({
    url: protocol + "//" + host + "/center",
    type: "GET",
    cache: false,
    success: function(obj) {
      var list = obj.data;
      var optionSelect = $("<option>").html("Select");
      $("#sltManageStaffCenterName").append(optionSelect);
      for (var i = 0; i < list.length; i++) {
        var option = $("<option>").val(list[i].centerId).html(list[i].centerCode);
        $("#sltManageStaffCenterName").append(option);
      }
    }
  });

}

function getStaff() {
  $.ajax({
    url: protocol + "//" + host + "/staff/pageSize/100/pageNo/1",
    type: "GET",
    cache: false,
    success: function(obj) {
      var list = obj.data;
      populateStaffDetails(list);
    }
  });
}



function populateStaffDetails(list) {
  var tbody = $("#tblStaffDetails tbody")[0];
  $(tbody).empty();
  destroyDataTable("tblStaffDetails");
  for (var i = 0; i < list.length; i++) {
    var tr = $("<tr>");
    $("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
    $(tr).data("obj", list[i]);
    var tdForName = $("<td>");
    $(tdForName).append(list[i].firstName + " " + list[i].lastName);
    $(tr).append(tdForName);

    var tdEmail = $("<td>");
    $(tdEmail).append(list[i].username);
    $(tr).append(tdEmail);

    // var tdForMobile = $("<td>");
    // $(tdForMobile).append(list[i].mobileNo);
    // $(tr).append(tdForMobile);
    var status = "Active";
    if (list[i].status == 0) {
      status = "Deactive";
    }

    var tdForStatus = $("<td>");
    $(tdForStatus).append(status);
    $(tr).append(tdForStatus);

    var settingsGear = createSettingsGearDiv();
    $(settingsGear).removeClass("pull-right");
    var tdForSettings = $("<td>").html(settingsGear);
    $(tr).append(tdForSettings);
    appendLiForStaffSettings(settingsGear, list[i]);
    $(tbody).append(tr);
  }
  initializeDataTable("tblStaffDetails")

}

function appendLiForStaffSettings(div, obj) {
  var ul = $(div).find("ul")[0];
  $(ul).empty();
  var liForEdit = createAndReturnLiForSettingsGear("Edit");
  $(ul).append(liForEdit);
  $(liForEdit).click(function() {
    var obj = $(this).closest("tr").data("obj");
    showAddNewStaffPage(obj);
  });
  var status = "Activate";
  if (obj.status == 1) {
    status = "Deactivate";
  }
  var liForUpdateStatus = createAndReturnLiForSettingsGear(status);
  $(ul).append(liForUpdateStatus);
  $(liForUpdateStatus).attr("status", obj.status);
  $(liForUpdateStatus).click(function() {
    var obj = $(this).closest("tr").data("obj");
    var status = $(this).attr("status");
    updateStafftatus(obj.userId, status, $(this));
  });
  var liForDelete = createAndReturnLiForSettingsGear("Delete");
  $(ul).append(liForDelete);
  $(liForDelete).click(function() {
    var obj = $(this).closest("tr").data("obj");
    deleteACenter(obj.centerId);
  });
}

function updateStafftatus(userId, status, liStatus) {
  $.ajax({
    url: protocol + "//" + host + "/Staff/" + userId + "/expiry",
    type: "PUT",
    cache: false,
    contentType: "text/plain",
    success: function(obj) {
      if (status == 1) {
        $(liStatus).find("a").html("Deactivate");
      } else {
        $(liStatus).find("a").html("Activte")
      }

    }
  });

}

function showAddNewStaffPage(obj) {
  $("#divAddNewStaffDetailsPage").modal("show");
  if (obj != undefined) {
    populateStaffAddForm(obj);
    $("#btnStaffDetailsSave").attr("type", "edit");
  }
}

function populateStaffAddForm(obj) {
  $("#sltManageStaffCenterName").val(obj.centerId);
  $("#txtStaffFirstName").val(obj.firstName);
  $("#txtStaffLastName").val(obj.lastName);
  $("input:radio[name='Staffgendername'][value=" + obj.gender + "]").prop("checked", true);
  $("#txtStaffDob").val(obj.dob);
  $("#txtStaffQualification").val(obj.qualification);
  $("#txtStaffEmailId").val(obj.username);
  $("#sltManageStaffStates").val(obj.stateId);
  $("#txtManageStaffCity").val(obj.city);
  $("#sltManageStaffAddress").val(obj.address);
  $("#txtManageStaffPinCode").val(obj.pinCode);
  $("#btnStaffDetailsSave").attr("userId", obj.userId)

}
