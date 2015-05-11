



////////////////////////////VARIABLES GLOBALES
var IP = "10.2.6.66";
var vector = Array.apply(null, new Array(100)).map(Number.prototype.valueOf,0); //datos salida
var ee = 0; //estado estable
var entrada = [0]; //vector con valores de escalon
var dy, dm, k, t1, t2, Tp, Theta = 0;
var desfase = 0;
var errorsalida =0.5;
var errorentrada = 0.5;
var comparacion=5;
var cont=0;
var aux2 = 0;
var cadena="";
var detener = false;
var d = new Date();
var name = "datos/"+d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()+ "_" + d.getHours()+ "-" +d.getMinutes()+d.getSeconds()+'.txt';
var grafSend=0;
//////////////////////////////////////////////

function escribir(dir,data){
	fs.writeFile(dir,data,function(err){
		if(err) throw err;
	});
}




//Server Config

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



var step = 10; // 10 milisegundos

function tomadato(i){
  setTimeout(function(){

	grafSend++;
	punto = analog.analogRead(5);
	punto = (punto*100)/4095;
	cadena += i/100 + '\t ' + ee + '\t ' + punto + '\n';  //tiempo en s, escalon, signal
	if(grafSend>99){ //99
	fs.appendFile(name, cadena ,function(err){if(err){throw err;}});
	cadena="";
	grafSend=0;
	//console.log(punto);
	io.emit('puntos', { point : punto , pointE : ee});
	}
	//run here
        //[2-10] => [0-3.3] => [0-4096];
        /*
        aux=analog.analogRead(2); //CUIDADO CON EL PIN [0-1] Reciben menos de 3.3V
	aux=(aux*100)/4096;
        vector.push(aux);

        if (i>comparacion) {
        if ((vector[i] - vector[i-comparacion] < errorsalida) && (vector[i] - ee[cont] > 0.05)) {
        ee.push(vector[i]);
        cont=cont+1;
        dy=ee[cont]-ee[cont-1];
        dm=entrada[cont]-entrada[cont-1];
        k=dy/dm;
        for (var i = vector.length - 1; i >= 0; i--) {
            if (vector[i] -0.2832*dy+ee[cont-1] <0.3){
                t1=(i-desfase)*step;
            }
            if (vector[i] - 0.6328*dy+ee[cont-1]<0.3){
                t2=(i-desfase)*step;
            }
        }
        Tp=(t1-t2)*3/2;
        Theta=t2-Tp;
        console.log("k= " +k+ " Tp= " +Tp+ " Theta= " +Theta)
        }
        }

        aux2=i;
        */

        //console.log("iteracion: " +i+ " | tiempo: "+ (i*step) + "ms");
        if(!detener){tomadato(++i);}
  },step);
};



http.listen(process.env.PORT || 3000, process.env.IP || IP, function(){
  var addr = http.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});


function writePin(Bescalon){
  escribir("/sys/devices/virtual/misc/pwmtimer/level/pwm5",Bescalon);
}
