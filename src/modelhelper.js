/*
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';

const scenePath = "/scene.gltf";

export const LoadGLTFByPath = (scenePath, scene) => {
    return new Promise((resolve, reject) => {
      // Loader
      const loader = new GLTFLoader();
  
      // GLTF file
      loader.load(
        scenePath,
        (gltf) => {
          scene.add(gltf.scene); // Add the loaded model to the scene
          resolve(gltf); // Resolve the promise with the GLTF object
        },
        undefined,
        (error) => {
          reject(error); // Reject the promise with the error
        }
      );
    });
  };
  */
