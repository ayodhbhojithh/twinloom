"use client";

/* ---------------------------------------------------------------------------
   The ball pit.

   Kevin Levron's scene by way of react-bits, taken as it is published rather
   than rewritten. Three changes to it, and only three:

   No gsap. The published file imports `gsap` and `Observer` to call
   `registerPlugin` once, and then never uses either - `Observer` appears
   nowhere else in it. So there is nothing here to port to the library this
   site already animates with: what drives this is a `requestAnimationFrame`
   loop and three.js, and an animation library on top of that would be a
   dependency to run a line that does nothing.

   Our colours as the defaults. Blue into teal is the mark's own run, with the
   accent set the card used - see `BALLPIT` below, which is the published
   config with those values in place of the black it ships with.

   And the vectors in the physics loop are made once rather than per pair. The
   maths is unchanged and so is every number it produces; what changes is that
   two hundred balls stop allocating twenty thousand throwaway objects a frame
   for the garbage collector to find. The published file already declares the
   temporaries to do this at the bottom of the module and does not use them.
--------------------------------------------------------------------------- */

import React, { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  InstancedMesh,
  MathUtils,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PMREMGenerator,
  PointLight,
  Raycaster,
  Scene,
  ShaderChunk,
  SphereGeometry,
  SRGBColorSpace,
  Timer,
  Vector2,
  Vector3,
  WebGLRenderer,
  type WebGLRendererParameters,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { cn } from "@/lib/utils";

interface XConfig {
  canvas?: HTMLCanvasElement;
  id?: string;
  rendererOptions?: Partial<WebGLRendererParameters>;
  size?: "parent" | { width: number; height: number };
}

interface SizeData {
  width: number;
  height: number;
  wWidth: number;
  wHeight: number;
  ratio: number;
  pixelRatio: number;
}

class X {
  #config: XConfig;
  #postprocessing:
    | {
        render: () => void;
        setSize: (w: number, h: number) => void;
        dispose: () => void;
      }
    | undefined;
  #resizeObserver?: ResizeObserver;
  #intersectionObserver?: IntersectionObserver;
  #resizeTimer?: number;
  #animationFrameId: number = 0;
  #timer: Timer = new Timer();
  #animationState = { elapsed: 0, delta: 0 };
  #isAnimating: boolean = false;
  #isVisible: boolean = false;

  /* Bound once and kept, so the removals in `dispose` take off the same
     functions that were added. `this.#onResize.bind(this)` written twice makes
     two different functions and the second one removes nothing - which is a
     listener left on `window` pointing at a disposed renderer. */
  #onResizeBound = this.#onResize.bind(this);
  #onVisibilityBound = this.#onVisibilityChange.bind(this);

  canvas!: HTMLCanvasElement;
  camera!: PerspectiveCamera;
  cameraMinAspect?: number;
  cameraMaxAspect?: number;
  cameraFov!: number;
  maxPixelRatio?: number;
  minPixelRatio?: number;
  scene!: Scene;
  renderer!: WebGLRenderer;
  size: SizeData = {
    width: 0,
    height: 0,
    wWidth: 0,
    wHeight: 0,
    ratio: 0,
    pixelRatio: 0,
  };

  render: () => void = this.#render.bind(this);
  onBeforeRender: (state: { elapsed: number; delta: number }) => void =
    () => {};
  onAfterRender: (state: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (size: SizeData) => void = () => {};
  isDisposed: boolean = false;

  constructor(config: XConfig) {
    this.#config = { ...config };
    this.#initCamera();
    this.#initScene();
    this.#initRenderer();
    this.resize();
    this.#initObservers();
  }

  #initCamera() {
    this.camera = new PerspectiveCamera();
    this.cameraFov = this.camera.fov;
  }

  #initScene() {
    this.scene = new Scene();
  }

  #initRenderer() {
    if (this.#config.canvas) {
      this.canvas = this.#config.canvas;
    } else if (this.#config.id) {
      const elem = document.getElementById(this.#config.id);
      if (elem instanceof HTMLCanvasElement) {
        this.canvas = elem;
      } else {
        console.error("Three: Missing canvas or id parameter");
      }
    } else {
      console.error("Three: Missing canvas or id parameter");
    }
    this.canvas!.style.display = "block";
    const rendererOptions: WebGLRendererParameters = {
      canvas: this.canvas,
      powerPreference: "high-performance",
      ...(this.#config.rendererOptions ?? {}),
    };
    this.renderer = new WebGLRenderer(rendererOptions);
    this.renderer.outputColorSpace = SRGBColorSpace;
  }

  #initObservers() {
    if (!(this.#config.size instanceof Object)) {
      window.addEventListener("resize", this.#onResizeBound);
      if (this.#config.size === "parent" && this.canvas.parentNode) {
        this.#resizeObserver = new ResizeObserver(this.#onResizeBound);
        this.#resizeObserver.observe(this.canvas.parentNode as Element);
      }
    }
    this.#intersectionObserver = new IntersectionObserver(
      this.#onIntersection.bind(this),
      { root: null, rootMargin: "0px", threshold: 0 },
    );
    this.#intersectionObserver.observe(this.canvas);
    document.addEventListener("visibilitychange", this.#onVisibilityBound);
  }

  #onResize() {
    if (this.#resizeTimer) clearTimeout(this.#resizeTimer);
    this.#resizeTimer = window.setTimeout(this.resize.bind(this), 100);
  }

  resize() {
    let w: number, h: number;
    if (this.#config.size instanceof Object) {
      w = this.#config.size.width;
      h = this.#config.size.height;
    } else if (this.#config.size === "parent" && this.canvas.parentNode) {
      w = (this.canvas.parentNode as HTMLElement).offsetWidth;
      h = (this.canvas.parentNode as HTMLElement).offsetHeight;
    } else {
      w = window.innerWidth;
      h = window.innerHeight;
    }
    this.size.width = w;
    this.size.height = h;
    this.size.ratio = w / h;
    this.#updateCamera();
    this.#updateRenderer();
    this.onAfterResize(this.size);
  }

  #updateCamera() {
    this.camera.aspect = this.size.width / this.size.height;
    if (this.camera.isPerspectiveCamera && this.cameraFov) {
      if (this.cameraMinAspect && this.camera.aspect < this.cameraMinAspect) {
        this.#adjustFov(this.cameraMinAspect);
      } else if (
        this.cameraMaxAspect &&
        this.camera.aspect > this.cameraMaxAspect
      ) {
        this.#adjustFov(this.cameraMaxAspect);
      } else {
        this.camera.fov = this.cameraFov;
      }
    }
    this.camera.updateProjectionMatrix();
    this.updateWorldSize();
  }

  #adjustFov(aspect: number) {
    const tanFov = Math.tan(MathUtils.degToRad(this.cameraFov / 2));
    const newTan = tanFov / (this.camera.aspect / aspect);
    this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(newTan));
  }

  updateWorldSize() {
    if (this.camera.isPerspectiveCamera) {
      const fovRad = (this.camera.fov * Math.PI) / 180;
      this.size.wHeight =
        2 * Math.tan(fovRad / 2) * this.camera.position.length();
      this.size.wWidth = this.size.wHeight * this.camera.aspect;
    }
  }

  #updateRenderer() {
    this.renderer.setSize(this.size.width, this.size.height);
    this.#postprocessing?.setSize(this.size.width, this.size.height);
    let pr = window.devicePixelRatio;
    if (this.maxPixelRatio && pr > this.maxPixelRatio) {
      pr = this.maxPixelRatio;
    } else if (this.minPixelRatio && pr < this.minPixelRatio) {
      pr = this.minPixelRatio;
    }
    this.renderer.setPixelRatio(pr);
    this.size.pixelRatio = pr;
  }

  #onIntersection(entries: IntersectionObserverEntry[]) {
    this.#isAnimating = entries[0].isIntersecting;
    if (this.#isAnimating) this.#startAnimation();
    else this.#stopAnimation();
  }

  #onVisibilityChange() {
    if (this.#isAnimating) {
      if (document.hidden) this.#stopAnimation();
      else this.#startAnimation();
    }
  }

  #startAnimation() {
    if (this.#isVisible) return;
    const animateFrame = () => {
      this.#animationFrameId = requestAnimationFrame(animateFrame);
      this.#timer.update();
      this.#animationState.delta = this.#timer.getDelta();
      this.#animationState.elapsed += this.#animationState.delta;
      this.onBeforeRender(this.#animationState);
      this.render();
      this.onAfterRender(this.#animationState);
    };
    this.#isVisible = true;
    this.#timer.reset();
    animateFrame();
  }

  #stopAnimation() {
    if (this.#isVisible) {
      cancelAnimationFrame(this.#animationFrameId);
      this.#isVisible = false;
    }
  }

  #render() {
    this.renderer.render(this.scene, this.camera);
  }

  clear() {
    this.scene.traverse((obj) => {
      const mesh = obj as InstancedMesh;
      if (!mesh.isInstancedMesh && !(obj as { isMesh?: boolean }).isMesh)
        return;
      const material = mesh.material as MeshPhysicalMaterial | undefined;
      if (material && typeof material === "object") {
        for (const key of Object.keys(material)) {
          const held = (material as unknown as Record<string, unknown>)[
            key
          ] as {
            dispose?: () => void;
          } | null;
          if (
            held &&
            typeof held === "object" &&
            typeof held.dispose === "function"
          ) {
            held.dispose();
          }
        }
        material.dispose();
        mesh.geometry?.dispose();
      }
    });
    this.scene.clear();
  }

  dispose() {
    this.#onResizeCleanup();
    this.#stopAnimation();
    this.#timer.dispose();
    this.clear();
    this.#postprocessing?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.isDisposed = true;
  }

  #onResizeCleanup() {
    window.removeEventListener("resize", this.#onResizeBound);
    this.#resizeObserver?.disconnect();
    this.#intersectionObserver?.disconnect();
    document.removeEventListener("visibilitychange", this.#onVisibilityBound);
  }
}

interface WConfig {
  count: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  maxSize: number;
  minSize: number;
  size0: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  controlSphere0?: boolean;
  followCursor?: boolean;
}

/* The scratch vectors the physics runs on.

   One set for the module, reused every pair of every frame. Inside the loop
   these were `new Vector3()` - eight of them per pair, and the pair loop is
   `n²/2`, so two hundred balls made a hundred and sixty thousand objects a
   frame. The published file declares its own set of these at the foot of the
   module and never reaches for them; this is that intention, carried out. */
const pos = new Vector3();
const vel = new Vector3();
const otherPos = new Vector3();
const otherVel = new Vector3();
const diff = new Vector3();
const correction = new Vector3();
const velCorrection = new Vector3();
const zero = new Vector3();

class W {
  config: WConfig;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center: Vector3 = new Vector3();

  constructor(config: WConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);
    this.center = new Vector3();
    this.#initializePositions();
    this.setSizes();
  }

  #initializePositions() {
    const { config, positionData } = this;
    this.center.toArray(positionData, 0);
    for (let i = 1; i < config.count; i++) {
      const idx = 3 * i;
      positionData[idx] = MathUtils.randFloatSpread(2 * config.maxX);
      positionData[idx + 1] = MathUtils.randFloatSpread(2 * config.maxY);
      positionData[idx + 2] = MathUtils.randFloatSpread(2 * config.maxZ);
    }
  }

  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i++) {
      sizeData[i] = MathUtils.randFloat(config.minSize, config.maxSize);
    }
  }

  update(deltaInfo: { delta: number }) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let startIdx = 0;
    if (config.controlSphere0) {
      startIdx = 1;
      pos.fromArray(positionData, 0);
      pos.lerp(center, 0.1).toArray(positionData, 0);
      zero.set(0, 0, 0).toArray(velocityData, 0);
    }
    for (let idx = startIdx; idx < config.count; idx++) {
      const base = 3 * idx;
      pos.fromArray(positionData, base);
      vel.fromArray(velocityData, base);
      vel.y -= deltaInfo.delta * config.gravity * sizeData[idx];
      vel.multiplyScalar(config.friction);
      vel.clampLength(0, config.maxVelocity);
      pos.add(vel);
      pos.toArray(positionData, base);
      vel.toArray(velocityData, base);
    }
    for (let idx = startIdx; idx < config.count; idx++) {
      const base = 3 * idx;
      pos.fromArray(positionData, base);
      vel.fromArray(velocityData, base);
      const radius = sizeData[idx];
      for (let jdx = idx + 1; jdx < config.count; jdx++) {
        const otherBase = 3 * jdx;
        otherPos.fromArray(positionData, otherBase);
        otherVel.fromArray(velocityData, otherBase);
        diff.copy(otherPos).sub(pos);
        const dist = diff.length();
        const sumRadius = radius + sizeData[jdx];
        if (dist < sumRadius) {
          const overlap = sumRadius - dist;
          correction
            .copy(diff)
            .normalize()
            .multiplyScalar(0.5 * overlap);
          velCorrection
            .copy(correction)
            .multiplyScalar(Math.max(vel.length(), 1));
          pos.sub(correction);
          vel.sub(velCorrection);
          pos.toArray(positionData, base);
          vel.toArray(velocityData, base);
          otherPos.add(correction);
          otherVel.add(
            velCorrection
              .copy(correction)
              .multiplyScalar(Math.max(otherVel.length(), 1)),
          );
          otherPos.toArray(positionData, otherBase);
          otherVel.toArray(velocityData, otherBase);
        }
      }
      if (config.controlSphere0) {
        diff.fromArray(positionData, 0).sub(pos);
        const d = diff.length();
        const sumRadius0 = radius + sizeData[0];
        if (d < sumRadius0) {
          correction
            .copy(diff)
            .normalize()
            .multiplyScalar(sumRadius0 - d);
          velCorrection
            .copy(correction)
            .multiplyScalar(Math.max(vel.length(), 2));
          pos.sub(correction);
          vel.sub(velCorrection);
        }
      }
      if (Math.abs(pos.x) + radius > config.maxX) {
        pos.x = Math.sign(pos.x) * (config.maxX - radius);
        vel.x = -vel.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(pos.y) + radius > config.maxY) {
          pos.y = Math.sign(pos.y) * (config.maxY - radius);
          vel.y = -vel.y * config.wallBounce;
        }
      } else if (pos.y - radius < -config.maxY) {
        pos.y = -config.maxY + radius;
        vel.y = -vel.y * config.wallBounce;
      }
      const maxBoundary = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(pos.z) + radius > maxBoundary) {
        pos.z = Math.sign(pos.z) * (config.maxZ - radius);
        vel.z = -vel.z * config.wallBounce;
      }
      pos.toArray(positionData, base);
      vel.toArray(velocityData, base);
    }
  }
}

