# ControlLab

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/leyenda/ControlLab?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)


En este repositorio está el código necesario para la identificación por curva de reacción en lazo abierto de la función de transferencia de alguna planta, en nuestro caso específico una generadora de voltaje con voltaje de excitación en el generador como variable controlada.

Se ha utilizado un Pcduino para la adquisición de datos, una HMI ha sido desarrollada en HTML y JavaScript, la cual grafica en tiempo real la entrada y la salida de la planta.

- ##Informes del Laboratorio Control Análogo:

  + [![Entrega 1 del laboratorio](https://img.shields.io/badge/Entrega_1-PDF-green.svg)](https://github.com/leyenda/ControlLab/blob/master/Entregas/Entrega1.pdf)
  + [![Entrega 2 del laboratorio](https://img.shields.io/badge/Entrega_2-PDF-green.svg)](https://github.com/leyenda/ControlLab/blob/master/Entregas/Entrega2.pdf)


##TODO
- [x] Crear chat Gitter
- [x] Completar HMI
  - [x] Iniciar
  - [x] Detener
  - [x] Lazo abierto
    - [x] Input escalon
    - [x] Enviar Cambio
  - [x] lazo cerrado
    - [x] seleccion Controlador
  - [x] Leyenda
    - [x] Lineas
      - [x] Escalon actual
      - [x] Respuesta
    - [x] constantes del controlador
  - [ ] Configuracion
    - [ ] Tiempo de muestreo (ms)
    - [ ] Tiempo de escritura y graficacion (ms)
    - [ ] Renombrar Base de datos
- [x] Implementacion algoritmo PID
