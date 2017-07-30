function loadTestimonialPage(isShow) {
  $.get("superadmin/testimonial.html" + postUrl, {
    "_": $.now()
  }, function(data) {
    $("#pageContainer").append(data);
    if (isShow) {
      showTestimonialPage();
    }
    $("#btnAddNewTestimonial").click(function() {
      $("#divSuperAdminAddNewTestimonial").modal("show");
    });
    $("#divSuperAdminAddNewTestimonial").on("shown.bs.modal", function() {

    });
    $("#divAddNewStudentDetailsPage").on("hidden.bs.modal", function() {
      $("#btnStudentDetailsSave").removeAttr("type");
    });
    $("#btnNewTestimonialSave").click(function() {
      var type = $(this).attr("type");
      if (type == "edit") {
        saveTestimonials();
      } else {
        saveTestimonials();
      }
    });
  });
}

function validateAndReturnTestimonialInfo() {
  var obj = {};
  var content = $("#txtTestimonial").val();
  if (content == "") {
    alert("Please enter testimonial");
    return;
  }
  obj.content = content;
  return obj;
}

function saveTestimonials() {
  var obj = validateAndReturnTestimonialInfo();
  if (obj == undefined) {
    return;
  }
  $.ajax({
    url: protocol + "//" + host + "/testimonial",
    type: "POST",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      console.info(obj);
      getTestimonials();
      $("#divSuperAdminAddNewTestimonial").modal("hide");
    }
  });

}

function editTestimonials() {
  var obj = validateAndReturnTestimonialInfo();
  if (obj == undefined) {
    return;
  }
  var testimonialId = $("#btnNewTestimonialSave").attr("testimonialId");
  obj.testimonialId = testimonialId;
  $.ajax({
    url: protocol + "//" + host + "/testimonial",
    type: "PUT",
    cache: false,
    data: JSON.stringify(obj),
    contentType: "application/json; charset=utf-8",
    success: function(obj) {
      console.info(obj);
      getTestimonials();
      $("#divSuperAdminAddNewTestimonial").modal("hide");
    }
  });

}

function getTestimonials() {
  $.ajax({
    url: protocol + "//" + host + "/testimonial",
    type: "GET",
    cache: false,
    success: function(obj) {
      var list = obj.data;
      populateTestimonials(list);
    }
  });
}

function deleteTestimonial(id) {
  $.ajax({
    url: protocol + "//" + host + "/testimonial/" + id,
    type: "DELETE",
    cache: false,
    success: function(obj) {
      getTestimonials();
    }
  });
}

function populateTestimonials(list) {
  var tbody = $("#tblTestimonial tbody")[0];
  $(tbody).empty();
  console.info(list)
  destroyDataTable("tblTestimonial");
  for (var i = 0; i < list.length; i++) {
    var tr = $("<tr>");
    $("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
    $(tr).data("obj", list[i]);
    var tdForName = $("<td>");
    $(tdForName).append(list[i].content);
    $(tr).append(tdForName);
    var settingsGear = createSettingsGearDiv();
    $(settingsGear).removeClass("pull-right");
    var tdForSettings = $("<td>").html(settingsGear);
    $(tr).append(tdForSettings);
    appendLiForTestimonialSettings(settingsGear, list[i]);
    $(tbody).append(tr);
  }
  initializeDataTable("tblTestimonial")

}

function appendLiForTestimonialSettings(div) {
  var ul = $(div).find("ul")[0];
  $(ul).empty();
  var liForEdit = createAndReturnLiForSettingsGear("Edit");
  $(ul).append(liForEdit);
  $(liForEdit).click(function() {
    var obj = $(this).closest("tr").data("obj");
    showTestimonialAddForm(obj);
  });
  var liForDelete = createAndReturnLiForSettingsGear("Delete");
  $(ul).append(liForDelete);
  $(liForDelete).click(function() {
    var obj = $(this).closest("tr").data("obj");
    deleteTestimonial(obj.testimonialId);
  });
}

function showTestimonialAddForm(obj) {
  $("#divSuperAdminAddNewTestimonial").modal("show");
  if (obj != undefined) {
    ("#btnNewTestimonialSave").attr("type", "edit");
    populateTestimonialAddForm(obj);
  }
}

function populateTestimonialAddForm(obj) {
  $("#txtTestimonial").val(obj.content);
  $("#btnNewTestimonialSave").attr("testimonialId", obj.testimonialId);
}
