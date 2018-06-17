function loadExamMasterPage(isShow) {
	$.get("superadmin/exammaster.html" + postUrl, {
		"_": $.now()
	}, function(data) {
		$("#pageContainer").append(data);
		if (isShow) {
			showExamMasterPage();
		}
		makeNumericTextBox($("#divAddNewExamMasterPage")[0]);
		$("#btnAddNewExamMasterExam").click(function() {
			$("#divAddNewExamMasterPage").modal("show");
		});
		$("#divAddNewCategoryPage").on("shown.bs.modal", function() {
			$("#thExamMasterCategoryDuration").hide();
		});
		$("#divAddNewExamMasterPage").on("hidden.bs.modal", function() {
			$("#btnExamMasterExamDetailsNext").removeData("isNextClicked");
			$("#btnExamMasterCategoryDetailsNext").removeData("isNextClicked");
			clearExamMasterPage();
		});
		$("a[href='#divExamMasterCategoryTab']").click(function() {
			return;
			var editMode = $("#btnExamMasterExamDetailsNext").attr("editMode");
			var object = $("#btnExamMasterExamDetailsNext").data("obj");
			var isNextClicked = $("#btnExamMasterExamDetailsNext").data("isNextClicked");
			if (isNextClicked == "1") {
				$("a[href='#divExamMasterCategoryTab']").tab("show");
				return;
			}

			if (editMode == "1") {
				editExamMasterExamDetails(function(obj) {
					getCategoryForExam(function() {
						populateExamCategoriesForEdit(object);
					});
					var questionPaperId = obj.data.questionPaperId;
					$("a[href='#divExamMasterCategoryTab']").tab("show");
					$("#btnExamMasterExamDetailsNext").data("isNextClicked", "1");
				});
			} else {
				saveExamMasterExamDetails(function(obj) {
					getCategoryForExam(function() {

					});
					var questionPaperId = obj.data.questionPaperId;
					$("#btnExamMasterCategoryDetailsNext").attr("questionPaperId", questionPaperId);
					$("a[href='#divExamMasterCategoryTab']").tab("show");
					$("#btnExamMasterExamDetailsNext").data("isNextClicked", "1");
				});
			}
		});
		$("#btnExamMasterExamDetailsNext").click(function() {
			var editMode = $(this).attr("editMode");
			var object = $(this).data("obj");
			var isNextClicked = $(this).data("isNextClicked");
			if (isNextClicked == "1") {
				$("a[href='#divExamMasterCategoryTab']").tab("show");
				return;
			}

			if (editMode == "1") {
				editExamMasterExamDetails(function(obj) {
					getCategoryForExam(function() {
						populateExamCategoriesForEdit(object);
					});
					var questionPaperId = obj.data.questionPaperId;
					$("a[href='#divExamMasterCategoryTab']").tab("show");
					$("#btnExamMasterExamDetailsNext").data("isNextClicked", "1");
				});
			} else {
				saveExamMasterExamDetails(function(obj) {
					getCategoryForExam(function() {

					});
					var questionPaperId = obj.data.questionPaperId;
					$("#btnExamMasterCategoryDetailsNext").attr("questionPaperId", questionPaperId);
					$("a[href='#divExamMasterCategoryTab']").tab("show");
					$("#btnExamMasterExamDetailsNext").data("isNextClicked", "1");
				});
			}

		});

		$("#btnExamMasterCategoryDetailsBack").click(function() {
			$("a[href='#divExamMasterExamDetailsTab']").tab("show");
		});
		$("#btnExamMasterSubCategoryDetailsBack").click(function() {
			$("a[href='#divExamMasterCategoryTab']").tab("show");
		});
		$("#btnExamMasterCategoryDetailsNext").click(function() {
			var isNextClicked = $(this).data("isNextClicked");
			// if (isNextClicked == "1") {
			// 	$("a[href='#divExamMasterSubCategoryTab']").tab("show");
			// 	return;
			// }
			$(this).data("isNextClicked", "1");
			var editMode = $(this).attr("editMode");
			if (editMode == 1) {
				var questionPaperId = $("#btnExamMasterCategoryDetailsNext").attr("questionPaperId");
				editExamMasterCategorytails(questionPaperId, function(list) {
					createSubCategoryDetailsForEachCategory(list);
					$("a[href='#divExamMasterSubCategoryTab']").tab("show");
				});
			} else {
				var questionPaperId = $("#btnExamMasterCategoryDetailsNext").attr("questionPaperId");
				saveExamMasterCategorytails(questionPaperId, function(list) {
					createSubCategoryDetailsForEachCategory(list);
					$("a[href='#divExamMasterSubCategoryTab']").tab("show");
				});
			}
		});
		$("#btnExamMasterSubCategoryDetailsNext").click(function() {
			saveExamMasterSubCategorytails(function(list) {
				$("#divAddNewExamMasterPage").modal("hide");
				getExamMasterExams();
			});
		});
		$("#sltExamMasterCoachingType").change(function() {
			var coachingType = $(this).val();
			getExamMasterExams(coachingType);
		})

	});
}

