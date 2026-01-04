/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from "react-naver-maps";
import { PXStore } from "@/lib/mockData";
import { useState } from "react";
import useSupercluster from "use-supercluster";

interface NaverMapComponentProps {
  stores: PXStore[];
  selectedStore: PXStore | null;
  onSelectStore: (store: PXStore) => void;
  onMapLoad?: (map: any) => void;
}

export default function NaverMapComponent({
  stores,
  selectedStore,
  onSelectStore,
  onMapLoad,
}: NaverMapComponentProps) {
  const navermaps = useNavermaps();
  const [map, setMap] = useState<any>(null);
  const [zoom, setZoom] = useState(13);
  const [bounds, setBounds] = useState<
    [number, number, number, number] | undefined
  >(undefined);

  // Convert stores to GeoJSON points
  const points = stores
    .filter((store) => store.lat && store.lng)
    .map((store) => ({
      type: "Feature" as const,
      properties: { cluster: false, storeId: store.id, ...store },
      geometry: {
        type: "Point" as const,
        coordinates: [store.lng!, store.lat!],
      },
    }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  });

  const updateMapState = () => {
    if (!map) return;
    const zoom = map.getZoom();
    const bounds = map.getBounds();

    const southWest = bounds.getMin();
    const northEast = bounds.getMax();

    setZoom(zoom);
    setBounds([southWest.x, southWest.y, northEast.x, northEast.y]);
  };

  return (
    <MapDiv style={{ width: "100%", height: "100%" }}>
      <NaverMap
        defaultCenter={new navermaps.LatLng(37.5665, 126.978)}
        defaultZoom={13}
        center={
          selectedStore?.lat && selectedStore?.lng
            ? new navermaps.LatLng(selectedStore.lat, selectedStore.lng)
            : undefined
        }
        ref={(mapInstance: any) => {
          if (mapInstance) {
            setMap(mapInstance);
            if (onMapLoad) onMapLoad(mapInstance);
          }
        }}
        onZoomChanged={updateMapState}
        onBoundsChanged={updateMapState}
        onCenterChanged={updateMapState}
      >
        {clusters.map((cluster) => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const { cluster: isCluster } = cluster.properties;

          if (isCluster) {
            const pointCount = (cluster.properties as any).point_count;
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                position={new navermaps.LatLng(latitude, longitude)}
                onClick={() => {
                  if (supercluster) {
                    const expansionZoom = Math.min(
                      supercluster.getClusterExpansionZoom(
                        cluster.id as number,
                      ),
                      20,
                    );
                    map?.setZoom(expansionZoom);
                    map?.setCenter(new navermaps.LatLng(latitude, longitude));
                  }
                }}
                icon={{
                  content: `
                    <div style="
                      width: ${30 + (pointCount / points.length) * 20}px; 
                      height: ${30 + (pointCount / points.length) * 20}px; 
                      border-radius: 50%; 
                      background-color: rgba(255, 165, 0, 0.9); 
                      color: white; 
                      display: flex; 
                      align-items: center; 
                      justify-content: center; 
                      font-weight: bold;
                      border: 2px solid white;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                      cursor: pointer;
                    ">
                      ${pointCount}
                    </div>
                  `,
                }}
              />
            );
          }

          // Individual Marker
          return (
            <Marker
              key={`store-${cluster.properties.storeId}`}
              position={new navermaps.LatLng(latitude, longitude)}
              onClick={() => onSelectStore(cluster.properties as PXStore)}
              icon={{
                content: `
                  <div class="px-3 py-1.5 bg-white border-2 rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer flex items-center gap-1.5 ${
                    cluster.properties.accessLevel === "GREEN"
                      ? "border-green-500"
                      : cluster.properties.accessLevel === "RED"
                        ? "border-red-500"
                        : "border-yellow-500"
                  }">
                    <div class="w-2.5 h-2.5 rounded-full ${
                      cluster.properties.accessLevel === "GREEN"
                        ? "bg-green-500"
                        : cluster.properties.accessLevel === "RED"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }"></div>
                    <div class="text-xs font-bold text-gray-900">${cluster.properties.name}</div>
                  </div>
                `,
              }}
            />
          );
        })}
      </NaverMap>
    </MapDiv>
  );
}
