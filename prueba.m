#!/usr/bin/octave -qf
# example octave script
printf ("Nombre del programa: %s", program_name ());

arg_list = argv ();
file = arg_list{1};
n = str2num(arg_list{2});
metodo = arg_list{3};

tic();
v = importdata(file);
t = v(:,1);
ex = v(:,2);
val = v(:,3);
ref=v(:,4);

val2 = val;
for j = 1:n
    for i = 2:size(val)-1
        if abs(val(i)-val(i-1)) > .1
            val(i) = (val(i-1)+val(i+1))/2;
        end
    end
end

error=ref-val;

fh = figure();
set(fh,'visible','off');
plot(t,val,t,ex,t,ref,t,error);
title(strcat('Metodo: ',metodo));
ylabel('% Senal');
xlabel('Tiempo (s)');
grid on;
grid minor;
print(fh,strcat("bower_components/img/validated/",metodo,".jpg"),"-djpg");
elapsed = toc();

printf("Tiempo de ejecucion: %.4f segundos\n", elapsed);
