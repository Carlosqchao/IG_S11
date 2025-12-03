// src/App.jsx
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as TWEEN from "@tweenjs/tween.js";
import "./styles.css";

const SolarSystemPhysics = () => {
  const containerRef = useRef(null);
  const [info, setInfo] = useState("Haz clic para lanzar asteroides");

  useEffect(() => {
    let scene, camera, renderer, controls;
    let sun, earth, moon, mars;
    let asteroids = [];
    let clock = new THREE.Clock();
    let raycaster = new THREE.Raycaster();
    let mouse = new THREE.Vector2();

    const init = () => {
      // Escena
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000510);

      // Cámara
      camera = new THREE.PerspectiveCamera(
        60,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000
      );
      camera.position.set(0, 20, 40);

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
      renderer.shadowMap.enabled = true;
      containerRef.current.appendChild(renderer.domElement);

      // Controles
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;

      // Luces
      const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
      scene.add(ambientLight);

      const sunLight = new THREE.PointLight(0xffffff, 2, 100);
      sunLight.castShadow = true;
      scene.add(sunLight);

      // Estrellas de fondo
      createStarField();

      // Crear Sol
      const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa00,
        emissive: 0xff6600,
        emissiveIntensity: 1,
      });
      sun = new THREE.Mesh(sunGeometry, sunMaterial);
      scene.add(sun);

      // Animar brillo del sol con tween
      const sunGlow = { intensity: 1 };
      const sunTween = new TWEEN.Tween(sunGlow)
        .to({ intensity: 1.5 }, 2000)
        .onUpdate(() => {
          sunMaterial.emissiveIntensity = sunGlow.intensity;
        })
        .easing(TWEEN.Easing.Sinusoidal.InOut)
        .repeat(Infinity)
        .yoyo(true);
      sunTween.start();

      // Crear Tierra
      const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
      const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x2233ff,
        emissive: 0x112244,
      });
      earth = new THREE.Mesh(earthGeometry, earthMaterial);
      earth.position.set(15, 0, 0);
      earth.castShadow = true;
      earth.receiveShadow = true;
      scene.add(earth);

      // Crear Luna
      const moonGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const moonMaterial = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
      moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(3, 0, 0);
      moon.castShadow = true;
      earth.add(moon);

      // Crear Marte
      const marsGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const marsMaterial = new THREE.MeshPhongMaterial({
        color: 0xff4422,
        emissive: 0x441100,
      });
      mars = new THREE.Mesh(marsGeometry, marsMaterial);
      mars.position.set(25, 0, 0);
      mars.castShadow = true;
      mars.receiveShadow = true;
      scene.add(mars);

      // Animación orbital de planetas con tween
      animateOrbit(earth, 15, 8000);
      animateOrbit(mars, 25, 12000);

      // Evento de clic para lanzar asteroides
      renderer.domElement.addEventListener("click", onDocumentMouseClick);

      animate();
    };

    const createStarField = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
      });

      const starsVertices = [];
      for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        starsVertices.push(x, y, z);
      }

      starsGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(starsVertices, 3)
      );
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
    };

    const animateOrbit = (planet, radius, duration) => {
      const orbit = { angle: 0 };
      const orbitTween = new TWEEN.Tween(orbit)
        .to({ angle: Math.PI * 2 }, duration)
        .onUpdate(() => {
          planet.position.x = Math.cos(orbit.angle) * radius;
          planet.position.z = Math.sin(orbit.angle) * radius;
        })
        .easing(TWEEN.Easing.Linear.None)
        .repeat(Infinity);
      orbitTween.start();
    };

    const onDocumentMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      createAsteroid(raycaster.ray.origin, raycaster.ray.direction);
    };

    const createAsteroid = (origin, direction) => {
      const asteroidGeometry = new THREE.SphereGeometry(0.3, 8, 8);
      const asteroidMaterial = new THREE.MeshPhongMaterial({
        color: Math.random() * 0xffffff,
        flatShading: true,
      });
      const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

      asteroid.position.copy(origin);
      asteroid.castShadow = true;

      asteroid.velocity = direction.clone().multiplyScalar(0.5);
      asteroid.angularVelocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      );

      scene.add(asteroid);
      asteroids.push(asteroid);

      asteroid.scale.set(0, 0, 0);
      const scaleUp = { s: 0 };
      new TWEEN.Tween(scaleUp)
        .to({ s: 1 }, 300)
        .onUpdate(() => {
          asteroid.scale.set(scaleUp.s, scaleUp.s, scaleUp.s);
        })
        .easing(TWEEN.Easing.Back.Out)
        .start();

      if (asteroids.length > 20) {
        const oldAsteroid = asteroids.shift();
        scene.remove(oldAsteroid);
      }

      setInfo(`Asteroides: ${asteroids.length}`);
    };

    const checkCollisions = () => {
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];

        // Si ya está en proceso de explosión, saltar
        if (asteroid.exploding) continue;

        const celestialBodies = [
          { mesh: sun, radius: 3, name: "Sol", color: 0xffaa00 },
          { mesh: earth, radius: 1, name: "Tierra", color: 0x2233ff },
          { mesh: mars, radius: 0.8, name: "Marte", color: 0xff4422 },
        ];

        for (const body of celestialBodies) {
          const bodyPos = body.mesh.getWorldPosition(new THREE.Vector3());
          const distance = asteroid.position.distanceTo(bodyPos);
          const minDistance = 0.3 + body.radius + 0.2; // Radio asteroide + radio cuerpo + margen

          if (distance < minDistance) {
            // Marcar como explotando
            asteroid.exploding = true;

            // Crear partículas de explosión con color del cuerpo impactado
            createExplosion(asteroid.position.clone(), body.color);

            // Efecto de explosión del asteroide
            const explosion = { scale: 1, opacity: 1 };
            const explosionScale = body.mesh === sun ? 4 : 2.5; // Explosión más grande en el sol
            new TWEEN.Tween(explosion)
              .to({ scale: explosionScale, opacity: 0 }, 400)
              .onUpdate(() => {
                asteroid.scale.setScalar(explosion.scale);
                asteroid.material.opacity = explosion.opacity;
                asteroid.material.transparent = true;
              })
              .onComplete(() => {
                scene.remove(asteroid);
              })
              .start();

            asteroids.splice(i, 1);

            // Mensaje específico según el cuerpo

            setInfo(`¡Impacto en ${body.name}!`);
            setTimeout(() => setInfo(`Asteroides: ${asteroids.length}`), 1500);
            break;
          }
        }

        // Remover asteroides muy lejanos
        if (asteroid.position.length() > 100) {
          scene.remove(asteroid);
          asteroids.splice(i, 1);
        }
      }
    };

    const createExplosion = (position, bodyColor = 0xff6600) => {
      // Crear pequeñas partículas de explosión
      const particleCount = 12; // Más partículas para mejor efecto
      for (let i = 0; i < particleCount; i++) {
        const particleGeometry = new THREE.SphereGeometry(0.15, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({
          color: bodyColor,
          transparent: true,
        });
        const particle = new THREE.Mesh(particleGeometry, particleMaterial);
        particle.position.copy(position);

        // Distribución esférica de partículas
        const theta = (Math.PI * 2 * i) / particleCount;
        const phi = Math.acos(2 * Math.random() - 1);
        const speed = 0.15 + Math.random() * 0.1;

        const velocity = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed
        );

        scene.add(particle);

        // Animar partícula
        const particleAnim = { t: 0 };
        new TWEEN.Tween(particleAnim)
          .to({ t: 1 }, 800)
          .onUpdate(() => {
            particle.position.add(velocity.clone().multiplyScalar(0.05));
            particle.material.opacity = 1 - particleAnim.t;
            particle.scale.setScalar(1 - particleAnim.t * 0.5);
          })
          .onComplete(() => {
            scene.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
          })
          .start();
      }
    };

    const updatePhysics = (deltaTime) => {
      for (const asteroid of asteroids) {
        // Si está explotando, no actualizar física
        if (asteroid.exploding) continue;

        // Movimiento más controlado
        const movement = asteroid.velocity
          .clone()
          .multiplyScalar(deltaTime * 50);
        asteroid.position.add(movement);

        asteroid.rotation.x += asteroid.angularVelocity.x;
        asteroid.rotation.y += asteroid.angularVelocity.y;
        asteroid.rotation.z += asteroid.angularVelocity.z;

        const toSun = sun.position.clone().sub(asteroid.position);
        const distance = toSun.length();
        if (distance > 3) {
          const gravity = toSun
            .normalize()
            .multiplyScalar(0.0003 / (distance * distance));
          asteroid.velocity.add(gravity);
        }
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);

      const deltaTime = clock.getDelta();
      TWEEN.update();

      // Verificar colisiones ANTES de actualizar física
      checkCollisions();
      updatePhysics(deltaTime);

      if (earth) earth.rotation.y += 0.01;
      if (mars) mars.rotation.y += 0.008;
      if (sun) sun.rotation.y += 0.002;
      if (moon) moon.rotation.y += 0.02;

      controls.update();
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (containerRef.current && camera && renderer) {
        camera.aspect =
          containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      }
    };

    window.addEventListener("resize", handleResize);
    init();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="container">
      <div ref={containerRef} className="canvas-container" />
      <div className="info-panel">
        <h2>Sistema Solar Interactivo</h2>
        <p>{info}</p>
        <p className="small">Usa el ratón para rotar la vista</p>
        <p className="small">Haz clic para lanzar asteroides</p>
      </div>
      <div className="footer">
        <p>Autor: Carlos Ruano Ramos</p>
      </div>
    </div>
  );
};

export default SolarSystemPhysics;
