function loadVideoTutorialPage(isShow) {
  $.get("superadmin/videotutorial.html" + postUrl, {
    "_": $.now()
  }, function(data) {
    $("#pageContainer").append(data);
    if (isShow) {
      showVideoTutorialPage();
    }
    $("#btnAddNewVideoTutorial").click(function() {
      $("#divSuperAdminAddNewVideoURL").modal("show");
    });
    $("#divAddNewCategoryPage").on("shown.bs.modal", function() {

    });
    $("#divAddNewCategoryPage").on("hidden.bs.modal", function() {});
    $("#btnNewVideoTutorialSave").click(function() {
      var type = $(this).attr("type");
      if (type == "edit") {
        editVideoTutorial();
      } else {
        saveVideoTutorial();
      }
    });
  });
}

function validateAndReturnVideoTutorialInfo() {
  var obj = {};
  var name = $("#txtVideoTutorialName").val();
  if (name == "") {
    alert("Please enter video tutorial name");
    return;
  }
  obj.name = name;
  var description = $("#txtVideoTutorialDescription").val();
  if (description == "") {
    alert("Please enter video tutorial description");
    return;
  }
  obj.description = description;
  var url = $("#txtVideoTutorialURL").val();
  if (url == "") {
    alert("Please enter video tutorial url");
    return;
  }
  obj.url = url;
  return obj;
}

function saveVideoTutorial() {
  var obj = validateAndReturnVideoTutorialInfo();
  if (obj == undefined) {
    return;
  }
  $.ajax({
    url: protocol + "//" + host + "/video-tutorial",
    type: "POST",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      $("#divSuperAdminAddNewVideoURL").modal("hide");
    }
  });

}

function editVideoTutorial() {
  var obj = validateAndReturnVideoTutorialInfo();
  if (obj == undefined) {
    return;
  }
  obj.videotutorialId = $("#btnNewVideoTutorialSave").attr("videotutorialId")
  $.ajax({
    url: protocol + "//" + host + "/video-tutorial",
    type: "PUT",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      $("#divSuperAdminAddNewVideoURL").modal("hide");
    }
  });

}

function showAddNewVideoTutorialPage(obj) {
  $("#divSuperAdminAddNewVideoURL").modal("show");
  if (obj != undefined) {
    populateAddNewVideoTutorialForm();
  }

}

function populateAddNewVideoTutorialForm(obj) {
  $("#txtVideoTutorialName").val(obj.name);
  $("#txtVideoTutorialDescription").val(obj.description);
  $("#txtVideoTutorialURL").val(obj.url);
  $("#btnNewVideoTutorialSave").attr("videotutorialId", obj.videotutorialId);

}
