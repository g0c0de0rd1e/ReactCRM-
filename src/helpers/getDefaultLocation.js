import { defaultCenter } from '../configs/app-global';

export default function getDefaultLocation(settings) {
  if (!settings?.location) {
    return defaultCenter;
  }
  const location = settings.location.split(', ');
  return {
    lat: Number(location[0]),
    lng: Number(location[1]),
  };
}
