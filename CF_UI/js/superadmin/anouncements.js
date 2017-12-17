function loadAnouncementsPage(isShow) {
  $.get("superadmin/anouncements.html" + postUrl, {
    "_": $.now()
  }, function(data) {
    $("#pageContainer").append(data);
    if (isShow) {
      showAnouncementsPage();
    }
    $("#btnAddNewAnouncement").click(function() {
      $("#divAddNewAnoucementPage").modal("show");
    });
    $("#divAddNewAnoucementPage").on("shown.bs.modal", function() {

    });
    $("#divAddNewAnoucementPage").on("hidden.bs.modal", function() {});
    $("#btnAddNewAnnouncementSave").click(function() {
      var type = $(this).attr("type");
      if (type == "edit") {
        editAnouncement();
      } else {
        saveAnouncement();
      }
    });
  });

}

function validateAndReturnAnouncementInfo() {
  var obj = {};
  var name = $("#txtAnouncementName").val();
  if (name == "") {
    alert("Please enter a name");
    return;
  }
  obj.name = name;
  var description = $("#txtAnouncementDescription").val();
  if (description == "") {
    alert("Please enter announcement description");
    return;
  }
  obj.description = description;
  var formdata = new FormData();
  var file = $("#fileAnnouncementImage")[0].files[0];
  formdata.append("file", file);
  var announcement = {
    description: description,
    name: name
  }
  formdata.append("announcement", JSON.stringify(announcement));
  obj.isCurrent = true;
  return formdata;
}

function saveAnouncement() {
  var formdata = validateAndReturnAnouncementInfo();
  if (formdata == undefined) {
    return;
  }
  $.ajax({
    url: protocol + "//" + host + "/announcement",
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    data: formdata,
    success: function(obj) {
      getVideoTutorials();
      $("#divAddNewAnoucementPage").modal("hide");
    }
  });

}

function editAnouncement() {
  var obj = validateAndReturnAnouncementInfo();
  if (obj == undefined) {
    return;
  }
  obj.videoTutorialId = $("#btnNewVideoTutorialSave").attr("videoTutorialId")
  $.ajax({
    url: protocol + "//" + host + "/announcement",
    type: "PUT",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      getAnnouncements();
      $("#divAddNewAnoucementPage").modal("hide");
    }
  });

}

function showAddNewAnnouncementPage(obj) {
  $("#divAddNewAnoucementPage").modal("show");
  if (obj != undefined) {
    populateAddNewAnnouncementForm(obj);
  }

}

function populateAddNewAnnouncementForm(obj) {
  $("#txtAnouncementName").val(obj.name);
  $("#txtAnouncementDescription").val(obj.description);
  $("#btnNewVideoTutorialSave").attr("announcementId", obj.announcementId);
  $("#btnNewVideoTutorialSave").attr("type", "edit");

}

function getAnnouncements() {
  $.ajax({
    url: protocol + "//" + host + "/announcement",
    type: "GET",
    cache: false,
    success: function(obj) {
      var list = obj.data;
      populateAnnouncements(list);
    }
  });
}

function deleteAnnouncement(id) {
  $.ajax({
    url: protocol + "//" + host + "/announcement/" + id,
    type: "DELETE",
    cache: false,
    success: function(obj) {
      getVideoTutorials();
    }
  });
}

function populateAnnouncements(list) {
  var tbody = $("#tblAnnouncements tbody")[0];
  $(tbody).empty();
  console.info(list)
  destroyDataTable("tblAnnouncements");
  for (var i = 0; i < list.length; i++) {
    var tr = $("<tr>").data("obj", list[i]);
    $("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
    $(tr).data("obj", list[i]);
    var tdForName = $("<td>");
    $(tdForName).append("<b>" + list[i].name + "</b>");
    $(tdForName).append("<br>" + list[i].description);
    $(tr).append(tdForName);


    var tdForUrl = $("<td>");
    $(tdForUrl).append(list[i].url);
    $(tr).append(tdForUrl);

    var settingsGear = createSettingsGearDiv();
    $(settingsGear).removeClass("pull-right");
    var tdForSettings = $("<td>").html(settingsGear);
    $(tr).append(tdForSettings);
    appendLiForAnnouncementPageSettings(settingsGear, list[i]);
    $(tbody).append(tr);
  }
  initializeDataTable("tblAnnouncements")

}

function appendLiForAnnouncementPageSettings(div) {
  var ul = $(div).find("ul")[0];
  $(ul).empty();
  var liForEdit = createAndReturnLiForSettingsGear("Edit");
  $(ul).append(liForEdit);
  $(liForEdit).click(function() {
    var obj = $(this).closest("tr").data("obj");
    showAddNewAnnouncementPage(obj);
  });
  var liForDelete = createAndReturnLiForSettingsGear("Delete");
  $(ul).append(liForDelete);
  $(liForDelete).click(function() {
    var obj = $(this).closest("tr").data("obj");
    deleteAnnouncement(obj.announcementId);
  });
}
