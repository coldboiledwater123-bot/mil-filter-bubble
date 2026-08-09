import { useEffect, useRef } from 'react';
import {
  Vector3, MeshPhysicalMaterial, InstancedMesh, Timer, AmbientLight, SphereGeometry,
  ShaderChunk, Scene, Color, Object3D, SRGBColorSpace, MathUtils, PMREMGenerator,
  Vector2, WebGLRenderer, PerspectiveCamera, PointLight, ACESFilmicToneMapping,
  Plane, Raycaster
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* ── Three.js boilerplate (react-bits internal) ── */
class ThreeScene {
  constructor(opts) {
    this.opts = { ...opts };
    this._initCamera();
    this._initScene();
    this._initRenderer();
    this.resize();
    this._bindEvents();
  }

  _initCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  _initScene() { this.scene = new Scene(); }

  _initRenderer() {
    this.canvas = this.opts.canvas || document.getElementById(this.opts.id);
    this.canvas.style.display = 'block';
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: 'high-performance',
      ...(this.opts.rendererOptions ?? {}),
    });
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  _bindEvents() {
    if (!(this.opts.size instanceof Object)) {
      window.addEventListener('resize', this._onResize.bind(this));
      if (this.opts.size === 'parent' && this.canvas.parentNode) {
        this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
        this._resizeObserver.observe(this.canvas.parentNode);
      }
    }
    this._intersectionObserver = new IntersectionObserver(this._onIntersect.bind(this), {
      root: null, rootMargin: '0px', threshold: 0,
    });
    this._intersectionObserver.observe(this.canvas);
    document.addEventListener('visibilitychange', this._onVisibility.bind(this));
  }

  _onIntersect(entries) {
    this._visible = entries[0].isIntersecting;
    this._visible ? this._start() : this._stop();
  }

  _onVisibility() {
    if (this._visible) document.hidden ? this._stop() : this._start();
  }

  _onResize() {
    if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
    this._resizeTimeout = setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let w, h;
    if (this.opts.size instanceof Object) { w = this.opts.size.width; h = this.opts.size.height; }
    else if (this.opts.size === 'parent' && this.canvas.parentNode) {
      w = this.canvas.parentNode.offsetWidth; h = this.canvas.parentNode.offsetHeight;
    } else { w = window.innerWidth; h = window.innerHeight; }
    this.size = { width: w, height: h, ratio: w / h };
    this._updateCamera();
    this.renderer.setSize(w, h);
    let dpr = window.devicePixelRatio;
    if (this.maxPixelRatio && dpr > this.maxPixelRatio) dpr = this.maxPixelRatio;
    else if (this.minPixelRatio && dpr < this.minPixelRatio) dpr = this.minPixelRatio;
    this.renderer.setPixelRatio(dpr);
    this.size.pixelRatio = dpr;
    this.onAfterResize?.(this.size);
  }

  _updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      this.camera.fov = this.cameraFov;
    }
    this.camera.updateProjectionMatrix();
    this._updateWorldSize();
  }

  _updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const halfFov = (this.camera.fov * Math.PI) / 180 / 2;
      this.size.wHeight = 2 * Math.tan(halfFov) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    }
  }

  _start() {
    if (this._running) return;
    const timer = new Timer();
    const animate = () => {
      this._raf = requestAnimationFrame(animate);
      timer.update();
      const delta = timer.getDelta();
      const elapsed = timer.elapsed + delta;
      this.onBeforeRender?.({ delta, elapsed });
      this.renderer.render(this.scene, this.camera);
      this.onAfterRender?.({ delta, elapsed });
    };
    this._running = true;
    animate();
  }

  _stop() {
    if (this._running) { cancelAnimationFrame(this._raf); this._running = false; }
  }

  dispose() {
    window.removeEventListener('resize', this._onResize.bind(this));
    this._resizeObserver?.disconnect();
    this._intersectionObserver?.disconnect();
    document.removeEventListener('visibilitychange', this._onVisibility.bind(this));
    this._stop();
    this.renderer.dispose();
  }
}

/* ── Ball physics ── */
const _v1 = new Vector3(), _v2 = new Vector3(), _v3 = new Vector3();
const _v4 = new Vector3(), _v5 = new Vector3(), _v6 = new Vector3();

class BallPhysics {
  constructor(config) {
    this.config = config;
    this.positions = new Float32Array(3 * config.count).fill(0);
    this.velocities = new Float32Array(3 * config.count).fill(0);
    this.sizes = new Float32Array(config.count).fill(1);
    this.center = new Vector3();
    this._scatter();
    this.setSizes();
  }

