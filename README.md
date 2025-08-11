# 🎮 Prueba Técnica – Game Developer

En esta prueba técnica se ha trabajado siguiendo las especificaciones y pautas definidas para el proyecto.  
Además, se han incorporado funcionalidades de diseño propio que aportan mejoras adicionales.  

Todos los sprites, así como el código del proyecto, han sido creados desde cero o reutilizados de proyectos anteriores propios [1][2].  
En todo momento se ha intentado mantener una estética coherente para todas las escenas del proyecto.  

Como característica global, se ha implementado un sistema adaptación de pantalla orientado a dispositivos móviles.  
Este sistema:
- Fuerza el contenido del juego a una escala fija de **16:9**.
- Ajusta automáticamente el escalado tanto en orientación **landscape** como **portrait** para que todo el contenido encaje en pantalla.
- Garantiza una experiencia visual consistente en diferentes resoluciones y tamaños de pantalla.
  
El objetivo principal de esta prueba es evaluar mis conocimientos actuales en programación utilizando el motor gráfico _Cocos Creator_.

---

### 🗂 Contenido del Proyecto

El proyecto se compone de **4 escenas principales**, cada una con su funcionalidad, características y observaciones específicas.

---

### 1️⃣ Escena **Splash**
**Función:** Mostrar el logotipo y una barra de carga.  

**Características:**
- Animación *fade in* del logo y carga progresiva de la barra.
- Transición automática hacia la escena **Menú**.

---

### 2️⃣ Escena **Menú**
**Función:** Punto central de navegación del juego.  

**Características:**
- Botones para acceder a las escenas **Quiz** y **Slots**.
- Reloj con la hora actual obtenida desde la API:  
  `https://worldtimeapi.org/api/timezone/Europe/Madrid`

**Observaciones:**
- La URL original fue cambiada de `http` a `https` porque Itch.io bloquea URLs con protocolo inseguro. Eso hacia que el reloj no funcionara correctamente en la Build.
- La API no siempre devuelve una respuesta correctamente, por lo que se ha implementado un botón en el reloj para forzar la petición manual.
- Se ejecuta una petición automática cada 1 minuto.
- Mientras no hay respuesta, el reloj utiliza un cálculo interno para seguir actualizando la hora visualmente.

---

### 3️⃣ Escena **Quiz**
**Función:** Presentar preguntas y respuestas tipo trivia a partir de un archivo **JSON**.  

**Características:**
- Sistema dinámico para generar botones de respuesta.
- Feedback visual en respuestas correctas e incorrectas.
- Flujo adaptable que permite múltiples preguntas y respuestas.

---

### 4️⃣ Escena **Slots**
**Función:** Minijuego slot machine 3×3 con comprobación de premios en la línea central.  

**Características:**
- Slot completamente dinámica, con capacidad para instanciar múltiples reels y símbolos.
- Estructura de código jerárquica:  
  **Slot Manager → Reel Controller → Symbol Controller**
- Archivo **paytable** editable para configurar símbolos e iconos.
- Paytable dinámica con función para forzar premios: cada símbolo tiene un botón que fuerza un *spin* mostrando ese símbolo en todos los reels.
- Desde el inspector del proyecto es posible acceder al **SlotManager** para modificar los parámetros públicos de la slot.

**Observaciones:**
- El flujo se ha inspirado en un prototipo previo hecho en Unity [2], pero se ha adaptado y optimizado para Cocos Creator.
- Se refactorizaron funciones para mejorar rendimiento y claridad del código.
- En el movimiento de reels se ha mantenido parte de la lógica original para priorizar mejoras en otras áreas.
- Se implementaron animaciones con el sistema nativo y por código, aportando una mejora en la fluidez y estética visual.

---

## 🌐 Versión Compilada

🔗 **[Probar en itch.io](https://srtrolo.itch.io/prueba-tcnica-gamedeveloper)**  
🔑 **Contraseña:** `Pitarque`  

---

## 📎 Referencias

[1] **Arte utilizado:** [Partymal](https://carlesgf11.itch.io/partymal)  
[2] **Prototipo de Slots en Unity:** [Luigi’s Slot Demo](https://srtrolo.itch.io/luigis-slot-demo)  
  🔑 **Contraseña:** `Pitarque`

---
