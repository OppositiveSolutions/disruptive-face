function populateStateDropdown(dropDown, callback) {
  $(dropDown).empty();
  $.get(protocol + "//" + host + "/common/states", {
    "_": $.now()
  }, function (obj) {
    var list = obj.data;
    var optionSelect = $("<option>").html("Select");
    $(optionSelect).attr("value", "0");
    $(dropDown).append(optionSelect);
    for (var i = 0; i < list.length; ++i) {
      var option = $("<option>", {
        value: list[i].stateId
      }).html(list[i].name);
      $(dropDown).append(option);
    }
  });
}

function trimValuesInObject(obj) {
  for (var key in obj) {
    if (obj[key] != null && obj[key] != undefined && typeof obj[key] === 'string') {
      obj[key] = obj[key].trim();
    }
  }
  return obj;
}
