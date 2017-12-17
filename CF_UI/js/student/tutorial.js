function loadMyTutorialPage() {
    $.get("student/mytutorial.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        showMyTutorialPage();
    });
}
function initializeMyTutorialsResultPage() {
    getAllTutorials();
}
function getAllTutorials() {
    var url = protocol + "//" + host + "/video-tutorial";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (list) {
            populateVideoTutorials(list.data);
        }
    });
}
function populateVideoTutorials(list) {
    $("#tutorialDiv").empty();
    for (var i = 0; i < list.length; i++) {
        var panelForVideo = $("<div>").addClass("panel panel-default");
        var panelBody = $("<div>").addClass("panel-body");


        var rowVideoLink = $("<div>").addClass("row");
        $(panelBody).append(rowVideoLink);

        var colVideoDescription = $("<div>").addClass("col-sm-6");
        var subHeadingVideo = $("<h3>").html(list[i].name);
        $(colVideoDescription).append(subHeadingVideo);
        var pForDescription = $("<p>").html(list[i].description);
        $(colVideoDescription).append(pForDescription);

        $(panelForVideo).append(panelBody);

        var divForVIdeo = $("<div>").addClass("col-sm-6");
        $(rowVideoLink).append(divForVIdeo);
        $(rowVideoLink).append(colVideoDescription);
        var iframeForVideo = $("<iframe>").addClass("col-sm-12");
        $(iframeForVideo).attr("height", "250");
        $(iframeForVideo).attr("allowfullscreen", "allowfullscreen");
        $(iframeForVideo).attr("src", list[i].url.replace('watch?v=', 'embed/'));
        $(divForVIdeo).append(iframeForVideo);
        $("#tutorialDiv").append(panelForVideo);
    }
}