interface Shader {
  uniforms: Record<string, { value: unknown }>;
  fragmentShader: string;
}

class Y extends MeshPhysicalMaterial {
  uniforms: Record<string, { value: number }> = {
    thicknessDistortion: { value: 0.1 },
    thicknessAmbient: { value: 0 },
    thicknessAttenuation: { value: 0.1 },
    thicknessPower: { value: 2 },
    thicknessScale: { value: 10 },
  };
  declare defines: Record<string, string>;

  constructor(params: ConstructorParameters<typeof MeshPhysicalMaterial>[0]) {
    super(params);

    /* Added to what the material already defines, not written over it.

       The published file assigns `this.defines = { USE_UV: "" }`, and
       `MeshPhysicalMaterial`'s own constructor has just set
       `{ STANDARD: "", PHYSICAL: "" }` there, so that assignment drops both.
       It compiles anyway today - the shader reaches most of what those two
       switch on by other routes - so this is not the fix for anything, just
       the correct way to add a define to a material that has its own. */
    this.defines = { ...this.defines, USE_UV: "" };
    this.onBeforeCompile = (shader: Shader) => {
      Object.assign(shader.uniforms, this.uniforms);
      shader.fragmentShader =
        `
        uniform float thicknessPower;
        uniform float thicknessScale;
        uniform float thicknessDistortion;
        uniform float thicknessAmbient;
        uniform float thicknessAttenuation;
        ` + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "void main() {",
        `
        void RE_Direct_Scattering(const in IncidentLight directLight, const in vec2 uv, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, inout ReflectedLight reflectedLight) {
          vec3 scatteringHalf = normalize(directLight.direction + (geometryNormal * thicknessDistortion));
          float scatteringDot = pow(saturate(dot(geometryViewDir, -scatteringHalf)), thicknessPower) * thicknessScale;
          #ifdef USE_COLOR
            /* .rgb, and this is the fourth change to the published file.

               It multiplies straight into vColor and assigns the result to a
               vec3. In current three.js, color_pars_fragment declares
               varying vec4 vColor - it carries alpha now - so the fragment
               shader failed to compile with a dimension mismatch, and what
               three reports for that is VALIDATE_STATUS false with no line in
               it. Which is why this was found by compiling the shader rather
               than by reading it.

               No backticks in here, either: this comment is inside a template
               literal, and one of them ends the shader source early. */
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * vColor.rgb;
          #else
            vec3 scatteringIllu = (scatteringDot + thicknessAmbient) * diffuse;
          #endif
          reflectedLight.directDiffuse += scatteringIllu * thicknessAttenuation * directLight.color;
        }

        void main() {
        `,
      );
      const lightsChunk = ShaderChunk.lights_fragment_begin.replaceAll(
        "RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );",
        `
          RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
          RE_Direct_Scattering(directLight, vUv, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, reflectedLight);
        `,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <lights_fragment_begin>",
        lightsChunk,
      );
    };
  }
}

