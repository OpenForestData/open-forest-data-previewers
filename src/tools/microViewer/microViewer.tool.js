import startPreview from '../core/js/retriever';

const embedIframe = (url) => {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.allowfullscreen = true;
  iframe.onwheel = () => false;
  iframe.frameBorder = 0;

  const fullscreen = document.createElement('button');
  fullscreen.classList.add('fullscreen-btn');
  fullscreen.innerHTML = '<img src="/tools/assets/images/fullscreen.png" alt="Fullscreen"/>';

  fullscreen.addEventListener('click', () => {
    const fullscreenMethod = iframe.requestFullscreen || iframe.webkitRequestFullScreen || iframe.mozRequestFullScreen;
    fullscreenMethod.call(iframe);
  });

  const root = document.querySelector('#root');

  root.appendChild(fullscreen);
  root.appendChild(iframe);
};

const init = ({ file }) => {
  file = file['data'];

  // eslint-disable-next-line no-undef
  embedIframe(
    'http://212.33.83.34:8042/osimis-viewer/app/index.html?study=d279e981-c99c42ff-1b4f98f6-9b8f3864-3ff04cc5'
  );
};

window.addEventListener('DOMContentLoaded', () => {
  startPreview(true, init);
});
