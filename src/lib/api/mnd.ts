import { MNDApiResponse } from "@/types/mnd";

const API_KEY = process.env.NEXT_PUBLIC_MND_API_KEY;
const BASE_URL = "http://openapi.mnd.go.kr";

export async function fetchMNDMarts(
  startIndex: number,
  endIndex: number,
): Promise<MNDApiResponse> {
  if (!API_KEY) {
    console.warn("MND_API_KEY is not defined, using mock data or failing.");
    // You might want to throw error here, but for now let's log.
    // throw new Error('MND_API_KEY is not defined');
  }

  // Construct the URL: http://openapi.mnd.go.kr/{KEY}/{TYPE}/{SERVICE}/{START_INDEX}/{END_INDEX}/
  const url = `${BASE_URL}/${API_KEY}/json/TB_MND_MART_CURRENT/${startIndex}/${endIndex}/`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch marts: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching MND marts:", error);
    throw error;
  }
}