/**
 * The scene's own settings.
 *
 * The published defaults, with this site's colours in place of the black it
 * ships with: the mark's blue running into its teal, lit white at the strength
 * the card used. Everything else - the counts, the sizes, the friction - is as
 * published, and every one of them can be overridden by a prop.
 */
const BALLPIT = {
  count: 200,
  colors: [0x2a98fe, 0x06dbaf],
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  lightIntensity: 2.4,
  materialParams: {
    metalness: 0.5,
    roughness: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0.15,
  },
  minSize: 0.5,
  maxSize: 1,
  size0: 1,
  gravity: 0.5,
  friction: 0.9975,
  wallBounce: 0.95,
  maxVelocity: 0.15,
  maxX: 5,
  maxY: 5,
  maxZ: 2,
  controlSphere0: false,
  followCursor: true,
};

const U = new Object3D();

let globalPointerActive = false;
const pointerPosition = new Vector2();

interface PointerData {
  position: Vector2;
  nPosition: Vector2;
  hover: boolean;
  touching: boolean;
  onEnter: (data: PointerData) => void;
  onMove: (data: PointerData) => void;
  onClick: (data: PointerData) => void;
  onLeave: (data: PointerData) => void;
  dispose?: () => void;
}

const pointerMap = new Map<HTMLElement, PointerData>();

