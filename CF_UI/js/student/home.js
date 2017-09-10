function loadStudentView() {
	loadStudentLeftMenu();
}

function initializeStudentRoutes() {
	crossroads.addRoute('dashboard', function (query) {
		alert("dash");

	});
	crossroads.addRoute('home', function (query) {
		showStudentHomPage();
	});
	crossroads.bypassed.add(function () {
		hasher.setHash('home');
	});
	crossroads.addRoute('mytests', function (query) {
		showMyTestPage();
	});

	crossroads.routed.add(console.log, console);
	//log all routes
	//setup hasher
	hasher.initialized.add(parseHash);
	//only required if you want to set a default value
	if (!hasher.getHash()) {
		console.info(hasher.getHash());
		//hasher.setHash(DEFAULT_HASH);
	}
	var previousHash = hasher.getHash();
	if (previousHash == 'login') {
		hasher.setHash('home');
	}
	// crossroads.removeRoute(loginRoute);
	//hasher.initialized.add(parseHash);
	//parse initial hash
	hasher.changed.add(parseHash);
	//parse hash changes

	hasher.init();
}

function loadStudentLeftMenu() {
	$.get("student/leftmenu.html", {
		"_": $.now()
	}, function (data) {
		$("#leftMenuContainer").append(data);
		$("#leftMenuContainer li>div").click(function () {
			handleStudentMenuClick($(this)[0]);
		});
	});

}

function showStudentHomPage() {
	if ($("#studentHome")[0] == undefined) {
		loadStudentHomePage();
		return;
	}
	updateLeftMenu("Home");
	showPage($("#studentHome")[0]);
	initializeStudentPage();

}

function showStudentProfile() {
	if ($("#studentProfilePage")[0] == undefined) {
		loadStudentProfilePage();
		return;
	}
	showPage($("#studentProfilePage")[0]);

}

function loadStudentProfilePage() {
	$.get("student/myprofile.html", {
		"_": $.now()
	}, function (data) {
		$("#pageContainer").append(data);
		showStudentProfile();
	});

}

function showMyTestPage() {
	if ($("#mytestpage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/student/mytest.js' + postUrl], function() {
			loadMyTestPage();
		});
		
		return;
	}
	showPage($("#mytestpage")[0]);
	updateLeftMenu("My test");
	getAllTestList();
}

function initializeStudentPage() {
	getBundleList($("#onlineTestPackages"));
	getResultList();
}

function getResultList() {
	var list = [{
		exam: "Psc December 2012",
		examId: 1,
		examDate: "31-05-2017 09:45:34",
		correctAnswerCount: 45,
		wrongAnswer: 5,
		Mark: 93
	}, {
		exam: "All India IBPS November 2015",
		examId: 2,
		examDate: "12-07-2017 12:45:34",
		correctAnswerCount: 45,
		wrongAnswer: 5,
		Mark: 68
	}, {
		exam: "Psc December 2012",
		examId: 1,
		examDate: "31-05-2017 09:45:34",
		correctAnswerCount: 45,
		wrongAnswer: 5,
		Mark: 74
	}, {
		exam: "Kerala Psc December 2012",
		examId: 1,
		examDate: "31-05-2017 09:45:34",
		correctAnswerCount: 45,
		wrongAnswer: 5,
		Mark: 83
	}, {
		exam: "Kerala BDS Exam July 2016",
		examId: 1,
		examDate: "31-05-2017 09:45:34",
		correctAnswerCount: 45,
		wrongAnswer: 5,
		Mark: 98
	}];
	populateResultList(list);

}

function populateResultList(list) {
	if (list.length != 0) {
		for (var i = 0; i < list.length; i++) {
			var divForExamResultListTile = $("<div>").addClass("row examResultListTile");
			var divForSpanExamResultListTile = $("<div>").addClass("col-md-9");
			$(divForExamResultListTile).append(divForSpanExamResultListTile);
			var spanForExamName = $("<span>").addClass("examResultExamName").html(list[i].exam);
			$(divForSpanExamResultListTile).append(spanForExamName);
			var spanForExamDate = $("<span>").addClass("examResultExamDate").html(moment(list[i].examDate, 'DD/MM/YYYY').format("DD MMM YYYY"));
			$(divForSpanExamResultListTile).append(spanForExamDate);
			var spanForanswerStatus = $("<span>").addClass("examResultExamDate").html(' <i class="fa fa-check green" ></i>' + list[i].correctAnswerCount);
			$(spanForanswerStatus).append(' <i class="fa fa-times red" ></i>' + list[i].wrongAnswer);
			$(divForSpanExamResultListTile).append(spanForExamDate);
			var divForSpanExamResultMark = $("<div>").addClass("col-md-3 markSpan").html(list[i].Mark);
			$(divForExamResultListTile).append(divForSpanExamResultMark);
			$(divForSpanExamResultListTile).append(spanForanswerStatus);
			$("#divForTableResultSummary").append(divForExamResultListTile);
		}
	}
}

