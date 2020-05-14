import startPreview from '../core/js/retriever';

const SERVER = 'https://iipsrv.whiteaster.com//fcgi-bin/iipsrv.fcgi';

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

const configTiff = () => {
  // CONFIG
  previewTiff({
    image: 'PalaisDuLouvre.tif',
  });
};

const init = ({ datasetFile, datasetFiles }) => {
  document.querySelectorAll('.action-button').forEach((button) => {
    button.addEventListener('click', (e) => {
      switch (e.target.dataset.action) {
        case 'preview': {
          previewTiff({
            image: 'PalaisDuLouvre.tif',
          });
          break;
        }

        case 'config': {
          configTiff();
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