function createPointerData(
  options: Partial<PointerData> & { domElement: HTMLElement },
): PointerData {
  const defaultData: PointerData = {
    position: new Vector2(),
    nPosition: new Vector2(),
    hover: false,
    touching: false,
    onEnter: () => {},
    onMove: () => {},
    onClick: () => {},
    onLeave: () => {},
    ...options,
  };
  if (!pointerMap.has(options.domElement)) {
    pointerMap.set(options.domElement, defaultData);
    if (!globalPointerActive) {
      document.body.addEventListener("pointermove", onPointerMove);
      document.body.addEventListener("pointerleave", onPointerLeave);
      document.body.addEventListener("click", onPointerClick);
      /* Passive, and this is a departure from the published file.

         It attaches these with `{ passive: false }` and calls
         `preventDefault()` on every touch, which takes the page's own scroll
         away for as long as a finger is over the canvas - on a phone that is a
         hero somebody cannot swipe past. The pit answers to a finger without
         needing to swallow the gesture. */
      document.body.addEventListener("touchstart", onTouchStart, {
        passive: true,
      });
      document.body.addEventListener("touchmove", onTouchMove, {
        passive: true,
      });
      document.body.addEventListener("touchend", onTouchEnd, { passive: true });
      document.body.addEventListener("touchcancel", onTouchEnd, {
        passive: true,
      });
      globalPointerActive = true;
    }
  }
  defaultData.dispose = () => {
    pointerMap.delete(options.domElement);
    if (pointerMap.size === 0) {
      document.body.removeEventListener("pointermove", onPointerMove);
      document.body.removeEventListener("pointerleave", onPointerLeave);
      document.body.removeEventListener("click", onPointerClick);
      document.body.removeEventListener("touchstart", onTouchStart);
      document.body.removeEventListener("touchmove", onTouchMove);
      document.body.removeEventListener("touchend", onTouchEnd);
      document.body.removeEventListener("touchcancel", onTouchEnd);
      globalPointerActive = false;
    }
  };
  return defaultData;
}

