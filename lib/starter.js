import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Boiler Plate Starter for ThreeJS
class Starter {
    // #region MAIN
    scene = null;
    camera = null;
    clock = null;
    renderer = null;
    orbit = null;
    render_bind = this.render.bind(this);
    onRender = null;
    deltaTime = 0;
    elapsedTime = 0;

    constructor(config = {}) {
        // { webgl2:true, grid:true, container:null }
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // MAIN
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.01, 1000);
        this.camera.position.set(0, 0, 0);

        this.clock = new THREE.Clock();

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // LIGHTING
        let light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(4, 10, 4);

        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0xffffff));

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // RENDERER
        let options = { antialias: true, alpha: true };

        // THREE.JS can't handle loading into WebGL2 on its own
        // Need to create canvas & get the proper context, pass those 2 into 3js
        if (config.webgl2) {
            let canvas = document.createElement("canvas");
            options.canvas = canvas;
            options.context = canvas.getContext("webgl2");
        }

        this.renderer = new THREE.WebGLRenderer(options);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0xe2e2e2, 1);

        //---------------------------------
        // where to add the cnavas object, in a container or in the body.
        if (config.container) config.container.appendChild(this.renderer.domElement);
        else document.body.appendChild(this.renderer.domElement);

        //---------------------------------
        // Have the canvas set as full screen or fill its container's space
        if (config.fullscreen != false) {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        } else {
            // Take the size of the parent element.
            let box = this.renderer.domElement.parentNode.getBoundingClientRect();
            this.renderer.setSize(box.width, box.height);

            // When changing the canvas size, need to update the Projection Aspect Ratio to render correctly.
            this.camera.aspect = box.width / box.height;
            this.camera.updateProjectionMatrix();
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // MISC
        this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
        if (config.grid) this.scene.add(new THREE.GridHelper(20, 20, 0x0c610c, 0x444444));
    }

    render() {
        requestAnimationFrame(this.render_bind);

        this.deltaTime = this.clock.getDelta();
        this.elapsedTime = this.clock.elapsedTime;

        if (this.onRender) this.onRender(this.deltaTime, this.elapsedTime);
        this.renderer.render(this.scene, this.camera);
    }
    // #endregion ////////////////////////////////////////////////////////////////////////////////////////

    // #region METHODS
    add(o) {
        this.scene.add(o);
        return this;
    }
    remove(o) {
        this.scene.remove(o);
        return this;
    }

    set_camera(lon, lat, radius, target) {
        let phi = ((90 - lat) * Math.PI) / 180,
            theta = ((lon + 180) * Math.PI) / 180;

        this.camera.position.set(-(radius * Math.sin(phi) * Math.sin(theta)), radius * Math.cos(phi), -(radius * Math.sin(phi) * Math.cos(theta)));

        if (target) this.orbit.target.fromArray(target);

        this.orbit.update();
        return this;
    }
    // #endregion ////////////////////////////////////////////////////////////////////////////////////////
}

export default Starter;
export { THREE };
