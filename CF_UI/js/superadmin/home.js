function loadSuperAdminView() {
	loadSuperAdminLeftMenu();
	showExamMasterPage();
}

function initializeSuperAdminRoutes() {
	crossroads.addRoute('dashboard', function(query) {

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
	crossroads.addRoute('manage-center', function(query) {
		showManageCenterPage();
	});
	crossroads.addRoute('student-details', function(query) {
		showStudentDetailsPage();
	});
	crossroads.addRoute('staff-details', function(query) {
		showStaffDetailsPage();
	});
	crossroads.addRoute('testimonial', function(query) {
		showTestimonialPage();
	});
	crossroads.addRoute('video-tutorial', function(query) {
		showVideoTutorialPage();
	});
	crossroads.addRoute('announcements', function(query) {
		showAnouncementsPage();
	});
	crossroads.addRoute('bundles', function(query) {
		showBundlesPage();
	});
	crossroads.bypassed.add(function() {
		hasher.setHash('home');
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

function loadSuperAdminLeftMenu() {
	$.get("superadmin/leftmenu.html", {
		"_": $.now()
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
		"_": $.now()
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

function showAnouncementsPage() {
	if ($("#divSuperAdminAnouncementsPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/anouncements.js' + postUrl], function() {
			loadAnouncementsPage(true);
		});
		return;
	}
	getAnnouncements();
	updateLeftMenu("Anouncements");
	showPage($("#divSuperAdminAnouncementsPage")[0]);
}

function showBundlesPage() {
	if ($("#divSuperAdminBundlesPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/bundles.js' + postUrl], function() {
			loadBundlesPage(true);
		});
		return;
	}

	updateLeftMenu("Bundles");
	showPage($("#divSuperAdminBundlesPage")[0]);
}

function showManageCenterPage() {
	if ($("#divSuperAdminManageCenterPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/managecenter.js' + postUrl], function() {
			loadManageCenterPage(true);
		});
		return;
	}
	getCenters();
	updateLeftMenu("Manage Center");
	showPage($("#divSuperAdminManageCenterPage")[0]);
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

function showStudentDetailsPage() {
	if ($("#divSuperAdminStudentDetailsPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/studentdetails.js' + postUrl], function() {
			loadStudentDetailPage(true);
		});
		return;
	}
	getStudents();
	updateLeftMenu("Student Details");
	showPage($("#divSuperAdminStudentDetailsPage")[0]);
}

function showStaffDetailsPage() {
	if ($("#divSuperAdminStaffDetailsPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/staffdetails.js' + postUrl], function() {
			loadStaffDetailsPage(true);
		});
		return;
	}
	getStaff();
	updateLeftMenu("Staff Details");
	showPage($("#divSuperAdminStaffDetailsPage")[0]);
}

function showVideoTutorialPage() {
	if ($("#divSuperadminVideoTutorialPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/videotutorial.js' + postUrl], function() {
			loadVideoTutorialPage(true);
		});
		return;
	}
	getVideoTutorials();
	updateLeftMenu("Video Tutorial");
	showPage($("#divSuperadminVideoTutorialPage")[0]);
}

function showTestimonialPage() {
	if ($("#divSuperadminTestimonialPage")[0] == undefined) {
		loadFilesAndExecutecallBack(['js/superadmin/testimonial.js' + postUrl], function() {
			loadTestimonialPage(true);
		});
		return;
	}
	getTestimonials();
	updateLeftMenu("Testimonial");
	showPage($("#divSuperadminTestimonialPage")[0]);
}

function handleSuperAdminMenuClick(menuDiv) {
	var menuTitle = $(menuDiv).text();
	menuTitle = menuTitle.trim();
	var previousHash = hasher.getHash();
	console.info(menuTitle);
	switch (menuTitle.toLowerCase()) {
		case "home":
			setHashInUrl('home');
			break;
		case "category master":
			setHashInUrl('category');
			break;
		case "exam master":
			setHashInUrl('exam-master');
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
		case "testimonial":
			setHashInUrl('testimonial');
			break;
		case "video tutorial":
			setHashInUrl('video-tutorial');
			break;
		case "announcements":
			setHashInUrl('announcements');
			break;
		case "bundles":
			setHashInUrl('bundles');
			break;
	}


	updateLeftMenu(menuTitle);
}
