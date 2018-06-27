function loadMakeQPaperPage(obj, questionId, isShow) {
	$.get("superadmin/makeqpaper.html" + postUrl, {
		"_": $.now()
	}, function (data) {
		$("#pageContainer").append(data);
		if (isShow) {
			showMakeQuestionPage(obj, questionId);
		}
		$("#btnAddNewQuestionPaper").unbind("click");
		$("#btnAddNewQuestionPaper").click(function () {

		});
		$("#btnMakeQuestionPaperQNext").click(function () {
			saveQuestion();
		});
		$("#divAddNewQPaperPage").on('hidden.bs.modal', function () {
			$("#makeQuetionPageBody").find("textarea").each(function () {
				var id = $(this).attr("id");
				tinymce.get(id).remove();
			});

		});
		$("#btnBackToMaster").click(function () {
			$("#divSuperAdminExamMasterPage").show();
			$("#divSuperAdminMakeQPaperPage").hide();
		});
		$("button[href='#imgTab']").click(function () {
			$("#makeQuetionPageBody").find("ul.nav-tabs").find("li").removeClass("active");
		});
		$(document).on("click", "li.questionOptionTab", function () {
			var targetDivId = $(this).find("a[role=tab]").attr("href");
			var idOfTargetTextArea = $(targetDivId).find("textarea").attr("id");
			tinyMCE.get(idOfTargetTextArea).focus();
		});
		tinymce.init({
			selector: '#txtAreaForSubContent',
			height: 250,
			plugins: ["advlist autolink lists charmap print preview ", "searchreplace visualblocks fullscreen", "insertdatetime  table contextmenu paste pramukhime  "],
			toolbar: " undo redo | styleselect | bold italic charmap | alignleft aligncenter alignright alignjustify | bullist numlist | fullscreen  | pramukhime   pramukhimetogglelanguage ",
			content_css: ['//fonts.googleapis.com/css?family=Lato:300,300i,400,400i', '//www.tinymce.com/css/codepen.min.css'],
			// language : 'ml_IN'
		});
		$("#questionImageSubContent").change(function (event) {
			showImagePreview(event.target, "#divAddImgCOntentForMakeQPaper");
		});
		$("#btnAddContentSubCategory").click(function () {
			var subCategoryId = $("#divAddNewSubContentPage").attr("subCategoryId");
			saveSubContent(subCategoryId);
		});
	});
}
function saveSubContent(subCategoryId) {
	var subContent = tinymce.get('txtAreaForSubContent').getContent();
	if (!subContent || subContent.trim() == "") {
		alert("Enter content ");
		return;
	}

	var isEdit = $("#divAddNewSubContentPage").attr("isEdit");
	var formdata = new FormData();
	formdata.append("contents", subContent);
	var hasImage = false;
	if (isEdit == "true") {
		var imageMap = $('#divAddNewSubContentPage').find("div.previewDiv").find("img").data("subImgMap");
		console.info(imageMap);
		if (imageMap) {
			hasImage = true;
			formdata.append("file", b64toBlob(imageMap.image));
		}
	}
	if ($("#questionImageSubContent")[0].files && $("#questionImageSubContent")[0].files[0]) {
		hasImage = true;
		formdata.append("file", $("#questionImageSubContent")[0].files[0]);
	}
	//	formdata.append("isImage", hasImage);
	//	formdata.append("questionPaperSubCategoryId", subCategoryId);
	$.ajax({
		url: protocol + "//" + host + "/question-paper/sub-category/" + subCategoryId + "/content",
		type: "POST",
		cache: false,
		contentType: false,
		processData: false,
		data: formdata,
		success: function (returnMap) {
			$("#divAddNewSubContentPage").modal("hide");
			refreshQuestionPaperPage(function () {

			});
		}
	});
}
function saveQuestion() {
	var subCategoryId = $("#divAddNewQPaperPage").attr("subCategoryId");
	var questionNumber = $("#txtQuestionNumber").val();
	if (!questionNumber || questionNumber.trim() == "") {
		alert("Enter the question number");
		$("#txtQuestionNumber").focus();
		return;
	}
	var question = tinymce.get('textAreaForQuestion').getContent();
	if (!question || question.trim() == "") {
		alert("Enter the question ");
		$("a[href='#questionTab']").trigger("click");
		return;
	}
	var questionId = $("#divAddNewQPaperPage").attr("questionId");
	question = question.slice(3);
	var options = [];
	var hasAllOption = true;
	$("#makeQuetionPageBody").find("textarea.option").each(function () {
		var id = $(this).attr("id");
		var optionNumber = $(this).attr("optionNumber");
		var textAreaContent = tinymce.get(id).getContent();
		if (!textAreaContent || textAreaContent.trim() == "") {
			$("#makeQuetionPageBody").find("a[href='#option" + optionNumber + "']").trigger("click");
			tinyMCE.get(id).focus();
			hasAllOption = false;
			return false;
		}

		textAreaContent = textAreaContent.slice(3);
		var optionMap = {
			optionNo: optionNumber,
			option: textAreaContent
		};
		options.push(optionMap);
	});
	if (!hasAllOption) {
		return;
	}
	var selectedOption = $("#selectCorrectOptionDiv").find("input:radio[name=selectedOption]:checked").val();
	if (!selectedOption) {
		alert("Select the correct answer option");
		return;
	}
	var list = [{
		questionPaperSubCategoryId: subCategoryId,
		questionNo: questionNumber,
		question: question,
		options: options,
		correctOptionNo: selectedOption
	}];
	if (questionId) {
		list.questionId = questionId;
	}

	$.ajax({
		url: protocol + "//" + host + "/question-paper/question",
		type: "POST",
		cache: false,
		data: JSON.stringify(list),
		contentType: "application/json; charset=utf-8",
		success: function (returnMap) {
			checkIfImageToUpload(returnMap, function () {
				$("#divAddNewQPaperPage").modal("hide");
				refreshQuestionPaperPage(function () {
					var categoryId = $("#divAddNewQPaperPage").attr("categoryId");
					$("#divSuperAdminMakeQPaperPage").find("div.panel[categoryId=" + categoryId + "]").find("button.btnView").trigger("click");
				});
			});

		}
	});

}
function b64toBlob(b64Data, sliceSize) {
	var contentType = 'image/jpg';
	sliceSize = sliceSize || 512;

	var byteCharacters = atob(b64Data);
	var byteArrays = [];

	for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
		var slice = byteCharacters.slice(offset, offset + sliceSize);

		var byteNumbers = new Array(slice.length);
		for (var i = 0; i < slice.length; i++) {
			byteNumbers[i] = slice.charCodeAt(i);
		}

		var byteArray = new Uint8Array(byteNumbers);

		byteArrays.push(byteArray);
	}

	var blob = new Blob(byteArrays, { type: contentType });
	return blob;
}
function checkIfImageToUpload(returnMap, callBack) {

	var formdata = new FormData();
	var hasImage = false;
	var isEdit = $("#divAddNewQPaperPage").attr("isEdit");
	if (isEdit) {
		var imageMap = $('#makeQuetionPageBody').find("div.previewDiv").find("img").data("questionimageMap");
		if (imageMap) {
			hasImage = true;
			formdata.append("file", b64toBlob(imageMap.image));
		}
	}
	if ($("#questionImage")[0].files && $("#questionImage")[0].files[0]) {
		hasImage = true;
		formdata.append("file", $("#questionImage")[0].files[0]);
	}

	if (hasImage) {
		var questionId = returnMap.data[0].questionId;
		formdata.append("description", "Question Image");
		$.ajax({
			url: protocol + "//" + host + "/question-paper/" + questionId + "/image",
			type: "POST",
			processData: false,
			contentType: false,
			cache: false,
			data: formdata,
			success: function (returnMap) {
				callBack();
			}
		});
	} else {
		callBack();
	}
}


