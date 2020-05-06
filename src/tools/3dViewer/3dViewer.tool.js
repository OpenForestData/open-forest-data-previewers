import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import OrbitControlsThree from 'three-orbit-controls';

import startPreview from '../core/js/retriever';
import { getFileName, getFileExtension } from '../core/js/utils';

const OrbitControls = OrbitControlsThree(THREE);

const CONFIG = {
  maxFileSize: 100000000,
  texturesExtensions: ['png'],
  showHelpers: false,
};

const getModelTextures = (datasetFile, files) => {
  const fileName = getFileName(datasetFile.dataFile.filename);
  return files.filter((file) => {
    const ext = getFileExtension(file.dataFile.filename);
    const textureName = getFileName(file.dataFile.filename);

    return (
      (CONFIG.texturesExtensions.indexOf(ext) !== -1 && textureName === fileName) ||
      file.dataFile.filename === 'texture.png'
    );
  });
};

const init = ({ datasetFile, datasetFiles }) => {
  if (datasetFile.dataFile.filesize > CONFIG.maxFileSize) {
    throw new Error('File is too big');
  }

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  const webGLRenderer = new THREE.WebGLRenderer({ alpha: true });
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;

  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 150;

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 250);
  scene.add(spotLight);

  const spotLightBack = new THREE.SpotLight(0xffffff);
  spotLightBack.position.set(0, 0, -250);
  scene.add(spotLightBack);

  if (CONFIG.showHelpers) {
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    const spotLightHelperBack = new THREE.SpotLightHelper(spotLightBack);
    scene.add(spotLightHelperBack);

    const axesHelper = new THREE.AxesHelper(150);
    scene.add(axesHelper);
  }

  document.getElementById('root').appendChild(webGLRenderer.domElement);

  const controls = new OrbitControls(camera, webGLRenderer.domElement);
  controls.autoRotate = false;

  const textures = getModelTextures(datasetFile, datasetFiles);

  let group;

  switch (getFileExtension(datasetFile.dataFile.filename)) {
    case 'stl': {
      const loader = new THREE.STLLoader();
      loader.load(datasetFile.url, (geometry) => {
        const mat = new THREE.MeshLambertMaterial({ color: 0x7777ff });
        group = new THREE.Mesh(geometry, mat);
        group.rotation.x = -0.5 * Math.PI;
        group.rotation.z = -0.5 * Math.PI;
        group.scale.set(0.6, 0.6, 0.6);
        scene.add(group);
      });
      break;
    }

    case 'obj': {
      const loader = new OBJLoader();
      group = new THREE.Object3D();

      loader.load(datasetFile.url, (geometry) => {
        textures.forEach((texture) => {
          const text = new THREE.TextureLoader().load(texture.url);
          geometry.traverse((child) => {
            if (child.type && child.type === 'Mesh') {
              child.material.map = text;
            }
          });
        });

        group.rotation.x = -0.5 * Math.PI;
        group.rotation.z = -0.5 * Math.PI;
        geometry.scale.set(0.6, 0.6, 0.6);
        spotLight.target = geometry;
        spotLightBack.target = geometry;

        scene.add(geometry);
      });

      break;
    }

    default: {
      throw new Error('Unsupported file type');
    }
  }

  const render = () => {
    requestAnimationFrame(render);
    webGLRenderer.render(scene, camera);
  };

  render();
};

window.addEventListener('DOMContentLoaded', () => {
  startPreview(false, init);
});