  _scatter() {
    const { config, positions } = this;
    this.center.toArray(positions, 0);
    for (let i = 1; i < config.count; i++) {
      const off = 3 * i;
      positions[off] = MathUtils.randFloatSpread(2 * config.maxX);
      positions[off + 1] = MathUtils.randFloatSpread(2 * config.maxY);
      positions[off + 2] = MathUtils.randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    const { config, sizes } = this;
    sizes[0] = config.size0;
    for (let i = 1; i < config.count; i++) sizes[i] = MathUtils.randFloat(config.minSize, config.maxSize);
  }

  update(dt) {
    const { config, center, positions, sizes, velocities } = this;
    let start = 0;
    if (config.controlSphere0) {
      start = 1;
      _v1.fromArray(positions, 0);
      _v1.lerp(center, 0.1).toArray(positions, 0);
      velocities[0] = velocities[1] = velocities[2] = 0;
    }
    for (let i = start; i < config.count; i++) {
      const b = 3 * i;
      _v2.fromArray(positions, b);
      _v3.fromArray(velocities, b);
      _v3.y -= dt.delta * config.gravity * sizes[i];
      _v3.multiplyScalar(config.friction).clampLength(0, config.maxVelocity);
      _v2.add(_v3);
      _v2.toArray(positions, b);
      _v3.toArray(velocities, b);
    }
    // collision
    for (let i = start; i < config.count; i++) {
      const bi = 3 * i;
      _v2.fromArray(positions, bi);
      for (let j = i + 1; j < config.count; j++) {
        const bj = 3 * j;
        _v4.fromArray(positions, bj);
        _v6.copy(_v4).sub(_v2);
        const dist = _v6.length();
        const sum = sizes[i] + sizes[j];
        if (dist < sum) {
          const overlap = sum - dist;
          _v6.normalize().multiplyScalar(0.5 * overlap);
          _v2.sub(_v6);
          _v4.add(_v6);
        }
      }
      // boundary
      const r = sizes[i];
      if (Math.abs(_v2.x) + r > config.maxX) _v2.x = Math.sign(_v2.x) * (config.maxX - r);
      if (config.gravity === 0) {
        if (Math.abs(_v2.y) + r > config.maxY) _v2.y = Math.sign(_v2.y) * (config.maxY - r);
      } else if (_v2.y - r < -config.maxY) _v2.y = -config.maxY + r;
      const mz = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(_v2.z) + r > mz) _v2.z = Math.sign(_v2.z) * (mz - r);
      _v2.toArray(positions, bi);
    }
  }
}

/* ── Scattering material ── */
class ScatteringMaterial extends MeshPhysicalMaterial {
  constructor(params) {
    super(params);
    this.uniforms = {
      thicknessDistortion: { value: 0.1 },
      thicknessAmbient: { value: 0 },
      thicknessAttenuation: { value: 0.1 },
      thicknessPower: { value: 2 },
      thicknessScale: { value: 10 },
    };
    this.defines.USE_UV = '';
    this.onBeforeCompile = shader => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        'uniform float thicknessPower;\nuniform float thicknessScale;\nuniform float thicknessDistortion;\nuniform float thicknessAmbient;\nuniform float thicknessAttenuation;\n' +
        shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace('void main() {',
        'void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {\n' +
        '  vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));\n' +
        '  float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;\n' +
        '  #ifdef USE_COLOR\n    vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor;\n' +
        '  #else\n    vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;\n' +
        '  #endif\n' +
        '  reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;\n' +
        '}\n\nvoid main() {\n');
      const lightsBegin = ShaderChunk.lights_fragment_begin.replaceAll(
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );',
        'RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n' +
        'RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);');
      shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', lightsBegin);
    };
  }
}

/* ── BallPit instanced mesh ── */
const DEFAULT_CONFIG = {
  count: 200, colors: [0xcccccc, 0xdddddd], ambientColor: 0xffffff, ambientIntensity: 1,
  lightIntensity: 200, minSize: 0.5, maxSize: 1, size0: 1, gravity: 0.5,
  friction: 0.9975, wallBounce: 0.95, maxVelocity: 0.15, maxX: 5, maxY: 5, maxZ: 2,
  controlSphere0: false, followCursor: true,
  materialParams: { metalness: 0.5, roughness: 0.5, clearcoat: 1, clearcoatRoughness: 0.15 },
};

const _dummy = new Object3D();