function showQuestionCreateSection(subCategoryId, obj, questionNo, categoryId) {
	$("#divAddNewQPaperPage").removeAttr("questionId");
	var optionCount = $("#divAddNewQPaperPage").attr("optionsCount");
	$("#divAddNewQPaperPage").modal("show");
	$("#divAddNewQPaperPage").attr("subCategoryId", subCategoryId);
	$("#divAddNewQPaperPage").attr("categoryId", categoryId);
	createOptionTabsAccordingToOptionCount(optionCount, function () {
		$("#makeQuetionPageBody").find("textarea").each(function () {
			var id = $(this).attr("id");
			tinymce.init({
				selector: '#' + id,
				height: 250,
				setup: function (ed) {
					ed.on('keydown', function (e) {
						if (e.keyCode == 9) {
							e.preventDefault();
							setFocusToNextTab();
						}
					});
				},
				plugins: ["advlist autolink lists charmap print preview ", "searchreplace visualblocks fullscreen", "insertdatetime  table contextmenu paste pramukhime  "],
				toolbar: " undo redo | styleselect | bold italic charmap | alignleft aligncenter alignright alignjustify | bullist numlist | fullscreen  | pramukhime   pramukhimetogglelanguage ",
				content_css: ['//fonts.googleapis.com/css?family=Lato:300,300i,400,400i', '//www.tinymce.com/css/codepen.min.css'],
				// language : 'ml_IN'
			});

		});
		setTimeout(function () {
			if (obj) {
				$("#divAddNewQPaperPage").attr("questionId", obj.questionId);
				$("#txtQuestionNumber").val(questionNo);
				tinymce.get('textAreaForQuestion').setContent(obj.question);
				$("#selectCorrectOptionDiv").find("input:radio[name=selectedOption][value=" + obj.correctOptionNo + "]").prop("checked", true);
				var optionListForPopulate = obj.options;
				for (var i = 0; i < optionListForPopulate.length; i++) {
					var idForOption = $("#makeQuetionPageBody").find("textarea.option[optionNumber=" + optionListForPopulate[i].optionNo + "]").attr("id");
					tinymce.get(idForOption).setContent(optionListForPopulate[i].option);
				}
			}
			$("#txtQuestionNumber").focus();
		}, 1000);
		var divForImage = $("<div>").addClass("tab-pane");
		var divForBtn = $("<div>").addClass("text-center");
		var fileInput = $("<input>").attr("type", "file");
		$(fileInput).attr("id", "questionImage");
		var divForPreview = $("<div>").addClass("previewDiv");
		var buttonForUploadImage = $("<label>").addClass("btn btn-sm btn-default").html("Upload Image");
		$(buttonForUploadImage).attr("for", "questionImage");
		$(divForBtn).append(buttonForUploadImage);
		$(divForBtn).append(fileInput);
		$(divForImage).append(divForBtn);
		$(divForImage).append(divForPreview);
		$(divForImage).attr("role", "tabpanel");
		$(divForImage).attr("id", "imgTab");
		$(fileInput).hide();
		$(fileInput).change(function (event) {
			showImagePreview(event.target, "#makeQuetionPageBody")
		});
		$("#makeQuetionPageBody").find("div.tab-content").append(divForImage);
		if (obj && obj.questionImage && obj.questionImage.length) {
			var img = $("<img>").attr("src", "data:image/jpg;base64," + obj.questionImage[0].image).attr("width", "100%");
			$(divForPreview).html("").append(img);
			$(img).data("questionimageMap", obj.questionImage[0])
		}
	});

}
function showImagePreview(input, div) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var img = $("<img>").attr("src", e.target.result).attr("width", "100%");
			$(div).find("div.previewDiv").html("").append(img);
		}

		reader.readAsDataURL(input.files[0]);
	}
}
function setFocusToNextTab() {
	if ($("#makeQuetionPageBody").find("li.questionOptionTab:last").hasClass("active")) {
		$("#makeQuetionPageBody").find("li.questionOptionTab:first").find("a[role=tab]").trigger("click");
	} else {
		$("#makeQuetionPageBody").find("li.questionOptionTab.active").next().find("a[role=tab]").trigger("click");
	}
}

