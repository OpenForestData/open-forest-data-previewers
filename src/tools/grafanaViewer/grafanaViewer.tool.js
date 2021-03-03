import axios from 'axios';
import startPreview from '../core/js/retriever';

const init = ({ file }) => {
  const root = document.querySelector('#root');
  file = file['data'];
  const uid = file['uid'];
  let siteUrl = file['site_url'];
  let detailUrl = file['details_url'];

  if (siteUrl[siteUrl.length - 1] !== '/') siteUrl += '/';
  if (detailUrl[0] === '/') detailUrl = detailUrl.substring(1);
  if (detailUrl[detailUrl.length - 1] !== '/') detailUrl += '/';
  axios.get(`${siteUrl}${detailUrl}`).then((data) => {
    data = data.data;
    const panels = data['dashboard']['panels'];
    panels.forEach((panel) => {
      const panelId = panel['id'];

      const grafanaViewURL = `${siteUrl}d-solo/${uid}?panelId=${panelId}&fullscreen`;

      const iframe = document.createElement('iframe');
      iframe.frameBorder = '0';
      iframe.src = grafanaViewURL;
      iframe.width = 650;
      iframe.height = 300;
      root.appendChild(iframe);
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
  startPreview(true, init);
});
