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
  this.timeSend = 0;
  this.parseData = "";
  this.escalon = 0;
  this.medicion = 0;
  this.fileName = "";
  this.toGraph = {};
  this.iteration = 0;
  this.writeTime = Math.round(config.writeTime/this.step)-1;
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

  this.tomaDato = function(){
      this.timeSend++;
      //medPercent = (analog.analogRead(5)*100)/4095;
      //parseData += iteration/100 + '\t ' + escalon + '\t ' + medPercent + '\n';
      if (this.timeSend > this.writeTime) {
        this.escribir(this.fileName,this.parseData);
        this.toGraph = {point : medPercent , pointE : this.escalon};
        this.iteration += 1;
        parseData = "";
        this.timeSend = 0;
      }
  };

  this.pwm = function(){
    this.escribir("/sys/devices/virtual/misc/pwmtimer/level/pwm5",Math.round(this.escalon*2));
  };

}

module.exports = controlador;
