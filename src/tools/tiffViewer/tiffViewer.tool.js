import axios from 'axios';

import startPreview from '../core/js/retriever';

const SERVER = 'https://iipimage.openforestdata.pl/fcgi-bin/iipsrv.fcgi';
const TIFF_UPLOADER = 'https://iipimage.openforestdata.pl/tiff';

const previewTiff = ({ server = SERVER, image }) => {
  const root = document.querySelector('#root');
  root.style.display = 'block';
  const actionButtons = document.querySelector('#action-buttons');
  actionButtons.style.display = 'none';
  // eslint-disable-next-line no-undef,no-new
  new IIPMooViewer('root', {
    server,
    image,
    prefix: '/tools/assets/images/',
  });
};

const configTiff = (fileId, doi) => {
  axios(`${TIFF_UPLOADER}?file_id=${fileId}&dataset_pid=${doi}`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  }).then((response) => {
    previewTiff({
      image: response['data']['filepath'],
    });
  });
};

const init = ({ datasetFile, dataset }) => {
  document.querySelectorAll('.action-button').forEach((button) => {
    button.addEventListener('click', (e) => {
      switch (e.target.dataset.action) {
        case 'preview': {
          previewTiff({
            image: `${dataset.datasetPersistentId.replace(/\//g, '-').replace('doi:', '')}/${
              datasetFile.dataFile.filename
            }`,
          });
          break;
        }

        case 'config': {
          configTiff(datasetFile.dataFile.id, dataset.datasetPersistentId);
          break;
        }

        default: {
          break;
        }
      }
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
  startPreview(false, init);
});
