export const getCurrentUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        // Fallback default coordinates (New Delhi / Mumbai Hub)
        resolve({
          latitude: 28.6139,
          longitude: 77.2090,
          isFallback: true,
        });
      },
      { timeout: 10000 }
    );
  });
};
