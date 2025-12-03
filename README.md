# IG_S11
Simulación interactiva de un sistema solar que combina animaciones fluidas mediante interpolación de fotogramas clave y un motor de física personalizado. El proyecto permite al usuario lanzar asteroides que interactúan gravitacionalmente con los cuerpos celestes y generan colisiones realistas.

Enlace al CodeSandbox: https://codesandbox.io/p/sandbox/r377x3

## Autor

**Carlos Ruano Ramos**

## Capturas de Pantalla

### Vista General del Sistema
<img width="784" height="781" alt="image" src="https://github.com/user-attachments/assets/8baaa557-12a4-40b2-8cbc-fff050d53ded" />

### Colisión con Planeta
<img width="786" height="784" alt="image" src="https://github.com/user-attachments/assets/c5f80dce-2805-4669-b1f5-929bb131d98c" />


## Video de Demostración

[![Video de demostración](https://github.com/user-attachments/assets/c5f80dce-2805-4669-b1f5-929bb131d98c)](./Video_IG_S11.mp4)



*Duración: 1 minuto - Resolución: 1920x1080 (Full HD, 16:9)*

## Descripción del Proyecto

Este proyecto implementa una simulación 3D en tiempo real de un sistema solar simplificado que incluye:

- Sol con iluminación emisiva y animación de brillo pulsante
- Tierra con satélite lunar en órbita
- Marte con órbita independiente
- Campo de estrellas de fondo
- Sistema de lanzamiento de asteroides mediante interacción con ratón
- Motor de física que simula gravedad, velocidad y colisiones
- Sistema de partículas para efectos de explosión

## Tecnologías Utilizadas

### Bibliotecas Principales

- **Three.js** (v0.160.0): Motor de renderizado 3D basado en WebGL
- **Tween.js** (v23.1.1): Biblioteca de interpolación para animaciones suaves
- **React** (v18.2.0): Framework para la interfaz de usuario
- **OrbitControls**: Control de cámara orbital incluido en Three.js

### Lenguajes y Herramientas

- JavaScript ES6+
- JSX (React)
- CSS3
- NPM para gestión de dependencias

## Características Implementadas

### Animaciones con Tween.js

El proyecto hace uso extensivo de la biblioteca Tween.js para crear animaciones fluidas mediante interpolación de fotogramas clave:

1. **Brillo Solar Pulsante**: Animación infinita del brillo emisivo del sol utilizando easing sinusoidal con efecto yoyo
2. **Órbitas Planetarias**: Movimiento circular continuo de la Tierra y Marte alrededor del sol con diferentes periodos orbitales
3. **Aparición de Asteroides**: Efecto de escalado suave al crear nuevos asteroides usando easing Back.Out
4. **Explosiones**: Animación de expansión y desvanecimiento al producirse colisiones
5. **Sistema de Partículas**: Interpolación de posición, escala y opacidad de partículas explosivas

### Motor de Física Personalizado

Implementación de un sistema físico básico que simula:

1. **Gravedad Solar**: Fuerza de atracción inversamente proporcional al cuadrado de la distancia
2. **Movimiento Balístico**: Los asteroides siguen trayectorias parabólicas influenciadas por la gravedad
3. **Velocidad Angular**: Rotación continua de asteroides en los tres ejes
4. **Detección de Colisiones**: Sistema de colisión esfera-esfera basado en distancia entre centros y suma de radios
5. **Gestión de Objetos**: Eliminación automática de asteroides lejanos para optimizar rendimiento

### Sistema de Colisiones

Características del sistema de detección y respuesta a colisiones:

- Verificación de colisiones con tres cuerpos celestes (Sol, Tierra y Marte)
- Cálculo preciso considerando radios de objetos más margen de seguridad
- Sistema de flags para evitar colisiones múltiples
- Generación de partículas explosivas con color del cuerpo impactado
- Explosiones escaladas según tamaño del cuerpo (más grandes en el Sol)
- Feedback visual y textual al usuario

## Estructura del Código

### Componentes Principales

**Inicialización de Escena**
- Configuración de renderer con sombras
- Creación de cámara perspectiva
- Implementación de controles orbitales
- Sistema de iluminación (ambiental y puntual)

**Creación de Objetos**
- Geometrías esféricas para cuerpos celestes
- Materiales con propiedades emisivas y de reflexión
- Sistema de partículas para campo estelar
- Jerarquía de objetos (luna como hijo de la Tierra)

**Bucle de Animación**
- Actualización de interpolaciones (TWEEN.update)
- Verificación de colisiones
- Actualización de física
- Rotación de cuerpos sobre su eje
- Renderizado de escena

### Funciones Clave

```javascript
animateOrbit()       // Configura órbitas planetarias con Tween.js
createAsteroid()     // Genera asteroides con propiedades físicas
checkCollisions()    // Detecta y procesa colisiones
updatePhysics()      // Actualiza posiciones y velocidades
createExplosion()    // Sistema de partículas para explosiones
```

## Controles de Usuario

### Interacción con Ratón

- **Clic Izquierdo**: Lanza un asteroide desde la posición de la cámara en la dirección del cursor
- **Arrastrar (Botón Izquierdo)**: Rotación orbital de la cámara alrededor del sistema
- **Arrastrar (Botón Derecho)**: Desplazamiento lateral (pan) de la vista
- **Rueda del Ratón**: Zoom in/out

### Información en Pantalla

- Panel superior izquierdo con contador de asteroides activos
- Notificaciones de impacto indicando el cuerpo celeste afectado
- Instrucciones de uso
- Créditos y tecnologías utilizadas

## Instalación y Ejecución

### Requisitos Previos

- Node.js (versión 14 o superior)
- NPM (incluido con Node.js)

### Instalación Local

```bash
# Clonar el repositorio
git clone [URL_DEL_REPOSITORIO]

# Navegar al directorio del proyecto
cd sistema-solar-threejs

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación se abrirá automáticamente en `http://localhost:3000`

### Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `build/`

## Estructura de Archivos

```
sistema-solar-threejs/
├── public/
│   ├── index.html
│   └── images/
│       ├── screenshot1.png
│       ├── screenshot2.png
│       └── screenshot3.png
├── src/
│   ├── App.jsx          # Componente principal con lógica Three.js
│   ├── index.js         # Punto de entrada React
│   └── styles.css       # Estilos de la interfaz
├── videos/
│   └── demo.mp4         # Video de demostración
├── package.json
└── README.md
```

## Aspectos Técnicos Destacables

### Optimizaciones

- Limitación de asteroides activos simultáneos (máximo 20)
- Eliminación automática de objetos fuera de rango
- Liberación de memoria de geometrías y materiales de partículas
- Uso de `requestAnimationFrame` para sincronización con tasa de refresco

### Renderizado

- Antialiasing activado para bordes suaves
- Sistema de sombras habilitado
- Materiales con propiedades emisivas para efecto de luz propia
- Flat shading en asteroides para estética de bajo polígono

### Física

- Actualización basada en deltaTime para independencia de framerate
- Velocidades normalizadas y escaladas apropiadamente
- Factor gravitacional ajustado para equilibrio entre realismo y jugabilidad

## Referencias y Recursos

### Documentación Oficial

- [Three.js Documentation](https://threejs.org/docs/)
- [Tween.js User Guide](https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md)
- [Three.js Examples](https://threejs.org/examples/)

---

**Fecha de Entrega**: [Fecha]

**Institución**: [Nombre de la Universidad/Centro]

**Asignatura**: [Nombre de la Asignatura]
