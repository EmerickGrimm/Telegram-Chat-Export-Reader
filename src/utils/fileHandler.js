export const getRelativePath = (href, basePath) => {
  if (!href) return null;
  const cleanPath = href.replace(/^\.\//, '');
  return basePath + '/' + cleanPath;
};

export const findFileInFolder = async (files, path) => {
  for (const file of files) {
    if (file.webkitRelativePath === path) {
      return URL.createObjectURL(file);
    }
  }
  return null;
};

export const parseHTML = (htmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
};