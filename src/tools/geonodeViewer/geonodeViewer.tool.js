import startPreview from '../core/js/retriever';

const init = ({ file }) => {
  file = file['data'];
  let siteUrl = file['site_url'];
  let detailUrl = file['detail_url'];
  if (siteUrl[siteUrl.length - 1] !== '/') siteUrl += '/';
  if (detailUrl[0] === '/') detailUrl = detailUrl.substring(1);
  if (detailUrl[detailUrl.length - 1] !== '/') detailUrl += '/';
  const geonodeViewURL = `${siteUrl}${detailUrl}embed`;

  const iframe = document.createElement('iframe');
  iframe.frameBorder = '0';
  iframe.src = geonodeViewURL;

  const root = document.querySelector('#root');
  root.appendChild(iframe);
};

window.addEventListener('DOMContentLoaded', () => {
  startPreview(true, init);
});
