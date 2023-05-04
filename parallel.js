import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MapControls } from "three/examples/jsm/controls/MapControls";
import "./main.css";

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    1,
    4000
);
camera.position.set(0, 0, 3);
var renderer = new THREE.WebGLRenderer({
    antialias: true,
});

renderer.setClearColor(0x44bb88);
var canvas = renderer.domElement;
document.body.appendChild(canvas);

var controls = new OrbitControls(camera, canvas);
controls.enableRotate = false;
// controls.update();
// controls.screenSpacePanning = true;
controls.enableDamping = true;
controls.minDistance = 2;
controls.maxDistance = 4;
// controls.maxZoom = 1;
controls.maxAzimuthAngle = 0;
controls.update();

// controls lock y axis
controls.addEventListener("change", function () {
    this.target.y = 0;
    camera.position.y = 0;
});

var light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

var settings = {
    radius: { value: 0.5 },
};

const planeSize = 30;
const texture = new THREE.TextureLoader().load("./checker.png");
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
const repeats = planeSize / 2;
texture.repeat.set(repeats, repeats);

var boxGeom = new THREE.BoxGeometry(8, 6, 3, 50, 40, 30);
var boxMat = new THREE.MeshLambertMaterial({ color: "blue", map: texture });
boxMat.side = THREE.BackSide;
boxMat.onBeforeCompile = (shader) => {
    shader.uniforms.boxSize = {
        value: new THREE.Vector3(
            boxGeom.parameters.width,
            boxGeom.parameters.height,
            boxGeom.parameters.depth
        ).multiplyScalar(0.5),
    };
    shader.uniforms.radius = settings.radius;
    shader.vertexShader =
        `
  uniform vec3 boxSize;
  uniform float radius;
  ` + shader.vertexShader;
    shader.vertexShader = shader.vertexShader.replace(
        `#include <begin_vertex>`,
        `#include <begin_vertex>
    
    float maxRadius = clamp(radius, 0.0, min(boxSize.x, min(boxSize.y, boxSize.z)));
    vec3 signs = sign(position);
    
    vec3 subBox = boxSize - vec3(maxRadius);
    
    vec3 absPos = abs(transformed); 
    // xy
    vec2 sub = absPos.xy - subBox.xy;
    if (absPos.x > subBox.x && absPos.y > subBox.y && absPos.z <= subBox.z) {
      transformed.xy = normalize(sub) * maxRadius + subBox.xy;
      transformed.xy *= signs.xy;
    }
    // xz
    sub = absPos.xz - subBox.xz;
    if (absPos.x > subBox.x && absPos.z > subBox.z && absPos.y <= subBox.y) {
      transformed.xz = normalize(sub) * maxRadius + subBox.xz;
      transformed.xz *= signs.xz;
    }
    // yz
    sub = absPos.yz - subBox.yz;
    if (absPos.y > subBox.y && absPos.z > subBox.z && absPos.x <= subBox.x) {
      transformed.yz = normalize(sub) * maxRadius + subBox.yz;
      transformed.yz *= signs.yz;
    }
    
    // corner
    if (all(greaterThan(absPos, subBox))){
      vec3 sub3 = absPos - subBox;
      transformed = (normalize(sub3) * maxRadius + subBox) * signs;
    }
    
    // re-compute normals for correct shadows and reflections
    objectNormal = all(equal(position, transformed)) ? normal : normalize(position - transformed); 
    transformedNormal = normalMatrix * objectNormal; 

    `
    );
};
var box = new THREE.Mesh(boxGeom, boxMat);
scene.add(box);

function render() {
    if (resize(renderer)) {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

function resize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

if (WebGL.isWebGLAvailable()) {
    // Initiate function or other initializations here
    render();
} else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById("container").appendChild(warning);
}
