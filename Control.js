var pcduino = require("pcduino");
var digital = pcduino.digital;
var analog = pcduino.analog;
var fs = require('fs');
var linAlg = require('linear-algebra')({
    add: require('add')
  }),
  Matrix = linAlg.Matrix;

function controlador(config) {
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
  var derivada = 0;
  var integral = 0;
  this.limSup = 20000;
  this.sumaError = 0;
  this.td = 0;
  this.ti = 0;
  this.kc = 0;
  this.referencia = 0;
  this.mMax = 0;
  this.timeSend = 0;
  this.parseData = "";
  this.m = 0;
  this.z = [];
  this.m_ant = 0;
  this.error = [0, 0];
  this.medicion = 0;
  this.fileName = "";
  this.toGraph = {};
  this.iteration = 0;
  this.writeTime = Math.round(config.writeTime / this.step) - 1;
  this.cerrado = false;
  this.cambios = 0;
  ////////////
  //Matrices//
  ////////////
  this.A = new Matrix([
    [-9.5052, -127.3539],
    [1, 0]
  ]);
  this.B = new Matrix([
    [1],
    [0]
  ]);
  this.C = new Matrix([
    [0, 92.3196]
  ]);
  this.D = new Matrix([
    [0]
  ]);
  var I = new Matrix.identity(2);
  this.z0 = new Matrix([
    [0],
    [0]
  ]);
  this.z1 = new Matrix([
    [0],
    [0]
  ]);
  var efa = this.A.mulEach(this.step).plus(I);
  ////////////
  //Metodos //
  ////////////
  this.z = Array.apply(null, new Array(66)).map(Number.prototype.valueOf, 0);

  this.escribir = function (dir, data) {
    fs.writeFile(dir, data, function (err) {
      if (err) throw err;
    });
  };

  this.enablePwm = function () {
    this.escribir("/sys/devices/virtual/misc/gpio/mode/gpio5", "2");
    this.escribir("/sys/devices/virtual/misc/pwmtimer/enable/pwm5", "1");
    this.escribir("/sys/devices/virtual/misc/pwmtimer/level/pwm5", "0");
  };

  this.tomaDato = function (callback) {
    this.timeSend++;
    medPercent = (analog.analogRead(5) * 100) / 4095;
    if (this.cerrado) {
      this.z1 = efa.mul(this.z0).plus(this.B.mulEach(this.step * this.m));
      this.z0 = this.z1;
      for (i = 0; i < 65; i++) {
        this.z[i] = this.z[i + 1]
      }
      this.z[65] = this.C.mul(this.z1).plus(this.D.mulEach(this.m));
      this.error[0] = this.error[1];
      this.error[1] = this.referencia - (medPercent - this.z[0] + this.z[66]);
      if (Math.abs(this.error[1]) > 0.01 * this.referencia) {
        this.sumaError += this.error[1];
        derivada = this.td * (this.error[1] - this.error[0]) / this.step;
        integral = (1 / this.ti) * this.sumaError * this.step;
        if (this.sumaError > this.limSup) {
          this.sumaError = this.limSup;
        } else if (this.sumaError < -this.limSup) {
          this.sumaError = -this.limSup;
        }
        this.m = this.kc * (this.error[1] + derivada + integral);
        if (this.m > this.mMax) {
          this.m = this.mMax;
        } else if (this.m < -this.mMax) {
          this.m = -this.mMax;
        }
        this.m = 10 * (this.m + this.mMax) / (2 * this.mMax);
        this.m = this.m * 10;
      }
    } else {
      this.m = this.referencia;
    }
    this.pwm();
    this.parseData += this.iteration / (100) + '\t ' + this.m + '\t ' + medPercent + '\t' + this.referencia + '\n';
    if (this.timeSend > this.writeTime) {
      fs.appendFile(this.fileName, this.parseData, function (err) {
        if (err) throw err;
      });
      this.toGraph = {
        point: medPercent,
        pointE: this.m
      };
      this.timeSend = 0;
      this.parseData = "";
      callback();
    }
    this.iteration++;
  };

  this.pwm = function () {
    this.escribir("/sys/devices/virtual/misc/pwmtimer/level/pwm5", Math.round(this.m * 2));
  };

}

module.exports = controlador;
