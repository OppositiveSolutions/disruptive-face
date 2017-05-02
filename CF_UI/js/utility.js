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