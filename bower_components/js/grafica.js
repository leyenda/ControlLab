var socket = io();
socket.on('graficaLista', function () {
  $('.wrapper').fadeOut(function () {
    $('.grafica').fadeIn();
  });
});
