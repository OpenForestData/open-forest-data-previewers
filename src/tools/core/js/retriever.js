import axios from 'axios';

const startPreview = (retrieveFile, callback = () => {}) => {
  let datasetFile = {};
  let datasetFiles = [];
  let dataset = {};
  let siteUrl = '';

  const queryParams = new URLSearchParams(window.location.search.substring(1));

  const fileId = queryParams.get('fileid');
  siteUrl = queryParams.get('siteUrl');
  if (siteUrl[siteUrl.length - 1] !== '/') siteUrl += '/';
  const apiKey = queryParams.get('key');
  const datasetId = queryParams.get('datasetid');
  const datasetVersion = queryParams.get('datasetversion');

  let versionUrl = `${siteUrl}api/datasets/${datasetId}/versions/${datasetVersion}`;

  if (apiKey) {
    versionUrl += `?key=${apiKey}`;
  }

  axios.get(versionUrl).then((response) => {
    let data = response['data']['data'];
    data = data['latestVersion'] ? data['latestVersion'] : data;
    let files = data['files'].map((file) => {
      file.url = `${siteUrl}api/access/datafile/${file.dataFile.id}`;
      return file;
    });
    datasetFiles = files;
    dataset = data;
    files.forEach((file) => {
      if (file.dataFile.id === Number(fileId)) {
        datasetFile = file;
        datasetFile.url = `${siteUrl}api/access/datafile/${fileId}`;

        if (apiKey) {
          datasetFile.url += `&key=${apiKey}`;
        }
      }
      return file;
    });

    if (retrieveFile) {
      axios.get(datasetFile.url).then((fileResponse) => {
        callback({ datasetFile, datasetFiles, dataset, file: fileResponse });
      });
    } else {
      callback({ datasetFile, datasetFiles, dataset });
    }
  });
};

export default startPreview;
