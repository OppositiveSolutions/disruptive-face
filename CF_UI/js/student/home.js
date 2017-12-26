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
	crossroads.addRoute('myprofile', function (query) {
		showStudentProfile();
	});
	crossroads.addRoute('mytests', function (query) {
		showMyTestPage();
	});
	crossroads.addRoute('myresults', function (query) {
		showMyResultPage();
	});
	crossroads.addRoute('videotutorials', function (query) {
		showMyTutorialPage();
	});
	crossroads.addRoute('buybundles', function (query) {
		showMyBundlePurchasePage();
	});
	crossroads.addRoute('announcements', function (query) {
		showStudentsAnnouncementsPage();
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
	google.charts.load('current', { 'packages': ['corechart'] });
	google.charts.setOnLoadCallback(drawAreaChart);
	updateLeftMenu("Home");
	showPage($("#studentHome")[0]);
	initializeStudentPage();

}

function showStudentProfile() {
	if ($("#studentProfilePage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/student/myprofile.js' + postUrl], function () {
			loadStudentProfilePage();
		});
		return;
	}
	showPage($("#studentProfilePage")[0]);
    initializeStudentProfilePage();
}



function showMyTestPage() {
	if ($("#mytestpage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/student/mytest.js' + postUrl], function () {
			loadMyTestPage();
		});

		return;
	}
	showPage($("#mytestpage")[0]);
	updateLeftMenu("My test");
	getAllTestList();
}
function showMyResultPage() {
	if ($("#myresultpage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/student/myresults.js' + postUrl], function () {
			loadMyResultsPage();
		});

		return;
	}
	showPage($("#myresultpage")[0]);
	updateLeftMenu("My results");
	initializeStudentResultPage();
}
function showMyTutorialPage() {
	if ($("#myTutorialPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/student/tutorial.js' + postUrl], function () {
			loadMyTutorialPage();
		});

		return;
	}
	showPage($("#myTutorialPage")[0]);
	updateLeftMenu("video tutorial");
	initializeMyTutorialsResultPage();
}
function showMyBundlePurchasePage() {
	if ($("#allBundlePage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/student/bundle.js' + postUrl], function () {
			loadAllBundlePage();
		});

		return;
	}
	showPage($("#allBundlePage")[0]);
	updateLeftMenu("buy practice test");
	initializePurchasePage();
}
function initializeStudentPage() {
	google.charts.setOnLoadCallback(drawAreaChart);
	getResultList();
	getExamProgressOfStudent();
}
function getExamProgressOfStudent() {
	console.info(currentAccountDetails);
	var userId = currentAccountDetails.userId;
	var url = protocol + "//" + host + "/result/scorecard";
	$.ajax({
		url: url,
		type: "GET",
		cache: false,
		success: function (list) {
			createProgressGraph(list.data);
		}
	});
}
function createProgressGraph(list) {
	console.info(list);
	var progressMap = [['Date', 'progress']];
	for (var i = 0; i < list.length && i < 10; i++) {

		var arrayForItem = [];
		arrayForItem.push(list[i].examCode);
		arrayForItem.push(list[i].totalMark);
		progressMap.push(arrayForItem);
	}
	console.info(progressMap);
	var options = {
		title: 'Performance',
		hAxis: { title: 'Exams', titleTextStyle: { color: '#333' } },
		vAxis: { minValue: 0, title: 'Progress' }
	};
	drawAreaChart(progressMap, options);
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

	});
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
			setHashInUrl('myprofile');
			break;
		case "my tests":
			setHashInUrl('mytests');
			break;
		case "my results":
			setHashInUrl('myresults');
			break;
		case "video tutorials":
			setHashInUrl('videotutorials');
			break;
		case "buy practice test":
			setHashInUrl('buybundles');
			break;
		case "announcements":
			setHashInUrl('announcements');
			break;
	}
	updateLeftMenu(menuTitle);
}

function showStudentsAnnouncementsPage() {
	if ($("#divStudentAnnouncements")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/student/announcements.js' + postUrl], function () {
			loadStudentAnnouncementsPage();
		});

		return;
	}
	showPage($("#divStudentAnnouncements")[0]);
	updateLeftMenu("announcements");
	initializeStudentAnnouncementPage();
}