function createOptionTabsAccordingToOptionCount(optionCount, callBack) {
	if (optionCount) {
		var ulToAppend = $("#makeQuetionPageBody").find("ul.nav-tabs");
		var divToAppend = $("#makeQuetionPageBody").find("div.tab-content");
		var liForTabList = $("<li>").addClass("active questionOptionTab");
		$(liForTabList).attr("role", "presentation");
		var anchorForTabList = $("<a>").attr("href", "#questionTab").html("Question");
		$(anchorForTabList).attr("aria-controls", "questionTab");
		$(anchorForTabList).attr("role", "tab");
		$(anchorForTabList).attr("data-toggle", "tab");
		$(liForTabList).html("").append(anchorForTabList);
		$(ulToAppend).html("").append(liForTabList);

		var divForTabContent = $("<div>").addClass("tab-pane active");
		$(divForTabContent).attr("role", "tabpanel");
		$(divForTabContent).attr("id", "questionTab");
		$(divToAppend).html("").append(divForTabContent);
		var textAreaForOptions = $("<textarea>").addClass("form-control typeArea");
		$(textAreaForOptions).attr("id", "textAreaForQuestion");
		var inputDivForQuestion = $("<div>").addClass("form-group fixedWidthDiv200");
		var inputForQuestion = $("<input>").addClass("form-control input-sm");
		$(inputForQuestion).attr("placeholder", "Question Number");
		$(inputForQuestion).attr("id", "txtQuestionNumber");
		$(inputForQuestion).keydown(function (e) {
			if (e.keyCode == 9) {
				e.preventDefault();
				setTabKeyPressDirectToQuestionArea();
			}
		});
		var divForSelectCorrectOption = $("#selectCorrectOptionDiv");
		var divForCOrrectAnswerRadioGroup = $("<div>").addClass("pull-right").html("Select Correct Option: ");
		$(inputDivForQuestion).append(inputForQuestion);
		$(divForSelectCorrectOption).html("").append(divForCOrrectAnswerRadioGroup);
		$(divForSelectCorrectOption).append(inputDivForQuestion);
		$(divForTabContent).append(textAreaForOptions);

		for (var i = 0; i < optionCount; i++) {
			var counter = i + 1;
			var liForTabList = $("<li>").addClass("questionOptionTab");
			$(liForTabList).attr("role", "presentation");
			var anchorForTabList = $("<a>").attr("href", "#option" + counter).html("option " + counter);
			$(anchorForTabList).attr("aria-controls", "subCategory" + counter);
			$(anchorForTabList).attr("role", "tab");
			$(anchorForTabList).attr("data-toggle", "tab");
			$(liForTabList).append(anchorForTabList);
			$(ulToAppend).append(liForTabList);

			var divForTabContent = $("<div>").addClass("tab-pane");
			$(divForTabContent).attr("role", "tabpanel");
			$(divForTabContent).attr("id", "option" + counter);
			$(divToAppend).append(divForTabContent);
			var textAreaForOptions = $("<textarea>").addClass("form-control typeArea option");
			$(textAreaForOptions).attr("id", "textArea" + counter);
			$(textAreaForOptions).attr("optionNumber", counter);
			$(divForTabContent).html("").append(textAreaForOptions);

			var labelForRadio = $("<label>").addClass("selectedOptionRadio");
			var radioForOption = $("<input>").attr("type", "radio");
			$(radioForOption).attr("name", "selectedOption");
			$(radioForOption).attr("value", counter);
			$(labelForRadio).append(radioForOption);
			$(labelForRadio).append(" Option" + counter);
			$(divForCOrrectAnswerRadioGroup).append(labelForRadio);

		}

	}
	callBack();
}

