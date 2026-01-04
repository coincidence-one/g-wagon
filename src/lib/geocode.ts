export interface Coordinates {
  lat: number;
  lng: number;
}

export function geocodeAddress(address: string): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      console.error("Naver Maps Service is not loaded");
      resolve(null);
      return;
    }

    window.naver.maps.Service.geocode(
      {
        query: address,
      },
      (status: any, response: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        if (status !== window.naver.maps.Service.Status.OK) {
          console.warn(`Geocoding failed for address: ${address}`);
          resolve(null);
          return;
        }

        const result = response.v2.addresses[0];
        if (result) {
          resolve({
            lat: parseFloat(result.y),
            lng: parseFloat(result.x),
          });
        } else {
          resolve(null);
        }
      },
    );
  });
}

export function reverseGeocode(
  lat: number,
  lng: number,
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!window.naver || !window.naver.maps || !window.naver.maps.Service) {
      console.error("Naver Maps Service is not loaded");
      resolve(null);
      return;
    }

    const coord = new window.naver.maps.LatLng(lat, lng);
    const orders = [
      window.naver.maps.Service.OrderType.ADDR,
      window.naver.maps.Service.OrderType.ROAD_ADDR,
    ].join(",");

    console.log("Reverse Geocoding Request:", { lat, lng, coord, orders });

    window.naver.maps.Service.reverseGeocode(
      {
        coords: coord,
        orders: orders,
      },
      (status: any, response: any) => {
        // eslint-disable-line @typescript-eslint/no-explicit-any
        if (status !== window.naver.maps.Service.Status.OK) {
          console.warn("Reverse geocoding failed with status:", status);
          resolve(null);
          return;
        }

        const result = response.v2.address;
        console.log("Reverse geocode result:", result);
        if (result) {
          // Prefer road address, fallback to jibun address
          resolve(result.roadAddress || result.jibunAddress);
        } else {
          resolve(null);
        }
      },
    );
  });
}
