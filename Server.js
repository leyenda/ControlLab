////////////////////////////////////
//IMPORTANTE PCDUINO package.json //
////////////////////////////////////

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var control = require('./Control');
var fs = require('fs');
var spawn = require('child_process').spawn;

config = {
   server_IP : "192.168.1.1",
   step : 10,
   writeTime : 1000,
   renameData : true,
   autoStart : false
};

var controlador = new control(config);
controlador.enablePwm();
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
app.set('view engine', 'jade');

app.get('/grafica', function(req,res){
  fs.readdir('datos',function(err,files){
    var renames= files.map(function(name){
       return name.substr(0,name.length-4);
    });
    res.render('index', {data:renames});
  });
});

app.get('/grafica/:metodo', function(req,res){
    var metodo = req.params.metodo;
    res.render('metodo',{data: metodo});
    var ls = spawn('./prueba.m', ["datos/"+metodo+".txt", 5, metodo]);

    ls.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });

    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    ls.on('close', function (code) {
      io.emit('graficaLista');
      console.log('Termino ejecucion del programa con codigo ' + code);
    });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  socket.on('Creferencia', function(data){
    console.info("Cambio en la referencia:" + data.referencia);
    if(controlador.cambios == 0){
        controlador.m = -controlador.mMax;
        controlador.sumaError = (controlador.m - data.referencia -controlador.td*(data.referencia/controlador.step))*controlador.ti/controlador.step;
        console.log(controlador.sumaError);
    }
    if(data.lazo =="cerrado"){
      controlador.cerrado = true;
      controlador.referencia = parseFloat(data.referencia);
    }else{
      controlador.cerrado = false;
      controlador.referencia = parseFloat(data.referencia);
    }
    console.log(controlador.kc)
    controlador.cambios++;
 });
 socket.on('changeMetod', function(data){
    controlador.kc = data.parametros[0];
    controlador.ti = data.parametros[1];
    controlador.td = data.parametros[2];
    controlador.mMax = controlador.kc*(100+(controlador.limSup*controlador.step)/controlador.ti);
  });
  
  socket.on('OrdenIni', function(data){
    if(!controlador.running){
      if(controlador.rename){
        if(data.lazo == 'cerrado'){
    	    controlador.fileName = "datos/"+ data.metodo +".txt";
    	    console.log(controlador.fileName);
    	}else{
    	    var d = new Date();
    	    controlador.fileName = "datos/"+d.getDate()+"-"+d.getMinutes()+"-"+d.getSeconds()+".txt";
    	    console.log(controlador.fileName);
    	}
      }else{
        controlador.fileName = "datos/BaseDatos.txt";
      }
      controlador.timeSend = 0;
      controlador.parseData = "";
      controlador.iteration = 0;
      if(data.lazo == 'cerrado'){
          controlador.kc = data.parametros[0];
          controlador.ti = data.parametros[1];
          controlador.td = data.parametros[2];
          controlador.mMax = controlador.kc*(100+(controlador.limSup*controlador.step)/controlador.ti);
      }
      run();
    }
  });
  
socket.on('OrdenStop', function(){
    controlador.running = false;
    controlador.cambios = 0;
    controlador.m = 0;
    controlador.iteration = 0;
  });
});


http.listen(process.env.PORT || 3000, process.env.IP || controlador.IP, function(){
  var addr = http.address();
  console.log("Servidor escuchando por", addr.address + ":" + addr.port);
});