function onPointerMove(e: PointerEvent) {
  pointerPosition.set(e.clientX, e.clientY);
  processPointerInteraction();
}

function processPointerInteraction() {
  for (const [elem, data] of pointerMap) {
    const rect = elem.getBoundingClientRect();
    if (isInside(rect)) {
      updatePointerData(data, rect);
      if (!data.hover) {
        data.hover = true;
        data.onEnter(data);
      }
      data.onMove(data);
    } else if (data.hover && !data.touching) {
      data.hover = false;
      data.onLeave(data);
    }
  }
}

function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 0) return;
  pointerPosition.set(e.touches[0].clientX, e.touches[0].clientY);
  for (const [elem, data] of pointerMap) {
    const rect = elem.getBoundingClientRect();
    if (isInside(rect)) {
      data.touching = true;
      updatePointerData(data, rect);
      if (!data.hover) {
        data.hover = true;
        data.onEnter(data);
      }
      data.onMove(data);
    }
  }
}

function onTouchMove(e: TouchEvent) {
  if (e.touches.length === 0) return;
  pointerPosition.set(e.touches[0].clientX, e.touches[0].clientY);
  for (const [elem, data] of pointerMap) {
    const rect = elem.getBoundingClientRect();
    updatePointerData(data, rect);
    if (isInside(rect)) {
      if (!data.hover) {
        data.hover = true;
        data.touching = true;
        data.onEnter(data);
      }
      data.onMove(data);
    } else if (data.hover && data.touching) {
      data.onMove(data);
    }
  }
}

