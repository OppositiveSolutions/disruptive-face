function loadStudentDetailPage(isShow) {
	$.get("superadmin/studentdetails.html" + postUrl, {
		"_": $.now()
	}, function(data) {
		$("#pageContainer").append(data);
		if (isShow) {
			showStudentDetailsPage();
		}
		$("#btnAddNewStudentDetails").click(function() {
			$("#divAddNewStudentDetailsPage").modal("show");
		});
		$("#divAddNewStudentDetailsPage").on("shown.bs.modal", function() {

		});
		$("#divAddNewStudentDetailsPage").on("hidden.bs.modal", function() {
			$("#btnStudentDetailsSave").removeAttr("type");
			clearStudentManagementPage();
		});
		populateStateDropdown($("#sltManageStudentsStates"));
		populateManageStudentsCenter();
		attachDatePickers($("#divAddNewStudentDetailsPage")[0]);
		$("#btnStudentDetailsSave").click(function() {
			var type = $(this).attr("type");
			if (type == "edit") {
				editStudentDetails();
			} else {
				saveStudentDetails();
			}
		});
	});
}

function clearStudentManagementPage() {
	$("#divAddNewStudentDetailsPage").find("input:text").val("");
	$("#divAddNewStudentDetailsPage").find("select").val("Select");
}

function saveStudentDetails() {
	var obj = validateAndReturnStudentInfo();
	if (obj == undefined) {
		return;
	}
	$.ajax({
		url: protocol + "//" + host + "/student",
		type: "POST",
		cache: false,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj) {
			console.info(obj);
			getStudents();
			$("#divAddNewStudentDetailsPage").modal("hide");
		}
	});

}

function editStudentDetails() {
	var obj = validateAndReturnStudentInfo();
	if (obj == undefined) {
		return;
	}
	var userId = $("#btnStudentDetailsSave").attr("userId");
	obj.userId = userId;
	$.ajax({
		url: protocol + "//" + host + "/student",
		type: "PUT",
		cache: false,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj) {
			console.info(obj);
			getStudents();
			$("#divAddNewStudentDetailsPage").modal("hide");
		}
	});

}

