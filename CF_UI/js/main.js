var DEFAULT_HASH = 'home';
$(document).ready(function () {
	initialize();
	checkSession();
});

function checkSession() {
	var url = protocol + "//" + host + "/login";
	$.ajax({
		url: url,
		type: "GET",
		cache: false,
		success: function (statusMap) {
			currentAccountDetails = statusMap.data;
			if (statusMap.status == STATUS_OK) {
				loadContainerPage(statusMap);
			}
		},
		error: function () {
			setHashInUrl('login');
		}
	});

}

// setup crossroads
// crossroads.ignoreState = true;
if (!hasher.getHash()) {
	console.info(hasher.getHash());
	// hasher.setHash(DEFAULT_HASH);
}
var loginRoute = crossroads.addRoute('login', function (query) {
	var session = false;
	var url = protocol + "//" + host + "/login";
	$.ajax({
		url: url,
		type: "GET",
		cache: false,
		success: function (statusMap) {
			currentAccountDetails = statusMap.data;
			if (statusMap.status == STATUS_OK) {
				setHashInUrl('home');
			}
		},
		error: function () {
			loadLoginPage();
		}
	});
});
// crossroads.bypassed.add(function() {
// setHashInUrl('login');
// });
// hasher.initialized.add(parseHash);
// parse initial hash
hasher.changed.add(parseHash);
// parse hash changes

hasher.init();
// start listening for hash changes

function loadFilesAndExecutecallBack(files, callBack) {
	head.load(files, function () {
		if (callBack != undefined) {
			callBack();
		}
	});
}

function initialize() {
	if (typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function (elt /* , from */) {
			var len = this.length >>> 0;
			var from = Number(arguments[1]) || 0;
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0)
				from += len;
			for (; from < len; from++) {
				if (from in this && this[from] === elt)
					return from;
			}
			return -1;
		};
	}
	$(document).ajaxSend(
		function (e, xhr, settings) {
			if (settings.hideLoading != undefined && settings.hideLoading) {
				return;
			}
			loadingMsg = settings.action == undefined ? "Loading" : settings.action;
			var regex = /\.html$/;
			if (regex.test(settings.url)) {
				return;
			}
			regex = /\.xml$/;
			if (regex.test(settings.url)) {
				loadingMsg = "Loading data";
			}
			isAjaxProgress = true;
		}).ajaxStop(function () {
			isAjaxProgress = false;
		});
	$.ajaxSetup({
		beforeSend: function (jqXHR) {
			// $.xhrPool.push(jqXHR);
		},
		complete: function (result, status, xhr) {
			// var index = $.xhrPool.indexOf(result);
			// if (index > -1) {
			// $.xhrPool.splice(index, 1);
			// }
			try {
				var responseText = result.responseText.trim();
				if (responseText == '#NO_SESSION#') { }
			} catch (err) {

			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			if (jqXHR.status == "0") {
				// alert("Seems like your internet connection is broken. Please
				// try again later. ");
			}
		}
	});
	jQuery.expr[":"].containsIgnoreCase = jQuery.expr
		.createPseudo(function (arg) {
			return function (elem) {
				return jQuery(elem).text().toUpperCase().indexOf(
					arg.toUpperCase()) >= 0;
			};
		});
	host = window.location.host + "/" + RESTFUL_DIR;
	protocol = window.location.protocol;
}

function loadLoginPage() {
	$.get("login.html", {
		"_": $.now()
	}, function (data) {
		$("#loginPage").remove();
		$("#pageContainer").empty();
		$("#container").remove();
		$("body").append(data);
		$("#lblSignUp").click(
			function () {
				window.location = protocol + "//" + window.location.host + FOLDER_NAME +
					"/signup.html";
			});
		$("#btnLogin").unbind('click');
		$("#btnLogin").click(function () {
			var username = $("#txtEmailId").val().trim();
			var password = $("#txtPassword").val();
			if (username == "") {
				alert("Enter your email address");
				return;
			}
			if (password == "") {
				alert("Enter your password");
				return;
			}
			authenticate(username, password);
		});

		$("#lblForgotPassword").unbind('mousedown');
		$("#lblForgotPassword").on("mousedown", function () {
			loadForgotPasswordPage();
		});
		$("#txtPassword").unbind("keydown");
		$("#txtPassword").keydown(function (event) {
			if (event.keyCode == 13) {
				var username = $("#txtEmailId").val().trim();
				var password = $("#txtPassword").val();
				if (username == "") {
					alert("Enter your email address");
					return;
				}
				if (password == "") {
					alert("Enter your password");
					return;
				}
				authenticate(username, password);
			}
		});

	});
}

function authenticate(username, password) {
	var url = protocol + "//" + host + "/login";
	$.ajax({
		url: url,
		type: "POST",
		cache: false,
		action: "Authenticating",
		data: {
			username: username,
			password: password
		},
		success: function (statusMap) {
			currentAccountDetails = statusMap.data;
			currentAccountDetails.role = statusMap.data.role;
			loadContainerPage(statusMap);
		}
	});
}

