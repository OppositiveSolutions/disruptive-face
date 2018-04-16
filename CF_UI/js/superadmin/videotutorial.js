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
      clearAddTutorialModal();
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
function clearAddTutorialModal(){
  $("#txtVideoTutorialName").val("");
  $("#txtVideoTutorialDescription").val("");
  $("#txtVideoTutorialURL").val("");
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
      getVideoTutorials();
      $("#divSuperAdminAddNewVideoURL").modal("hide");
    }
  });

}

function editVideoTutorial() {
  var obj = validateAndReturnVideoTutorialInfo();
  if (obj == undefined) {
    return;
  }
  obj.videoTutorialId = $("#btnNewVideoTutorialSave").attr("videoTutorialId")
  $.ajax({
    url: protocol + "//" + host + "/video-tutorial",
    type: "PUT",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      getVideoTutorials();
      $("#divSuperAdminAddNewVideoURL").modal("hide");
    }
  });

}

function showAddNewVideoTutorialPage(obj) {
  $("#divSuperAdminAddNewVideoURL").modal("show");
  if (obj != undefined) {
    populateAddNewVideoTutorialForm(obj);
  }

}

function populateAddNewVideoTutorialForm(obj) {
  $("#txtVideoTutorialName").val(obj.name);
  $("#txtVideoTutorialDescription").val(obj.description);
  $("#txtVideoTutorialURL").val(obj.url);
  $("#btnNewVideoTutorialSave").attr("videoTutorialId", obj.videoTutorialId);
  $("#btnNewVideoTutorialSave").attr("type", "edit");

}

function getVideoTutorials() {
  $.ajax({
    url: protocol + "//" + host + "/video-tutorial",
    type: "GET",
    cache: false,
    success: function(obj) {
      var list = obj.data;
      populateVideoTutorials(list);
    }
  });
}

function deleteVideoTutorial(id) {
  $.ajax({
    url: protocol + "//" + host + "/video-tutorial/" + id,
    type: "DELETE",
    cache: false,
    success: function(obj) {
      getVideoTutorials();
    }
  });
}

function populateVideoTutorials(list) {
  var tbody = $("#tblVideoTutorials tbody")[0];
  $(tbody).empty();
  console.info(list)
  destroyDataTable("tblVideoTutorials");
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
    appendLiForVideoTutorialSettings(settingsGear, list[i]);
    $(tbody).append(tr);
  }
  initializeDataTable("tblVideoTutorials")

}

function appendLiForVideoTutorialSettings(div) {
  var ul = $(div).find("ul")[0];
  $(ul).empty();
  var liForEdit = createAndReturnLiForSettingsGear("Edit");
  $(ul).append(liForEdit);
  $(liForEdit).click(function() {
    var obj = $(this).closest("tr").data("obj");
    showAddNewVideoTutorialPage(obj);
  });
  var liForDelete = createAndReturnLiForSettingsGear("Delete");
  $(ul).append(liForDelete);
  $(liForDelete).click(function() {
    var obj = $(this).closest("tr").data("obj");
    deleteVideoTutorial(obj.videoTutorialId);
  });
}

function showAddNewCategoryPage(obj) {
  $("#divAddNewCategoryPage").modal("show");
  if (obj != undefined) {
    $("#txtCategoryName").val(obj.name);
    $("#btnAddNewCategorySave").attr("type", "edit");
    $("#btnAddNewCategorySave").attr("categoryId", obj.categoryId);
  }
}
