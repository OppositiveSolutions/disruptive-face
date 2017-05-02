function loadExamMasterPage(isShow) {
	$.get("superadmin/exammaster.html" + postUrl, {
		"_" : $.now()
	}, function(data) {
		$("#pageContainer").append(data);
		if (isShow) {
			showExamMasterPage();
		}
		$("#btnAddNewExamMasterExam").click(function() {
			$("#divAddNewExamMasterPage").modal("show");
		});
		$("#divAddNewCategoryPage").on("shown.bs.modal", function() {

		});
		$("a[href='#divExamMasterCategoryTab']").click(function() {
			getCategoryForExam();
		});
		$("#btnExamMasterExamDetailsNext").click(function() {
			saveExamMasterExamDetails(function(obj) {
				getCategoryForExam();
				var questionPaperId = obj.data.questionPaperId;
				$("#btnExamMasterCategoryDetailsNext").attr("questionPaperId", questionPaperId);
				$("a[href='#divExamMasterCategoryTab']").tab("show");
			});
		});
		$("#btnExamMasterCategoryDetailsNext").click(function() {
			var questionPaperId = $("#btnExamMasterCategoryDetailsNext").attr("questionPaperId");
			saveExamMasterCategorytails(questionPaperId, function(list) {
				createSubCategoryDetailsForEachCategory(list);
				$("a[href='#divExamMasterSubCategoryTab']").tab("show");
			});
		});
		$("#btnExamMasterSubCategoryDetailsNext").click(function() {
			saveExamMasterSubCategorytails(function(list) {
				$("a[href='#divExamMasterSubCategoryTab']").tab("show");
			});
		});

	});
}

function saveExamMasterExamDetails(callBack) {
	var obj = validateAndReturnExamMasteExamDetails();
	if (obj == undefined) {
		return;
	}
	$.ajax({
		url : protocol + "//" + host + "/question-paper",
		type : "POST",
		cache : false,
		data : JSON.stringify(obj),
		contentType : "application/json; charset=utf-8",
		success : function(returnMap) {
			if (callBack != undefined) {
				callBack(returnMap);
			}
		}
	});

}

function validateAndReturnExamMasteExamDetails() {
	var obj = {};
	var examCode = $("#txtExamMasterExamCode").val();
	if (examCode == "") {
		alert("Please enter a exam code");
		return;
	}
	obj.examCode = examCode;
	var courseName = $("#txtExamMasterCourseName").val();
	if (courseName == "") {
		alert("Please enter a course name");
		return;
	}
	obj.isDemo = false;
	obj.courseName = courseName;
	obj.name = courseName;
	var examDurationHours = $("#txtExamMasterExamDurationHours").val();
	var examDurationMinutes = $("#txtExamMasterExamDurationMinutes").val();
	if (examDurationHours == "") {
		alert("Please enter exam duration");
		return;
	}
	obj.duration = examDurationHours;
	var noOfQuestions = $("#txtExamMasterTotalNoOfQuestions").val();
	if (noOfQuestions == "") {
		alert("Please enter no. of questions");
		return;
	}
	obj.noOfQuestions = noOfQuestions;
	var noOfOptions = $("#txtExamMasterTotalNoOfOptions").val();
	if (noOfOptions == "") {
		alert("Please enter no. of options");
		return;
	}
	obj.noOfOptions = noOfOptions;
	return obj;
}

function getCategoryForExam() {
	$.ajax({
		url : protocol + "//" + host + "/category",
		type : "GET",
		cache : false,
		success : function(obj) {
			var list = obj.data;
			populateCategoryForExam(list);
		}
	});
}

function populateCategoryForExam(list) {
	var tbody = $("#tblCategoryForExam tbody")[0];
	$(tbody).empty();
	for (var i = 0; i < list.length; i++) {
		var tr = $("<tr>");
		var tdForName = $("<td>");
		var label = $("<label>").addClass("radio-inline");
		var inputCheckbox = $("<input>").attr("type", "checkbox").val(list[i].categoryId).attr("name", list[i].name);
		$(label).append(inputCheckbox);
		$(label).append(list[i].name);
		$(tdForName).append(label);
		$(tr).append(tdForName);
		var inputForQuestion = $("<input>").addClass("form-control input-sm noOfQuestion");
		var tdForQuestion = $("<td>");
		$(tdForQuestion).append(inputForQuestion);
		$(tr).append(tdForQuestion);

		var inputForOption = $("<input>").addClass("form-control input-sm noOfSubcategory");
		var tdForOption = $("<td>");
		$(tdForOption).append(inputForOption);
		$(tr).append(tdForOption);

		var inputForRightAnswer = $("<input>").addClass("form-control input-sm weightage");
		var tdForRightAnswer = $("<td>");
		$(tdForRightAnswer).append(inputForRightAnswer);
		$(tr).append(tdForRightAnswer);

		var inputForNegativeMark = $("<input>").addClass("form-control input-sm negativeMark");
		var tdForNegativeMark = $("<td>");
		$(tdForNegativeMark).append(inputForNegativeMark);
		$(tr).append(tdForNegativeMark);

		$(tbody).append(tr);
	}

}

