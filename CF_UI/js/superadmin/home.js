function loadSuperAdminView() {
	loadSuperAdminLeftMenu();
}

function initializeSuperAdminRoutes() {
	crossroads.addRoute('dashboard', function(query) {
		alert("dash");

	});

	crossroads.addRoute('home', function(query) {
		showSuperAdminHomPage();
	});
	crossroads.addRoute('category', function(query) {
		showCategoryMasterPage();
	});
	crossroads.addRoute('exam-master', function(query) {
		showExamMasterPage();
	});
	crossroads.bypassed.add(function() {
		hasher.setHash('home');
	});
	crossroads.routed.add(console.log, console);
	//log all routes
	//setup hasher
	hasher.initialized.add(parseHash);
	//only required if you want to set a default value
	if (! hasher.getHash()) {
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

function loadSuperAdminLeftMenu() {
	$.get("superadmin/leftmenu.html", {
		"_" : $.now()
	}, function(data) {
		$("#leftMenuContainer").append(data);
		$("#leftMenuContainer li>div").click(function() {
			handleSuperAdminMenuClick($(this)[0]);
		});
	});

}

function showSuperAdminHomPage() {
	if ($("#superAdminHome")[0] == undefined) {
		loadSuperAmdinHomePage();
		return;
	}
	updateLeftMenu("Home");
	showPage($("#superAdminHome")[0]);
}

function loadSuperAmdinHomePage() {
	$.get("superadmin/home.html", {
		"_" : $.now()
	}, function(data) {
		$("#pageContainer").append(data);
		showSuperAdminHomPage();
	});
}

function showCategoryMasterPage() {
	if ($("#divSuperAdminCategoryPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/category.js' + postUrl], function() {
			loadCategoryMasterPage(true);
		});
		return;
	}
	updateLeftMenu("Category Master");
	showPage($("#divSuperAdminCategoryPage")[0]);
	getCategory();
	//$("#divAddNewCategoryPage").modal("show");
}

function showExamMasterPage() {
	if ($("#divSuperAdminExamMasterPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/exammaster.js' + postUrl], function() {
			loadExamMasterPage(true);
		});
		return;
	}
	getExamMasterExams();
	updateLeftMenu("Exam Master");
	showPage($("#divSuperAdminExamMasterPage")[0]);
	//$("#divAddNewCategoryPage").modal("show");
}

function handleSuperAdminMenuClick(menuDiv) {
	var menuTitle = $(menuDiv).text();
	menuTitle = menuTitle.trim();
	var previousHash = hasher.getHash();
	switch(menuTitle.toLowerCase()) {
	case "home":
		setHashInUrl('home');
		break;
	case "category master":
		setHashInUrl('category');
		break;
	case  "exam master":
		setHashInUrl('exam-master');
		break;
	}
	updateLeftMenu(menuTitle);
}
