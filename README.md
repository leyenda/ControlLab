# ControlLab

En este repositorio está el código necesario para la identificación por curva de reacción en lazo abierto de la función de transferencia de alguna planta, en nuestro caso específico una generadora de voltaje con voltaje de excitación en el generador como variable controlada.

Se ha utilizado un Pcduino para la adquisición de datos, una HMI ha sido desarrollada en HTML y JavaScript, la cual grafica en tiempo real la entrada y la salida de la planta.

- ##Informes del Laboratorio Control Análogo:

  [![Entrega 1 del laboratorio](https://img.shields.io/badge/Entrega_1-PDF-green.svg)](https://github.com/leyenda/ControlLab/blob/master/Entregas/Entrega1.pdf)

Alguna idea para mejorar el codigo?
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/leyenda/ControlLab?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=body_badge)

##TODO
- [x] Crear chat Gitter
- [ ] Completar HMI
  - [ ] Iniciar
  - [ ] Detener
  - [ ] Lazo abierto
    - [ ] Input escalon
    - [ ] Enviar Cambio
  - [ ] lazo cerrado
    - [ ] seleccion Controlador
  - [x] Leyenda
    - [x] Lineas
      - [x] Escalon actual
      - [x] Respuesta
    - [x] constantes del controlador
  - [ ] Configuracion
    - [ ] Tiempo de muestreo (ms)
    - [ ] Tiempo de escritura y graficacion (ms)
- [ ] Implementacion algoritmo PID