function initializeSetQPaperPage(obj, questionId) {
	$("#divAddNewQPaperPage").attr("questionPaperId", questionId);
	$("#makeQuetionPageBody").attr("questionPaperId", questionId)
	getAllCategoriesForQuestionPaper(obj.questionPaperCategorys);
	$("#divAddNewQPaperPage").attr("optionsCount", obj.noOfOptions);
}
function refreshQuestionPaperPage(callBack) {
	var questionpaperId = $("#makeQuetionPageBody").attr("questionPaperId");
	$.ajax({
		url: protocol + "//" + host + "/question-paper/" + questionpaperId + "/category",
		type: "GET",
		cache: false,
		success: function (obj) {
			var list = obj.data;
			getAllCategoriesForQuestionPaper(list, callBack);
		}
	});
}

function setTabKeyPressDirectToQuestionArea(item) {
	$("a[href='#questionTab']").trigger("click");
	//tinyMCE.get("textAreaForQuestion").focus();
}

function getAllCategoriesForQuestionPaper(list, callBack) {
	var mainDiv = $("#makeQPaperPageBody").empty();
	if (list.length != 0) {
		for (var i = 0; i < list.length; i++) {
			var index = i + 1;
			var divPanel = $("<div>").addClass("panel panel-default");
			$(mainDiv).append(divPanel);
			var divPanelHeading = $("<div>").addClass("panel-heading");
			$(divPanel).append(divPanelHeading);
			$(divPanelHeading).attr("categoryId", list[i].category.categoryId);
			$(divPanel).attr("categoryId", list[i].category.categoryId);
			var aToggleButton = $("<button>").addClass("btn btn-sm btn-default pull-right btnView").html("view");
			$(divPanelHeading).append(aToggleButton);
			$(aToggleButton).attr("data-toggle", "collapse");
			$(aToggleButton).attr("data-parent", "#makeQPaperPageBody");
			$(aToggleButton).attr("href", "#category" + index + "Condent");
			var h4title = $("<h4>").addClass("panel-title").html(list[i].category.name);
			$(divPanelHeading).append(h4title);

			var divForCategoryCondent = $("<div>").addClass("panel-collapse collapse ");
			$(divForCategoryCondent).attr("id", "category" + index + "Condent");
			$(divPanel).append(divForCategoryCondent);
			var divForPanelCategoryCondent = $("<div>").addClass("panel-body");
			$(divForCategoryCondent).append(divForPanelCategoryCondent);
			getSubCategoryForACategory(list[i].questionPaperSubCategorys, divForPanelCategoryCondent, list[i].correctAnswerMark);
		}
	}
	if (callBack) {
		callBack();
	}
}