function saveExamMasterCategorytails(questionPaperId, callBack) {
	var obj = validateAndReturnExamMasterCategoryDetails(questionPaperId);
	if (obj == undefined) {
		return;
	}
	$.ajax({
		url : protocol + "//" + host + "/question-paper/category",
		type : "POST",
		cache : false,
		data : JSON.stringify(obj),
		contentType : "application/json; charset=utf-8",
		success : function(returnMap) {
			if (callBack != undefined) {
				callBack(returnMap.data);
			}
		}
	});

}

function validateAndReturnExamMasterCategoryDetails(questionPaperId) {
	var shouldReturn = false;
	var list = [];
	$("#tblCategoryForExam tbody").find("input:checkbox:checked").each(function() {
		var obj = {};
		var categoryId = $(this).val();
		var name = $(this).attr("name");
		var tr = $(this).closest("tr")[0];
		var noOfQuestions = $(tr).find("input:text.noOfQuestion").val();
		if (noOfQuestions == "") {
			alert("Please enter no. of questions");
			shouldReturn = true;
			return false;
		}
		var noOfSubCategory = $(tr).find("input:text.noOfSubcategory").val();
		if (noOfSubCategory == "") {
			alert("Please enter no. of sub categories");
			shouldReturn = true;
			return false;
		}
		var correctAnswerMark = $(tr).find("input:text.weightage").val();
		if (correctAnswerMark == "") {
			alert("Please enter right answer mark");
			shouldReturn = true;
			return false;
		}
		var negativeMark = $(tr).find("input:text.negativeMark").val();
		if (negativeMark == "") {
			alert("Please enter minus mark");
			shouldReturn = true;
			return false;
		}
		obj.category = {};
		obj.questionPaperId = questionPaperId;
		obj.category.categoryId = categoryId;
		obj.category.name = name;
		obj.noOfQuestions = noOfQuestions;
		obj.noOfSubCategory = noOfSubCategory;
		obj.correctAnswerMark = correctAnswerMark;
		obj.negativeMark = negativeMark;
		list.push(obj);

	});
	if (shouldReturn) {
		return;
	}
	return list;

}

function getExamMasterExams() {
	$.ajax({
		url : protocol + "//" + host + "/question-paper",
		type : "GET",
		cache : false,
		success : function(obj) {
			var list = obj.data;
			populateExamMasterExams(list);
		}
	});
}

