////////////////////////////////////
//IMPORTANTE PCDUINO package.json //
////////////////////////////////////

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var control = require('./Control');

config = {
   server_IP : "192.168.1.100",
   step : 10,
   writeTime : 1000,
   renameData : true,
   autoStart : false
};

var controlador = new control(config);

//////////////
//Functions //
//////////////
function run(){
  controlador.running = true;
  setTimeout(function(){
    controlador.tomaDato(function(){
      io.emit('puntos',controlador.toGraph);
    });
    if (controlador.running) {
      run();
    }
  },controlador.step);
}

///////////////////////
//Server Http and io //
///////////////////////

app.use(express.static(__dirname + '/bower_components'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  socket.on('Cescalon', function(data){
    console.info("Cambio en escalon " + data.escalon);
    controlador.escalon = data.escalon;
    //controlador.pwm();
  });
  socket.on('OrdenIni', function(){
    d = new Date();
    if (controlador.renameData){
      controlador.fileName = "datos/"+d.getDate()+this.medicion +".txt";
    }else{
      controlador.fileName = "datos/BaseDatos.txt";
    }
    controlador.timeSend = 0;
    controlador.parseData = "";
    run();
  });
  socket.on('OrdenStop', function(){
    controlador.running = false;
  });
});


http.listen(process.env.PORT || 3000, process.env.IP || controlador.IP, function(){
  var addr = http.address();
  console.log("Servidor escuchando por", addr.address + ":" + addr.port);
});
