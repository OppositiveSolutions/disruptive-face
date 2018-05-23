$(document).ready(function() {
	$("#btnStudentDetailsSave").unbind("click");
	$("#btnStudentDetailsSave").click(function() {
		var type = $(this).attr("type");
		if (type == "edit") {
			editStudentDetails();
		} else {
			saveStudentDetails();
		}
		return false;
	});
	$("#btnStudentDetailsSave").attr("disabled", true);
	$("#chkTerms").change(function() {
		if ($(this).prop("checked")) {
			$("#btnStudentDetailsSave").removeAttr("disabled");
		} else {
			$("#btnStudentDetailsSave").attr("disabled", true);
		}
	})
	$("#btnCancel").click(function() {
		window.location = protocol + "//" + window.location.host + FOLDER_NAME;
	})
	attachDatePickers($("#signupPage")[0]);
	populateStateDropdown($("#sltManageStudentsStates"));
	populateManageStudentsCenter($("#sltManageStudentsCenterName"));
})

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
		url: protocol + "//" + host + "/student",
		type: "POST",
		cache: false,
		data: formdata,
		processData: false,
		contentType: false,
		success: function(obj) {
			alert("You are successfully registered")
			window.location = protocol + "//" + window.location.host + FOLDER_NAME;
		},
		error: function() {
			window.location = protocol + "//" + window.location.host + FOLDER_NAME;
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
	obj.phoneNo = phoneNo;
	if (!isMobileNo(phoneNo)) {
		alert("Please enter a valid mobile number");
		return;
	}

	var centerCode = $("#sltManageStudentsCenterName").val();
	if (centerCode == "Select") {}
	centerCode = 0;
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
	var gender = $("input:radio[name='gendername']:checked").val();
	if (gender == "" || gender == undefined || gender == null) {
		alert("Please enter gender");
		return;
	}
	obj.gender = gender;
	var city = $("#txtManageStudentsCity").val();
	if (city == "") {
		// alert("Please enter a city");
		// return;
	}
	obj.city = city;
	var stateId = $("#sltManageStudentsStates").val();
	if (stateId == "Select") {
		alert("Please enter select the state");
		return;
	}
	obj.stateId = stateId;

	var address = $("#txtAddress").val();
	if (address == "") {
		// alert("Please enter address");
		// return;
	}
	obj.address = address;

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

	// var centerId = $("#centerId").val();
	// if (centerId == "") {
	// 	alert("Please enter city");
	// 	return;
	// }
	// obj.centerId = centerId;
	return obj;
}