function getSubCategoryForACategory(subCategoryList, categoryDiv, correctAnswerMark) {
	if (subCategoryList.length != 0) {
		for (var j = 0; j < subCategoryList.length; j++) {
			var index = j + 1;

			//------------------------------panels for sub category-----------------------//
			var subCategoryPanel = $("<div>").addClass("panel panel-default");
			$(categoryDiv).append(subCategoryPanel);
			var divSubCategoryTop = $("<div>").addClass("panel-heading subCatHead");
			$(subCategoryPanel).append(divSubCategoryTop);
			var h4ForSubHead = $("<h4>").addClass("panel-title").html("Sub Category " + (j + 1) + " ( Mark:" + subCategoryList[j].noOfQuestions + " X " + correctAnswerMark + " )");
			$(divSubCategoryTop).append(h4ForSubHead);

			var divForSubBody = $("<div>").addClass("panel-body subCat");
			$(divForSubBody).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
			$(subCategoryPanel).append(divForSubBody);
			if (subCategoryList[j].description) {
				var spanForDirection = $("<span>").addClass("boldFont").html("Directions:");
				var PforDirection = $("<p>").html("[ " + subCategoryList[j].description + " ]");
				$(divForSubBody).append(spanForDirection);
				$(divForSubBody).append(PforDirection);
			}
			var btnForAddQuestion = $("<button>").addClass("btn btn-default btn-sm pull-right marginrgtfive").html("Add Question");
			$(btnForAddQuestion).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
			$(btnForAddQuestion).click(function () {
				$("#divAddNewQPaperPage").attr("isEdit", "false");
				var categoryId = $(this).closest("div.panel").attr("categoryId");
				showQuestionCreateSection($(this).attr("subCategoryId"), undefined, undefined, categoryId);
			});

			//-------------------collapse buttons------------------------------------------------//

			var btnForCollapse = $("<button>").addClass("btn btn-default contentBtn btn-sm pull-right marginrgtfive").html("-");
			$(btnForCollapse).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
			$(btnForCollapse).click(function () {

				collapseCurrentSubCategoryData($(this));
			});
			$(h4ForSubHead).append(btnForCollapse);

			var btnForExpandCollapse = $("<button>").addClass("btn btn-default contentBtn btn-sm pull-right marginrgtfive").html("+");
			$(btnForExpandCollapse).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
			$(btnForExpandCollapse).click(function () {
				viewCurrentSubCategoryData($(this));
			});
			$(h4ForSubHead).append(btnForExpandCollapse);
			//------------------------------------------------------------------------------//

			var btnForDeleteContent = $("<button>").addClass("btn btn-default contentBtn btn-sm pull-right marginrgtfive").html("Delete Content");
			$(btnForDeleteContent).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
			$(btnForDeleteContent).click(function () {
				var subCategoryId = $(this).attr("subCategoryId");
				if (confirm("Are you sure you want to delete content"))
					deletContentToSUbCategory(subCategoryId);
			});
			$(h4ForSubHead).append(btnForAddQuestion);
			var btnForAddContent = $("<button>").addClass("btn btn-default contentBtn btn-sm pull-right marginrgtfive").html("Add Content");
			$(btnForAddContent).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
			$(btnForAddContent).click(function () {
				var subCategoryId = $(this).attr("subCategoryId");
				addContentToSUbCategory(subCategoryId);
			});
			var btnForEditContent = $("<button>").addClass("btn btn-default contentEditBtn btn-sm pull-right marginrgtfive").html("Edit Content");
			$(btnForEditContent).attr("subCategoryId", subCategoryList[j].questionPaperSubCategoryId);
			$(btnForEditContent).data("subData", subCategoryList[j]);
			$(btnForEditContent).click(function () {
				var subCategoryId = $(this).attr("subCategoryId");
				var subData = $(this).data("subData");
				addContentToSUbCategory(subCategoryId, subData);
			});
			if (subCategoryList[j].content) {
				$(h4ForSubHead).append(btnForDeleteContent);
				$(h4ForSubHead).append(btnForEditContent);
			}
			else
				$(h4ForSubHead).append(btnForAddContent);



			var divForContent = $("<div>").addClass("subContent").html(subCategoryList[j].content);
			$(divForSubBody).append(divForContent);
			try {
				var imgList = subCategoryList[j].questionPaperSubCategoryImage;
				if (imgList && imgList.length) {
					for (var k = 0; k < imgList.length; k++) {
						var divForImage = $("<div>").addClass("text-center");
						var imgForContent = $("<img>").attr("src", 'data:image/jpeg;base64,' + imgList[k].image);
						$(imgForContent).attr("width", "300px");
						$(divForImage).append(imgForContent);
						$(divForSubBody).append(divForImage);

					}
				}
			} catch (e) {

			}
			populateQuestionAndOptions(subCategoryList[j], divForSubBody);
			$(divForSubBody).hide();
		}
	}
}
function viewCurrentSubCategoryData(item) {
	var subCategoryId = $(item).attr("subCategoryId");
	$("#makeQPaperPageBody").find("div.subCat").hide();
	$("#makeQPaperPageBody").find("div.subCat[subCategoryId=" + subCategoryId + "]").show();
	window.scrollTo(0, ($(item).offset().top - 200));
}
function collapseCurrentSubCategoryData(item) {
	var subCategoryId = $(item).attr("subCategoryId");
	$("#makeQPaperPageBody").find("div.subCat[subCategoryId=" + subCategoryId + "]").hide();
}
function deletContentToSUbCategory(subCategoryId) {
	$.ajax({
		url: protocol + "//" + host + "/question-paper/sub-category/" + subCategoryId + "/content",
		type: "DELETE",
		cache: false,
		success: function (obj) {
			refreshQuestionPaperPage();
		}
	});
}


