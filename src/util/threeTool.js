import { light } from "@mui/material/styles/createPalette";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default {
  init() {
    this._animateValue = null;
    const raycaster = this._setupRaycaster();
    const renderer = this._setupRenderer();
    const scene = this._setupScene();
    const camera = this._setupCamera();
    const controls = this._setupOrbitController(camera, renderer);
    // resizable
    this._resizeHandler();

    // create objects
    this._setupLight();
    this._setupModel();

    // append renderer element to root child
    document.querySelector("#root").appendChild(renderer.domElement);
    this._animateValue = requestAnimationFrame(this.render.bind(this));
  },
  _resizeHandler() {
    window.addEventListener(
      "resize",
      () => {
        this._camera.aspect = innerWidth / innerHeight;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(innerWidth, innerHeight);
      },
      false
    );
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
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.type = THREE.VSMShadowMap;

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
      far: 5000,
    };

    const camera = new THREE.PerspectiveCamera(
      cameraOption.fov,
      cameraOption.aspect,
      cameraOption.near,
      cameraOption.far
    );
    // camera position settings
    // camera.position.set(0, 3, 2);
    camera.position.set(300, 300, 0);
    camera.lookAt(0, 0, 0);

    this._scene.add(camera);
    return (this._camera = camera);
  },
  _setupOrbitController(camera, renderer) {
    // create orbit controller
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 100, 0);

    return (this._controls = controls);
  },
  _addPointLight(x, y, z, helperColor) {
    const color = 0xffffff;
    const intensity = 1.5;
    const pointLight = new THREE.PointLight(color, intensity, 2000);
    pointLight.position.set(x, y, z);

    this._scene.add(pointLight);

    const pointLightHelper = new THREE.PointLightHelper(
      pointLight,
      10,
      helperColor
    );
    this._scene.add(pointLightHelper);
  },
  _setupLight() {
    // light
    const light = new THREE.DirectionalLight(/* 0xffcc55 */ 0xffffff, 0.2);
    const helper = new THREE.DirectionalLightHelper(light);

    this._scene.add(helper);
    // this.light = new THREE.PointLight(0xffffbb, 1);

    // default option settings
    light.shadow.mapSize.width = 1024; // default
    light.shadow.mapSize.height = 1024; // default
    light.shadow.camera.top = light.shadow.camera.right = 700;
    light.shadow.camera.bottom = light.shadow.camera.left = -700;
    light.shadow.camera.near = 100; // default
    light.shadow.camera.far = 900; // default
    light.shadow.radius = 5;
    light.castShadow = true;

    const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
    this._scene.add(shadowCameraHelper);

    light.position.set(200, 500, 200);
    light.target.position.set(0, 0, 0);

    this._scene.add(light.target);
    this._scene.add(light);
    // this._light = light;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    this._scene.add(ambientLight);

    this._addPointLight(500, 150, 500, 0xff0000);
    this._addPointLight(-500, 150, 500, 0xffff00);
    this._addPointLight(-500, 150, -500, 0x00ff00);
    this._addPointLight(500, 150, -500, 0x0000ff);

    // this._light = light;

    // const pointLight = new THREE.PointLight(0xffffff, 2);
    // pointLight.position.set(0, 5, 0);
    // const helper = new THREE.PointLightHelper(pointLight);
    // this._scene.add(helper);
    // this._scene.add(pointLight);
    // this._light = pointLight;
  },
  _setupModel() {
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshPhongMaterial({ color: 0x44a80 });
    // const cube = new THREE.Mesh(geometry, material);

    // this._scene.add(cube);
    // this._cube = cube;

    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x878787,
      // roughness: 0.5,
      // metalness: 0.5,
      // side: THREE.DoubleSide,
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; /* THREE.MathUtils.degToRad(-90); */
    ground.receiveShadow = true;
    this._scene.add(ground);

    new GLTFLoader().load(require("../gltf/character.glb"), (gltf) => {
      const model = gltf.scene;

      model.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });

      const animationClips = gltf.animations;
      const mixer = new THREE.AnimationMixer(model);
      const animationsMap = {};
      animationClips.forEach((clip) => {
        const name = clip.name;
        console.log(name);
        animationsMap[name] = mixer.clipAction(clip);
      });

      this._mixer = mixer;
      this._animationsMap = animationsMap;
      this._currentAnimationAction = this._animationsMap["Idle"];
      this._currentAnimationAction.play();

      this._scene.add(model);

      const box = new THREE.Box3().setFromObject(model);
      model.position.y = (box.max.y - box.min.y) / 2;

      const axisHelper = new THREE.AxesHelper(1000);
      this._scene.add(axisHelper);

      const boxHelper = new THREE.BoxHelper(model);
      this._scene.add(boxHelper);
      this._boxHelper = boxHelper;
      this._model = model;
    });
  },
  render(time) {
    this.resizeCanvasToDisplaySize();

    this.animationFrameFeatures(time);

    this._animateValue = requestAnimationFrame(this.render.bind(this));
  },
  clear() {
    cancelAnimationFrame(this._animateValue);
    document.querySelector("#root").innerHTML = "";
  },
  animationFrameFeatures(time) {
    time *= 0.001;

    this._renderer.render(this._scene, this._camera);
    // this.camera.autoRotate = true;

    if (this._mixer) {
      const deltaTime = time - this._previousTime;
      this._mixer.update(deltaTime);
    }

    this._previousTime = time;

    if (this._boxHelper) {
      this._boxHelper.update();
    }
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