function loadContainerPage(statusMap) {
	$.get("container.html", {
		"_": $.now()
	}, function (data) {
		$("#loginPage").remove();
		$("#container").remove();
		$("body").append(data);
		currentAccountDetails = {};
		currentAccountDetails=statusMap.data;
		console.info(statusMap.data);
		currentAccountDetails.role = statusMap.data.role;
		initializePagesBasedOnRole();
		$("#btnLogOut").click(function () {
			logout();
		});
		console.info(currentAccountDetails);
		$("#lblAccountHolderName").html(currentAccountDetails.firstName + " " + currentAccountDetails.lastName);
		$("#emailid").html(currentAccountDetails.emailid);
	});

}

function initializePagesBasedOnRole() {
	console.info(currentAccountDetails);
	switch (currentAccountDetails.role.toString()) {
		case STUDENT:
			loadFilesAndExecutecallBack(['js/student/home.js' + postUrl], function () {
				initializeStudentRoutes();
				loadStudentView();
			});
			break;
		case ADMIN:
			loadFilesAndExecutecallBack(['js/superadmin/home.js' + postUrl], function () {
				initializeSuperAdminRoutes();
				loadSuperAdminView();
			});
			break;
	}
}

function parseHash(newHash, oldHash) {
	// second parameter of crossroads.parse() is the "defaultArguments" and
	// should be an array
	// so we ignore the "oldHash" argument to avoid issues.
	crossroads.parse(newHash);
}

function showPage(toPage) {
	$(".page").hide();
	$(toPage).show();
}

jQuery.expr[':'].contains = function (a, i, m) {
	return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
};

function updateLeftMenu(menuTitle) {
	$("#leftMenuContainer").find("div.activeMenu").removeClass("activeMenu");
	$("#leftMenuContainer").find("div:contains(" + menuTitle + ")").addClass(
		"activeMenu");
}

function setHashInUrl(hash) {
	var previousHash = hasher.getHash();
	hasher.setHash(hash);
	if (previousHash == hash) {
		parseHash(hash);
	}
}

function logout() {
	var url = protocol + "//" + host + "/logout";
	$.ajax({
		url: url,
		type: "GET",
		cache: false,
		success: function () {
			setHashInUrl('login');
		},
		error: function () {
			setHashInUrl('login');
		}
	});
}

function initializeDataTable(tableId, isRenderMobileView, displayStart,
	callBackAfterNextOrPreviousClick) {
	try {
		$.fn.dataTableExt.sErrMode = 'throw';
	} catch (err) {

	}
	isRenderMobileView = isRenderMobileView == undefined ? true :
		isRenderMobileView;
	var table = $("#" + tableId)[0];
	if (!$(table).is("table")) {
		table = $(table).children("table.table")[0];
	}
	var bindFunction;

	try {
		jQuery.extend(jQuery.fn.dataTableExt.oSort, {
			"date-uk-pre": function (a) {
				if (a == null || a == "") {
					return 0;
				}
				return parseMMDDYYYYHHMMToJSDateObject(a).getTime();
			},

			"date-uk-asc": function (a, b) {
				return ((a < b) ? -1 : ((a > b) ? 1 : 0));
			},

			"date-uk-desc": function (a, b) {
				return ((a < b) ? 1 : ((a > b) ? -1 : 0));
			}
		});

	} catch (err) {

	}
	var dontSort = [];
	$(table).find('thead th').each(function (index) {
		var thText = $(this).text();
		$(table).find('tbody tr').each(function (indexOfTd) {
			$(this).find('td:eq(' + index + ')').attr("data-title", thText);
		});
	});
	$(table).find('thead th').each(function (index) {
		if ($(this).hasClass('dont-sort')) {
			dontSort.push({
				"bSortable": false,
			});
			// dontSort.push(null);
		} else if ($(this).hasClass('sortDate')) {
			dontSort.push({
				"bSortable": true,
				"sType": 'date-uk',
				"iDataSort": index - 1,
			});
		} else if ($(this).hasClass('numeric')) {
			dontSort.push({
				"bSortable": true,
				"sType": 'numeric',
			});
		} else {
			dontSort.push(null);
		}
	});
	var iDisplayStart = displayStart == undefined ? 0 : displayStart;
	try {
		dataTableList[tableId] = $(table).dataTable({
			"sDom": '<"top"fp<"clear">>rt<"bottom"ip<"clear">>',
			"aaSorting": [],
			"bAutoWidth": false,
			"responsive": true,
			"destroy": true,
			"bDestroy": true,
			"iDisplayStart": iDisplayStart,
			"fnDrawCallback": function (oSettings) {
				//------------------------for removing scroll if no data available
				if (oSettings._iDisplayEnd == 0) {
					$(table).closest("div.table-responsive").addClass("table-nodata");
				} else {
					$(table).closest("div.table-responsive").removeClass("table-nodata");
				}
				if (bindFunction != undefined) {
					bindFunction();
				}
			},
			"aoColumns": dontSort,
			"fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
				if ($(table).hasClass("slNo")) {
					var index = $(table).find("th.slNo").index();
					if (index == "-1") {
						index = 0;
					}
					$("td:eq(" + index + ")", nRow).html(parseInt(iDisplayIndexFull + 1));
				}
				return nRow;
			},
		});
	} catch (err) {
		console.info(err);
	}
}

function destroyDataTable(tableId) {
	if (dataTableList[tableId] != undefined) {
		try {
			if (dataTableList[tableId].fnSettings() != null) {
				dataTableList[tableId].fnClearTable();
				dataTableList[tableId].fnDestroy();
				dataTableList[tableId].destroy();
			}
		} catch (err) {
			console.info("asdasas")
		}
	}
}
