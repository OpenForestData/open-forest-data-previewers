export const getFileExtension = (fileName) => {
  return fileName.substr(fileName.lastIndexOf('.') + 1).toLowerCase();
};

export const getFileName = (fileName) => {
  return fileName.substr(0, fileName.lastIndexOf('.'));
};