function validateAndReturnStudentInfo() {
	var obj = {};
	var centerCode = $("#sltManageStudentsCenterName").val();
	if (centerCode == "Select") {
		alert("Please select the center code");
		return;
	}
	obj.center = {};
	obj.centerId = centerCode;
	obj.center.centerCode = centerCode
	var firstName = $("#txtFirstName").val();
	if (firstName == "") {
		alert("Please enter first name");
		return;
	}
	obj.firstName = firstName;
	var lastName = $("#txtLastName").val();
	if (lastName == "") {
		alert("Please enter last name");
		return;
	}
	obj.lastName = lastName;
	var gender = $("input:radio[name='gendername']:checked").val();
	if (gender == "" || gender == undefined || gender == null) {
		alert("Please enter gender");
		return;
	}
	obj.gender = gender;
	var dob = $("#txtDob").val();
	if (dob == "") {
		alert("Please enter DOB");
		return;
	}
	obj.dob = dob;
	var qualification = $("#txtQualification").val();
	if (qualification == "") {
		alert("Please enter qualification");
		return;
	}
	obj.qualification = qualification;
	var address = $("#txtAddress").val();
	if (address == "") {
		alert("Please enter address");
		return;
	}
	obj.address = address;
	var emailId = $("#txtEmailId").val();
	if (emailId == "") {
		alert("Please enter emailId");
		return;
	}
	obj.emailId = emailId;

	var stateId = $("#sltManageStudentsStates").val();
	if (stateId == "Select") {
		alert("Please enter select the state");
		return;
	}
	obj.stateId = stateId;
	var city = $("#txtManageStudentsCity").val();
	if (city == "") {
		alert("Please enter a city");
		return;
	}
	obj.city = city;
	var address = $("#sltManageStudentsAddress").val();

	obj.address = address;
	var pinCode = $("#txtManageStudentsPinCode").val();
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

function populateManageStudentsCenter() {
	$.ajax({
		url: protocol + "//" + host + "/center",
		type: "GET",
		cache: false,
		success: function(obj) {
			var list = obj.data;
			var optionSelect = $("<option>").html("Select");
			$("#sltManageStudentsCenterName").append(optionSelect);
			for (var i = 0; i < list.length; i++) {
				var option = $("<option>").val(list[i].centerId).html(list[i].centerCode);
				$("#sltManageStudentsCenterName").append(option);
			}
		}
	});

}

function getStudents() {
	$.ajax({
		url: protocol + "//" + host + "/student/pageSize/100/pageNo/1",
		type: "GET",
		cache: false,
		success: function(obj) {
			var list = obj.data;
			populateStudentDetails(list);
		}
	});
}



function populateStudentDetails(list) {
	var tbody = $("#tblStudentDetails tbody")[0];
	$(tbody).empty();
	destroyDataTable("tblStudentDetails");
	for (var i = 0; i < list.length; i++) {
		var tr = $("<tr>");
		$("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
		$(tr).data("obj", list[i]);
		var tdForName = $("<td>");
		$(tdForName).append(list[i].firstName + " " + list[i].lastName);
		$(tr).append(tdForName);


		var tdForCreatedDate = $("<td>");
		$(tdForCreatedDate).append(list[i].createdDate);
		$(tr).append(tdForCreatedDate);


		var tdForexpiryDate = $("<td>");
		$(tdForexpiryDate).append(list[i].expiryDate);
		$(tr).append(tdForexpiryDate);

		var tdEmail = $("<td>");
		$(tdEmail).append(list[i].username);
		$(tr).append(tdEmail);

		var tdForMobile = $("<td>");
		$(tdForMobile).append(list[i].phoneNo);
		$(tr).append(tdForMobile);
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
		appendLiForStudentsSettings(settingsGear, list[i]);
		$(tbody).append(tr);
	}
	initializeDataTable("tblStudentDetails")

}

function appendLiForStudentsSettings(div, obj) {
	var ul = $(div).find("ul")[0];
	$(ul).empty();
	var liForEdit = createAndReturnLiForSettingsGear("Edit");
	$(ul).append(liForEdit);
	$(liForEdit).click(function() {
		var obj = $(this).closest("tr").data("obj");
		showAddNewStudentPage(obj);
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
		updateStudentStatus(obj.userId, status, $(this));
	});
	var liForDelete = createAndReturnLiForSettingsGear("Delete");
	$(ul).append(liForDelete);
	$(liForDelete).click(function() {
		var obj = $(this).closest("tr").data("obj");
		deleteACenter(obj.centerId);
	});
}

function updateStudentStatus(userId, status, liStatus) {
	$.ajax({
		url: protocol + "//" + host + "/student/" + userId + "/expiry",
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

function showAddNewStudentPage(obj) {
	$("#divAddNewStudentDetailsPage").modal("show");
	if (obj != undefined) {
		populateStudnetAddForm(obj);
		$("#btnStudentDetailsSave").attr("type", "edit");
	}

}

function populateStudnetAddForm(obj) {
	$("#sltManageStudentsCenterName").val(obj.centerId);
	$("#txtFirstName").val(obj.firstName);
	$("#txtLastName").val(obj.lastName);
	$("input:radio[name='gendername'][value=" + obj.gender + "]").prop("checked", true);
	$("#txtDob").val(obj.dob);
	$("#txtQualification").val(obj.qualification);
	$("#txtEmailId").val(obj.username);
	$("#sltManageStudentsStates").val(obj.stateId);
	$("#txtManageStudentsCity").val(obj.city);
	$("#sltManageStudentsAddress").val(obj.address);
	$("#txtManageStudentsPinCode").val(obj.pinCode);
	$("#btnStudentDetailsSave").attr("userId", obj.userId)

}
