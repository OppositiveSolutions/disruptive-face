function createSettingsGearDiv() {
	var div = $("<div>").addClass("btn-group pull-right");
	var button = $("<button>").addClass("btn btn-white btn-sm dropdown-toggle");
	$(button).attr("data-toggle", "dropdown");
	$(button).attr("aria-expanded", "false");
	$(button).append('<span class="glyphicon glyphicon-cog"></span><span class="caret"></span>');
	$(div).append(button);
	var ul = $("<ul>").addClass("dropdown-menu dropdown-menu-right vitalSettings");
	$(ul).attr("role", "menu");
	$(div).append(ul);
	$(div).on('shown.bs.dropdown', function(e) {
		var div = $(e.target)[0];
		if ($(div).closest("table")[0] != undefined) {
			var clickedDiv = div;
			var tableContainerHeight = $(clickedDiv).find("ul").closest("div.table-responsive").height();
			var trHeightPostion = $(clickedDiv).find("ul").closest("tr").position();
			var trHeight = $(clickedDiv).find("ul").closest("tr").height();
			var ulHeight = $(clickedDiv).find("ul").height();
			var ulOffset = $(clickedDiv).find("ul").position();
			if (trHeightPostion.top + ulHeight + 36 >= tableContainerHeight) {
				if (ulHeight + 28 > trHeight) {
					var paddingBottom = ulHeight - trHeight;
					$(clickedDiv).find("ul").closest("div.table-responsive").css("padding-bottom", paddingBottom + ulOffset.top);
				}
			}
		}
	});
	$(div).on('hidden.bs.dropdown', function(e) {
		var clickedDiv = div;
		$(clickedDiv).find("ul").closest("div.table-responsive").css("padding-bottom", "0px");
	});
	return div;
}

function createAndReturnLiForSettingsGear(text) {
	var li = $("<li>");
	var anchor = $("<a>").html(text);
	$(li).append(anchor);
	return li;
}

function makeNumericTextBox(div, isInteger) {
	var allowededKeyCodes = [46, 8, 9, 27, 13, 110];
	if (!isInteger) {
		allowededKeyCodes.push(190);
	}
	if ($(div).hasClass("numberOnly")) {
		$(div).keydown(function(e) {
			if (e.ctrlKey) {
				if (e.keyCode == 86 || e.keyCode == 65 || e.keyCode == 88 || e.keyCode == 67) {
					return;
				}
			}
			if ((e.keyCode == 190 && $(this).val().indexOf('.') != -1)) {
				e.preventDefault();
			}
			if (($.inArray(e.keyCode, allowededKeyCodes) !== -1 && !e.shiftKey) || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
				return;
			}
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			}

		});

	} else {
		$(div).find(".numberOnly").keydown(function(e) {
			if (e.ctrlKey) {
				if (e.keyCode == 86 || e.keyCode == 65 || e.keyCode == 88 || e.keyCode == 67) {
					return;
				}
			}
			if ((e.keyCode == 190 && $(this).val().indexOf('.') != -1)) {
				e.preventDefault();
			}
			if (($.inArray(e.keyCode, allowededKeyCodes) !== -1 && !e.shiftKey) || (e.keyCode == 65 && e.ctrlKey === true) || (e.keyCode >= 35 && e.keyCode <= 39)) {
				return;
			}
			if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
				e.preventDefault();
			}
		});
	}
}

function attachDateTimePickers(div) {
	if ($().datetimepicker == undefined) {
		loadFilesAndExecuteCallback(['js/jquery.datetimepicker.js', 'css/jquery.datetimepicker.css'], function() {
			attachDateTimePickers(div);
		});
		return;
	}

	if ($().datetimepicker == undefined && $().mask == undefined) {
		loadFilesAndExecuteCallback(['js/jquery.datetimepicker.js', 'css/jquery.datetimepicker.css', 'js/jquery.mask.js' + postUrl], function() {
			attachDateTimePickers(div);
		});
		return;
	} else if ($().datetimepicker == undefined) {
		loadFilesAndExecuteCallback(['js/jquery.datetimepicker.js', 'css/jquery.datetimepicker.css'], function() {
			attachDateTimePickers(div);
		});
		return;
	} else if ($().mask == undefined) {
		loadFilesAndExecuteCallback(['js/jquery.mask.js' + postUrl], function() {
			attachDatePickers(div);
		});
		return;
	}
	$(div).find(".date").datetimepicker({
		format: 'm/d/Y g:i A',
		formatTime: 'g:i A',
		formatDate: 'd/m/Y',
		timepicker: true,
		validateOnBlur: false,
	});
	$(div).find(".date").mask("99/99/9999 99:99 AA");

}

function attachDatePickers(div) {
	if ($().datetimepicker == undefined) {
		loadFilesAndExecuteCallback(['js/jquery.datetimepicker.js', 'css/jquery.datetimepicker.css'], function() {
			attachDatePickers(div);
		});
		return;
	}

	if ($().datetimepicker == undefined && $().mask == undefined) {
		loadFilesAndExecuteCallback(['js/jquery.datetimepicker.js', 'css/jquery.datetimepicker.css', 'js/jquery.mask.js' + postUrl], function() {
			attachDatePickers(div);
		});
		return;
	} else if ($().datetimepicker == undefined) {
		loadFilesAndExecuteCallback(['js/jquery.datetimepicker.js', 'css/jquery.datetimepicker.css'], function() {
			attachDatePickers(div);
		});
		return;
	} else if ($().mask == undefined) {
		loadFilesAndExecuteCallback(['js/jquery.mask.js' + postUrl], function() {
			attachDatePickers(div);
		});
		return;
	}
	$(div).find(".date").datetimepicker({
		format: 'm/d/Y',
		formatDate: 'd/m/Y',
		timepicker: false,
		validateOnBlur: false,
	});
	$(div).find(".date").mask("99/99/9999");
}

function focusFirstTextbox(div) {
	if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		if ($(div).find("form").find("[fieldId]").attr("class") != undefined) {
			if ($(div).find("form").find("[fieldId]").attr("class").indexOf("date") >= 0) {
				return;
			}
		}
		$(div).find("form").find("select[fieldId],input[fieldId],input:radio[name^=control],textarea").first().focus();
	}
}

function attachTimePickers(div, callBack) {
	if ($().datetimepicker == undefined) {
		loadFilesAndExecuteCallback(['js/jquery.datetimepicker.js', 'css/jquery.datetimepicker.css'], function() {
			attachTimePickers(div, callBack);
		});
		return;
	}
	$(div).find(".time").datetimepicker({
		format: 'g:i A',
		formatTime: 'g:i A',
		datepicker: false,
		validateOnBlur: false
	});
	if (callBack != undefined) {
		callBack();
	}
}

function isEmail(email) {
	var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
