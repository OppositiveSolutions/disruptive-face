function loadStaffDetailsPage(isShow) {
  $.get("superadmin/staffdetailspage.html" + postUrl, {
    "_": $.now()
  }, function(data) {
    $("#pageContainer").append(data);
    if (isShow) {
      showStaffDetailsPage();
    }
    $("#btnAddNewStudentDetails").click(function() {
      $("#divAddNewStudentDetailsPage").modal("show");
    });
    $("#divAddNewStudentDetailsPage").on("shown.bs.modal", function() {

    });
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
