var DEFAULT_HASH = 'home';
$(document).ready(function() {
	initialize();
	checkSession();
});
function checkSession() {
	var session = false;
	alert("session");
	if (!session) {
		hasher.setHash('');
		loadLoginPage();
	}
	parseHash(hasher.getHash());
}

//setup crossroads
crossroads.ignoreState = true;
crossroads.addRoute('home', function() {
	loadFilesAndExecutecallBack(['js/main2.js', 'css/jquery-ui.css'], function() {
		all("ASddddddddddddddddddddd");
	});

});
crossroads.addRoute('dashboard', function(query) {
	alert("dash");

});
crossroads.addRoute('', function() {
	alert("login");
}, 1);

crossroads.bypassed.add(function() {
	hasher.setHash('');
});

crossroads.routed.add(console.log, console);
//log all routes
//setup hasher

//only required if you want to set a default value
if (! hasher.getHash()) {
	console.info(hasher.getHash());
	//hasher.setHash(DEFAULT_HASH);
}
function parseHash(newHash, oldHash) {
	// second parameter of crossroads.parse() is the "defaultArguments" and should be an array
	// so we ignore the "oldHash" argument to avoid issues.
	console.info(newHash);
	crossroads.parse(newHash);
}

//hasher.initialized.add(parseHash);
//parse initial hash
hasher.changed.add(parseHash);
//parse hash changes

hasher.init();
//start listening for hash changes

function loadFilesAndExecutecallBack(files, callBack) {
	head.load(files, function() {
		if (callBack != undefined) {
			callBack();
		}
	});
}

function initialize() {
	if ( typeof String.prototype.trim !== 'function') {
		String.prototype.trim = function() {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	if (!Array.prototype.indexOf) {
		Array.prototype.indexOf = function(elt /* , from */) {
			var len = this.length >>> 0;
			var from = Number(arguments[1]) || 0;
			from = (from < 0) ? Math.ceil(from) : Math.floor(from);
			if (from < 0)
				from += len;
			for (; from < len; from++) {
				if ( from in this && this[from] === elt)
					return from;
			}
			return -1;
		};
	}
	$(document).ajaxSend(function(e, xhr, settings) {
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
	}).ajaxStop(function() {
		isAjaxProgress = false;
	});
	$.ajaxSetup({
		beforeSend : function(jqXHR) {
			//$.xhrPool.push(jqXHR);
		},
		complete : function(result, status, xhr) {
			// var index = $.xhrPool.indexOf(result);
			// if (index > -1) {
			// $.xhrPool.splice(index, 1);
			// }
			try {
				var responseText = result.responseText.trim();
				if (responseText == '#NO_SESSION#') {
				}
			} catch (err) {

			}
		},
		error : function(jqXHR, textStatus, errorThrown) {
			if (jqXHR.status == "0") {
				// alert("Seems like your internet connection is broken. Please
				// try again later. ");
			}
		}
	});
	jQuery.expr[":"].containsIgnoreCase = jQuery.expr.createPseudo(function(arg) {
		return function(elem) {
			return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
		};
	});
	host = window.location.host + "/" + RESTFUL_DIR;
	protocol = window.location.protocol;
}

function loadLoginPage() {
	$.get("login.html", {
		"_" : $.now()
	}, function(data) {
		$("#loginPage").remove();
		$("body").append(data);
		$("#lblSignUp").click(function() {
			//----------signup disabled after screening
			return;
			window.location = protocol + "//" + window.location.host + FOLDER_NAME + "/signup.html";
		});
		$("#btnLogin").unbind('click');
		$("#btnLogin").click(function() {
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
		$("#lblForgotPassword").on("mousedown", function() {
			loadForgotPasswordPage();
		});
		$("#txtPassword").unbind("keydown");
		$("#txtPassword").keydown(function(event) {
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