function loadStudentHomePage() {
	$.get("student/home.html", {
		"_": $.now()
	}, function (data) {
		$("#pageContainer").append(data);
		showStudentHomPage();
		$("#btnPurchaseNewBundle").click(function () {
			showBundlePurchasePage($("#modalContainerForBundlePurchaseList"));

		});
	});
}
function showBundlePurchasePage(div) {
	$("#modalPurchaseNewBundle").modal("show");
	getBundleList(div);
}

function handleStudentMenuClick(menuDiv) {
	var menuTitle = $(menuDiv).text();
	menuTitle = menuTitle.trim();
	var previousHash = hasher.getHash();
	console.info(menuTitle);
	switch (menuTitle.toLowerCase()) {
		case "home":
			setHashInUrl('home');
			break;
		case "my profile":
			setHashInUrl('Profile');
			showStudentProfile();
			break;
		case "my tests":
			setHashInUrl('mytests');
			break;
		case "student details":
			setHashInUrl('student-details');
			break;
		case "staff details":
			setHashInUrl('staff-details');
			break;
		case "manage center":
			setHashInUrl('manage-center');
			break;
	}
	updateLeftMenu(menuTitle);
}

function getBundleList(div) {
	list = [{
		bundle_id: 1,
		bundle_category_id: 1,
		name: "Bundle For Psc",
		description: "Contains Questions for psc class clears the bottom-margin of each panel",
		mrp: 30,
		selling_price: 28,
		imageUrl: "bundle1.jpg",
		is_available: true,
		coaching_type: 1,
		discount_percent: null,
		validity_days: 60
	}, {
		bundle_id: 2,
		bundle_category_id: 2,
		name: "Bundle For IBPS",
		description: "Contains Questions for Bank class clears the bottom-margin of each panel",
		mrp: 30,
		selling_price: 28,
		imageUrl: "bundle2.png",
		is_available: true,
		coaching_type: 1,
		discount_percent: null,
		validity_days: 60
	}, {
		bundle_id: 1,
		bundle_category_id: 1,
		name: "Bundle For Psc",
		description: "Contains Questions for psc class clears the bottom-margin of each panel ",
		mrp: 30,
		selling_price: 28,
		imageUrl: "bundle1.jpg",
		is_available: true,
		coaching_type: 1,
		discount_percent: null,
		validity_days: 60
	}, {
		bundle_id: 2,
		bundle_category_id: 2,
		name: "Bundle For IBPS",
		description: "Contains Questions for Bank class clears the bottom-margin of each panel",
		mrp: 30,
		selling_price: 28,
		imageUrl: "bundle2.png",
		is_available: true,
		coaching_type: 1,
		discount_percent: null,
		validity_days: 60
	}, {
		bundle_id: 1,
		bundle_category_id: 1,
		name: "Bundle For Psc",
		description: "Contains Questions for psc class clears the bottom-margin of each panel:",
		mrp: 30,
		selling_price: 28,
		imageUrl: "bundle1.jpg",
		is_available: true,
		coaching_type: 1,
		discount_percent: null,
		validity_days: 60
	}, {
		bundle_id: 2,
		bundle_category_id: 2,
		name: "Bundle For IBPS",
		description: "Contains Questions for Bank class clears the bottom-margin of each panel:",
		mrp: 30,
		selling_price: 28,
		imageUrl: "bundle2.png",
		is_available: true,
		coaching_type: 1,
		discount_percent: null,
		validity_days: 60
	}, {
		bundle_id: 1,
		bundle_category_id: 1,
		name: "Bundle For Psc",
		description: "Contains Questions for psc class clears the bottom-margin of each panel  clears the bottom-margin of each panel",
		mrp: 30,
		selling_price: 28,
		imageUrl: "bundle1.jpg",
		is_available: true,
		coaching_type: 1,
		discount_percent: null,
		validity_days: 60
	}];
	populateBundleList(list, div);
}

function populateBundleList(list, div) {
	var mainDiv = div;
	$(mainDiv).empty();
	if (list.length != 0) {
		for (var i = 0; i < list.length; i++) {
			populateTileForBundle(list[i], mainDiv);
		}
	}
}

function populateTileForBundle(bundleMap, div) {
	var divForTileContainer = $("<div>").addClass("col-md-4 bundleContainer");
	$(div).append(divForTileContainer);
	var containerRow = $("<div>").addClass("row");
	$(divForTileContainer).append(containerRow);
	var divImageContainer = $("<div>").addClass("col-md-4 leftContainer");
	$(divImageContainer).css("background", "url(images/" + bundleMap.imageUrl + ")");
	$(divImageContainer).css("background-size", "cover");
	$(divImageContainer).css("background-position", "center");
	var divRightContainer = $("<div>").addClass("col-md-8 rightContainer");
	$(containerRow).append(divImageContainer);
	$(containerRow).append(divRightContainer);
	var spanForName = $("<span>").addClass("spanForName").html(bundleMap.name);
	var spanForDescription = $("<span>").addClass("spanForDescription").html(bundleMap.description.substring(0, 90));
	$(divRightContainer).append(spanForName);
	$(divRightContainer).append(spanForDescription);

}

function listAllPurchaseNewBundle() {

}