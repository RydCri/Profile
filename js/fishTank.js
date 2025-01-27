import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ColladaLoader } from 'three/addons/loaders/ColladaLoader.js';

const params = {
    threshold: 0.74,
    strength: 0.315,
    radius: 0,
    exposure: 1
};
let camera,
    composer,
    clock,
    delta,
    meshKnot,
    light1,
    light2,
    light3,
    light4,
    light5,
    light6,
    renderer,
    stats;

let mixer, mixer2, mixer3, mixer4
init()
function init() {

    const container = document.getElementById( 'container' );

    // stats = new Stats();
    // container.appendChild( stats.dom );

    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } );
    //Lower resolution
    // renderer.setPixelRatio( window.devicePixelRatio * .5 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.needsUpdate = true;
    renderer.domElement.style.zIndex = "-999";
    container.appendChild( renderer.domElement );
    const scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 500 );
    camera.position.set(0, 13, -55);
    camera.lookAt(0,0,0)
    scene.add( camera );

    // const controls = new OrbitControls( camera, renderer.domElement );
    // controls.maxPolarAngle = Math.PI * 0.5;

    // scene.add( new THREE.AmbientLight( 0xcccccc ) );

    const pointLight = new THREE.PointLight( 0xffffff, 10 );
    camera.add( pointLight );

    const renderScene = new RenderPass( scene, camera );

    const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), .815, 0.1, 0.822 );
    // bloomPass.threshold = params.threshold;
    // bloomPass.strength = params.strength;
    // bloomPass.radius = params.radius;

    const outputPass = new OutputPass();

    composer = new EffectComposer( renderer );
    composer.addPass( renderScene );
    composer.addPass( bloomPass );
    composer.addPass( outputPass );
    function playScrollAnimations() {
        animationScripts.forEach((a) => {
            if (scrollPercent >= a.start && scrollPercent < a.end) {
                a.func()
            }
        })
    }

    let scrollPercent = 0

    document.body.onscroll = () => {
        scrollPercent =
            ((document.documentElement.scrollTop || document.body.scrollTop) /
                ((document.documentElement.scrollHeight || document.body.scrollHeight) -
                    document.documentElement.clientHeight)) * 100
        document.getElementById('scrollProgress').innerText =
            'Scroll : ' + scrollPercent.toFixed(2)
    }
    function update() {
        renderer.render(scene, camera);
    }
    //lights
    const sphere = new THREE.SphereGeometry( 0.15, 16, 8 );

    light1 = new THREE.PointLight( 0xff0040,10000);
    light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
    scene.add( light1 );

    light2 = new THREE.PointLight( 0x0040ff,10000);
    light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x0040ff } ) ) );
    scene.add( light2 );

    light3 = new THREE.PointLight( 0x80ff80,10000);
    light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x80ff80 } ) ) );
    scene.add( light3 );

    light4 = new THREE.PointLight( 0xffaa00,10000);
    light4.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
    scene.add( light4 );

    light5 = new THREE.PointLight( 0x66aa00,10000);
    light5.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
    scene.add( light5 );

    light6 = new THREE.PointLight( 0x77ff00,10000);
    light6.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) ) );
    scene.add( light6 );

    RectAreaLightUniformsLib.init();

    const rectLight1 = new THREE.RectAreaLight(0xff00ff, 8, 40, 40);
    rectLight1.position.set(25, 20, 0);
    rectLight1.rotateX(Math.PI / 180 * -90)
    rectLight1.rotateZ(Math.PI/2)
    scene.add(rectLight1);

    const rectLight3 = new THREE.RectAreaLight(0x200589, 8, 40, 40);
    rectLight3.position.set(-25, 20, 0);
    rectLight3.rotateX(Math.PI / 180 * -90)
    rectLight3.rotateZ(Math.PI/2)
    scene.add(rectLight3);

    // scene.add(new RectAreaLightHelper(rectLight1));
    // scene.add(new RectAreaLightHelper(rectLight2));
    // scene.add(new RectAreaLightHelper(rectLight3));

    // const geoFloor = new THREE.BoxGeometry(2000, 0.1, 2000);
    // const matStdFloor = new THREE.MeshStandardMaterial({color: 0xbcbcbc, roughness: 0.1, metalness: 1});
    // const mshStdFloor = new THREE.Mesh(geoFloor, matStdFloor);
    // scene.add(mshStdFloor);


    const loadingScreen = document.getElementById( 'loading-screen' );
    const loadingManager = new THREE.LoadingManager();

    loadingManager.onStart = function(url, item, total) {
        console.log(`Loading ${url}`)
    }
    loadingManager.onProgress = function(url, item, total) {
        console.log(`${item} ${total}`)
    }
    loadingManager.onError = function (url, item, error){
        console.log(`Failed to load ${item}, ${error}`)
    }

    loadingManager.onLoad = function ( ) {
        loadingScreen.classList.add( 'fade-out' );
        // optional: remove loader from DOM via event listener
        loadingScreen.addEventListener( 'transitionend', onTransitionEnd );

    };


    function onTransitionEnd( event ) {

        event.target.remove();

    }

    const dracoLoader = new DRACOLoader(( ) => {
        dracoLoader.setDecoderPath('js/libs/draco/gltf/');
    });

    const someFish = new GLTFLoader( loadingManager ).setPath('../assets/model/')
    someFish.setDRACOLoader( dracoLoader, console.log('DRACO Loaded') )

    someFish.load( 'justBlue.glb', function ( gltf ) {
        const model = gltf.scene;
        model.position.set(23,3,-74)
        model.receiveShadow = true;
        model.rotateX(Math.PI/7)
        model.rotateY(-Math.PI/3)
        // model.rotateZ(Math.PI/2)
        scene.add( model );

        mixer4 = new THREE.AnimationMixer( model );
        mixer4.timeScale = .5
        const clip = gltf.animations[ 0 ];
        mixer4.clipAction( clip.optimize() ).play();

        animate();
    });

    someFish.load( 'justRed.glb', function ( gltf ) {

        const model = gltf.scene;
        model.position.set(0,0,55)
        scene.add( model );

        mixer3 = new THREE.AnimationMixer( model );
        const clip = gltf.animations[ 0 ];
        mixer3.timeScale = 0.68
        mixer3.clipAction( clip.optimize()).play();

        animate();
    });

    function lerp(x, y, a) {
        return (1 - a) * x + a * y
    }

    function scalePercent(start, end) {
        return (scrollPercent - start) / (end - start)
    }
    const animationScripts = []

    animationScripts.push({
        start: 0,
        end: 30,
        func: () => {
            camera.position.set(21, 1, -67);
            camera.lookAt(0,29,75)
        },
    })

    animationScripts.push({
        start: 0,
        end: 100,
        func: () => {
            const delta = clock.getDelta();
            const time = Date.now() * 0.0005;

            light1.position.x = Math.sin( time * 0.7 ) * 30;
            light1.position.y = Math.cos( time * 0.5 ) * 40;
            light1.position.z = Math.cos( time * 0.3 ) * 30;

            light2.position.x = Math.cos( time * 0.3 ) * 30;
            light2.position.y = Math.sin( time * 0.5 ) * 40;
            light2.position.z = Math.sin( time * 0.7 ) * 30;

            light3.position.x = Math.sin( time * 0.7 ) * 30;
            light3.position.y = Math.cos( time * 0.3 ) * 40;
            light3.position.z = Math.sin( time * 0.5 ) * 30;

            light4.position.x = Math.sin( time * 0.3 ) * 30;
            light4.position.y = Math.cos( time * 0.7 ) * 40;
            light4.position.z = Math.sin( time * 0.5 ) * 30;

            light5.position.x = Math.sin( time * 0.3 ) * 30;
            light5.position.y = Math.cos( time * 0.7 ) * 80;
            light5.position.z = Math.sin( time * 0.5 ) * 40;

            light6.position.x = Math.sin( time * 0.3 ) * 50;
            light6.position.y = Math.cos( time * 0.7 ) * 90;
            light6.position.z = Math.sin( time * 0.5 ) * 70;

        },
    })

    animationScripts.push({
        start: 50,
        end: 100,
        func: () => {
            camera.position.z = lerp(-67, 45, scalePercent(50, 100))
            camera.position.x = lerp(21, -4, scalePercent(50, 100))
            camera.position.y = lerp(1, 0, scalePercent(50, 100));

        },
    })

