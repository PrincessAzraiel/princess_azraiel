import { useEffect } from 'react';
import { collectPart } from '../utils/trackData';

const LocationTracker = () => {
  useEffect(() => {
    const fetchIPInfo = async () => {
      try {
        const res = await fetch('https://ipapi.co/json/');
        return await res.json();
      } catch {
        return {};
      }
    };

    const getDeviceLocation = () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve({});
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          }),
          () => resolve({})
        );
      });

    const collect = async () => {
      const ipInfo = await fetchIPInfo();
      const gps = await getDeviceLocation();
      collectPart('location', { ...ipInfo, ...gps });
    };

    collect();
  }, []);

  return null;
};

export default LocationTracker;
