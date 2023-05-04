import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

let container, stats;
let camera, scene, renderer;

// let group;

// let targetRotation = 0;
// let targetRotationOnPointerDown = 0;

// let pointerX = 0;
// let pointerXOnPointerDown = 0;

let windowHalfX = window.innerWidth / 2;

init();
animate();

function init() {
    container = document.createElement("div");
    document.body.appendChild(container);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 400);
    scene.add(camera);

    const light = new THREE.PointLight(0xffffff, 0.8);
    camera.add(light);

    // group = new THREE.Group();
    // group.position.y = 50;
    // scene.add(group);

    function addShape(shape, extrudeSettings, color, x, y, z, rx, ry, rz, s) {
        // extruded shape
        let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({ color: color }));
        // mesh.position.set(x, y, z - 75);
        // mesh.rotation.set(rx, ry, rz);
        // mesh.scale.set(s, s, s);
        scene.add(mesh);
    }

    // Triangle

    const triangleShape = new THREE.Shape().moveTo(80, 20).lineTo(40, 80).lineTo(120, 80).lineTo(80, 20); // close path

    // Rounded rectangle

    const roundedRectShape = new THREE.Shape();

    (function roundedRect(ctx, x, y, width, height, radius) {
        ctx.moveTo(x, y + radius);
        ctx.lineTo(x, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
        ctx.lineTo(x + width - radius, y + height);
        ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
        ctx.lineTo(x + width, y + radius);
        ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
        ctx.lineTo(x + radius, y);
        ctx.quadraticCurveTo(x, y, x, y + radius);
    })(roundedRectShape, 0, 0, 50, 50, 20);

    const extrudeSettings = {
        depth: 18, // 입체감
        bevelEnabled: true, // 경사적용
        bevelSegments: 2,
        steps: 2,
        bevelSize: 1,
        bevelThickness: 1, // 경사도 곡선 수치
    };

    addShape(triangleShape, extrudeSettings, 0x8080f0, -180, 0, 0, 0, 0, 0, 1);
    addShape(roundedRectShape, extrudeSettings, 0x008000, -150, 150, 0, 0, 0, 0, 1);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    stats = new Stats();
    container.appendChild(stats.dom);

    const controls = new OrbitControls(camera, container);
    controls.update();

    // container.style.touchAction = "none";
    //container.addEventListener("pointerdown", onPointerDown);

    //

    window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

//

// function onPointerDown(event) {
//     if (event.isPrimary === false) return;

//     pointerXOnPointerDown = event.clientX - windowHalfX;
//     targetRotationOnPointerDown = targetRotation;

//     document.addEventListener("pointermove", onPointerMove);
//     document.addEventListener("pointerup", onPointerUp);
// }

// function onPointerMove(event) {
//     if (event.isPrimary === false) return;

//     pointerX = event.clientX - windowHalfX;

//     targetRotation =
//         targetRotationOnPointerDown +
//         (pointerX - pointerXOnPointerDown) * 0.02;
// }

// function onPointerUp() {
//     if (event.isPrimary === false) return;

//     document.removeEventListener("pointermove", onPointerMove);
//     document.removeEventListener("pointerup", onPointerUp);
// }

//

function animate() {
    requestAnimationFrame(animate);

    render();
    stats.update();
}

function render() {
    // group.rotation.y += (targetRotation - group.rotation.y) * 0.05;
    renderer.render(scene, camera);
}