// const gui = new GUI();
//
// const bloomFolder = gui.addFolder( 'bloom' );
//
// bloomFolder.add( params, 'threshold', 0.0, 1.0 ).onChange( function ( value ) {
//
//     bloomPass.threshold = Number( value );
//
// } );
//
// bloomFolder.add( params, 'strength', 0.0, 3.0 ).onChange( function ( value ) {
//
//     bloomPass.strength = Number( value );
//
// } );
//
// gui.add( params, 'radius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
//
//     bloomPass.radius = Number( value );
//
// } );
//
// const toneMappingFolder = gui.addFolder( 'tone mapping' );
//
// toneMappingFolder.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {
//
//     renderer.toneMappingExposure = Math.pow( value, 4.0 );
//
// } );

    window.addEventListener( 'resize', onWindowResize );


    function onWindowResize() {

        const width = window.innerWidth;
        const height = window.innerHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize( width, height );
        composer.setSize( width, height );
    }
    function animate() {
        // clock = new THREE.Clock()
        delta = clock.getDelta()
        if (mixer) {
            mixer.update(delta);
        }
        if (mixer2) {
            mixer2.update(delta)
        }
        if (mixer3) {
            mixer3.update(delta)
        }
        if (mixer4) {
            mixer4.update(delta)
        }
        requestAnimationFrame(animate)
        playScrollAnimations()
        update()
        render()
        // stats.update();

        composer.render();
    }

    function render() {
        renderer.render(scene, camera)
        composer.render();

    }

    window.scrollTo({top: 0, behavior: 'smooth'})
    animate()


}