class BallPitInstanced extends InstancedMesh {
  constructor(renderer, config = {}) {
    const cfg = { ...DEFAULT_CONFIG, ...config };
    const pm = new PMREMGenerator(renderer, 0.04);
    const env = pm.fromScene(new RoomEnvironment()).texture;
    const geo = new SphereGeometry();
    const mat = new ScatteringMaterial({ envMap: env, ...cfg.materialParams });
    mat.envMapRotation.x = -Math.PI / 2;
    super(geo, mat, cfg.count);
    this.config = cfg;
    this.physics = new BallPhysics(cfg);
    this.ambientLight = new AmbientLight(cfg.ambientColor, cfg.ambientIntensity);
    this.add(this.ambientLight);
    this.light = new PointLight(cfg.colors[0], cfg.lightIntensity);
    this.add(this.light);
    this.setColors(cfg.colors);
  }

  setColors(colors) {
    if (Array.isArray(colors) && colors.length > 1) {
      const colorObjs = colors.map(c => new Color(c));
      for (let i = 0; i < this.count; i++) {
        const ratio = i / this.count;
        const idx = Math.floor(ratio * (colors.length - 1));
        const alpha = ratio * (colors.length - 1) - idx;
        const start = colorObjs[idx];
        const end = colorObjs[Math.min(idx + 1, colors.length - 1)];
        this.setColorAt(i, new Color(
          start.r + alpha * (end.r - start.r),
          start.g + alpha * (end.g - start.g),
          start.b + alpha * (end.b - start.b)
        ));
        if (i === 0) this.light.color.set(start);
      }
      this.instanceColor.needsUpdate = true;
    }
  }

  update(dt) {
    this.physics.update(dt);
    for (let i = 0; i < this.count; i++) {
      _dummy.position.fromArray(this.physics.positions, 3 * i);
      if (i === 0 && !this.config.followCursor) _dummy.scale.setScalar(0);
      else _dummy.scale.setScalar(this.physics.sizes[i]);
      _dummy.updateMatrix();
      this.setMatrixAt(i, _dummy.matrix);
      if (i === 0) this.light.position.copy(_dummy.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

/* ── Public API ── */
function createBallpit(canvas, userConfig = {}) {
  const three = new ThreeScene({ canvas, size: 'parent', rendererOptions: { antialias: true, alpha: true } });
  three.renderer.toneMapping = ACESFilmicToneMapping;
  three.camera.position.set(0, 0, 20);
  three.camera.lookAt(0, 0, 0);
  three.cameraMaxAspect = 1.5;
  three.resize();

  let spheres;
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const hit = new Vector3();
  let paused = false;
  canvas.style.touchAction = 'none';

  const init = (cfg) => {
    if (spheres) { three.scene.remove(spheres); }
    spheres = new BallPitInstanced(three.renderer, cfg);
    three.scene.add(spheres);
  };
  init(userConfig);

  three.onBeforeRender = (dt) => { if (!paused) spheres.update(dt); };
  three.onAfterResize = (size) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };

  /* ── Pointer interaction ── */
  const onPointer = (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera({ x, y }, three.camera);
    three.camera.getWorldDirection(plane.normal);
    if (raycaster.ray.intersectPlane(plane, hit)) {
      spheres.physics.center.copy(hit);
      spheres.config.controlSphere0 = true;
    }
  };
  const onLeave = () => { spheres.config.controlSphere0 = false; };

  canvas.addEventListener('pointermove', onPointer);
  canvas.addEventListener('pointerleave', onLeave);

  return {
    three,
    spheres,
    setCount(count) { init({ ...spheres.config, count }); },
    updateConfig(props) {
      if (props.count !== undefined && props.count !== spheres.config.count) {
        init({ ...spheres.config, ...props });
      } else {
        Object.assign(spheres.config, props);
        if (props.colors) spheres.setColors(spheres.config.colors);
        if (props.minSize !== undefined || props.maxSize !== undefined) spheres.physics.setSizes();
      }
    },
    togglePause() { paused = !paused; },
    dispose() {
      canvas.removeEventListener('pointermove', onPointer);
      canvas.removeEventListener('pointerleave', onLeave);
      three.dispose();
    },
  };
}

/* ── React component ── */
const Ballpit = ({ className = '', followCursor = true, ...props }) => {
  const canvasRef = useRef(null);
  const instanceRef = useRef(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    instanceRef.current = createBallpit(canvas, { followCursor, ...props });
    return () => { instanceRef.current?.dispose(); instanceRef.current = null; };
  }, []);

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    instanceRef.current?.updateConfig({ followCursor, ...props });
  }, [props, followCursor]);

  return <canvas className={`${className} h-full w-full`} ref={canvasRef} />;
};

export default Ballpit;
