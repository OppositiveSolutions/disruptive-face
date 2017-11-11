function drawAreaChart(graphData,options) {
	var data = google.visualization.arrayToDataTable(graphData);

	var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
	chart.draw(data, options);
}