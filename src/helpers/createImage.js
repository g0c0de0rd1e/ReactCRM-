export default function createImage(name) {
  const findHTTPS = name?.includes('https');
  if (!name) return undefined;

  return {
    name,
    url: findHTTPS ? name : name,
  };
}