function onTouchEnd() {
  for (const [, data] of pointerMap) {
    if (data.touching) {
      data.touching = false;
      if (data.hover) {
        data.hover = false;
        data.onLeave(data);
      }
    }
  }
}

function onPointerClick(e: MouseEvent) {
  pointerPosition.set(e.clientX, e.clientY);
  for (const [elem, data] of pointerMap) {
    const rect = elem.getBoundingClientRect();
    updatePointerData(data, rect);
    if (isInside(rect)) data.onClick(data);
  }
}

function onPointerLeave() {
  for (const data of pointerMap.values()) {
    if (data.hover) {
      data.hover = false;
      data.onLeave(data);
    }
  }
}

function updatePointerData(data: PointerData, rect: DOMRect) {
  data.position.set(
    pointerPosition.x - rect.left,
    pointerPosition.y - rect.top,
  );
  data.nPosition.set(
    (data.position.x / rect.width) * 2 - 1,
    (-data.position.y / rect.height) * 2 + 1,
  );
}

function isInside(rect: DOMRect) {
  return (
    pointerPosition.x >= rect.left &&
    pointerPosition.x <= rect.left + rect.width &&
    pointerPosition.y >= rect.top &&
    pointerPosition.y <= rect.top + rect.height
  );
}

class Z extends InstancedMesh {
  config: typeof BALLPIT;
  physics: W;
  ambientLight: AmbientLight | undefined;
  light: PointLight | undefined;

