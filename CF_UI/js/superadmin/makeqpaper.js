function loadMakeQPaperPage(obj, isShow) {
	$.get("superadmin/makeqpaper.html" + postUrl, {
		"_" : $.now()
	}, function(data) {
		$("#pageContainer").append(data);
		if (isShow) {
			showMakeQuestionPage(obj);
		}
		$("#btnMakeQuestionPaperQNext").click(function() {
			saveQuestion();
			$("#makeQuetionPageBody").find("textarea").each(function() {
				
			//	alert(tinymce.get('textAreaForQuestion').getContent());

			});
		});
		$("#divAddNewQPaperPage").on('hidden.bs.modal', function() {
			$("#makeQuetionPageBody").find("textarea").each(function() {
				var id = $(this).attr("id");
				tinymce.get(id).remove();
			});

		});
	});
}

function saveQuestion() {
	var list = [{
		"questionId":39,
		"questionPaperSubCategoryId" : 4,
		"questionNo" : 2,
		"question" : "Your name edited?",
		"options" : [{
			"optionNo" : 1,
			"option" : "Monique Alexander"
		}, {
			"optionNo" : 2,
			"option" : "Ava Addams"
		}, {
			"optionNo" : 3,
			"option" : "Kendra Lust"
		}],
		"correctOptionNo" : 2
	}];
	$.ajax({
		url : protocol + "//" + host + "/question-paper/question",
		type : "POST",
		cache : false,
		data : JSON.stringify(list),
		contentType : "application/json; charset=utf-8",
		success : function(returnMap) {
			console.info(returnMap);
		}
	});

}

function showQuestionCreateSection() {
	var optionCount = 5;
	$("#divAddNewQPaperPage").modal("show");
	createOptionTabsAccordingToOptionCount(optionCount, function() {
		$("#makeQuetionPageBody").find("textarea").each(function() {
			var id = $(this).attr("id");
			tinymce.init({
				selector : '#' + id,
				height : 250,
				plugins : ["advlist autolink lists charmap print preview ", "searchreplace visualblocks fullscreen", "insertdatetime  table contextmenu paste "],
				toolbar : " undo redo | styleselect | bold italic charmap | alignleft aligncenter alignright alignjustify | bullist numlist | fullscreen  ",
				content_css : ['//fonts.googleapis.com/css?family=Lato:300,300i,400,400i', '//www.tinymce.com/css/codepen.min.css'],
				// language : 'ml_IN'
			});
		});
	});
}

function createOptionTabsAccordingToOptionCount(optionCount, callBack) {
	if (optionCount) {
		var ulToAppend = $("#makeQuetionPageBody").find("ul.nav-tabs");
		var divToAppend = $("#makeQuetionPageBody").find("div.tab-content");
		var liForTabList = $("<li>").addClass("active");
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
		$(divForTabContent).append(textAreaForOptions);
		for (var i = 0; i < optionCount; i++) {
			var counter = i + 1;
			var liForTabList = $("<li>");
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
			var textAreaForOptions = $("<textarea>").addClass("form-control typeArea");
			$(textAreaForOptions).attr("id", "textArea" + counter);
			$(divForTabContent).html("").append(textAreaForOptions);
		}

	}
	callBack();
}

function initializeSetQPaperPage(obj) {
	getAllCategoriesForQuestionPaper(obj.questionPaperCategorys);
	//getAllSubCategoriesForQuestionPaper(obj);
}

function getAllCategoriesForQuestionPaper(list) {
	var mainDiv = $("#makeQPaperPageBody").empty();
	if (list.length != 0) {
		for (var i = 0; i < list.length; i++) {
			var index = i + 1;
			var divPanel = $("<div>").addClass("panel panel-default");
			$(mainDiv).append(divPanel);
			var divPanelHeading = $("<div>").addClass("panel-heading");
			$(divPanel).append(divPanelHeading);
			$(divPanelHeading).attr("categoryId", list[i].category.categoryId);
			var aToggleButton = $("<button>").addClass("btn btn-sm btn-default pull-right").html("view");
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
}

function getSubCategoryForACategory(subCategoryList, categoryDiv, correctAnswerMark) {
	if (subCategoryList.length != 0) {
		for (var j = 0; j < subCategoryList.length; j++) {
			var index = j + 1;
			var divSubCategoryTop = $("<div>").addClass("fontFourteen ");
			if (subCategoryList[j].direction) {
				var spanForDirection = $("<span>").addClass("boldFont").html("Directions:");
				var PforDirection = $("<p>").html("[ " + subCategoryList[j].direction + " ]");
				$(divSubCategoryTop).append(spanForDirection);
				$(divSubCategoryTop).append(PforDirection);
			}
			var spanForMark = $("<span>").addClass("markSpan").html("Mark: (" + subCategoryList[j].noOfQuestions + " X " + correctAnswerMark + ")");
			$(divSubCategoryTop).append(spanForMark);
			$(categoryDiv).append(divSubCategoryTop);
			populateQuestionAndOptions(subCategoryList[j].questions, categoryDiv);
		}
	}
}

function populateQuestionAndOptions(questionsList, targetDiv) {
	var ulForQuestion = $("<ul>").addClass('noPadding QuestionUl');
	$(targetDiv).append(ulForQuestion);
	if (questionsList.length != 0) {
		for (var k = 0; k < questionsList.length; k++) {
			var divForQuestion = $("<li>").addClass("questionLi").html(questionsList[k].questionNo + ") " + questionsList[k].question.question);
			$(ulForQuestion).append(divForQuestion);
			var spanForEditANdDelete = $("<span>").addClass("pull-right editDeleteSpan");
			var editIcon = $("<i>").addClass("fa fa-pencil");
			var deleteIcon = $("<i>").addClass("fa fa-trash-o");
			$(spanForEditANdDelete).append(editIcon);
			$(spanForEditANdDelete).append(deleteIcon);
			$(divForQuestion).append(spanForEditANdDelete);
			var ulForOptions = $("<ul>").addClass("optionsList");
			var optionsList = questionsList[k].question.options;
			if (optionsList) {
				for (var p = 0; p < optionsList.length; p++) {
					var liForOption = $("<li>").html(optionsList[p].optionNo + ") " + optionsList[p].option);
					$(liForOption).attr("questionNumber", optionsList[p].optionNo);
					$(liForOption).attr("optionId", optionsList[p].optionId);
					$(ulForOptions).append(liForOption);
				}
			}
			$(divForQuestion).append(ulForOptions);
			var correctAnswer = $(ulForOptions).find("li[questionNumber=" + questionsList[k].question.correctOptionNo + "]").html();
			var pForAnswer = $("<p>").addClass("answerDiv").html(" Answer: " + correctAnswer);
			$(divForQuestion).append(pForAnswer);

		}
	}
}
