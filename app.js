import * as THREE from 'three';

// Initialize Lucide Icons
if (window.lucide) {
  window.lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  initHero3D();
  init3DTiltCards();
  initProductsDropdown();
  initNavigationAndModal();
});

/* ==========================================================================
   1. PRODUCTS DROPDOWN MENU INTERACTION
   ========================================================================== */
function initProductsDropdown() {
  const dropdownContainer = document.querySelector('.nav-item-dropdown');
  const triggerBtn = document.querySelector('.dropdown-trigger');

  if (!dropdownContainer || !triggerBtn) return;

  // Toggle on click for touch devices
  triggerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = dropdownContainer.classList.contains('open');
    if (isOpen) {
      dropdownContainer.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
    } else {
      dropdownContainer.classList.add('open');
      triggerBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownContainer.contains(e.target)) {
      dropdownContainer.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown on product item click
  document.querySelectorAll('.product-menu-item').forEach(item => {
    item.addEventListener('click', () => {
      dropdownContainer.classList.remove('open');
      triggerBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ==========================================================================
   2. THREE.JS ELEGANT SUBTLE 3D PARTICLE CONSTELLATION
   ========================================================================== */
function initHero3D() {
  const container = document.getElementById('canvas-container');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Ambient Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const purpleLight = new THREE.PointLight(0x4F26B8, 6, 60);
  purpleLight.position.set(-15, 15, 10);
  scene.add(purpleLight);

  const tealLight = new THREE.PointLight(0x00D28E, 8, 60);
  tealLight.position.set(15, -15, 10);
  scene.add(tealLight);

  // Subtle Particles Group
  const particleGroup = new THREE.Group();
  scene.add(particleGroup);

  const particleCount = 700;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPurple = new THREE.Color(0x4F26B8);
  const colorBlue = new THREE.Color(0x2D52D7);
  const colorTeal = new THREE.Color(0x00D28E);
  const colorMint = new THREE.Color(0x00E5A3);

  const palette = [colorPurple, colorBlue, colorTeal, colorMint];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 55;
    const y = (Math.random() - 0.5) * 40;
    const z = (Math.random() - 0.5) * 30;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });

  const particlesMesh = new THREE.Points(particleGeo, particleMat);
  particleGroup.add(particlesMesh);

  // Subtle Constellation Lines
  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];

  for (let i = 0; i < particleCount; i += 8) {
    for (let j = i + 1; j < particleCount; j += 8) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < 8) {
        linePositions.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        linePositions.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
      }
    }
  }

  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x2D52D7,
    transparent: true,
    opacity: 0.15
  });
  const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
  particleGroup.add(lineMesh);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.0005;
    mouseY = (e.clientY - windowHalfY) * 0.0005;
  });

  // FX Toggle
  let fxMode = true;
  const fxBtn = document.getElementById('theme-toggle-btn');
  if (fxBtn) {
    fxBtn.addEventListener('click', () => {
      fxMode = !fxMode;
      particleGroup.visible = fxMode;
      fxBtn.style.opacity = fxMode ? '1' : '0.5';
    });
  }

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    targetX += (mouseX - targetX) * 0.03;
    targetY += (mouseY - targetY) * 0.03;

    camera.position.x = targetX * 8;
    camera.position.y = -targetY * 8;
    camera.lookAt(scene.position);

    particleGroup.rotation.y = elapsedTime * 0.03;
    particleGroup.rotation.x = Math.sin(elapsedTime * 0.1) * 0.05;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ==========================================================================
   3. 3D TILT CARDS ENGINE (PERSPECTIVE PARALLAX)
   ========================================================================== */
function init3DTiltCards() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      const inner = card.querySelector('.card-inner');
      if (inner) {
        inner.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        inner.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

/* ==========================================================================
   4. NAVIGATION & CONSULTATION MODAL CONTROLS
   ========================================================================== */
function initNavigationAndModal() {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Drawer
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => mobileDrawer.classList.add('open'));
    drawerClose.addEventListener('click', () => mobileDrawer.classList.remove('open'));
    
    document.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', () => mobileDrawer.classList.remove('open'));
    });
  }

  // Consultation Modal Dialog
  const modal = document.getElementById('consult-modal');
  const openBtns = [
    document.getElementById('open-consult-btn'),
    document.getElementById('hero-consult-btn'),
    document.getElementById('mobile-consult-btn'),
    document.getElementById('banner-consult-btn'),
    document.getElementById('footer-contact-link')
  ];
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const form = document.getElementById('consult-form');
  const successState = document.getElementById('form-success');
  const successCloseBtn = document.getElementById('success-close-btn');

  openBtns.forEach((btn) => {
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (modal) {
          form.style.display = 'flex';
          successState.style.display = 'none';
          modal.showModal();
        }
      });
    }
  });

  document.querySelectorAll('[data-modal-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceKey = btn.getAttribute('data-modal-target');
      const selectEl = document.getElementById('client-service');
      if (selectEl && serviceKey) selectEl.value = serviceKey;
      if (modal) {
        form.style.display = 'flex';
        successState.style.display = 'none';
        modal.showModal();
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', () => modal.close());
  if (cancelBtn) cancelBtn.addEventListener('click', () => modal.close());
  if (successCloseBtn) successCloseBtn.addEventListener('click', () => modal.close());

  // Check if page loaded after form submit redirect
  if (window.location.search.includes('submitted=true')) {
    if (modal && form && successState) {
      form.style.display = 'none';
      successState.style.display = 'block';
      modal.showModal();
      // Clean up URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      const submitBtn = document.getElementById('form-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span><i data-lucide="loader" class="animate-spin"></i>`;
        if (window.lucide) window.lucide.createIcons();
      }
      // Allow native form POST to FormSubmit
    });
  }

  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
