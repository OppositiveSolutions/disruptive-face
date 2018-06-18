function loadStudentDetailPage(isShow) {
	$.get("superadmin/studentdetails.html" + postUrl, {
		"_" : $.now()
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
		makeNumericTextBox($("#divAddNewStudentDetailsPage")[0])
		$("#divAddNewStudentDetailsPage").on("hidden.bs.modal", function() {
			$("#btnStudentDetailsSave").removeAttr("type");
			clearStudentManagementPage();
		});
		populateStateDropdown($("#sltManageStudentsStates"));
		populateManageStudentsCenter($("#sltManageStudentsCenterName"));
		attachDatePickers($("#divAddNewStudentDetailsPage")[0]);
		addIconToMandatoryItems($("#divAddNewStudentDetailsPage")[0])
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

function populateManageStudentsCenter(dropDown) {
	$.ajax({
		url : protocol + "//" + host + "/center",
		type : "GET",
		cache : false,
		success : function(obj) {
			var list = obj.data;
			var optionSelect = $("<option>").html("Select");
			$(dropDown).append(optionSelect);
			for (var i = 0; i < list.length; i++) {
				var option = $("<option>").val(list[i].centerId).html(
						list[i].centerCode);
				$(dropDown).append(option);
			}
		}
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
	var formdata = new FormData();
	var fileName = $("#fileStudentProfilePic").val();
	if (fileName != "") {
		var file = $("#fileStudentProfilePic")[0].files[0];
		formdata.append("file", file);
	}
	formdata.append("studentJson", JSON.stringify(obj));

	$.ajax({
		url : protocol + "//" + host + "/student",
		type : "POST",
		cache : false,
		data : formdata,
		processData : false,
		contentType : false,
		success : function(obj) {
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
	var formdata = new FormData();
	var fileName = $("#fileStudentProfilePic").val();
	if (fileName != "") {
		var file = $("#fileStudentProfilePic")[0].files[0];
		formdata.append("file", file);
	}
	formdata.append("studentJson", JSON.stringify(obj));

	$.ajax({
		url : protocol + "//" + host + "/student",
		type : "PUT",
		cache : false,
		data : formdata,
		processData : false,
		contentType : false,
		success : function(obj) {
			console.info(obj);
			getStudents();
			$("#divAddNewStudentDetailsPage").modal("hide");
		}
	});
}

// function editStudentDetails() {
// var obj = validateAndReturnStudentInfo();
// if (obj == undefined) {
// return;
// }
// var userId = $("#btnStudentDetailsSave").attr("userId");
// obj.userId = userId;
// $.ajax({
// url: protocol + "//" + host + "/student",
// type: "PUT",
// cache: false,
// data: JSON.stringify(obj),
// contentType: "application/json; charset=utf-8",
// success: function(obj) {
// console.info(obj);
// getStudents();
// $("#divAddNewStudentDetailsPage").modal("hide");
// }
// });
// }

function validateAndReturnStudentInfo() {
	var obj = {};
	var emailId = $("#txtEmailId").val();
	if (emailId == "") {
		alert("Please enter emailId");
		return;
	}
	obj.emailId = emailId;
	var phoneNo = $("#txtPhone").val();
	if (phoneNo == "") {
		alert("Please enter mobile number");
		return;
	}
	obj.mobileNo = phoneNo;
	if (!isMobileNo(phoneNo)) {
		alert("Please enter a valid mobile number");
		return;
	}
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
	var userId = $("#txtUserId").val();
	obj.userId = userId;
	
	var qualification = $("#txtQualification").val();
	if (qualification == "") {
		alert("Please enter qualification");
		return;
	}
	obj.qualification = qualification;

	var dob = $("#txtDob").val();
	if (dob == "") {
		alert("Please enter DOB");
		return;
	}
	obj.dob = dob;
	var place = $("#txtManageStudentsPlace").val();
	if (place == "") {
		alert("Please enter a place");
		return;
	}
	obj.place = place;
	var centerCode = $("#sltManageStudentsCenterName").val();
	if (centerCode == "Select") {
	}
	centerCode = 0;
	// obj.center = {};
	// obj.centerId = centerCode;
	// obj.center.centerCode = centerCode

	var gender = $("input:radio[name='gendername']:checked").val();
	if (gender == "" || gender == undefined || gender == null) {
		alert("Please enter gender");
		return;
	}
	obj.gender = gender;

	var address = $("#txtAddress").val();
	if (address == "") {
		// alert("Please enter address");
		// return;
	}
	obj.address = address;

	var stateId = $("#sltManageStudentsStates").val();
	if (stateId == "Select") {
		alert("Please enter select the state");
		return;
	}
	// obj.stateId = stateId;
	obj.state = {};
	obj.state.stateId = stateId;
	obj.state.name = stateId;

	var city = $("#txtManageStudentsCity").val();
	if (city == "") {
		// alert("Please enter a city");
		// return;
	}
	obj.city = city;
	var address = $("#sltManageStudentsAddress").val();

	obj.address = address;
	var pinCode = $("#txtManageStudentsPinCode").val();
	if (pinCode == "") {
		// alert("Please enter a pin code");
		// return;
	}
	obj.pinCode = pinCode;

	// var city = $("#city").val();
	// if (city == "") {
	// alert("Please enter city");
	// return;
	// }
	// obj.city = city;
	// var state = $("#state").val();
	// if (state == "") {
	// alert("Please enter city");
	// return;
	// }
	// obj.state = state;
	// var pinCode = $("#pinCode").val();
	// if (pinCode == "") {
	// alert("Please enter city");
	// return;
	// }
	// obj.pinCode = pinCode;
	// var emailId = $("#emailId").val();
	// if (emailId == "") {
	// alert("Please enter city");
	// return;
	// }
	// obj.emailId = emailId;

	// var centerId = $("#centerId").val();
	// if (centerId == "") {
	// alert("Please enter city");
	// return;
	// }
	// obj.centerId = centerId;
	return obj;
}

function getStudents() {
	$.ajax({
		url : protocol + "//" + host + "/student/pageSize/100/pageNo/1",
		type : "GET",
		cache : false,
		success : function(obj) {
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

		// var tdForCreatedDate = $("<td>");
		// $(tdForCreatedDate).append(list[i].createdDate);
		// $(tr).append(tdForCreatedDate);
		
		var tdQualification = $("<td>");
		$(tdQualification).append(list[i].qualification);
		$(tr).append(tdQualification);

		var tdPlace = $("<td>");
		$(tdPlace).append(list[i].place);
		$(tr).append(tdPlace);

		var tdDob = $("<td>");
		$(tdDob).append(list[i].dob);
		$(tr).append(tdDob);

		var tdContact = $("<td>");
		$(tdContact).append(list[i].username);
		$(tdContact).append("<br/>");
		$(tdContact).append(list[i].phoneNo);
		$(tr).append(tdContact);

		// var tdEmail = $("<td>");
		// $(tdEmail).append(list[i].username);
		// $(tr).append(tdEmail);
		//
		// var tdForMobile = $("<td>");
		// $(tdForMobile).append(list[i].phoneNo);
		// $(tr).append(tdForMobile);

		var status = "Active";
		if (list[i].status == 0) {
			status = "Inactive";
		}

		var tdForStatus = $("<td>");
		$(tdForStatus).append(status);
		$(tr).append(tdForStatus);

		var tdForimg = $("<td>");
		var imgForTd = $("<img>").attr(
				"src",
				protocol + "//" + host + "/student/" + list[i].userId
						+ "/image");
		$(imgForTd).attr("width", "100px");
		$(tdForimg).append(imgForTd);
		$(tr).append(tdForimg);

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
		deleteStudent(obj.userId);
	});
}

function deleteStudent(userId, status, liStatus) {
	$.ajax({
		url : protocol + "//" + host + "/student/" + userId,
		type : "DELETE",
		cache : false,
		success : function(obj) {
			getStudents();

		}
	});

}

function updateStudentStatus(userId, status, liStatus) {
	$.ajax({
		url : protocol + "//" + host + "/student/" + userId + "/activate",
		type : "GET",
		cache : false,
		success : function(obj) {
			getStudents();

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
	$("#txtUserId").val(obj.userId);
	$("input:radio[name='gendername'][value=" + obj.gender + "]").prop(
			"checked", true);
	$("#txtDob").val(obj.dob);
	$("#txtQualification").val(obj.qualification);
	$("#txtEmailId").val(obj.username);
	$("#txtPhone").val(obj.phoneNo);
	$("#sltManageStudentsStates").val(obj.stateId);
	$("#txtManageStudentsCity").val(obj.city);
	$("#sltManageStudentsAddress").val(obj.address);
	$("#txtManageStudentsPinCode").val(obj.pinCode);
	$("#btnStudentDetailsSave").attr("userId", obj.userId)

}
