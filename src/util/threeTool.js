import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
  init() {
    this._animateValue = null;
    const raycaster = this._setupRaycaster();
    const renderer = this._setupRenderer();
    const scene = this._setupScene();
    const camera = this._setupCamera();
    const controls = this._setupOrbitController(camera, renderer);

    // create objects
    this._setupLight();
    this._setupModel();

    // append renderer element to root child
    document.querySelector("#root").appendChild(renderer.domElement);
    this._animateValue = requestAnimationFrame(this.render.bind(this));
  },
  _setupRaycaster() {
    const raycaster = new THREE.Raycaster();
    return (this._raycaster = raycaster);
  },
  _setupRenderer() {
    // create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    // set pixel ratio for renderer
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);
    // shadow settings
    renderer.shadowMap.soft = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    return (this._renderer = renderer);
  },
  _setupScene() {
    const scene = new THREE.Scene();
    return (this._scene = scene);
  },
  _setupCamera() {
    const cameraOption = {
      fov: 75,
      aspect: innerWidth / innerHeight,
      near: 0.1,
      far: 1000,
    };

    const camera = new THREE.PerspectiveCamera(
      cameraOption.fov,
      cameraOption.aspect,
      cameraOption.near,
      cameraOption.far
    );
    // camera position settings
    camera.position.set(0, 8, 8);

    this._scene.add(camera);
    return (this._camera = camera);
  },
  _setupOrbitController(camera, renderer) {
    // create orbit controller
    const controls = new OrbitControls(camera, renderer.domElement);
    return (this._controls = controls);
  },
  _setupLight() {
    // light
    const light = new THREE.DirectionalLight(0xffcc55, 1);
    // this.light = new THREE.PointLight(0xffffbb, 1);
    light.position.set(30, 40, 0);

    // default option settings
    light.shadow.mapSize.width = 1024; // default
    light.shadow.mapSize.height = 1024; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    light.shadow.radius = 2;
    light.castShadow = true;

    this._scene.add(light);
    this._light = light;
  },
  _setupModel() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: 0x44a80 });
    const cube = new THREE.Mesh(geometry, material);

    this._scene.add(cube);
    this._cube = cube;
  },
  render(time) {
    this.resizeCanvasToDisplaySize();

    this.animationFrameFeatures();

    this._animateValue = requestAnimationFrame(this.render.bind(this));
  },
  clear() {
    cancelAnimationFrame(this._animateValue);
    document.querySelector("#root").innerHTML = "";
  },
  animationFrameFeatures() {
    this._renderer.render(this._scene, this._camera);
    // this.camera.autoRotate = true;
    this._controls.update();
    // this.controls.autoRotate = true;
  },
  resizeCanvasToDisplaySize() {
    // 캔버스 엘리먼트
    const canvas = this._renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      this._renderer.setSize(width, height, false);
      this._camera.aspect = width / height;
      this._camera.updateProjectionMatrix();

      // set render target sizes here
    }
  },
};

// https://www.youtube.com/watch?v=ITA9no8Bsio&ab_channel=GISDEVELOPER