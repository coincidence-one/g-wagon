/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { geocodeAddress } from "@/lib/geocode";
import { PXStore } from "@/lib/mockData";
import { MNDApiResponse } from "@/types/mnd";

export default function DataGeneratorPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "running" | "saving" | "done">(
    "idle",
  );
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs((prev) => [...prev, msg]);

  const startGeneration = async () => {
    setStatus("running");
    setLogs([]);
    addLog("Starting full data generation...");

    try {
      // 1. Fetch all marts (increase range to cover everything)
      addLog("Fetching marts from API (1-5000)...");
      const res = await fetch("/api/marts?start=1&end=5000");
      const data: MNDApiResponse = await res.json();

      if (!data.TB_MND_MART_CURRENT || !data.TB_MND_MART_CURRENT.row) {
        throw new Error("No data found");
      }

      const rawMarts = data.TB_MND_MART_CURRENT.row;
      const total = rawMarts.length;
      addLog(`Fetched ${total} marts.`);

      const processedMarts: PXStore[] = [];
      const BATCH_SIZE = 10; // Slightly larger batch

      for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = rawMarts.slice(i, i + BATCH_SIZE);
        if (i % 50 === 0) addLog(`Processing ${i}/${total}...`);

        const batchPromises = batch.map(async (mart) => {
          // Skip if no address (rare)
          if (!mart.LOC) return { ...mart, id: mart.SEQ } as any;

          let coords = null;
          try {
            coords = await geocodeAddress(mart.LOC);
            // Fallback for tricky addresses
            if (!coords) {
              const simpleAddr = mart.LOC.split(" ").slice(0, 3).join(" ");
              if (simpleAddr !== mart.LOC)
                coords = await geocodeAddress(simpleAddr);
            }
          } catch (e) {}

          return {
            id: mart.SEQ,
            name: mart.MART,
            lat: coords?.lat,
            lng: coords?.lng,
            address: mart.LOC,
            phone: mart.TEL,
            hours: `평일: ${mart.OP_WEEKDAY}, 토: ${mart.OP_SAT}, 일: ${mart.OP_SUN}`,
            description: `${mart.SCALE} / ${mart.NOTE}`,
          };
        });

        const batchResults = await Promise.all(batchPromises);
        processedMarts.push(...batchResults);

        setProgress(Math.round(((i + BATCH_SIZE) / total) * 100));
        await new Promise((r) => setTimeout(r, 100)); // 100ms delay
      }

      addLog("Geocoding complete. Saving to file...");
      setStatus("saving");

      // 3. Save to file via API
      const saveRes = await fetch("/api/save-marts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedMarts),
      });

      if (!saveRes.ok) throw new Error("Failed to save file");

      setStatus("done");
      addLog("Successfully saved marts.json!");
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
      setStatus("idle");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Full Data Generator</h1>
      <button
        onClick={startGeneration}
        disabled={status !== "idle"}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {status === "idle" ? "Start Generation" : status}
      </button>

      {status !== "idle" && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center mt-1">{progress}%</p>
        </div>
      )}

      {status === "done" && (
        <div className="mt-4 text-xl text-green-600 font-bold" id="status-done">
          All Done!
        </div>
      )}

      <div className="mt-4 h-64 overflow-auto border p-2 bg-gray-50 text-xs font-mono">
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
