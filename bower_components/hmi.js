$(window).load(function(){
//////////////////////
//Pantalla de carga //
//////////////////////
$('.loading').hide(function(){
  $('.afterLoad').show();
});
//////////////////////
//Responsive Design //
//////////////////////
var ancho = window.innerWidth;
var alto = window.innerHeight;
$('#myChart').attr('width', ancho -20);
$('#myChart').attr('height', alto -20);
$('#myChart').css('margin', '0 auto');




var npoints = 30;
var points = Array.apply(null, new Array(npoints)).map(Number.prototype.valueOf, 0);
var pointsE = Array.apply(null, new Array(npoints)).map(Number.prototype.valueOf, 0);
var resetLabels = Array.apply(null, new Array(npoints)).map(function (x, y) {
  return (y - 29);
});
var labels = Array.apply(null, new Array(npoints)).map(function (x, y) {
  return (y - 29);
});


var data = {
  labels: labels,
  datasets: [{
    label: "Escalon",
    fillColor: "rgba(255,20,20,0.2)",
    strokeColor: "rgba(255,20,20,1)",
    pointColor: "rgba(255,20,20,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(220,220,205,1)",
    data: pointsE
  }, {
    label: "Respuesta",
    fillColor: "rgba(151,187,205,0.2)",
    strokeColor: "rgba(151,187,205,1)",
    pointColor: "rgba(151,187,205,1)",
    pointStrokeColor: "#fff",
    pointHighlightFill: "#fff",
    pointHighlightStroke: "rgba(151,187,205,1)",
    data: points
  }]
};
var ctx = document.getElementById("myChart").getContext("2d");
var myLineChart = new Chart(ctx).Line(data, {
  animation: false,
  showTooltips: false,
  scaleOverride: true,
  scaleSteps: 10,
  scaleStepWidth: 10,
  scaleStartValue: 0,
  bezierCurve: true,
  bezierCurveTension: 0.2,
  pointDot: false,
  scaleGridLineColor : "rgba(255,255,255,.05)",
});

var socket = io();

$('#inicio').click(function (event) {
  event.preventDefault();
  socket.emit('OrdenIni');
  myLineChart.scale.xLabels = resetLabels;
});

$('#Stop').click(function (event) {
  event.preventDefault();
  socket.emit('OrdenStop');
});

var cadena = "";
$("#target").submit(function (event) {
  var str = $("form input:text").val();
  if ((str !== "") && (str >= 0) && (str <= 100) && (str != cadena)) {
    socket.emit('Cescalon', {
      escalon: str
    });
    cadena = str;
  } else {
    console.error('Error: No cumple con las condiciones.');
  }
  event.preventDefault();
});


socket.on('puntos', function (data) {
  //data es un punto
  //reordeno el arreglo anterior de datos como ultimo valor el recibido.
  myLineChart.scale.xLabels = myLineChart.scale.xLabels.map(function (x, y) {
    return x + 1;
  });
  for (var i = 0; i < (npoints - 1); i++) {
    myLineChart.datasets[1].points[i].value = myLineChart.datasets[1].points[i + 1].value;
    myLineChart.datasets[0].points[i].value = myLineChart.datasets[0].points[i + 1].value;
  }
  myLineChart.datasets[1].points[npoints - 1].value = data.point;
  myLineChart.datasets[0].points[npoints - 1].value = data.pointE;
  myLineChart.update();
});
});
