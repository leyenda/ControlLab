var fs = require('fs');

//GLOBAL = [[t1,t2,t3, ...],[e1,e2,e3, ...], [s1,s2,s3, ...]]

//GLOABAL = [[t1, e1, s1],[t1, e1, s1],[t1, e1, s1], ...];
var vt = [1,2,3,4,5,6,7,8,9];
var vs = [1,2,3,4,5,6,7,8,9];
var ve = [1,2,3,4,5,6,7,8,9];

function reorganizar(vt,vs,ve){
  var global =[];
  for (var i = vt.length; i--; ) {
    global[i] = [vt[i], vs[i], ve[i]];
  }
  return global;
}

var arr = reorganizar(vt,vs,ve);

var file = fs.createWriteStream('arrayb.txt');
file.on('error', function(err) { console.log("Todo Fracaso"+ err) });
arr.forEach(function(v) { file.write(v.join('\t') + '\n'); });
file.end();