function addContentToSUbCategory(subCategoryId, subData) {
	$("#divAddNewSubContentPage").modal("show");
	$("#divAddNewSubContentPage").attr("isEdit", false);
	tinymce.get('txtAreaForSubContent').setContent("");
	$("#divAddImgCOntentForMakeQPaper").find("div.previewDiv").html("");
	$("#questionImageSubContent").val("");
	$("#divAddNewSubContentPage").attr("subCategoryId", subCategoryId);
	try {
		if (subData) {
			$("#divAddNewSubContentPage").attr("isEdit", true);
			tinymce.get('txtAreaForSubContent').setContent(subData.content);
			try {
				if (!subData.questionPaperSubCategoryImage[0]) {
					return;
				}
				var img = $("<img>").attr("src", "data:image/jpg;base64," + subData.questionPaperSubCategoryImage[0].image).attr("width", "100%");
				$("#divAddImgCOntentForMakeQPaper").find("div.previewDiv").html(img);
				$(img).data("subImgMap", subData.questionPaperSubCategoryImage[0]);
				$('#divAddNewSubContentPage').find("div.previewDiv").find("img").data("subImgMap");
			} catch (e) {

			}
		}
	} catch (e) {

	}
}
function populateQuestionAndOptions(subCategory, targetDiv) {
	$(targetDiv).css("border-top", "1px solid #ddd");
	var questionsList = subCategory.questions;
	var ulForQuestion = $("<ul>").addClass('noPadding QuestionUl');
	$(ulForQuestion).attr("subCategoryId", subCategory.questionPaperSubCategoryId);
	$(targetDiv).append(ulForQuestion);
	if (questionsList.length != 0) {
		for (var k = 0; k < questionsList.length; k++) {
			var divForQuestion = $("<li>").addClass("questionLi");

			var pForNumber = $("<p>").html(questionsList[k].questionNo + ") ");
			$(divForQuestion).append(pForNumber);
			try {
				$(divForQuestion).attr("questionId", questionsList[k].question.questionId);
			} catch (e) {

			}

			try {
				var hasImage = false;
				var ImgMapList = questionsList[k].question.questionImage;
				var divForImg = $("<div>").addClass("text-center");
				for (var i = 0; i < ImgMapList.length; i++) {
					var ImgMap = ImgMapList[i];
					if (ImgMap.image) {
						var imgForQuestion = $("<img>").attr("src", 'data:image/jpeg;base64,' + ImgMap.image);
						$(imgForQuestion).attr("width", "300px");
						hasImage = true;
					}
					$(divForImg).append(imgForQuestion);
				}
				$(divForQuestion).append(divForImg);
				var pForQuestion = $("<p>").html(questionsList[k].questionNo + ") " + questionsList[k].question.question);
				if (hasImage) {
					$(pForQuestion).html(questionsList[k].question.question)
				} else {
					$(pForNumber).remove();
				}
				$(divForQuestion).append(pForQuestion);
			} catch (e) {

			}
			$(ulForQuestion).append(divForQuestion);


			var spanForEditAndDelete = $("<span>").addClass("pull-right editDeleteSpan");
			$(spanForEditAndDelete).attr("subCategroyId", questionsList[k].questionPaperSubCategoryId);
			$(spanForEditAndDelete).data("question", questionsList[k].question);
			$(spanForEditAndDelete).attr("questionNo", questionsList[k].questionNo);
			var editIcon = $("<i>").addClass("fa fa-pencil");
			$(editIcon).click(function () {
				var questionMap = $(this).parent().data("question");
				var subCategoryId = $(this).parent().attr("subCategroyId");
				var questionNo = $(this).parent().attr("questionNo");
				var categoryId = $(this).closest("div.panel").attr("categoryId");
				$("#divAddNewQPaperPage").attr("isEdit", "true");

				showQuestionCreateSection(subCategoryId, questionMap, questionNo, categoryId);
			});
			var deleteIcon = $("<i>").addClass("fa fa-trash-o");
			$(spanForEditAndDelete).append(editIcon);
			$(spanForEditAndDelete).append(deleteIcon);
			$(deleteIcon).click(function () {
				var questionMap = $(this).parent().data("question");
				if (confirm("Are you sure you want to delete the question")) {
					deleteQuestion(questionMap.questionId);
				}
			});
			$(divForQuestion).append(spanForEditAndDelete);
			var ulForOptions = $("<ul>").addClass("optionsList");
			var optionsList = questionsList[k].question.options;
			if (optionsList) {
				for (var p = 0; p < optionsList.length; p++) {
					var liForOption = $("<li>").html("<p>" + optionsList[p].optionNo + ") " + optionsList[p].option);
					$(liForOption).attr("questionNumber", optionsList[p].optionNo);
					$(liForOption).attr("optionId", optionsList[p].optionId);
					$(ulForOptions).append(liForOption);
				}
			}
			$(divForQuestion).append(ulForOptions);
			var correctAnswer = $(ulForOptions).find("li[questionNumber=" + questionsList[k].question.correctOptionNo + "]").text();
			var pForAnswer = $("<p>").addClass("answerDiv").html(" Answer: " + correctAnswer);
			$(divForQuestion).append(pForAnswer);

		}
	}
}

function deleteQuestion(questionId) {
	$.ajax({
		url: protocol + "//" + host + "/question-paper/" + questionId + "/question",
		type: "DELETE",
		cache: false,
		success: function (obj) {
			try {
				$("#makeQPaperPageBody").find("li.questionLi[questionId=" + questionId + "]").remove();
			} catch (e) {

			}
		}
	});
}