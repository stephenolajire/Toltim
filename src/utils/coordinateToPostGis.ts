export const coordinatesToPostGIS = (lat: number, lng: number): string => {
  return `SRID=4326;POINT (${lng} ${lat})`;
};