  constructor(renderer: WebGLRenderer, params: Partial<typeof BALLPIT> = {}) {
    const config = { ...BALLPIT, ...params };
    const roomEnv = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(roomEnv).texture;
    /* Released as soon as the map is baked. The generator holds two render
       targets and the room holds a dozen meshes, and neither is looked at
       again after this line - the published file leaves both alive for the
       life of the scene. */
    pmrem.dispose();
    roomEnv.dispose();

    /* Sixteen by twelve, not the default thirty-two by sixteen.

       A default sphere is about a thousand triangles; a hundred of them is a
       hundred thousand a frame. These are drawn between forty and ninety
       pixels across, where the difference between 1,024 facets and 384 is not
       visible - a ball this size is lit by its own reflection, not by its
       silhouette. */
    const geometry = new SphereGeometry(1, 16, 12);
    const material = new Y({ envMap: envTexture, ...config.materialParams });
    material.envMapRotation.x = -Math.PI / 2;
    super(geometry, material, config.count);
    this.config = config;
    this.physics = new W(config);
    this.#setupLights();
    this.setColors(config.colors);
  }

  #setupLights() {
    this.ambientLight = new AmbientLight(
      this.config.ambientColor,
      this.config.ambientIntensity,
    );
    this.add(this.ambientLight);
    this.light = new PointLight(
      this.config.colors[0],
      this.config.lightIntensity,
    );
    this.add(this.light);
  }

  setColors(colors: number[]) {
    if (!Array.isArray(colors) || colors.length <= 1) return;

    const objects = colors.map((col) => new Color(col));
    const at = (ratio: number, out: Color = new Color()) => {
      const clamped = Math.max(0, Math.min(1, ratio));
      const scaled = clamped * (colors.length - 1);
      const idx = Math.floor(scaled);
      const start = objects[idx];
      if (idx >= colors.length - 1) return start.clone();
      const alpha = scaled - idx;
      const end = objects[idx + 1];
      out.r = start.r + alpha * (end.r - start.r);
      out.g = start.g + alpha * (end.g - start.g);
      out.b = start.b + alpha * (end.b - start.b);
      return out;
    };

    for (let idx = 0; idx < this.count; idx++) {
      this.setColorAt(idx, at(idx / this.count));
      if (idx === 0) this.light!.color.copy(at(idx / this.count));
    }

    if (!this.instanceColor) return;
    this.instanceColor.needsUpdate = true;
  }

  update(deltaInfo: { delta: number }) {
    this.physics.update(deltaInfo);
    for (let idx = 0; idx < this.count; idx++) {
      U.position.fromArray(this.physics.positionData, 3 * idx);
      if (idx === 0 && this.config.followCursor === false) {
        U.scale.setScalar(0);
      } else {
        U.scale.setScalar(this.physics.sizeData[idx]);
      }
      U.updateMatrix();
      this.setMatrixAt(idx, U.matrix);
      if (idx === 0) this.light!.position.copy(U.position);
    }
    this.instanceMatrix.needsUpdate = true;
  }
}

interface CreateBallpitReturn {
  three: X;
  spheres: Z;
  setCount: (count: number) => void;
  updateConfig: (newProps: Partial<typeof BALLPIT>) => void;
  togglePause: () => void;
  dispose: () => void;
}