function clearExamMasterPage() {
	$("#divAddNewExamMasterPage").find("input:text").val("");
	$("#tblCategoryForExam tbody").empty();
	$("#divSubCategoryDetailsContainer").empty();
	$("#btnExamMasterExamDetailsNext").removeAttr("editMode");
	$("a[href='#divExamMasterExamDetailsTab']").tab("show");
}

function saveExamMasterExamDetails(callBack) {
	var obj = validateAndReturnExamMasteExamDetails();
	if (obj == undefined) {
		return;
	}
	$.ajax({
		url: protocol + "//" + host + "/question-paper",
		type: "POST",
		cache: false,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(returnMap) {
			if (callBack != undefined) {
				callBack(returnMap);
			}
		}
	});

}

function editExamMasterExamDetails(callBack) {
	var obj = validateAndReturnExamMasteExamDetails();
	if (obj == undefined) {
		return;
	}
	obj.questionPaperId = $("#btnExamMasterExamDetailsNext").attr("questionPaperId");
	obj.question_paper_id = $("#btnExamMasterExamDetailsNext").attr("questionPaperId");
	obj.questionPaperId = parseInt(obj.questionPaperId);
	$.ajax({
		url: protocol + "//" + host + "/question-paper",
		type: "PUT",
		cache: false,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(returnMap) {
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
	var testType = $("#sltExamMasterTestType").val();
	obj.isDemo = false;
	if (testType == 0) {
		obj.isDemo = true;
	}
	obj.courseName = courseName;
	obj.name = courseName;
	var examDurationHours = $("#txtExamMasterExamDurationHours").val();
	var examDurationMinutes = $("#txtExamMasterExamDurationMinutes").val();
	var coachingType = $("#sltExamMasterAddNewCoachingType").val();
	var durationType = $("#sltExamMasterType").val();
	if (durationType == 1) {
		obj.isElastic = "1"
	} else {
		obj.isElastic = "0";
	}
	obj.durationType = durationType;
	obj.coachingType = coachingType;
	if (examDurationHours == "" && examDurationMinutes == "") {
		alert("Please enter exam duration");
		return;
	}
	if (examDurationHours == "") {
		examDurationHours = 0;
	}
	if (examDurationMinutes == "") {
		examDurationMinutes = 0;
	}
	examDurationHours = parseInt(examDurationHours);
	examDurationMinutes = parseInt(examDurationMinutes);
	if (examDurationHours > 24) {
		alert("Please enter the valid hours");
		return;
	}
	if (examDurationMinutes > 60) {
		alert("Please enter the valid minutes");
		return;
	}
	console.info(examDurationHours);
	console.info(examDurationMinutes);
	examDurationHours = examDurationHours * 60;
	examDurationHours = examDurationHours + examDurationMinutes;
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
	obj = trimValuesInObject(obj);
	return obj;
}

function getCategoryForExam(callBack) {
	$.ajax({
		url: protocol + "//" + host + "/category",
		type: "GET",
		cache: false,
		success: function(obj) {
			var list = obj.data;
			populateCategoryForExam(list);
			if (callBack != undefined) {
				callBack();
			}
		}
	});
}

function populateCategoryForExam(list) {
	var examMasterType = $("#sltExamMasterType").val();
	if (examMasterType == 1) {
		$("#thExamMasterCategoryDuration").hide();
	} else {
		$("#thExamMasterCategoryDuration").show();
	}
	var tbody = $("#tblCategoryForExam tbody")[0];
	$(tbody).empty();
	for (var i = 0; i < list.length; i++) {
		var tr = $("<tr>").data("obj", list[i]);
		var tdForName = $("<td>");
		var label = $("<label>").addClass("radio-inline");
		var inputCheckbox = $("<input>").attr("type", "checkbox").val(list[i].categoryId).attr("name", list[i].name);
		$(label).append(inputCheckbox);
		$(label).append(list[i].name);
		$(tdForName).append(label);
		$(tr).append(tdForName);

		var inputOrder = $("<input>").addClass("form-control input-sm order numberOnly");
		var tdOrder = $("<td>");
		$(tdOrder).append(inputOrder);
		$(tr).append(tdOrder);

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

		var inputDuration = $("<input>").addClass("form-control input-sm categoryDuration").attr("placeholder", "Minutes");
		var tdForDuration = $("<td>");
		$(tdForDuration).append(inputDuration);
		if (examMasterType != 1) {
			$(tr).append(tdForDuration);
		}

		$(tbody).append(tr);
	}
	makeNumericTextBox($("#divAddNewExamMasterPage")[0], true);

}

function saveExamMasterCategorytails(questionPaperId, callBack) {
	var obj = validateAndReturnExamMasterCategoryDetails(questionPaperId);
	if (obj == undefined) {
		return;
	}
	$.ajax({
		url: protocol + "//" + host + "/question-paper/category",
		type: "POST",
		cache: false,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(returnMap) {
			if (callBack != undefined) {
				callBack(returnMap.data);
			}
		}
	});

}

function editExamMasterCategorytails(questionPaperId, callBack) {
	if (!questionPaperId) {
		questionPaperId = $("#divAddNewExamMasterPage").attr("questionPaperId");
	}
	var obj = validateAndReturnExamMasterCategoryDetails(questionPaperId);
	if (obj == undefined) {
		return;
	}
	$.ajax({
		url: protocol + "//" + host + "/question-paper/" + questionPaperId + "/category",
		type: "PUT",
		cache: false,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(returnMap) {
			if (callBack != undefined) {
				callBack(returnMap.data);
			}
		}
	});

}

function validateAndReturnExamMasterCategoryDetails(questionPaperId) {
	var shouldReturn = false;
	var list = [];
	var totalDurationOfCategories = 0;
	var examMasterType = $("#sltExamMasterType").val();
	var totalQuestions = $("#txtExamMasterTotalNoOfQuestions").val();
	var totalCategroyQuestions = 0;
	var prevOrder = "";
	$("#tblCategoryForExam tbody").find("input:checkbox:checked").each(function() {
		var obj = {};
		var categoryId = $(this).val();
		var name = $(this).attr("name");
		var tr = $(this).closest("tr")[0];
		var questionPaperCategoryId = $(tr).attr("questionPaperCategoryId");

		var order = $(tr).find("input:text.order").val();
		if (order == "") {
			alert("Please enter the order");
			shouldReturn = true;
			return false;
		}
		if (prevOrder == order) {
			alert("You can't give same order for different category");
			shouldReturn = true;
			return false;
		}
		prevOrder = order;

		var noOfQuestions = $(tr).find("input:text.noOfQuestion").val();
		if (noOfQuestions == "") {
			alert("Please enter no. of questions");
			shouldReturn = true;
			return false;
		}
		totalCategroyQuestions = totalCategroyQuestions + parseInt(noOfQuestions);
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
		if (examMasterType != 1) {
			var duration = $(tr).find("input:text.categoryDuration").val();
			if (duration == "" || parseInt(duration) == 0) {
				alert("Please enter duration");
				shouldReturn = true;
				return false;
			}
			duration = parseInt(duration)
			totalDurationOfCategories = totalDurationOfCategories + duration
			obj.duration = duration;
		}



		obj.questionPaperId = questionPaperId;
		obj.questionPaperCategoryId = questionPaperCategoryId;
		obj.category.categoryId = categoryId;
		obj.category.name = name;
		obj.order = order;
		obj.noOfQuestions = noOfQuestions;
		obj.noOfSubCategory = noOfSubCategory;
		obj.correctAnswerMark = correctAnswerMark;
		obj.negativeMark = negativeMark;
		obj = trimValuesInObject(obj);
		list.push(obj);

	});
	if (list.length == 0 && !shouldReturn) {
		alert("Please select a category");
		shouldReturn = true;
	}
	var examDurationHours = $("#txtExamMasterExamDurationHours").val();
	var examDurationMinutes = $("#txtExamMasterExamDurationMinutes").val();
	if (examDurationHours == "") {
		examDurationHours = 0;
	}
	if (examDurationMinutes == "") {
		examDurationMinutes = 0;
	}
	examDurationHours = parseInt(examDurationHours);
	examDurationMinutes = parseInt(examDurationMinutes);
	examDurationHours = examDurationHours * 60;
	examDurationHours = examDurationHours + examDurationMinutes;
	console.info(examDurationHours);
	console.info(totalDurationOfCategories)
	if (examMasterType != 1) {
		if (totalDurationOfCategories != examDurationHours) {
			alert("Exam duration and total of category duration doesn't match");
			shouldReturn = true;
		}
	}
	if (shouldReturn) {
		return;
	}
	if (parseInt(totalQuestions) != totalCategroyQuestions) {
		alert("Total no. of questions and total category questions doesn't match");
		shouldReturn = true;
	}
	if (shouldReturn) {
		return;
	}
	return list;

}

function getExamMasterExams(coachingType) {
	if (coachingType == undefined) {
		coachingType = 0;
	}
	$.ajax({
		url: protocol + "//" + host + "/question-paper/all?coachingType=" + coachingType,
		type: "GET",
		cache: false,
		success: function(obj) {
			var list = obj.data;
			populateExamMasterExams(list);
		}
	});
}

function populateExamMasterExams(list) {
	var tbody = $("#tblExamMaster tbody")[0];
	$(tbody).empty();
	destroyDataTable("tblExamMaster");
	for (var i = 0; i < list.length; i++) {
		var tr = $("<tr>");
		$("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
		$(tr).data("obj", list[i]);
		$(tr).attr("questionId", list[i].questionPaperId)
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

		var tdForStatus = $("<td>");
		var status = "";
		if (list[i].status == "0") {
			status = "Created";
		} else if (list[i].status == "1") {
			status = "Enabled";
		} else if (list[i].status == "2") {
			status = "Disabled";
		} else if (list[i].status == "3") {
			status = "Deleted";
		}
		var demo = "";
		if (list[i].isDemo) {
			demo = "Demo";
		} else {
			demo = "Regular";
		}
		$(tdForStatus).append(status);
		$(tdForStatus).append("<br/>" + demo);
		$(tr).append(tdForStatus);

		var settingsGear = createSettingsGearDiv();
		$(settingsGear).removeClass("pull-right");
		var tdForSettings = $("<td>").html(settingsGear);
		$(tr).append(tdForSettings);
		appendLiForExamSettings(settingsGear, list[i]);
		$(tbody).append(tr);
	}
	initializeDataTable("tblExamMaster");
}

function appendLiForExamSettings(div, obj) {
	var ul = $(div).find("ul")[0];
	$(ul).empty();
	var liForEdit = createAndReturnLiForSettingsGear("Edit Exam Details");
	$(ul).append(liForEdit);
	$(liForEdit).unbind("click");
	$(liForEdit).click(function() {
		var obj = $(this).closest("tr").data("obj");
		populateExamMasterExamForm(obj);
	});
	var liForSetQuestions = createAndReturnLiForSettingsGear("Set Question Paper");
	$(ul).append(liForSetQuestions);
	$(liForSetQuestions).click(function() {
		var obj = $(this).closest("tr").data("obj");
		var questionId = $(this).closest("tr").attr("questionId");
		showMakeQuestionPage(obj, questionId);
	});

	var liForManageSolution = createAndReturnLiForSettingsGear("Manage Solution");
	//$(ul).append(liForManageSolution);
	$(liForManageSolution).click(function() {
		var obj = $(this).closest("tr").data("obj");
	});

	var liForDelete = createAndReturnLiForSettingsGear("Delete");
	$(liForDelete).click(function() {
		var obj = $(this).closest("tr").data("obj");
		var questionPaperId = obj.questionPaperId;
		deleteExamMasterExam(questionPaperId);
	});
	var liForStatus = createAndReturnLiForSettingsGear("Enable");
	var status = "";
	if (obj.status == "0") {
		$(ul).append(liForDelete);
		liForStatus = createAndReturnLiForSettingsGear("Enable");
		$(liForStatus).attr("status", "1");
		$(ul).append(liForStatus);
	} else if (obj.status == "1") {
		liForStatus = createAndReturnLiForSettingsGear("Disable");
		$(liForStatus).attr("status", "2");
		$(ul).append(liForStatus);
	} else if (obj.status == "2") {
		$(ul).append(liForDelete);
		liForStatus = createAndReturnLiForSettingsGear("Enable");
		$(liForStatus).attr("status", "1");
		$(ul).append(liForStatus);
	} else if (obj.status == "3") {
		liForStatus = createAndReturnLiForSettingsGear("Recover");
		$(liForStatus).attr("status", "3");
		$(ul).append(liForStatus);
	}
	console.info("status = " + obj.status)
	$(liForStatus).click(function() {
		var obj = $(this).closest("tr").data("obj");
		var status = $(this).attr("status");
		var questionPaperId = obj.questionPaperId;
		updateExamMasterStatus(questionPaperId, status);
	});

	var liForDemo = createAndReturnLiForSettingsGear("Set as Demo");
	var demo = "";
	if (obj.isDemo == "0") {
		$(ul).append(liForDelete);
		liForDemo = createAndReturnLiForSettingsGear("Set as Demo");
		$(liForDemo).attr("isDemo", "1");
		$(ul).append(liForDemo);
	} else if (obj.isDemo == "1") {
		liForDemo = createAndReturnLiForSettingsGear("Set as Regular");
		$(liForDemo).attr("isDemo", "0");
		$(ul).append(liForDemo);
	}
	console.info("isDemo = " + obj.isDemo)
	$(liForDemo).click(function() {
		var obj = $(this).closest("tr").data("obj");
		var isDemo = $(this).attr("isDemo");
		var questionPaperId = obj.questionPaperId;
		updateExamMasterIsDemo(questionPaperId, isDemo);
	});



}

function showMakeQuestionPage(obj, questionId) {
	if ($("#divSuperAdminMakeQPaperPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/makeqpaper.js' + postUrl, 'tinymce/js/tinymce/tinymce.min.js' + postUrl], function() {
			loadMakeQPaperPage(obj, questionId, true);
		});
		return;
	}
	showPage($("#divSuperAdminMakeQPaperPage")[0]);
	$("#btnAddNewQuestionPaper").unbind("click");
	$("#btnAddNewQuestionPaper").click(function() {
		showQuestionCreateSection();

	});
	initializeSetQPaperPage(obj, questionId);
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

function createAndReturnSubCategoryDetailsDiv(panelBody, index, obj) {
	var description = obj == undefined || obj == null ? "" : obj.description;
	var noOfQuestions = obj == undefined || obj == null ? "" : obj.noOfQuestions

	var divFormGroup = $("<div>").addClass("form-group");
	var labelSubCategoryName = $("<label>").html("Subcategory name");
	var inputCategoryName = $("<input>").attr("type", "text").addClass("input-sm form-control subcategoryName");
	$(inputCategoryName).val("Subcategory " + index);
	$(divFormGroup).append(labelSubCategoryName);
	$(divFormGroup).append(inputCategoryName);
	$(panelBody).append(divFormGroup);

	var divFormGroupForDescription = $("<div>").addClass("form-group");
	var labelSubCategoryDescription = $("<label>").html("Description");
	var inputDescription = $("<input>").attr("type", "text").addClass("input-sm form-control description").val(description);
	$(divFormGroupForDescription).append(labelSubCategoryDescription);
	$(divFormGroupForDescription).append(inputDescription);
	$(panelBody).append(divFormGroupForDescription);

	var divFormGroupNoOfQuestion = $("<div>").addClass("form-group");
	var labelSubCategoryNoOfQuestion = $("<label>").html("No. of Questions");
	var inputNoOfQuestion = $("<input>").attr("type", "text").addClass("input-sm form-control noOfQuestions").val(noOfQuestions);
	$(divFormGroupNoOfQuestion).append(labelSubCategoryNoOfQuestion);
	$(divFormGroupNoOfQuestion).append(inputNoOfQuestion);
	$(panelBody).append(divFormGroupNoOfQuestion);

	return panelBody;
}

function createSubCategoryDetailsForEachCategory(list) {
	$("#divSubCategoryDetailsContainer").empty();
	if (!list) {
		return;
	}
	for (var i = 0; i < list.length; ++i) {

		var divPanel = createAndReturnPanelDiv(list[i].category.name);
		var panelBody = $(divPanel).find("div.panel-body")[0];
		$(panelBody).addClass("category")
		var noOfSubCategories = list[i].noOfSubCategory;
		var divMainRow = $("<div>").addClass("row");
		for (var j = 0; j < noOfSubCategories; ++j) {
			var col = $("<div>").addClass("col-md-6 col-sm-6");
			$(panelBody).append(col);
			var panelForSubCategory = createAndReturnPanelDiv();
			$(panelForSubCategory).attr("questionPaperCategoryId", list[i].questionPaperCategoryId);
			$(panelForSubCategory).attr("noOfQuestions", list[i].noOfQuestions);
			$(panelForSubCategory).find("div.panel-heading").remove();
			$(col).append(panelForSubCategory);
			var label = $("<label>").html("Sub category " + parseInt(j + 1));
			$(panelForSubCategory).find("div.panel-body").append(label);
			createAndReturnSubCategoryDetailsDiv($(panelForSubCategory).find("div.panel-body"), parseInt(j + 1), list[i].questionPaperSubCategorys[j]);
		}
		$("#divSubCategoryDetailsContainer").append(divPanel);

	}
}

function validateAndReturnSubcategoryDetails() {
	var list = [];
	var shouldReturn = false;
	var totalSubCategroyQuestions = 0;
	var previousQuestionPaperCategoryId = 0;
	$("#divSubCategoryDetailsContainer").find("*[questionPaperCategoryId]").each(function() {
		var obj = {};
		var description = $(this).find("input:text.description").val();
		var noOfQuestions = $(this).find("input:text.noOfQuestions").val();
		var name = $(this).find("input:text.subcategoryName").val();
		var questionPaperCategoryId = $(this).attr("questionPaperCategoryId");
		previousQuestionPaperCategoryId = questionPaperCategoryId
		var totalCategoryQuestions = $(this).attr("noOfQuestions");
		obj.description = description;
		obj.noOfQuestions = noOfQuestions;
		obj.name = name;
		obj.order = "0";
		obj.questionPaperCategoryId = questionPaperCategoryId;
		if (obj.noOfQuestions == "") {
			alert("Please enter no of questions");
			shouldReturn = true;
			return false;
		}
		obj = trimValuesInObject(obj);
		list.push(obj);
	});
	if (shouldReturn) {
		return;
	}
	$("#divSubCategoryDetailsContainer").find(".category").each(function() {
		var totalCategoryQuestions = 0;
		var totalSubCategoryQuestions = 0
		$(this).find("*[questionPaperCategoryId]").each(function() {
			totalCategoryQuestions = $(this).attr("noOfQuestions");
			var noOfQuestions = $(this).find("input:text.noOfQuestions").val();
			totalSubCategoryQuestions = totalSubCategoryQuestions + parseInt(noOfQuestions);
		});
		if (parseInt(totalCategoryQuestions) != totalSubCategoryQuestions) {
			alert("Total no. of category questons and total no. of Subcategory questions doesn't match");
			shouldReturn = true;
			return false;
		}
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
		url: protocol + "//" + host + "/question-paper/sub-category",
		type: "POST",
		cache: false,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(returnMap) {
			if (callBack != undefined) {
				callBack(returnMap.data);
			}
		}
	});

}

function deleteExamMasterExam(questionPaperId) {
	$.ajax({
		url: protocol + "//" + host + "/question-paper/" + questionPaperId,
		type: "DELETE",
		cache: false,
		contentType: "application/json; charset=utf-8",
		success: function(returnMap) {
			getExamMasterExams();
			// if (callBack != undefined) {
			// 	callBack(returnMap.data);
			//
			// }
		}
	});
}

function updateExamMasterStatus(questionPaperId, status) {
	$.ajax({
		url: protocol + "//" + host + "/question-paper/" + questionPaperId + "/status/" + status,
		type: "GET",
		cache: false,
		success: function(returnMap) {
			getExamMasterExams();
		}
	});
}

function updateExamMasterIsDemo(questionPaperId, isDemo) {
	$.ajax({
		url: protocol + "//" + host + "/question-paper/" + questionPaperId + "/isdemo/" + isDemo,
		type: "GET",
		cache: false,
		success: function(returnMap) {
			getExamMasterExams();
		}
	});
}

function populateExamMasterExamForm(obj) {
	$("#btnExamMasterExamDetailsNext").data("obj", obj);
	$("#divAddNewExamMasterPage").modal("show");
	$("a[href='#divExamMasterExamDetailsTab']").tab("show");
	$("#btnExamMasterExamDetailsNext").attr("editMode", 1);
	$("#txtExamMasterExamCode").val(obj.examCode);
	$("#txtExamMasterCourseName").val(obj.courseName);
	$("#btnExamMasterExamDetailsNext").attr("questionPaperId", obj.questionPaperId);
	$("#divAddNewExamMasterPage").attr("questionPaperId", obj.questionPaperId);
	obj.duration = parseInt(obj.duration);
	var hours = obj.duration / 60;
	hours = parseInt(hours);
	var hoursInMinutes = hours * 60;
	var minutes = parseInt(obj.duration) - hoursInMinutes;
	$("#txtExamMasterExamDurationHours").val(hours);
	$("#txtExamMasterExamDurationMinutes").val(minutes);
	$("#txtExamMasterTotalNoOfQuestions").val(obj.noOfQuestions);
	$("#txtExamMasterTotalNoOfOptions").val(obj.noOfOptions);
	var testtype = "1"
	if (obj.isDemo) {
		testtype = "0";
	}
	$("#sltExamMasterTestType").val(testtype);
	$("#sltExamMasterAddNewCoachingType").val(obj.coachingType);
	$("#sltExamMasterType").val(obj.durationType);

}

function populateExamCategoriesForEdit(obj) {
	console.info(obj);
	$("#btnExamMasterCategoryDetailsNext").attr("editMode", 1);
	var categories = obj.questionPaperCategorys;
	for (var i = 0; i < categories.length; ++i) {
		var tr = $("#tblCategoryForExam").find("input:checkbox[value=" + categories[i].category.categoryId + "]").closest("tr");
		$("#tblCategoryForExam").find("input:checkbox[value=" + categories[i].category.categoryId + "]").prop("checked", true);
		$(tr).find("input:text.noOfQuestion").val(categories[i].noOfQuestions);
		$(tr).find("input:text.order").val(categories[i].order);
		$(tr).find("input:text.noOfSubcategory").val(categories[i].noOfSubCategory);
		$(tr).find("input:text.weightage").val(categories[i].correctAnswerMark);
		$(tr).find("input:text.negativeMark").val(categories[i].negativeMark);
		$(tr).attr("questionPaperCategoryId", categories[i].questionPaperCategoryId);
	}

}

function getCoachingTypes() {
	$.ajax({
		url: protocol + "//" + host + "/bundle/coachingtypes",
		type: "GET",
		cache: false,
		success: function(obj) {
			populateCoachingTypes(obj.data);
			populateCoachingTypesIPopup(obj.data);
		}
	});
}

function populateCoachingTypes(list) {
	$("#sltExamMasterCoachingType").empty();
	var option = $("<option>").val(0).html("All");
	$("#sltExamMasterCoachingType").append(option);
	for (var i = 0; i < list.length; ++i) {
		var option = $("<option>").val(list[i].coachingTypeId).html(list[i].name);
		$("#sltExamMasterCoachingType").append(option);
	}
}

function populateCoachingTypesIPopup(list) {
	$("#sltExamMasterAddNewCoachingType").empty();
	var option = $("<option>").val(0).html("All");
	//$("#sltExamMasterAddNewCoachingType").append(option);
	for (var i = 0; i < list.length; ++i) {
		var option = $("<option>").val(list[i].coachingTypeId).html(list[i].name);
		$("#sltExamMasterAddNewCoachingType").append(option);
	}
}
