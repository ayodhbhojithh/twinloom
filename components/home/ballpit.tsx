"use client";

import { useEffect, useRef } from "react";
import {
  ACESFilmicToneMapping,
  AmbientLight,
  ClampToEdgeWrapping,
  DataTexture,
  type Texture,
  Group,
  InstancedMesh,
  LinearFilter,
  MathUtils,
  MeshPhysicalMaterial,
  Object3D,
  PerspectiveCamera,
  Plane,
  PMREMGenerator,
  DirectionalLight,
  Raycaster,
  RGBAFormat,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Timer,
  UnsignedByteType,
  Vector2,
  Vector3,
  WebGLRenderer,
  type MeshPhysicalMaterialParameters,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Ballpit, from React Bits. After Kevin Levron.

   A box of instanced spheres with a physics step of its own: gravity, friction,
   a wall bounce and pair-by-pair separation, all run over flat arrays rather
   than objects, and written into one `InstancedMesh` every frame. The material
   is a `MeshPhysicalMaterial` with a scattering term patched into its light
   loop, which is what makes the balls read as glass beads rather than as
   plastic. Sphere zero is the cursor: it is pulled toward wherever the pointer
   meets the camera's plane, and it shoves the rest out of the way.

   Ported to TypeScript from the published component, and kept close to it. Four
   things are deliberately different:

   1. The touch handlers are gone. As published they call `preventDefault` on
      every `touchstart` and `touchmove` reaching the body, whether or not the
      touch is anywhere near the canvas - which stops the page scrolling on a
      phone. The card this sits in is most of a phone screen, so that is a page
      nobody can get past. Pointer events still cover mouse and pen, and a phone
      has no cursor to follow in the first place.
   2. `touch-action: none` on the canvas is gone, for the same reason.
   3. The window and document listeners are removed with the same function
      objects they were added with. As published they are re-bound at removal,
      so nothing is ever taken off and every mount leaves its listeners behind.
   4. The stage only sizes itself to its parent, because that is the only way
      this is used. The `id` lookup and the window-size mode went with it.
--------------------------------------------------------------------------- */

const { randFloat, randFloatSpread } = MathUtils;

/* How fast the balls are already going when they arrive.

   Added to the published physics, and needed the moment gravity is nought.
   Velocities start at zero there, so with nothing pulling on them the balls
   simply hang where they were scattered and the pit is a still photograph until
   somebody moves the cursor. A shove each, in a random direction, and the field
   drifts from the first frame. */
const NUDGE = 0.03;

/** Scratch, module-wide, so the physics step allocates nothing. */
const cursorAt = new Vector3();
const here = new Vector3();
const there = new Vector3();
const still = new Vector3();
const drift = new Vector3();
const otherDrift = new Vector3();
const gap = new Vector3();
const push = new Vector3();
const shove = new Vector3();
const otherShove = new Vector3();

interface StageSize {
  width: number;
  height: number;
  wWidth: number;
  wHeight: number;
  ratio: number;
  pixelRatio: number;
}

interface Beat {
  elapsed: number;
  delta: number;
}

/**
 * The renderer, the camera and the loop.
 *
 * Sized to whatever the canvas is inside, stopped when it leaves the screen or
 * the tab goes to the background, and disposed properly on the way out.
 */
class Stage {
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  cameraMaxAspect?: number;
  maxPixelRatio?: number;

  size: StageSize = {
    width: 0,
    height: 0,
    wWidth: 0,
    wHeight: 0,
    ratio: 0,
    pixelRatio: 0,
  };

  onBeforeRender: (beat: Beat) => void = () => {};
  onAfterResize: (size: StageSize) => void = () => {};

  #fov: number;
  #running = false;
  #seen = false;
  #frame = 0;
  #settle?: ReturnType<typeof setTimeout>;
  #clock = new Timer();
  #beat: Beat = { elapsed: 0, delta: 0 };
  #bounds?: ResizeObserver;
  #eye?: IntersectionObserver;

  /* Bound once and kept, because a listener added with one bound function and
     removed with another is a listener that never comes off. */
  #onResize = () => {
    if (this.#settle) clearTimeout(this.#settle);
    this.#settle = setTimeout(() => this.resize(), 100);
  };
  #onWake = () => {
    if (!this.#seen) return;
    if (document.hidden) this.#stop();
    else this.#start();
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.camera = new PerspectiveCamera();
    this.#fov = this.camera.fov;
    this.scene = new Scene();

    canvas.style.display = "block";
    this.renderer = new WebGLRenderer({
      canvas,
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    this.renderer.outputColorSpace = SRGBColorSpace;

    /* Do not read the compiler's opinion back.

       Three asks the driver for every program's info log after linking, and
       prints whatever comes back. On Windows that is ANGLE's HLSL compiler,
       which warns about its own constant folding - "sum of 1 and -1.49e-017
       cannot be represented accurately" - on shaders three generates itself
       while prefiltering the environment map. The numbers are cosines of right
       angles, which are 6e-17 rather than 0 in double precision. Nothing is
       wrong and there is nothing to fix in them; they are a vendor compiler
       being conversational.

       Turning it off is not hiding a fault, and it is worth doing for a second
       reason: `getProgramInfoLog` is a synchronous read back from the GPU, so
       every program this compiles has been stalling the thread to fetch a
       string nobody reads. Three's own guidance is to switch it off outside
       development. */
    this.renderer.debug.checkShaderErrors = false;

    this.resize();

    window.addEventListener("resize", this.#onResize);
    if (canvas.parentElement) {
      this.#bounds = new ResizeObserver(this.#onResize);
      this.#bounds.observe(canvas.parentElement);
    }
    this.#eye = new IntersectionObserver(
      (entries) => {
        this.#seen = entries[0]?.isIntersecting ?? false;
        if (this.#seen) this.#start();
        else this.#stop();
      },
      { threshold: 0 },
    );
    this.#eye.observe(canvas);
    document.addEventListener("visibilitychange", this.#onWake);
  }

  resize() {
    const parent = this.canvas.parentElement;
    const width = parent?.offsetWidth ?? window.innerWidth;
    const height = parent?.offsetHeight ?? window.innerHeight;

    this.size.width = width;
    this.size.height = height;
    this.size.ratio = width / height;

    this.camera.aspect = width / height;
    if (this.cameraMaxAspect && this.camera.aspect > this.cameraMaxAspect) {
      /* Narrower than the camera was set up for: widen the lens rather than
         crop, or a tall card shows a slice of the box and nothing else. */
      const held =
        Math.tan(MathUtils.degToRad(this.#fov / 2)) /
        (this.camera.aspect / this.cameraMaxAspect);
      this.camera.fov = 2 * MathUtils.radToDeg(Math.atan(held));
    } else {
      this.camera.fov = this.#fov;
    }
    this.camera.updateProjectionMatrix();

    const seen = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(seen / 2) * this.camera.position.length();
    this.size.wWidth = this.size.wHeight * this.camera.aspect;

    this.renderer.setSize(width, height);
    const ratio = Math.min(
      window.devicePixelRatio || 1,
      this.maxPixelRatio ?? Infinity,
    );
    this.renderer.setPixelRatio(ratio);
    this.size.pixelRatio = ratio;

    this.onAfterResize(this.size);
  }

  #start() {
    if (this.#running) return;
    this.#running = true;
    this.#clock.reset();
    const loop = () => {
      this.#frame = requestAnimationFrame(loop);
      this.#clock.update();
      this.#beat.delta = this.#clock.getDelta();
      this.#beat.elapsed += this.#beat.delta;
      this.onBeforeRender(this.#beat);
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  #stop() {
    if (!this.#running) return;
    cancelAnimationFrame(this.#frame);
    this.#running = false;
  }

  clear() {
    this.scene.traverse((thing) => {
      const mesh = thing as InstancedMesh;
      if (!mesh.isInstancedMesh && !(thing as { isMesh?: boolean }).isMesh) {
        return;
      }
      const material = mesh.material as MeshPhysicalMaterial | undefined;
      material?.dispose();
      mesh.geometry?.dispose();
    });
    this.scene.clear();
  }

  dispose() {
    window.removeEventListener("resize", this.#onResize);
    document.removeEventListener("visibilitychange", this.#onWake);
    this.#bounds?.disconnect();
    this.#eye?.disconnect();
    if (this.#settle) clearTimeout(this.#settle);
    this.#stop();
    this.#clock.dispose();
    this.clear();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

/**
 * Where the pointer is over a given element, in that element's own coordinates.
 *
 * One listener on the body rather than one per canvas, because the page may hold
 * several of these and a pointer move is a pointer move.
 */
interface Pointer {
  nPosition: Vector2;
  hover: boolean;
  onMove: () => void;
  onLeave: () => void;
}

const watched = new Map<HTMLElement, Pointer>();
const cursor = new Vector2();
let listening = false;

function inside(box: DOMRect) {
  return (
    cursor.x >= box.left &&
    cursor.x <= box.left + box.width &&
    cursor.y >= box.top &&
    cursor.y <= box.top + box.height
  );
}

function moved(event: PointerEvent) {
  cursor.x = event.clientX;
  cursor.y = event.clientY;
  for (const [element, pointer] of watched) {
    const box = element.getBoundingClientRect();
    if (inside(box)) {
      pointer.nPosition.x = ((cursor.x - box.left) / box.width) * 2 - 1;
      pointer.nPosition.y = (-(cursor.y - box.top) / box.height) * 2 + 1;
      pointer.hover = true;
      pointer.onMove();
    } else if (pointer.hover) {
      pointer.hover = false;
      pointer.onLeave();
    }
  }
}

function left() {
  for (const pointer of watched.values()) {
    if (!pointer.hover) continue;
    pointer.hover = false;
    pointer.onLeave();
  }
}

function watch(
  element: HTMLElement,
  onMove: () => void,
  onLeave: () => void,
): Pointer & { dispose: () => void } {
  const pointer: Pointer = {
    nPosition: new Vector2(),
    hover: false,
    onMove,
    onLeave,
  };
  watched.set(element, pointer);
  if (!listening) {
    document.body.addEventListener("pointermove", moved);
    document.body.addEventListener("pointerleave", left);
    listening = true;
  }
  return {
    ...pointer,
    get nPosition() {
      return pointer.nPosition;
    },
    dispose() {
      watched.delete(element);
      if (watched.size > 0) return;
      document.body.removeEventListener("pointermove", moved);
      document.body.removeEventListener("pointerleave", left);
      listening = false;
    },
  };
}

interface PitConfig {
  count: number;
  /** The gradient every ball carries, foot to crown. */
  colors: number[];
  /** The gradients the odd ball carries instead, taken in turn. */
  accents: number[][];
  /** How many balls are odd ones, nought to one, shared between the lot. */
  accentShare: number;
  ambientColor: number;
  ambientIntensity: number;
  lightIntensity: number;
  materialParams: MeshPhysicalMaterialParameters;
  minSize: number;
  maxSize: number;
  size0: number;
  gravity: number;
  friction: number;
  wallBounce: number;
  maxVelocity: number;
  maxX: number;
  maxY: number;
  maxZ: number;
  controlSphere0: boolean;
  followCursor: boolean;
}

/**
 * The physics: three flat arrays and a step that walks every pair.
 *
 * Quadratic in the ball count, which is why the count is the one number worth
 * being careful with. At a hundred and forty it is twenty thousand distance
 * checks a frame, which is nothing; at a thousand it is half a million.
 */
class Physics {
  config: PitConfig;
  positionData: Float32Array;
  velocityData: Float32Array;
  sizeData: Float32Array;
  center = new Vector3();

  constructor(config: PitConfig) {
    this.config = config;
    this.positionData = new Float32Array(3 * config.count).fill(0);
    this.velocityData = new Float32Array(3 * config.count).fill(0);
    this.sizeData = new Float32Array(config.count).fill(1);

    this.center.toArray(this.positionData, 0);
    for (let i = 1; i < config.count; i += 1) {
      const at = 3 * i;
      this.positionData[at] = randFloatSpread(2 * config.maxX);
      this.positionData[at + 1] = randFloatSpread(2 * config.maxY);
      this.positionData[at + 2] = randFloatSpread(2 * config.maxZ);
      this.velocityData[at] = randFloatSpread(NUDGE);
      this.velocityData[at + 1] = randFloatSpread(NUDGE);
      this.velocityData[at + 2] = randFloatSpread(NUDGE * 0.4);
    }
    this.setSizes();
  }

  setSizes() {
    const { config, sizeData } = this;
    sizeData[0] = config.size0;
    for (let i = 1; i < config.count; i += 1) {
      sizeData[i] = randFloat(config.minSize, config.maxSize);
    }
  }

  update(beat: Beat) {
    const { config, center, positionData, sizeData, velocityData } = this;
    let first = 0;

    if (config.controlSphere0) {
      first = 1;
      cursorAt.fromArray(positionData, 0);
      cursorAt.lerp(center, 0.1).toArray(positionData, 0);
      still.set(0, 0, 0).toArray(velocityData, 0);
    }

    for (let i = first; i < config.count; i += 1) {
      const at = 3 * i;
      here.fromArray(positionData, at);
      drift.fromArray(velocityData, at);
      drift.y -= beat.delta * config.gravity * sizeData[i];
      drift.multiplyScalar(config.friction);
      drift.clampLength(0, config.maxVelocity);
      here.add(drift);
      here.toArray(positionData, at);
      drift.toArray(velocityData, at);
    }

    for (let i = first; i < config.count; i += 1) {
      const at = 3 * i;
      here.fromArray(positionData, at);
      drift.fromArray(velocityData, at);
      const radius = sizeData[i];

      for (let j = i + 1; j < config.count; j += 1) {
        const other = 3 * j;
        const otherRadius = sizeData[j];
        const touching = radius + otherRadius;

        /* Three subtractions before anything else happens.

           This is the hot loop of the whole screen: every ball against every
           ball behind it, which at two hundred and twenty is twenty-four
           thousand pairs a frame, sixty times a second. Almost none of them
           touch - the field is mostly space - and the version below was doing
           two `Vector3.fromArray` calls, a copy, a subtract and a square root
           for each one before finding that out.

           A ball is at most about one unit across and the box is tens of units
           wide, so a comparison on one axis rejects the overwhelming majority
           for the cost of a subtraction. Three of them, cheapest axis first,
           and only what survives gets read into vectors and measured. The
           physics is identical: the pairs this skips are pairs whose distance
           on a single axis already exceeds the sum of their radii, and no such
           pair can be overlapping. */
        const dx = positionData[other] - positionData[at];
        if (dx > touching || dx < -touching) continue;
        const dy = positionData[other + 1] - positionData[at + 1];
        if (dy > touching || dy < -touching) continue;
        const dz = positionData[other + 2] - positionData[at + 2];
        if (dz > touching || dz < -touching) continue;

        const apart = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (apart >= touching) continue;

        there.fromArray(positionData, other);
        otherDrift.fromArray(velocityData, other);
        gap.set(dx, dy, dz);

        push
          .copy(gap)
          .normalize()
          .multiplyScalar(0.5 * (touching - apart));
        shove.copy(push).multiplyScalar(Math.max(drift.length(), 1));
        otherShove.copy(push).multiplyScalar(Math.max(otherDrift.length(), 1));

        here.sub(push);
        drift.sub(shove);
        here.toArray(positionData, at);
        drift.toArray(velocityData, at);

        there.add(push);
        otherDrift.add(otherShove);
        there.toArray(positionData, other);
        otherDrift.toArray(velocityData, other);
      }

      if (config.controlSphere0) {
        gap.copy(cursorAt).sub(here);
        const apart = gap.length();
        const touching = radius + sizeData[0];
        if (apart < touching) {
          push.copy(gap.normalize()).multiplyScalar(touching - apart);
          shove.copy(push).multiplyScalar(Math.max(drift.length(), 2));
          here.sub(push);
          drift.sub(shove);
        }
      }

      if (Math.abs(here.x) + radius > config.maxX) {
        here.x = Math.sign(here.x) * (config.maxX - radius);
        drift.x = -drift.x * config.wallBounce;
      }
      if (config.gravity === 0) {
        if (Math.abs(here.y) + radius > config.maxY) {
          here.y = Math.sign(here.y) * (config.maxY - radius);
          drift.y = -drift.y * config.wallBounce;
        }
      } else if (here.y - radius < -config.maxY) {
        here.y = -config.maxY + radius;
        drift.y = -drift.y * config.wallBounce;
      }
      const deepest = Math.max(config.maxZ, config.maxSize);
      if (Math.abs(here.z) + radius > deepest) {
        here.z = Math.sign(here.z) * (config.maxZ - radius);
        drift.z = -drift.z * config.wallBounce;
      }

      here.toArray(positionData, at);
      drift.toArray(velocityData, at);
    }
  }
}

/* The scattering material is gone.

   As published, the beads use a `MeshPhysicalMaterial` with a subsurface term
   patched into the standard light loop through `onBeforeCompile` - a
   `RE_Direct_Scattering` function injected ahead of `main`, and a second call
   spliced into every `RE_Direct` in the `lights_fragment_begin` chunk. It does
   not compile against the three in this project: the program comes back with
   VALIDATE_STATUS false and the pit never draws.

   That patch reaches into a shader chunk by string match, so it is tied to the
   exact text of a file three is free to rewrite in any release - which is what
   makes it worth losing rather than pinning a version to. What it added was a
   soft glow through the back of each bead. The clearcoat and the room
   environment map do most of that work anyway, and the balls still read as
   glass rather than as plastic.
*/

const DEFAULTS: PitConfig = {
  count: 200,
  colors: [0, 0, 0],
  accents: [],
  accentShare: 0,
  ambientColor: 0xffffff,
  ambientIntensity: 1,
  /* Directional, so this is a plain multiplier rather than candela - see the
     light itself in `Beads`. */
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

/* How many steps the gradient is cut into. Sixty-four is past the point where
   another one is visible on a ball forty pixels across, and it is four bytes
   each. */
const BANDS = 64;

/**
 * The colours, as a strip one pixel wide.
 *
 * This is the gradient every ball carries. It is a texture rather than a colour
 * attribute on the geometry, and that is the second attempt: an attribute added
 * to the sphere after the mesh was built never reached the shader, and a shader
 * reading an unbound attribute gets nought - which is a field of black balls
 * with the lights still on them.
 *
 * A map has no such question. The sphere's own `uv.y` runs from nought at the
 * foot to one at the crown, so a strip one pixel wide and sixty-four tall is
 * read straight up the ball, and the first colour in the list is the foot.
 *
 * Bytes in sRGB, which is the space the numbers were written in. Passing linear
 * floats through a texture declared sRGB converts them twice.
 */
function ribbon(colors: number[]) {
  const stops = colors.map((value) => [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255,
  ]);

  const data = new Uint8Array(BANDS * 4);
  for (let i = 0; i < BANDS; i += 1) {
    const scaled = (i / (BANDS - 1)) * (stops.length - 1);
    const at = Math.min(stops.length - 2, Math.floor(scaled));
    const step = scaled - at;
    const from = stops[at];
    const to = stops[at + 1];
    data[i * 4] = from[0] + step * (to[0] - from[0]);
    data[i * 4 + 1] = from[1] + step * (to[1] - from[1]);
    data[i * 4 + 2] = from[2] + step * (to[2] - from[2]);
    data[i * 4 + 3] = 255;
  }

  const strip = new DataTexture(data, 1, BANDS, RGBAFormat, UnsignedByteType);
  strip.colorSpace = SRGBColorSpace;
  strip.magFilter = LinearFilter;
  strip.minFilter = LinearFilter;
  strip.wrapS = ClampToEdgeWrapping;
  strip.wrapT = ClampToEdgeWrapping;
  strip.needsUpdate = true;
  return { strip, data };
}

const placing = new Object3D();

/**
 * The environment the balls are lit and reflected by, made once per renderer.
 *
 * Prefiltering a scene into an environment map is not cheap: it renders a cube,
 * then blurs it down through every mip level, compiling a shader for each - and
 * it was being done afresh every time the pit mounted, which is every time
 * somebody turns the landing card onto that screen and back. The result is the
 * same room every time.
 *
 * Keyed on the renderer because the texture belongs to a context: hand it to a
 * second one and it is a texture uploaded to a GPU that has never seen it. A
 * `WeakMap` so a renderer that goes away takes its entry with it.
 *
 * The generator is disposed as soon as it has produced the texture. It holds
 * render targets and a mesh of its own, and it is finished the moment it
 * answers - keeping one alive for the life of the page is keeping a scaffold up
 * after the building is done.
 */
const ROOMS = new WeakMap<WebGLRenderer, Texture>();

function roomFor(renderer: WebGLRenderer): Texture {
  const had = ROOMS.get(renderer);
  if (had) return had;

  const maker = new PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const made = maker.fromScene(room, 0.04).texture;

  maker.dispose();
  room.clear();

  ROOMS.set(renderer, made);
  return made;
}

/** Every ball, as one instanced mesh, with the cursor's own light inside it. */
/**
 * Every ball, as two instanced meshes rather than one.
 *
 * One mesh is one material and one material is one gradient, so a field where
 * most balls run blue into green and a few run yellow into red is two draws. It
 * is still one physics: the balls do not know which mesh they are in, they know
 * where they are, and `lane` and `seat` say which row of which mesh gets each
 * one's matrix. Two draw calls for two hundred spheres is not a cost worth
 * avoiding; a shader that picks a gradient per instance would be.
 *
 * A `Group`, because neither mesh is the other's parent and the lights belong to
 * both.
 */
class Beads extends Group {
  config: PitConfig;
  physics: Physics;
  glow: DirectionalLight;

  /** The field, and the odd one out. */
  private shells: InstancedMesh[];
  /** Which shell each ball is in, and which row of it. */
  private lane: Uint8Array;
  private seat: Int32Array;

  constructor(renderer: WebGLRenderer, config: PitConfig) {
    super();

    const room = roomFor(renderer);

    /* Enough bands to carry a gradient. The default sphere has sixteen from
       pole to pole, and a ramp laid over sixteen is a ramp you can count. One
       geometry for both meshes, because it is the same ball. */
    const geometry = new SphereGeometry(1, 32, 28);

    const skin = (colors: number[]) => {
      const material = new MeshPhysicalMaterial({
        envMap: room,
        /* The gradient. `color` stays white and this multiplies into it, so the
           list is the only thing deciding what a ball looks like. */
        map: ribbon(colors.length > 1 ? colors : [0xffffff, 0xffffff]).strip,
        ...config.materialParams,
      });
      material.envMapRotation.x = -Math.PI / 2;
      return material;
    };

    const field = skin(config.colors);

    /* Which balls are the odd ones, and which gradient each of them gets.

       Every nth, worked out from the share asked for, and the accents taken in
       turn - so the shares come out even without anything having to count them.
       Spaced rather than scattered, for two reasons: a tenth picked at random is
       a tenth on average and eight on this load, and random inside a component
       is a component that renders differently on the server and the client. By
       the time they have bounced around for a second nobody can tell they were
       spaced. */
    const gap =
      config.accentShare > 0 && config.accents.length > 0
        ? Math.max(2, Math.round(1 / config.accentShare))
        : 0;

    this.lane = new Uint8Array(config.count);
    this.seat = new Int32Array(config.count);
    const rows = new Array<number>(1 + config.accents.length).fill(0);

    let turn = 0;
    for (let i = 0; i < config.count; i += 1) {
      /* Never ball zero. That one is the cursor. */
      const odd = gap > 0 && i > 0 && i % gap === gap >> 1;
      const lane = odd ? 1 + (turn++ % config.accents.length) : 0;
      this.lane[i] = lane;
      this.seat[i] = rows[lane];
      rows[lane] += 1;
    }

    this.shells = [field, ...config.accents.map(skin)].map((material, lane) => {
      /* At least one row even where a lane came out empty, so the lane numbers
         above stay the lane numbers here. The spare is scaled to nothing, or it
         would sit at the origin as a ball nobody put there. */
      const shell = new InstancedMesh(
        geometry,
        material,
        Math.max(1, rows[lane]),
      );
      placing.position.set(0, 0, 0);
      placing.scale.setScalar(0);
      placing.updateMatrix();
      for (let spare = rows[lane]; spare < shell.count; spare += 1) {
        shell.setMatrixAt(spare, placing.matrix);
      }
      /* The instances move every frame and the box they move in is the card, so
         a bounding sphere worked out once is a bounding sphere that lies. */
      shell.frustumCulled = false;
      this.add(shell);
      return shell;
    });

    this.config = config;
    this.physics = new Physics(config);

    this.add(new AmbientLight(config.ambientColor, config.ambientIntensity));

    /* The key light: fixed, and above and in front of the field.

       It was a point light parked inside the field on sphere zero, which is the
       sphere the pointer drags around - so the brightest part of the picture
       was wherever the cursor happened to be, and moving the mouse across the
       card dragged a bright patch through it. That is a torch, and this is
       meant to be a room.

       Directional rather than a point light moved somewhere else, because a
       point light has a position and therefore a falloff: parked anywhere in
       the field it makes a hot spot, and parked outside it goes out. A
       directional light has only an angle, so every ball in the field is lit
       the same way from the same side - which is what makes a hundred spheres
       read as one material rather than as a hundred separately staged objects.

       Its intensity is not the old number. Point lights are given in candela
       and fall off with the square of the distance; a directional light does
       not fall off at all, so the two are not the same scale and 190 of these
       would be a white card.

       The colour takes the middle of the field's ramp rather than one end,
       because it is what the whole box is lit by and neither end is the box. */
    const mid = (BANDS >> 1) * 4;
    const lit = ribbon(
      config.colors.length > 1 ? config.colors : [0xffffff, 0xffffff],
    ).data;
    this.glow = new DirectionalLight(0xffffff, config.lightIntensity);
    this.glow.color.setRGB(
      lit[mid] / 255,
      lit[mid + 1] / 255,
      lit[mid + 2] / 255,
      SRGBColorSpace,
    );
    /* Up, to the left and towards the viewer, which is where the highlight
       already sits on every ball in the field. */
    this.glow.position.set(-6, 9, 12);
    this.add(this.glow);
  }

  update(beat: Beat) {
    this.physics.update(beat);
    for (let i = 0; i < this.config.count; i += 1) {
      placing.position.fromArray(this.physics.positionData, 3 * i);
      const hidden = i === 0 && !this.config.followCursor;
      placing.scale.setScalar(hidden ? 0 : this.physics.sizeData[i]);
      placing.updateMatrix();
      this.shells[this.lane[i]].setMatrixAt(this.seat[i], placing.matrix);
    }
    for (const shell of this.shells) shell.instanceMatrix.needsUpdate = true;
  }
}

function createBallpit(canvas: HTMLCanvasElement, config: Partial<PitConfig>) {
  const stage = new Stage(canvas);
  stage.renderer.toneMapping = ACESFilmicToneMapping;
  stage.camera.position.set(0, 0, 20);
  stage.camera.lookAt(0, 0, 0);
  stage.cameraMaxAspect = 1.5;
  /* One and a half rather than two.

     Two hundred glossy spheres over a white card is a picture with no fine
     detail in it anywhere - no type, no hairlines, nothing whose edge a denser
     buffer would sharpen. What it does have is a lot of shaded pixels, and a
     physically-shaded material with a scattering term is expensive per pixel.
     Three quarters of the density is a bit over half the shading, and side by
     side the difference is not findable. */
  stage.maxPixelRatio = 1.5;
  stage.resize();

  const beads = new Beads(stage.renderer, { ...DEFAULTS, ...config });
  stage.scene.add(beads);

  /* Where the pointer meets the plane the camera is looking at. That point is
     where sphere zero is pulled to, and everything else gets out of its way. */
  const ray = new Raycaster();
  const facing = new Plane(new Vector3(0, 0, 1), 0);
  const landed = new Vector3();

  const pointer = watch(
    canvas,
    () => {
      ray.setFromCamera(pointer.nPosition, stage.camera);
      stage.camera.getWorldDirection(facing.normal);
      ray.ray.intersectPlane(facing, landed);
      beads.physics.center.copy(landed);
      beads.config.controlSphere0 = true;
    },
    () => {
      beads.config.controlSphere0 = false;
    },
  );

  stage.onBeforeRender = (beat) => beads.update(beat);
  stage.onAfterResize = (size) => {
    beads.config.maxX = size.wWidth / 2;
    beads.config.maxY = size.wHeight / 2;
  };
  stage.onAfterResize(stage.size);

  return {
    dispose() {
      pointer.dispose();
      stage.dispose();
    },
  };
}

export interface BallpitProps extends Partial<PitConfig> {
  className?: string;
}

/**
 * The pit.
 *
 * The canvas is built in the effect rather than rendered, and thrown away with
 * it. It has to be: tearing down calls `WEBGL_lose_context`, and a canvas whose
 * context has been lost that way can never be given another one. React in
 * development mounts, unmounts and mounts again to catch exactly this sort of
 * thing, and a canvas that lived in the markup would survive that round trip
 * dead - `new WebGLRenderer` on it fails reading `precision` off a null context.
 *
 * Everything else is set at mount and never updated. The published component
 * watches its props and rebuilds the whole scene when the count changes; here
 * the props are written where it is used and never change, and a prop watcher
 * that can only ever fire once is a scene rebuild waiting to happen the day
 * somebody passes an inline array.
 */
export function Ballpit({ className, ...config }: BallpitProps) {
  const box = useRef<HTMLDivElement>(null);
  /* The first render's props, and the only ones. Read in the effect below,
     never written again - which is the whole point of the note above. */
  const held = useRef(config);

  useEffect(() => {
    const wrap = box.current;
    if (!wrap) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    wrap.appendChild(canvas);

    const pit = createBallpit(canvas, held.current);
    return () => {
      pit.dispose();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={box}
      aria-hidden
      className={cn("relative size-full overflow-hidden", className)}
    />
  );
}
