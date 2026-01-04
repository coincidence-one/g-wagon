import { useState, useEffect } from "react";
import { PXStore } from "@/lib/mockData";
import { MNDApiResponse } from "@/types/mnd";
import staticMarts from "@/data/marts.json";

export function useMarts() {
  const [stores, setStores] = useState<PXStore[]>(
    staticMarts.map((store) => ({
      ...store,
      // Default to YELLOW if not specified in static data
      accessLevel: "YELLOW" as const,
    })),
  );
  const [loading, setLoading] = useState(false); // Start false because we have data
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFreshData() {
      setLoading(true);
      try {
        const res = await fetch("/api/marts?start=1&end=1000");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: MNDApiResponse = await res.json();

        if (data.TB_MND_MART_CURRENT && data.TB_MND_MART_CURRENT.row) {
          const freshMarts = data.TB_MND_MART_CURRENT.row;

          setStores((currentStores) => {
            return currentStores.map((store) => {
              const fresh = freshMarts.find((f) => f.SEQ === store.id);
              if (fresh) {
                return {
                  ...store,
                  hours: `평일: ${fresh.OP_WEEKDAY}, 토: ${fresh.OP_SAT}, 일: ${fresh.OP_SUN}`,
                  description: `${fresh.SCALE} / ${fresh.NOTE}`,
                  // Keep the static coordinates
                };
              }
              return store;
            });
          });
        }
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    // Fetch fresh data in background
    fetchFreshData();
  }, []);

  return { stores, setStores, loading, error };
}
