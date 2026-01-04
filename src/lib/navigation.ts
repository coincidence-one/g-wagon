export const getNaverDirectionsUrl = (
  name: string,
  lat: number,
  lng: number,
  startLat?: number,
  startLng?: number,
) => {
  const encodedName = encodeURIComponent(name);
  let url = `https://map.naver.com/index.nhn?elng=${lng}&elat=${lat}&etext=${encodedName}&menu=route`;

  if (startLat && startLng) {
    url += `&slng=${startLng}&slat=${startLat}&stext=현재 위치`;
  }

  return url;
};

export const getKakaoDirectionsUrl = (
  name: string,
  lat: number,
  lng: number,
  startLat?: number,
  startLng?: number,
) => {
  if (startLat && startLng) {
    // Kakao Map Directions from > to
    return `https://map.kakao.com/link/from/현재 위치,${startLat},${startLng}/to/${name},${lat},${lng}`;
  }
  return `https://map.kakao.com/link/to/${name},${lat},${lng}`;
};
