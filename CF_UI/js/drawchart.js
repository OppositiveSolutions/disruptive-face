function drawAreaChart(graphData, options) {
  if (!google.visualization) {
    return;
  }

  var data = google.visualization.arrayToDataTable(graphData);

  var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}
function drawBarChart(data, options) {
  if (!google.visualization) {
    return;
  }

  var data = google.visualization.arrayToDataTable(data);

  var chart = new google.charts.Bar(document.getElementById('resultBarChart'));

  chart.draw(data, google.charts.Bar.convertOptions(options));
}