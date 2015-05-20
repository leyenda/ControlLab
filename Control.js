//var pcduino = require("pcduino");
//var digital = pcduino.digital;
//var analog = pcduino.analog;
var fs =require('fs');

function controlador(config){
//////////////////
//Constructor   //
//////////////////
  this.IP = config.server_IP;
  this.step = config.step;
  this.rename = config.renameData;
  this.running = config.autoStart;
////////////////////
//Local variables //
////////////////////
  var medPercent = 0;
  var sumaError=0;
  var de=0;
  var limSup =30;
  var limInf =-0.5;
  this.td =0.39;
  this.ti =0.411;
  this.kc = 0.07;
  this.timeSend = 0;
  this.parseData = "";
  this.m = 0;
  this.error=[0,0];
  this.referencia=0;
  this.metodo;
  this.medicion = 0;
  this.fileName = "";
  this.toGraph = {};
  this.iteration = 0;
  this.writeTime = Math.round(config.writeTime/this.step)-1;
  this.cerrado = false;
////////////
//Metodos //
////////////
  this.escribir = function(dir,data){
    fs.writeFile(dir,data,function(err){
      if(err) throw err;
    });
  };

//  this.enablePwm = function(){
//    escribir("/sys/devices/virtual/misc/gpio/mode/gpio5","2");
//    escribir("/sys/devices/virtual/misc/pwmtimer/enable/pwm5","1");
//    escribir("/sys/devices/virtual/misc/pwmtimer/level/pwm5","0");
//  };

  this.tomaDato = function(callback){
      this.timeSend++;
      //medPercent = (analog.analogRead(5)*100)/4095;
      if(this.cerrado){
        this.error[0] = this.error[1];
        this.error[1] = this.referencia - medPercent;
        this.de = (this.error[1]-this.error[0])/this.step;
        this.sumaError += this.error[1];
        this.m = this.kc*(this.error[1]+this.td*this.de + (1/this.ti)*this.sumaError*this.step);
      }else{
        this.m = this.referencia;
      }
      //this.parseData += iteration/(this.writeTime+1) + '\t ' iteration + '\t ' + this.m + '\t ' + medPercent + '\n';
      if (this.timeSend > this.writeTime) {
        this.escribir(this.fileName,this.parseData);
        this.toGraph = {point : medPercent , pointE : this.referencia};
        callback();
        this.iteration += 1;
        this.parseData = "";
        this.timeSend = 0;
      }
  };
  
  this.cLoop = function(metodo,referencia){
    this.cerrado = true;
    this.metodo = metodo;
    this.referencia = referencia;
  };
  
  this.oLoop = function(referencia){
    this.cerrado = false;
    this.metodo = null;
    this.referencia = referencia;
  }

  this.pwm = function(){
    this.escribir("/sys/devices/virtual/misc/pwmtimer/level/pwm5",Math.round(this.m*2));
  };

}

module.exports = controlador;
