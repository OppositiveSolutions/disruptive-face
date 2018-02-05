function loadStudentProfilePage() {
    $.get("student/myprofile.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        $("#editMyprofileBtn").click(function () {
            enableEditMyProfile();
        });
        showStudentProfile();
        populateStateDropdown($("#sltManageStudentsStatesMyProfile"));
        $("#btnStudentDetailsSaveMyProfile").click(function () {
            saveEditedPersonalInfo();
        });
    });

}
function initializeStudentProfilePage() {
    var url = protocol + "//" + host + "/profile";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (data) {
            populateStudentData(data.data);
        }
    });
}
function saveEditedPersonalInfo() {
    var userData = $("#editMyprofileBtn").data("userData");
    var postMap = {};
    postMap.address = $("#sltManageStudentsAddressMyProfile").val();
    postMap.city = $("#txtManageStudentsCityMyProfile").val();
    postMap.dob = $("#txtDobMyProfile").val();
    postMap.emailId = $("#txtEmailIdMyProfile").val();
    postMap.firstName = $("#txtFirstNameMyProfile").val();
    postMap.gender = $("#genderMyProfile").find("input:radio[name=gendername]:checked").val();
    postMap.lastName = $("#txtLastNameMyProfile").val();
    postMap.pinCode = $("#txtManageStudentsPinCode").val();
    postMap.qualification = $("#txtQualificationMyProfile").val();
    postMap.stateId = $("#sltManageStudentsStatesMyProfile").val();
    postMap.userId = userData.userId;
    $.ajax({
        url: protocol + "//" + host + "/student",
        type: "PUT",
        cache: false,
        data: JSON.stringify(postMap),
        contentType: "application/json; charset=utf-8",
        success: function (obj) {
            $("#editStudentDetailsModal").modal("hide");
        }
    });
}
function enableEditMyProfile() {
    var userData = $("#editMyprofileBtn").data("userData");
    $("#editStudentDetailsModal").modal("show");
    if (!userData) {
        return;
    }
    var userDetails = userData.user;
    if (userDetails) {
        var address = userDetails.address[0];
        $("#sltManageStudentsAddressMyProfile").val(address.streetAddress);
        $("#sltManageStudentsStatesMyProfile").val(address.states.stateId);
        $("#txtManageStudentsCityMyProfile").val(address.city);
        $("#txtManageStudentsPinCode").val(address.pinCode);
    }
    $("#txtFirstNameMyProfile").val(userDetails.firstName);
    $("#txtLastNameMyProfile").val(userDetails.lastName);
    $("#txtDobMyProfile").val(userDetails.dob);
    $("#genderMyProfile").find("input:radio[name=gendername][value=" + userDetails.gender + "]").prop("checked", true);
    $("#txtEmailIdMyProfile").val(userDetails.username);
    $("#txtQualificationMyProfile").val(userData.qualification);




}

function populateStudentData(data) {
    if (!data) {
        return;
    }
    $("#editMyprofileBtn").data("userData", data);
    var userDetails = data.user;
    if (userDetails) {
        var address = userDetails.address[0];
        $("#studentAddress").html(address.streetAddress);
        if (address.states) {
            $("#studentState").html(address.states.name);
        }
        $("#studentCity").html(address.city);
        $("#studentPin").html(address.pinCode);
        $("#studentFirstName").html(userDetails.firstName);
        $("#studentLastName").html(userDetails.lastName);
        $("#studentDob").html(userDetails.dob);
        $("#studentGender").html(userDetails.gender);
        $("#studentEmail").html(userDetails.username);
    }
    $("#studentQualification").html(data.qualification);

}