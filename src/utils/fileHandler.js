export const getRelativePath = (href, basePath) => {
  if (!href) return null;
  const cleanPath = href.replace(/^\.\//, '');
  return basePath + '/' + cleanPath;
};

export const findFileInFolder = async (files, path) => {
  if (!path) return null;
  const normalizedPath = path.replace(/\\/g, '/').replace(/^\.\//, '');
  for (const file of files) {
    const relativePath = (file.webkitRelativePath || file.name).replace(/\\/g, '/');
    if (relativePath === path || relativePath.endsWith(`/${normalizedPath}`) || relativePath === normalizedPath) {
      return URL.createObjectURL(file);
    }
  }
  return null;
};

export const parseHTML = (htmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(htmlString, 'text/html');
};