function populateExamMasterExams(list) {
	var tbody = $("#tblExamMaster tbody")[0];
	$(tbody).empty();
	for (var i = 0; i < list.length; i++) {
		var tr = $("<tr>");
		$("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
		$(tr).data("obj", list[i]);
		var tdForExamCode = $("<td>");
		$(tdForExamCode).append(list[i].examCode);
		$(tr).append(tdForExamCode);

		var tdForCourseName = $("<td>");
		$(tdForCourseName).append(list[i].courseName);
		$(tr).append(tdForCourseName);

		var tdForTotalNoofQuestions = $("<td>");
		$(tdForTotalNoofQuestions).append(list[i].noOfQuestions);
		$(tr).append(tdForTotalNoofQuestions);

		var tdForCreatedDate = $("<td>");
		$(tdForCreatedDate).append(list[i].createdDate);
		$(tr).append(tdForCreatedDate);

		var tdForModifiedDate = $("<td>");
		$(tdForModifiedDate).append(list[i].lastModified);
		$(tr).append(tdForModifiedDate);

		var settingsGear = createSettingsGearDiv();
		$(settingsGear).removeClass("pull-right");
		var tdForSettings = $("<td>").html(settingsGear);
		$(tr).append(tdForSettings);
		appendLiForExamSettings(settingsGear, list[i]);
		$(tbody).append(tr);
	}
}

function appendLiForExamSettings(div) {
	var ul = $(div).find("ul")[0];
	$(ul).empty();
	var liForEdit = createAndReturnLiForSettingsGear("Edit Exam Details");
	$(ul).append(liForEdit);
	$(liForEdit).click(function() {
		var obj = $(this).closest("tr").data("obj");
	});
	var liForSetQuestions = createAndReturnLiForSettingsGear("Set Question Paper");
	$(ul).append(liForSetQuestions);
	$(liForSetQuestions).click(function() {
		var obj = $(this).closest("tr").data("obj");
	});

	var liForManageSolution = createAndReturnLiForSettingsGear("Manage Solution");
	$(ul).append(liForManageSolution);
	$(liForManageSolution).click(function() {
		var obj = $(this).closest("tr").data("obj");
	});

	var liForDelete = createAndReturnLiForSettingsGear("Delete");
	$(ul).append(liForDelete);
	$(liForDelete).click(function() {
		var obj = $(this).closest("tr").data("obj");
	});
}

function createAndReturnPanelDiv(panelTitle) {
	var divPanel = $("<div>").addClass("panel panel-default");
	var divPanelTitle = $("<div>").addClass("panel-heading");
	var h3 = $("<h3>").html(panelTitle).addClass("panel-title");
	$(divPanel).append(divPanelTitle);
	$(divPanelTitle).append(h3);
	var divPanelBody = $("<div>").addClass("panel-body");
	$(divPanel).append(divPanelBody);
	return divPanel;

}

function createAndReturnFieldSet(index) {
	var fieldSet = $("<fieldset>");
	var legend = $("<legend>").html("Sub category " + index);
	$(fieldSet).append(legend);
	var divFormGroup = $("<div>").addClass("form-group");
	var labelSubCategoryName = $("<label>").html("Sub category name");
	var inputCategoryName = $("<input>").addClass("input-sm form-control");
	$(divFormGroup).append(labelSubCategoryName);
	$(divFormGroup).append(inputCategoryName);
	$(fieldSet).append(divFormGroup);
	return fieldSet;
}

function createAndReturnSubCategoryDetailsDiv(panelBody, index) {
	var divFormGroup = $("<div>").addClass("form-group");
	var labelSubCategoryName = $("<label>").html("Subcategory name");
	var inputCategoryName = $("<input>").attr("type", "text").addClass("input-sm form-control subcategoryName");
	$(inputCategoryName).val("Subcategory " + index);
	$(divFormGroup).append(labelSubCategoryName);
	$(divFormGroup).append(inputCategoryName);
	$(panelBody).append(divFormGroup);

	var divFormGroupForDescription = $("<div>").addClass("form-group");
	var labelSubCategoryDescription = $("<label>").html("Description");
	var inputDescription = $("<input>").attr("type", "text").addClass("input-sm form-control description");
	$(divFormGroupForDescription).append(labelSubCategoryDescription);
	$(divFormGroupForDescription).append(inputDescription);
	$(panelBody).append(divFormGroupForDescription);

	var divFormGroupNoOfQuestion = $("<div>").addClass("form-group");
	var labelSubCategoryNoOfQuestion = $("<label>").html("No. of Questions");
	var inputNoOfQuestion = $("<input>").attr("type", "text").addClass("input-sm form-control noOfQuestions");
	$(divFormGroupNoOfQuestion).append(labelSubCategoryNoOfQuestion);
	$(divFormGroupNoOfQuestion).append(inputNoOfQuestion);
	$(panelBody).append(divFormGroupNoOfQuestion);

	return panelBody;
}

function createSubCategoryDetailsForEachCategory(list) {
	$("#divSubCategoryDetailsContainer").empty();
	for (var i = 0; i < list.length; ++i) {
		var divPanel = createAndReturnPanelDiv(list[i].category.name);
		var panelBody = $(divPanel).find("div.panel-body")[0];
		var noOfSubCategories = list[i].noOfSubCategory;
		for (var j = 0; j < noOfSubCategories; ++j) {
			var panelForSubCategory = createAndReturnPanelDiv();
			$(panelForSubCategory).attr("questionPaperCategoryId", list[i].questionPaperCategoryId);
			$(panelForSubCategory).find("div.panel-heading").remove();
			$(panelBody).append(panelForSubCategory);
			var label = $("<label>").html("Sub category " + parseInt(j + 1));
			$(panelForSubCategory).find("div.panel-body").append(label);
			createAndReturnSubCategoryDetailsDiv($(panelForSubCategory).find("div.panel-body"), parseInt(j + 1));
		}
		$("#divSubCategoryDetailsContainer").append(divPanel);

	}
}

function validateAndReturnSubcategoryDetails() {
	var list = [];
	var shouldReturn = false;
	$("#divSubCategoryDetailsContainer").find("*[questionPaperCategoryId]").each(function() {
		var obj = {};
		var description = $(this).find("input:text.description").val();
		var noOfQuestions = $(this).find("input:text.noOfQuestions").val();
		var name = $(this).find("input:text.subcategoryName").val();
		var questionPaperCategoryId = $(this).attr("questionPaperCategoryId");
		obj.description = description;
		obj.noOfQuestions = noOfQuestions;
		obj.name = name;
		if (obj.noOfQuestions == "") {
			alert("Please enter no of questions");
			shouldReturn = true;
			return false;
		}
		list.push(obj);
	});
	if (shouldReturn) {
		return;
	}
	return list;
}

function saveExamMasterSubCategorytails(callBack) {
	var obj = validateAndReturnSubcategoryDetails();
	if (obj == undefined) {
		return;
	}
	$.ajax({
		url : protocol + "//" + host + "/question-paper/sub-category",
		type : "POST",
		cache : false,
		data : JSON.stringify(obj),
		contentType : "application/json; charset=utf-8",
		success : function(returnMap) {
			if (callBack != undefined) {
				callBack(returnMap.data);
			}
		}
	});

}
