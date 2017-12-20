function loadStudentAnnouncementsPage() {
  $.get("student/announcements.html", {
    "_": $.now()
  }, function(data) {
    $("#pageContainer").append(data);
    showStudentsAnnouncementsPage();
  });
}

function initializeStudentAnnouncementPage() {
  getAllAnnouncements();
}

function getAllAnnouncements() {
  var url = protocol + "//" + host + "/announcement";
  $.ajax({
    url: url,
    type: "GET",
    cache: false,
    success: function(list) {
      populateStudentAnnouncements(list.data);
    }
  });
}

function populateStudentAnnouncements(list) {
  $("#divAnnouncementContainer").empty();
  for (var i = 0; i < list.length; ++i) {
    var panel = $("<div>").addClass("panel panel-default");
    var panelBody = $("<div>").addClass("panel-body");
    var divRow = $("<div>").addClass("row");
    $(panelBody).append(divRow);
    var divCol4 = $("<div>").addClass("col-md-3");
    $(divRow).append(divCol4);
    var divCol8 = $("<div>").addClass("col-md-9");
    $(divRow).append(divCol8);
    var divImageContainer = $("<div>").addClass("img-container");

    $(divCol4).append(divImageContainer);
    var img = $("<img>").attr("src", protocol + "//" + host + "/announcement/" + list[i].announcementId + "/image")
    $(img).attr("width", "100px");
    $(img).attr("hight", "100px");
    $(divImageContainer).append(img);
    $(panel).append(panelBody);
    var pForName = $("<p>").html("<strong>" + list[i].name + "</strong>");
    $(divCol8).append(pForName);
    var pForDescription = $("<p>").html(list[i].description);
    $(divCol8).append(pForDescription);
    $("#divAnnouncementContainer").append(panel);

  }
}
