function loadCategoryMasterPage(isShow) {
	$.get("superadmin/category.html" + postUrl, {
		"_": $.now()
	}, function(data) {
		$("#pageContainer").append(data);
		if (isShow) {
			showCategoryMasterPage();
		}
		$("#btnAddNewCategory").click(function() {
			$("#divAddNewCategoryPage").modal("show");
		});
		$("#divAddNewCategoryPage").on("shown.bs.modal", function() {

		});
		$("#btnAddNewCategorySave").click(function() {
			var type = $(this).attr("type");
			if (type == "edit") {
				editCategory();
			} else {
				saveCategory();
			}
		});
	});
}

function saveCategory() {
	var obj = validateAndReturnCategoryInfo();
	if (obj == undefined) {
		return;
	}
	$.ajax({
		url: protocol + "//" + host + "/category",
		type: "POST",
		cache: false,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj) {
			console.info(obj);
			getCategory();
			$("#divAddNewCategoryPage").modal("hide");
		}
	});

}

function editCategory() {
	var obj = validateAndReturnCategoryInfo();
	if (obj == undefined) {
		return;
	}
	var categoryId = $("#btnAddNewCategorySave").attr("categoryId");
	obj.categoryId = categoryId;
	$.ajax({
		url: protocol + "//" + host + "/category",
		type: "PUT",
		cache: false,
		data: JSON.stringify(obj),
		contentType: "application/json; charset=utf-8",
		success: function(obj) {
			console.info(obj);
			getCategory();
			$("#divAddNewCategoryPage").modal("hide");
		}
	});

}

function validateAndReturnCategoryInfo() {
	var obj = {};
	var categoryName = $("#txtCategoryName").val();
	if (categoryName == "") {
		alert("Please enter category name");
		return;
	}
	obj.name = categoryName;
	return obj;
}

function getCategory() {
	$.ajax({
		url: protocol + "//" + host + "/category",
		type: "GET",
		cache: false,
		success: function(obj) {
			var list = obj.data;
			populateCategory(list);
		}
	});
}

function deleteCategory(id) {
	$.ajax({
		url: protocol + "//" + host + "/category/" + id,
		type: "DELETE",
		cache: false,
		success: function(obj) {
			getCategory();
		}
	});
}

function populateCategory(list) {
	var tbody = $("#tblCategory tbody")[0];
	$(tbody).empty();
	for (var i = 0; i < list.length; i++) {
		var tr = $("<tr>");
		$("<td>" + parseInt(i + 1) + "</td>").appendTo(tr);
		$(tr).data("obj", list[i]);
		var tdForName = $("<td>");
		$(tdForName).append(list[i].name);
		$(tr).append(tdForName);
		var settingsGear = createSettingsGearDiv();
		$(settingsGear).removeClass("pull-right");
		var tdForSettings = $("<td>").html(settingsGear);
		$(tr).append(tdForSettings);
		appendLiForCategorySettings(settingsGear, list[i]);
		$(tbody).append(tr);
	}
	initializeTable("tblCategory")

}

function appendLiForCategorySettings(div) {
	var ul = $(div).find("ul")[0];
	$(ul).empty();
	var liForEdit = createAndReturnLiForSettingsGear("Edit");
	$(ul).append(liForEdit);
	$(liForEdit).click(function() {
		var obj = $(this).closest("tr").data("obj");
		showAddNewCategoryPage(obj);
	});
	var liForDelete = createAndReturnLiForSettingsGear("Delete");
	$(ul).append(liForDelete);
	$(liForDelete).click(function() {
		var obj = $(this).closest("tr").data("obj");
		deleteCategory(obj.categoryId);
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
