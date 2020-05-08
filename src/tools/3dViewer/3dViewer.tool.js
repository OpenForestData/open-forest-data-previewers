import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader';
import OrbitControlsThree from 'three-orbit-controls';

import startPreview from '../core/js/retriever';
import { getFileName, bytesToSize, getFileExtension, ErrorModal } from '../core/js/utils';

const OrbitControls = OrbitControlsThree(THREE);

const CONFIG = {
  maxFileSize: 50000000,
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

const fitCameraToSelection = (camera, controls, selection, fitOffset = 1.2) => {
  const box = new THREE.Box3();

  box.expandByObject(selection);

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

  const direction = controls.target.clone().sub(camera.position).normalize().multiplyScalar(distance);

  controls.maxDistance = distance * 10;
  controls.target.copy(center);

  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();

  camera.position.copy(controls.target).sub(direction);

  controls.update();
};

const generateOBJLoader = () => {
  const loaderContainer = document.createElement('div');
  loaderContainer.classList.add('obj-file-loader-container');

  const loaderProgress = document.createElement('p');
  loaderProgress.classList.add('obj-file-loader-progress');
  loaderContainer.appendChild(loaderProgress);

  const loaderBar = document.createElement('div');
  loaderBar.classList.add('obj-file-loader-bar');
  loaderContainer.appendChild(loaderBar);

  const root = document.querySelector('#root');
  root.classList.add('loading');
  document.querySelector('body').appendChild(loaderContainer);
};

const updateOBJLoaderProgress = (progress) => {
  const loaderBar = document.querySelector('.obj-file-loader-bar');
  loaderBar.style.width = `${progress}%`;

  const loaderProgress = document.querySelector('.obj-file-loader-progress');
  loaderProgress.innerHTML = `${progress}%`;
};

const removeOBJLoader = () => {
  const loaderContainer = document.querySelector('.obj-file-loader-container');
  loaderContainer.remove();
  const root = document.querySelector('#root');
  root.classList.remove('loading');
};

const controlRotationHandler = (geometry, camera, controls) => {
  const buttons = document.querySelectorAll('.rotate-object');

  for (const button of buttons) {
    button.addEventListener('click', (e) => {
      controls.reset();

      const vector = e.target.dataset['vector'];

      let x = 0;
      let y = 0;
      let z = 0;

      switch (vector) {
        case 'top': {
          x = 0;
          y = 150;
          z = 0;
          break;
        }

        case 'bottom': {
          x = 0;
          y = -150;
          z = 0;
          break;
        }

        case 'front': {
          x = 0;
          y = 0;
          z = 150;
          break;
        }

        case 'back': {
          x = 0;
          y = 0;
          z = -150;
          break;
        }

        case 'left': {
          x = -150;
          y = 0;
          z = 0;
          break;
        }

        case 'right': {
          x = 150;
          y = 0;
          z = 0;
          break;
        }

        default:
          break;
      }

      camera.position.set(x, y, z);
      // controls.update();
      fitCameraToSelection(camera, controls, geometry);
    });
  }
};

const renderMetaData = ({ tableData }) => {
  const tableContainer = document.createElement('div');
  tableContainer.classList.add('metadata-table-container');
  const table = document.createElement('table');

  tableData.forEach((row) => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    const tdValue = document.createElement('td');

    tdName.innerHTML = row['name'];
    tdValue.innerHTML = row['value'];

    tr.appendChild(tdName);
    tr.appendChild(tdValue);

    table.appendChild(tr);
  });

  tableContainer.appendChild(table);

  document.querySelector('#root').insertBefore(tableContainer, document.querySelector('#root canvas'));
};

