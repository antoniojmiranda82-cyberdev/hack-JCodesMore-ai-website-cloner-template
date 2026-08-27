(() => {
  const root = document.querySelector("[data-ai-template]");
  const canvas = document.getElementById("ai-template-canvas");
  if (!root || !canvas) return;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
  let attempts = 0;

  function start() {
    attempts += 1;
    const THREE = window.THREE;
    if (!THREE) {
      if (attempts < 120) {
        window.setTimeout(start, 50);
      } else {
        root.dataset.scene = "fallback";
      }
      return;
    }

    try {
      const blueprint = JSON.parse(canvas.dataset.blueprint || "{}");
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.25 : 1.8));
      renderer.outputColorSpace = THREE.SRGBColorSpace;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x090b0d, window.innerWidth < 700 ? 0.045 : 0.032);

      const camera = new THREE.PerspectiveCamera(54, 1, 0.1, 120);
      camera.position.set(0, 2.4, 18);

      const stone = new THREE.MeshStandardMaterial({ color: 0x2b3032, roughness: 0.92, metalness: 0.02 });
      const darkStone = new THREE.MeshStandardMaterial({ color: 0x171b1d, roughness: 0.96, metalness: 0.01 });
      const ember = new THREE.MeshBasicMaterial({ color: 0xcf8a3c });

      const group = new THREE.Group();
      scene.add(group);

      const isMobile = window.innerWidth < 700;
      const structures = isMobile
        ? (blueprint.structures || []).filter((_, index) => index % 2 === 0)
        : (blueprint.structures || []);

      structures.forEach((item) => {
        let mesh;
        if (item.kind === "tower") {
          mesh = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.08, 1, 10), darkStone);
        } else if (item.kind === "arch") {
          const archGroup = new THREE.Group();
          const [sx, sy, sz] = item.scale;
          const columnGeometry = new THREE.BoxGeometry(1, 1, 1);
          const left = new THREE.Mesh(columnGeometry, stone);
          const right = new THREE.Mesh(columnGeometry, stone);
          const crown = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), darkStone);
          left.scale.set(sx * 0.22, sy, sz);
          right.scale.set(sx * 0.22, sy, sz);
          crown.scale.set(sx, sy * 0.28, sz);
          left.position.x = -sx * 0.39;
          right.position.x = sx * 0.39;
          crown.position.y = sy * 0.38;
          archGroup.add(left, right, crown);
          archGroup.position.set(...item.position);
          if (item.rotationY) archGroup.rotation.y = item.rotationY;
          group.add(archGroup);
          return;
        } else {
          mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), item.kind === "floor" ? darkStone : stone);
        }

        mesh.position.set(...item.position);
        mesh.scale.set(...item.scale);
        if (item.rotationY) mesh.rotation.y = item.rotationY;
        group.add(mesh);
      });

      scene.add(new THREE.HemisphereLight(0x6f8392, 0x120e09, 0.5));

      (blueprint.lights || []).forEach((item) => {
        if (item.kind === "moon") {
          const light = new THREE.DirectionalLight(0xb7c9d6, item.intensity || 2);
          light.position.set(...item.position);
          scene.add(light);
          return;
        }

        const light = new THREE.PointLight(0xe39745, item.intensity || 12, 10, 2);
        light.position.set(...item.position);
        scene.add(light);
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 8), ember);
        glow.position.set(...item.position);
        scene.add(glow);
      });

      const starsGeometry = new THREE.BufferGeometry();
      const stars = [];
      const starCount = isMobile ? 80 : 180;
      for (let i = 0; i < starCount; i += 1) {
        stars.push((Math.random() - 0.5) * 70, Math.random() * 30 + 8, -Math.random() * 80 + 10);
      }
      starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(stars, 3));
      const starsMesh = new THREE.Points(
        starsGeometry,
        new THREE.PointsMaterial({ color: 0xaab9c0, size: 0.045, transparent: true, opacity: 0.65 })
      );
      scene.add(starsMesh);

      const progressBar = document.querySelector(".ai-progress span");
      const chapterCopies = Array.from(document.querySelectorAll(".ai-chapter-copy"));

      let lenis = null;
      if (!reduceMotion && window.Lenis) {
        lenis = new window.Lenis({ duration: 1.25, smoothWheel: true });
      }

      function getProgress() {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        return Math.min(1, Math.max(0, window.scrollY / max));
      }

      function updateScene(progress, elapsed) {
        const z = 18 - progress * 58;
        const y = 2.4 + Math.sin(progress * Math.PI * 2) * 0.45 + progress * 3.6;
        camera.position.set(Math.sin(progress * Math.PI * 1.4) * 1.35, y, z);
        camera.lookAt(0, 2.1 + progress * 1.45, z - 8);
        starsMesh.rotation.y = progress * 0.1;
        starsMesh.rotation.x = Math.sin(elapsed * 0.00008) * 0.01;

        if (progressBar) progressBar.style.setProperty("--ai-progress", String(progress));

        chapterCopies.forEach((copy, index) => {
          const chapterCenter = (index + 0.5) / chapterCopies.length;
          const distance = Math.abs(progress - chapterCenter);
          const opacity = Math.max(0.25, 1 - distance * 5.5);
          copy.style.opacity = String(reduceMotion ? 1 : opacity);
          copy.style.transform = reduceMotion ? "none" : `translateY(${Math.min(24, distance * 50)}px)`;
        });
      }

      function resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(1, height);
        camera.updateProjectionMatrix();
      }

      let frame = 0;
      function raf(time) {
        if (lenis) lenis.raf(time);
        updateScene(getProgress(), time);
        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(raf);
      }

      resize();
      window.addEventListener("resize", resize, { passive: true });
      frame = window.requestAnimationFrame(raf);
      root.dataset.scene = "ready";

      window.addEventListener(
        "pagehide",
        () => {
          window.cancelAnimationFrame(frame);
          window.removeEventListener("resize", resize);
          if (lenis && typeof lenis.destroy === "function") lenis.destroy();
          renderer.dispose();
          stone.dispose();
          darkStone.dispose();
          ember.dispose();
          starsGeometry.dispose();
        },
        { once: true }
      );
    } catch (error) {
      console.error("AI template scene failed to initialize", error);
      root.dataset.scene = "fallback";
    }
  }

  start();
})();
