function loadTestimonialPage(isShow) {
  $.get("superadmin/testimonial.html" + postUrl, {
    "_": $.now()
  }, function (data) {
    $("#pageContainer").append(data);
    if (isShow) {
      showTestimonialPage();
    }
    $("#btnAddNewTestimonial").click(function () {
      $("#divSuperAdminAddNewTestimonial").modal("show");
      $("#btnNewTestimonialSave").attr("type", "add");
    });
    $("#divSuperAdminAddNewTestimonial").on("shown.bs.modal", function () {

    });
    $("#divAddNewStudentDetailsPage").on("hidden.bs.modal", function () {
      $("#btnStudentDetailsSave").removeAttr("type");
    });
    $("#btnNewTestimonialSave").click(function () {
      var type = $(this).attr("type");
      if (type == "edit") {
        editTestimonials();
      } else {
        saveTestimonials();
      }
    });
  });
}

function validateAndReturnTestimonialInfo() {
  var obj = {};
  var name = $("#testimonialName").val();
  if (name == "") {
    alert("Please enter a name");
    return;
  }
  obj.name = name;
  var phnNo = $("#testimonialContact").val();
  if (phnNo == "") {
    alert("Please enter contact information");
    return;
  }
  obj.contact = phnNo;
  var description = $("#testimonialDescription").val();
  if (description == "") {
    alert("Please enter testimonial description");
    return;
  }
  obj.description = description;
  var content = $("#testimonialContent").val();
  if (content == "") {
    alert("Please enter testimonial content");
    return;
  }
  obj.content = content;
  var formdata = new FormData();
  var file = $("#testimonialPhotoUpload")[0].files[0];
  formdata.append("file", file);
  formdata.append("testimonial", JSON.stringify(obj));
  return formdata;

}

function saveTestimonials() {
  var formdata = validateAndReturnTestimonialInfo();
  if (formdata == undefined) {
    return;
  }
  $.ajax({
    url: protocol + "//" + host + "/testimonial",
    type: "POST",
    processData: false,
    contentType: false,
    cache: false,
    data: formdata,
    success: function (obj) {
      $("#divSuperAdminAddNewTestimonial").modal("hide");
      getTestimonials();
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
    success: function (obj) {
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
    success: function (obj) {
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
    success: function (obj) {
      getTestimonials();
    }
  });
}

function populateTestimonials(list) {
  var tbody = $("#tblTestimonial tbody")[0];
  $(tbody).empty();
  destroyDataTable("tblTestimonial");
  for (var i = 0; i < list.length; i++) {
    var tr = $("<tr>");
    $("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
    $(tr).data("obj", list[i]);
    var tdForName = $("<td>");
    $(tdForName).append(list[i].name);
    $(tr).append(tdForName);
    var tdForDescription = $("<td>");
    $(tdForDescription).append(list[i].description);
    $(tr).append(tdForDescription);
    var tdForContact = $("<td>");
    $(tdForContact).append(list[i].contact);
    $(tr).append(tdForContact);
    var tdForContent = $("<td>");
    $(tdForContent).append(list[i].content);
    $(tr).append(tdForContent);
    var tdForimg = $("<td>");
    var imgForTd = $("<img>").attr("src", protocol + "//" + host + "/testimonial/" + list[i].testimonialId + "/image");
    $(imgForTd).attr("width", "100px");
    $(tdForimg).append(imgForTd);
    $(tr).append(tdForimg);
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
  $(liForEdit).click(function () {
    var obj = $(this).closest("tr").data("obj");
    showTestimonialAddForm(obj);
  });
  var liForDelete = createAndReturnLiForSettingsGear("Delete");
  $(ul).append(liForDelete);
  $(liForDelete).click(function () {
    var obj = $(this).closest("tr").data("obj");
    deleteTestimonial(obj.testimonialId);
  });
}

function showTestimonialAddForm(obj) {
  $("#divSuperAdminAddNewTestimonial").modal("show");
  if (obj != undefined) {
    $("#btnNewTestimonialSave").attr("type", "edit");
    populateTestimonialAddForm(obj);
  }
}

function populateTestimonialAddForm(obj) {
  $("#txtTestimonial").val(obj.content);
  $("#btnNewTestimonialSave").attr("testimonialId", obj.testimonialId);
  $("#btnNewTestimonialSave").attr("type", "edit");
}
