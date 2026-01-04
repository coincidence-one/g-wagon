export interface PXStore {
  id: number;
  name: string;
  lat?: number;
  lng?: number;
  address: string;
  phone: string;
  hours: string;
  description: string;
  accessLevel: "RED" | "YELLOW" | "GREEN";
}

export const stores: PXStore[] = [
  {
    id: 1,
    name: "국군복지단 WA마트",
    lat: 37.5456,
    lng: 126.9678,
    address: "서울특별시 용산구 한강대로 42",
    phone: "02-1234-5678",
    hours: "10:00 - 19:30",
    description: "다양한 생필품과 간식을 저렴하게 판매합니다.",
    accessLevel: "GREEN",
  },
  {
    id: 2,
    name: "국군복지단 용산마트",
    lat: 37.5345,
    lng: 126.989,
    address: "서울특별시 용산구 두텁바위로 123",
    phone: "02-9876-5432",
    hours: "10:30 - 20:00",
    description: "군인가족을 위한 최고의 쇼핑 공간입니다.",
    accessLevel: "YELLOW",
  },
  {
    id: 3,
    name: "국군복지단 영등포마트",
    lat: 37.5123,
    lng: 126.9012,
    address: "서울특별시 영등포구 신길로 45",
    phone: "02-5555-5555",
    hours: "09:00 - 18:00",
    description: "넓은 주차 공간과 쾌적한 쇼핑 환경.",
    accessLevel: "RED",
  },
];
