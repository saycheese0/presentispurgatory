import './style.css'
import * as THREE from 'three';

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { checkRayIntersections, getMouseVector2 } from './raycasthelper';
import { getPaperObjects} from './paperhelper.js';
import { keywords, messages } from './arrayhelper.js';
import { highlightObject, unhighlightObject } from './raycasthelper';

// Wait for the DOM to load
console.log("JavaScript file is loaded.");

//AUDIO
const ambientAudio = new Audio('ambient_noise.mp3');
const vinylstopAudio = new Audio('vinyl-stop.mp3'); // Reversed vinyl sound
vinylstopAudio.playbackRate = 0.7;
vinylstopAudio.volume = 0.3;
const bellAudio = new Audio('bell.mp3'); // Bell sound for after vinyl finishes
const paperAudio = new Audio('paper.mp3'); // Paper sound effect
const dingAudio = new Audio('ding.mp3');
const elavatorAudio = new Audio('elavator.mp3');

ambientAudio.loop = true; // For background music
ambientAudio.volume = 0.5; // Adjust volume

//elavatorAudio.play();


document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed");

  const landingPage = document.getElementById('landing-page');
  const sceneContainer = document.getElementById('scene-container');

  //const spotifyEmbedWindow = document.querySelector('iframe[src*="spotify.com/embed"]').contentWindow;
  //spotifyEmbedWindow.postMessage({command: 'toggle'}, '*');
  
  const centerButton = document.querySelector('.center-button');

  const spotifyWidget = document.getElementById('spotify-widget');
  const popup = document.getElementById("popup");
  const closePopupButton = document.getElementById("close-popup");

  const paperPopup = document.getElementById("paper-popup");
  const readButton = document.getElementById('readButton');
  const closeButton = document.getElementById('closeButton');
  const ee = document.getElementById('easter-eggs');

  const exitButton = document.getElementById('exitButton');

  let clock = new THREE.Clock();

  let paperList = [];
  let mixers = [];
  let interactableObjects = [];
  let clips;

  let actionUncrumple; // For the animation action
  let isPaperCrumpled = true; // Track if paper is crumpled or not

  vinylstopAudio.play();

  if (!centerButton) {
    console.error("Button with class 'center-button' not found!");
    return;
  }

  console.log("Button found:", centerButton);
  
  // Show 3D scene when the button is clicked
  centerButton.addEventListener('click', () => {
    //spotifyEmbedWindow.postMessage({command: 'toggle'}, '*');
    //vinylstopAudio.play(); // Play reversed vinyl sound
    elavatorAudio.playbackRate = 0.7
    elavatorAudio.play();


    landingPage.style.display = 'none';


    elavatorAudio.onended = () => {
      console.log('Button clicked');
      
    };
      setTimeout(() => {
        bellAudio.play();
        popup.style.display = 'block';
        sceneContainer.style.display = 'block';
         ambientAudio.play();
        //spotifyWidget.style.display = 'block';
        initScene();
      }, 4000); // 500ms delay (adjust as needed)

    
  });

  closePopupButton.addEventListener("click", () => {
    popup.style.display = 'none';
    exitButton.style.display = 'block';
    spotifyWidget.style.display = 'block';
  });

  exitButton.addEventListener('click', () => {
    location.reload();
  });

  function initScene() {
    console.log('Scene initialized');

    const scene = new THREE.Scene();

    const sceneChildren = scene.children;
    const newMessages = messages.map(str => `"${str}"`);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    
    camera.position.set(0, 20,0);
    
    const renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#bg"),
    });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //camera.position.setZ(30);
    
    renderer.render(scene, camera);

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight), 
      0.5, // Lower strength
      1.4, // Lower radius
      0.1  // Lower threshold (more bloom effect)
    );
    

    composer.addPass(renderPass);
    composer.addPass(bloomPass);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.8; // Adjust exposure


    
    //light source
    const pointLight = new THREE.PointLight(0xffffff);
    
    pointLight.position.set(5.2,-1.5,-3.2);
    pointLight.intensity = 12;

    const ambientLight = new THREE.AmbientLight(0xffffff);
    ambientLight.intensity = 1.7;
    scene.add(pointLight, ambientLight);
    
    const lightHelper = new THREE.PointLightHelper(pointLight)
    //scene.add(lightHelper);


    
    //controls
    const controls = new OrbitControls(camera, renderer.domElement);
    
    //controls.maxAzimuthAngle = Math.PI / 2;  // Restrict horizontal rotation to 45 degrees (change as needed)
    //controls.minAzimuthAngle = -Math.PI / 2;  // Restrict horizontal rotation to -45 degrees (change as needed)
    
    //controls.maxPolarAngle = Math.PI / 3;  // Restrict vertical rotation from above (e.g., 80 degrees max)
  
    window.addEventListener('resize', () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
    
    //bg
    //const spaceTexture = new THREE.TextureLoader().load("texture.jpg");
    scene.background = new THREE.Color( 0x000000 );
    
    //scene model
    const loader = new GLTFLoader();
    const scenePath = '/timetravel.gltf';
    
    loader.load(scenePath, (gltf) => {
      let model = gltf.scene;
      console.log('Animations:', gltf.animations);
      clips = gltf.animations;

      mixers = readPaper(paperList, clips, scene);

      //90-degree counterclockwise rotation around the Y axis
      model.rotation.y = THREE.MathUtils.degToRad(90); // Rotate counterclockwise 90 degrees
    
      model.position.set(0,-5,0);
      model.scale.set(1.4,1.4,1.4);

        // Traverse through each mesh in the model and modify the emissive properties
      model.traverse((child) => {
        if (child.isMesh) {
          // Check if the material has an emissive property (not all materials do)
          const material = child.material;

          // If the material has emissive property (like MeshStandardMaterial or similar), update it
          if (material.emissive !== undefined) {
            material.emissive = new THREE.Color(0x0000ff);  // Set emissive color to white
            material.emissiveIntensity = 0.01;  // Adjust the intensity of the emissive effect
            material.color.set(0xffffff);
          }
        }
  });

      scene.add(gltf.scene);
      console.log('GLTF model loaded successfully!');
    }, undefined, (error) => {
      console.error('Error loading GLTF model:', error);
      
    });

  
    //add listener to call onmousemove everytime mouse moves in browser window
    document.addEventListener('mousemove', onMouseMove, false);
    const raycaster = new THREE.Raycaster();

    //let mousePointer = new ThreeMFLoader.Vector2();
    let mousePointer = new THREE.Vector2();

    let previousHighlightedObject = null;

    //function to be called every time mouse moves
    function onMouseMove(event) {
      mousePointer = getMouseVector2(event, window);
      const getFirstValue = true;
      
      const intersections = checkRayIntersections(mousePointer, camera, raycaster, scene, getFirstValue);

      //console.log('Object list passed to getPaperObjects:', paperList);
      paperList = getPaperObjects(intersections);
  
      if (paperList.length > 0 || !isPaperCrumpled) {
          {paperPopup.style.display = 'block';}
          readPaper(paperList, clips);
        }

      readButton.addEventListener('click', () => {
        playUncrumple();

      });

      closeButton.addEventListener('click', () => {
        playCrumple();
        paperPopup.style.display = 'none';
         // Hide the popup when the read button is clicked
      });

      interactableObjects = getInteractiveObjects(intersections, keywords);
      let message = getMessage(interactableObjects[0], keywords, newMessages);
      interactableObjects = [ ...paperList, ...interactableObjects];

      const currentObject = interactableObjects[0];

      if (currentObject !== previousHighlightedObject) {
        if (previousHighlightedObject) {
            unhighlightObject(previousHighlightedObject);
        }

        if (currentObject) {
            highlightObject(currentObject);
            dingAudio.volume = 0.1;
            dingAudio.playbackRate = 0.3;
            dingAudio.play();
        }
          previousHighlightedObject = currentObject;
      }

        message = getMessage(currentObject, keywords, newMessages);


        if (message) {
          ee.innerText = message;
          ee.style.display = 'block';
          paperPopup.style.display = 'none';
        } else {
          ee.style.display = 'none';
        }
    }


    /*
  
    function createPopup() {
      ee.style.display = 'block'
      // Update popup text and position
      return (text) => {
        if (text) {
          ee.innerText = text;
          ee.classList.add('visible');
        } else {
          ee.classList.remove('visible');
        }
      };
    }

    function hidePopup() {
      if (ee) {
          ee.style.display = "none";
      }
  }
    
    // Initialize the popup function
    const updatePopup = createPopup();
    */


    function getInteractiveObjects(objectList, keywords) {
      let interactableObjects = [];
  
      // If it's not an array, process the single object
      if (!Array.isArray(objectList)) {
          if (objectList && objectList.object && objectList.object.name) {
              const objectName = objectList.object.name || "Unnamed Object";
              if (keywords.includes(objectName)) {
                  interactableObjects.push(objectList.object);
              }
          }
          return interactableObjects;
      }
  
      // Iterate through the array of objects
      objectList.forEach((object) => {
          if (object && object.object && object.object.name) {
              const objectName = object.object.name || "Unnamed Object";
              if (keywords.includes(objectName)) {
                  interactableObjects.push(object.object);
              }
          }
      });
      return interactableObjects;
  }

  function getMessage(interactableObject, keywords, newMessages) {
    if (!interactableObject || !interactableObject.name) {
        return null; // No valid object
    }

    const objectName = interactableObject.name || "Unnamed Object";
    const index = keywords.indexOf(objectName);

    if (index !== -1) {
        return newMessages[index]; // Return the corresponding message
    }

    return null; // No match found
}


    function playUncrumple() {
      if (actionUncrumple) {
        isPaperCrumpled = false; // Set the paper state to uncrumpled
        readButton.style.display = 'none';
        closeButton.style.display = 'inline';
      actionUncrumple.timeScale = 1; // Forward direction
      actionUncrumple.play();
      paperAudio.play();
      
      } else {
        console.error('actionUncrumple is undefined'); 
      }
}

    function playCrumple() {
          actionUncrumple.timeScale = -1; // Reverse direction
          actionUncrumple.paused = false;
          actionUncrumple.play(); // Replay the animation in reverse
          paperAudio.play();
          closeButton.style.display = 'none';
          readButton.style.display = 'inline';
          isPaperCrumpled = true;
    }


    function readPaper(paperList, clips) {
        //console.log("Available animations:", clips.map(clip => clip.name));
        //console.log("Loaded animations:", clips);
        
        if (paperList.length > 0) {
        paperList.forEach((paper) => {
          // Create an AnimationMixer
          let paperMixer;
          paperMixer = new THREE.AnimationMixer(paper);

          actionUncrumple = paperMixer.clipAction(clips[1], paper);
                
          actionUncrumple.loop = THREE.LoopOnce; // Ensure it plays only once
          actionUncrumple.clampWhenFinished = true; // Stop at the end frame
              
          mixers.push(paperMixer); // Add this mixer to the array
        });

        }
        //paperList.length = 0; // Clear the paper list
        return mixers;
    }

    //stars in scene
    function addStar() {
      const geometry = new THREE.SphereGeometry(0.02);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff});
      const star = new THREE.Mesh(geometry, material);
    
      const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(11));
      star.position.set(x, y, z);
      scene.add(star)
    }
    Array(900).fill().forEach(addStar) 


    function animate() {
      requestAnimationFrame(animate)    
        // Update controls
        if (camera) {
          controls.update(); // Only update controls if the camera is defined
        }
      //controls.update();
      const delta = clock.getDelta();
      mixers.forEach(mixer => mixer.update(delta));

      renderer.render(scene, camera);
      composer.render();
    }
    animate();    
  }
});