import startPreview from '../core/js/retriever';

const init = ({ file }) => {
  const root = document.querySelector('#root');
  file = file['data'];
  let url = file['server_meta']['url'];
  const uid = file['dashboard']['uid'];
  const panels = file['dashboard']['panels'];
  panels.forEach((panel) => {
    const panelId = panel['id'];

    if (url[url.length - 1] !== '/') url += '/';

    const grafanaViewURL = `${url}d-solo/${uid}?panelId=${panelId}&fullscreen`;

    const iframe = document.createElement('iframe');
    iframe.frameBorder = '0';
    iframe.src = grafanaViewURL;
    iframe.width = 650;
    iframe.height = 300;
    root.appendChild(iframe);
  });
};

window.addEventListener('DOMContentLoaded', () => {
  startPreview(true, init);
});
