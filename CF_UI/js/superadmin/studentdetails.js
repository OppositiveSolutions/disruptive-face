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
function saveStudentDetails() {
	var obj = validateAndReturnStudentInfo();
	if (obj == undefined) {
		return;
	}
	$.ajax({
		url : protocol + "//" + host + "/student",
		type : "POST",
		cache : false,
		data : JSON.stringify(obj),
		contentType : "application/json; charset=utf-8",
		success : function(obj) {
			console.info(obj);
			getStudentDetails();
			$("#divAddNewStudentDetailsPage").modal("hide");
		}
	});

}

function editStudentDetails() {
	var obj = validateAndReturnStudentInfo();
	if (obj == undefined) {
		return;
	}
	var studentId = $("#btnStudentDetailsSave").attr("studentId");
	obj.studentId = studentId;
	$.ajax({
		url : protocol + "//" + host + "/student",
		type : "PUT",
		cache : false,
		data : JSON.stringify(obj),
		contentType : "application/json; charset=utf-8",
		success : function(obj) {
			console.info(obj);
			getStudentDetails();
			$("#divAddNewStudentDetailsPage").modal("hide");
		}
	});

}

function validateAndReturnStudentInfo() {
	var obj = {};
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
	if (gender == "" || gender==undefined || gender==null) {
		alert("Please enter gender");
		return;
	}
	obj.gender = gender;
	var dob = $("#dob").val();
	if (dob == "") {
		alert("Please enter DOB");
		return;
	}
	obj.dob = dob;
	var qualification = $("#qualification").val();
	if (qualification == "") {
		alert("Please enter qualification");
		return;
	}
	obj.qualification = qualification;
	var address = $("#address").val();
	if (address == "") {
		alert("Please enter address");
		return;
	}
	obj.address = address;
	var city = $("#city").val();
	if (city == "") {
		alert("Please enter city");
		return;
	}
	obj.city = city;
	var state = $("#state").val();
	if (state == "") {
		alert("Please enter city");
		return;
	}
	obj.state = state;
	var pinCode = $("#pinCode").val();
	if (pinCode == "") {
		alert("Please enter city");
		return;
	}
	obj.pinCode = pinCode;
	var emailId = $("#emailId").val();
	if (emailId == "") {
		alert("Please enter city");
		return;
	}
	obj.emailId = emailId;
	var mobileNo = $("#mobileNo").val();
	if (mobileNo == "") {
		alert("Please enter city");
		return;
	}
	obj.mobileNo = mobileNo;
	var centerId = $("#centerId").val();
	if (centerId == "") {
		alert("Please enter city");
		return;
	}
	obj.centerId = centerId;
	return obj;
}