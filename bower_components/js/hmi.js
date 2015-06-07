$(window).load(function () {
  //////////////////////
  //Pantalla de carga //
  //////////////////////
  $('.loading').hide(function () {
    $('.afterLoad').show();
  });
  //////////////////////
  //Responsive Design //
  //////////////////////
  var ancho = window.innerWidth;
  var alto = window.innerHeight;
  $('#myChart').attr('width', ancho - 20);
  $('#myChart').attr('height', alto - 20);
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
      label: "referencia",
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
    scaleGridLineColor: "rgba(255,255,255,.05)",
  });

  var socket = io();
  var parametros = {
    k_ult: [1.121, 0.36, 0.0577], //[Kc Ti Td]
    integral: [0.07, 0.41, 0.39],
    opt: [0.323, 0.41, 0.21],
    polos: [7.405, 0.09617, 0.065],
    sintesis: [0.6124, 0.35, 0.1052]
  };

  $('#metodo').on('change', function () {
    var metodo = $("#metodo").val();
    var param = updateParams(metodo, parametros);
    socket.emit('changeMetod', {
      parametros: param,
    });
  });

  $('#inicio').click(function (event) {
    var state = $('#inicio>span').text();
    if (state == 'Inicio') {
      event.preventDefault();
      if ($('.lazo').attr('name') == 'cerrado') {
        var metodo = $("#metodo").val();
        var param = updateParams(metodo, parametros);
        socket.emit('OrdenIni', {
          metodo: metodo,
          parametros: param,
          lazo: 'cerrado'
        });
      } else {
        socket.emit('OrdenIni', {
          metodo: null,
          parametros: null,
          lazo: 'abierto'
        });
      }
      myLineChart.scale.xLabels = resetLabels;
      $('#inicio>span').text('Parar');
      $('#inicio>i').toggleClass('initAnimate');
      $('#inicio>i').toggleClass('stopAnimate');
      $(this).toggleClass('stop');
    } else {
      socket.emit('OrdenStop');
      $('#inicio>span').text('Inicio');
      $('#inicio>i').toggleClass('initAnimate');
      $('#inicio>i').toggleClass('stopAnimate');
      $(this).toggleClass('stop');
    }
  });

  $(".lazoSel").click(function () {
    var mySpan = $(this).children('.lazo');
    var imagen = $(this).children('img');
    var selector = $(this);
    if (mySpan.attr('name') == 'abierto') {
      mySpan.attr('name', 'cerrado');
      mySpan.text('Lazo cerrado');
      imagen.toggleClass('giro');
      selector.siblings('.abierto').slideToggle(200, function () {
        selector.siblings('.cerrado').slideToggle(200, function () {
          imagen.toggleClass('giro');
        });
      });
    } else {
      mySpan.attr('name', 'abierto');
      mySpan.text('Lazo abierto');
      imagen.toggleClass('giro');
      selector.siblings('.cerrado').slideToggle(200, function () {
        selector.siblings('.abierto').slideToggle(200, function () {
          imagen.toggleClass('giro');
        });
      });
    }
  });


  $("#escalon").click(function (event) {
    var str = $(".abierto>input:text").val();
    if (validator(str)) {
      socket.emit('Creferencia', {
        referencia: str,
        lazo: 'abierto'
      });
    }
    event.preventDefault();
  });



  $("#referencia").click(function (event) {
    var str = $("#set").val();
    if (validator(str)) {
      socket.emit('Creferencia', {
        referencia: str,
        lazo: 'cerrado'
      });
    }
    event.preventDefault();
  });

  $(".inline").colorbox({
    inline: true,
    width: "50%"
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
    $('.vexc').text(data.pointE.toPrecision(4));
    $('.vres').text(data.point.toPrecision(4));
  });
});


function updateParams(metodo, parametros) {
  var param = parametros[metodo];
  $('.kc').text(param[0].toPrecision(4));
  $('.ti').text(param[1].toPrecision(4));
  $('.td').text(param[2].toPrecision(4));
  return param;
}

function validator(str) {
  if ((str !== "") && (str >= 0) && (str <= 100)) {
    return true;
  } else {
    notifyMe('Error: No cumple con las condiciones.');
    return false;
  }
}

function notifyMe(txt) {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    var notification = new Notification(txt);
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(txt);
      }
    });
  }
}