function createBallpit(
  canvas: HTMLCanvasElement,
  config: Partial<typeof BALLPIT> = {},
): CreateBallpitReturn {
  const threeInstance = new X({
    canvas,
    size: "parent",
    rendererOptions: { antialias: true, alpha: true },
  });
  let spheres: Z;
  /* A cap on how many pixels this is drawn at, which nothing was setting.

     `X` has had `maxPixelRatio` since it was published and `createBallpit`
     never touches it, so the scene renders at whatever the display asks for.
     On a 2x screen a card this size is about three and a half million
     fragments a frame, on a 3x phone it is eight million - and every one of
     them runs a physical material with a clearcoat lobe, an environment
     lookup and the scattering term added on top, several times over where the
     balls overlap.

     At 1.5 that is two million, whatever the display. Glass spheres are the
     most forgiving thing there is to render at less than native: there is no
     type on them, no hairline, no edge that has to land on a pixel. */
  threeInstance.maxPixelRatio = 1.5;

  threeInstance.renderer.toneMapping = ACESFilmicToneMapping;
  threeInstance.camera.position.set(0, 0, 20);
  threeInstance.camera.lookAt(0, 0, 0);
  threeInstance.cameraMaxAspect = 1.5;
  threeInstance.resize();
  initialize(config);
  const raycaster = new Raycaster();
  const plane = new Plane(new Vector3(0, 0, 1), 0);
  const intersectionPoint = new Vector3();
  let isPaused = false;

  canvas.style.touchAction = "none";
  canvas.style.userSelect = "none";
  (
    canvas.style as CSSStyleDeclaration & { webkitUserSelect?: string }
  ).webkitUserSelect = "none";

  const pointerData = createPointerData({
    domElement: canvas,
    onMove() {
      raycaster.setFromCamera(pointerData.nPosition, threeInstance.camera);
      threeInstance.camera.getWorldDirection(plane.normal);
      raycaster.ray.intersectPlane(plane, intersectionPoint);
      spheres.physics.center.copy(intersectionPoint);
      spheres.config.controlSphere0 = true;
    },
    onLeave() {
      spheres.config.controlSphere0 = false;
    },
  });

  function initialize(cfg: Partial<typeof BALLPIT>) {
    if (spheres) {
      threeInstance.clear();
      threeInstance.scene.remove(spheres);
    }
    spheres = new Z(threeInstance.renderer, cfg);
    threeInstance.scene.add(spheres);
  }

  threeInstance.onBeforeRender = (deltaInfo) => {
    if (!isPaused) spheres.update(deltaInfo);
  };
  threeInstance.onAfterResize = (size) => {
    spheres.config.maxX = size.wWidth / 2;
    spheres.config.maxY = size.wHeight / 2;
  };

  return {
    three: threeInstance,
    get spheres() {
      return spheres;
    },
    setCount(count: number) {
      initialize({ ...spheres.config, count });
    },
    updateConfig(newProps: Partial<typeof BALLPIT>) {
      if (
        newProps.count !== undefined &&
        newProps.count !== spheres.config.count
      ) {
        initialize({ ...spheres.config, ...newProps });
      } else {
        Object.assign(spheres.config, newProps);
        if (newProps.colors) spheres.setColors(spheres.config.colors);
        if (
          newProps.minSize !== undefined ||
          newProps.maxSize !== undefined ||
          newProps.size0 !== undefined
        ) {
          spheres.physics.setSizes();
        }
      }
    },
    togglePause() {
      isPaused = !isPaused;
    },
    dispose() {
      pointerData.dispose?.();
      threeInstance.dispose();
    },
  };
}

interface BallpitProps extends Partial<typeof BALLPIT> {
  className?: string;
}

const Ballpit: React.FC<BallpitProps> = ({
  className = "",
  followCursor = true,
  ...props
}) => {
  /* A host to hang a canvas in, rather than the canvas itself.

     The published component renders the `<canvas>` from JSX and holds a ref to
     it, and on this site that crashed on the second mount: `dispose()` calls
     `forceContextLoss()`, which does not release a context so much as destroy
     it, and React hands the same DOM node back when it re-mounts. In
     development that is every mount - StrictMode runs effects twice on purpose
     to find exactly this - so the second renderer attached to a dead canvas and
     three.js threw reading `precision` off a null shader format.

     Making the canvas here means every mount gets an element that has never had
     a context. It also keeps `forceContextLoss()`, which is worth keeping: a
     browser allows about sixteen live WebGL contexts and drops the oldest
     without asking, so a scene that does not give its own back takes somebody
     else's. */
  const hostRef = useRef<HTMLDivElement>(null);
  const spheresInstanceRef = useRef<CreateBallpitReturn | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    spheresInstanceRef.current = createBallpit(canvas, {
      followCursor,
      ...props,
    });

    return () => {
      spheresInstanceRef.current?.dispose();
      spheresInstanceRef.current = null;
      canvas.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (spheresInstanceRef.current) {
      spheresInstanceRef.current.updateConfig({ followCursor, ...props });
    }
  }, [props, followCursor]);

  return <div ref={hostRef} className={cn("h-full w-full", className)} />;
};

export default Ballpit;