const init = ({ datasetFile, datasetFiles }) => {
  if (datasetFile.dataFile.filesize > CONFIG.maxFileSize) {
    new ErrorModal({ message: 'File size too large' });
    return;
  }

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, (window.innerWidth - 250) / window.innerHeight, 0.1, 1000);

  const webGLRenderer = new THREE.WebGLRenderer({ alpha: true });
  webGLRenderer.setSize(window.innerWidth - 250, window.innerHeight);
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
      const loader = new STLLoader();
      generateOBJLoader();
      loader.load(
        datasetFile.url,
        (geometry) => {
          const mat = new THREE.MeshLambertMaterial({ color: 0x7777ff });
          group = new THREE.Mesh(geometry, mat);
          group.rotation.x = -0.5 * Math.PI;
          group.rotation.z = -0.5 * Math.PI;
          group.scale.set(0.6, 0.6, 0.6);
          scene.add(group);

          controlRotationHandler(group, camera, controls);
          fitCameraToSelection(camera, controls, group);
          removeOBJLoader();

          let vertex = 0;

          geometry.children.forEach((children) => {
            if (children.geometry) {
              vertex += children.geometry.attributes.position.count;
            }
          });

          setTimeout(() => {
            renderMetaData({
              tableData: [
                { name: 'File name', value: datasetFile.dataFile.filename },
                { name: 'File size', value: bytesToSize(datasetFile.dataFile.filesize) },
                { name: 'Vertex count', value: vertex },
                { name: 'Triangle count', value: webGLRenderer.info.render.triangles },
              ],
            });
          }, 500);
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            updateOBJLoaderProgress(Math.round(percentComplete));
          }
        },
        () => {
          new ErrorModal({ message: 'There was a problem loading the file' });
        }
      );
      break;
    }

    case 'obj': {
      const loader = new OBJLoader();
      group = new THREE.Object3D();

      generateOBJLoader();

      loader.load(
        datasetFile.url,
        (geometry) => {
          const texturesData = [];
          textures.forEach((texture, i) => {
            const text = new THREE.TextureLoader().load(texture.url);
            texturesData.push({ name: `Texture #${i + 1} name`, value: texture.dataFile.filename });
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
          controlRotationHandler(geometry, camera, controls);
          fitCameraToSelection(camera, controls, geometry);
          removeOBJLoader();

          let vertex = 0;

          geometry.children.forEach((children) => {
            if (children.geometry) {
              vertex += children.geometry.attributes.position.count;
            }
          });

          setTimeout(() => {
            renderMetaData({
              tableData: [
                { name: 'File name', value: datasetFile.dataFile.filename },
                { name: 'File size', value: bytesToSize(datasetFile.dataFile.filesize) },
                { name: 'Vertex count', value: vertex },
                { name: 'Triangle count', value: webGLRenderer.info.render.triangles },
                ...texturesData,
              ],
            });
          }, 500);
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            updateOBJLoaderProgress(Math.round(percentComplete));
          }
        },
        () => {
          new ErrorModal({ message: 'There was a problem loading the file' });
        }
      );

      break;
    }

    case '3ds': {
      const loader = new TDSLoader();
      generateOBJLoader();

      loader.load(
        datasetFile.url,
        (geometry) => {
          var materialObj = new THREE.MeshBasicMaterial({
            vertexColors: THREE.FaceColors,
          });
          geometry.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
              child.material = materialObj;
            }
          });

          geometry.scale.set(0.6, 0.6, 0.6);

          spotLight.target = geometry;
          spotLightBack.target = geometry;

          scene.add(geometry);
          controlRotationHandler(geometry, camera, controls);
          fitCameraToSelection(camera, controls, geometry);
          removeOBJLoader();

          let vertex = 0;

          geometry.children.forEach((children) => {
            if (children.geometry) {
              vertex += children.geometry.attributes.position.count;
            }
          });

          setTimeout(() => {
            renderMetaData({
              tableData: [
                { name: 'File name', value: datasetFile.dataFile.filename },
                { name: 'File size', value: bytesToSize(datasetFile.dataFile.filesize) },
                { name: 'Vertex count', value: vertex },
                { name: 'Triangle count', value: webGLRenderer.info.render.triangles },
              ],
            });
          }, 500);
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            updateOBJLoaderProgress(Math.round(percentComplete));
          }
        },
        () => {
          new ErrorModal({ message: 'There was a problem loading the file' });
        }
      );
      break;
    }

    default: {
      new ErrorModal({ message: 'Unsupported file type' });
      break;
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
