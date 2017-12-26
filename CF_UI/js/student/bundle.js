function loadAllBundlePage() {
    $.get("student/bundlepurchase.html", {
        "_": $.now()
    }, function (data) {
        $("#pageContainer").append(data);
        showMyBundlePurchasePage();
    });
}
function initializePurchasePage() {
    getAllCoachingTypes();

}
function getAllCoachingTypes() {
    var url = protocol + "//" + host + "/bundle/coachingTypes";
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (list) {
            populateCoachingTypePanels(list.data);
        }
    });

}
function populateCoachingTypePanels(list) {
    $("#allBundleDiv").empty();
    for (var i = 0; i < list.length; i++) {
        var panelForCategory = $("<div>").addClass("panel panel-default");
        var panelHeadForCategory = $("<div>").addClass("panel-heading");
        $(panelForCategory).append(panelHeadForCategory);
        var panelTitleForCategory = $("<h3>").addClass("panel-title").html(list[i].name);
        $(panelHeadForCategory).append(panelTitleForCategory);
        var panelBodyForCategory = $("<div>").addClass("panel-body");
        $(panelForCategory).append(panelBodyForCategory);
        getAllBundles(list[i].bundle_category_id, panelBodyForCategory);
        $("#allBundleDiv").append(panelForCategory);
    }
}

function getAllBundles(categoryId, div) {
    var url = protocol + "//" + host + "/bundle/list/" + categoryId;
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (list) {
            populateBundleForCategory(list.data, div);
        }
    });
}
function populateBundleForCategory(list, div) {
    var rowForBundleList = $("<div>").addClass("row");
    $(div).html(rowForBundleList);
    for (var i = 0; i < list.length; i++) {
        var divForBundleTile = $("<div>").addClass("col-sm-3 itemTile");
        $(divForBundleTile).data("bundleData", list[i]);
        var divInnerForItemsDetails = $("<div>").addClass("itemDetailContainer");
        $(divForBundleTile).append(divInnerForItemsDetails);


        var pForName = $("<p>").addClass("pforName").html(list[i].name);
        $(divInnerForItemsDetails).append(pForName);

        var pForDescription = $("<p>").addClass("descriptionP").html(list[i].description.substring(0, 100) + "...");
        $(divInnerForItemsDetails).append(pForDescription);

        var spanForOffer = $("<span>").addClass("offerBlock").html(list[i].discount_percent + ' % OFF');
        $(divInnerForItemsDetails).append(spanForOffer);

        var spanForPrize = $("<span>").addClass("prizeBlock").html('<i class="fa fa-inr" ></i> ' + list[i].selling_price);
        $(divInnerForItemsDetails).append(spanForPrize);

        var spanForMrp = $("<span>").addClass("mrpBlock").html('<i class="fa fa-inr" ></i> ' + list[i].mrp);
        $(divInnerForItemsDetails).append(spanForMrp);

        var BuyNowBtnDiv = $("<div>").addClass("text-center buyBtn");
        $(divInnerForItemsDetails).append(BuyNowBtnDiv);
        var btForBuy = $("<button>").addClass("btn btn-sm ").html("Buy Now");
        $(BuyNowBtnDiv).append(btForBuy);
        $(btForBuy).click(function () {
            var bundleData = $(this).closest("div.itemTile").data("bundleData");
            purchaseBundle(bundleData);
        });

        $(rowForBundleList).append(divForBundleTile);
    }
}


function purchaseBundle(bundleData) {
    var url = protocol + "//" + host + "/bundle/purchase/" + bundleData.bundle_id;
    $.ajax({
        url: url,
        type: "GET",
        cache: false,
        success: function (list) {
          //  populateBundleForCategory(list.data, div);
        }
    });
}



