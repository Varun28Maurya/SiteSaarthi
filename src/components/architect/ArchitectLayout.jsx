import React, { useState } from "react";

/* ---------- 2D FLOOR PLAN ---------- */
const FloorPlan2D = () => (
  <div className="flex flex-col items-center w-full">
    <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800 text-center">
      2D Architectural Layout
    </h2>

    <div className="flex flex-col md:flex-row bg-white p-4 md:p-8 rounded-xl border gap-4 items-center overflow-auto">
      <div
        className="grid gap-[2px] bg-gray-400 border-4 border-gray-600"
        style={{
          width: "100%",
          maxWidth: "900px",
          height: "60vh",
          maxHeight: "600px",
          gridTemplateColumns: "repeat(12, 1fr)",
          gridTemplateRows: "repeat(10, 1fr)",
        }}
      >
        <div className="col-span-3 row-span-3 bg-cyan-100 border p-1 text-[9px]">
          <b>Bathroom</b>
          <br />
          92.17 ft²
        </div>

        <div className="col-span-2 row-span-3 bg-green-200 border p-1 text-[9px]">
          <b>Laundry</b>
          <br />
          50.96 ft²
        </div>

        <div className="col-span-7 row-span-7 bg-orange-200 border p-2 text-[9px] relative">
          <b className="text-sm">Living Room</b>
          <br />
          389.31 ft²
        </div>

        <div className="col-span-4 row-span-5 bg-pink-100 border p-2 text-[9px]">
          <b className="text-sm">Master Bedroom</b>
          <br />
          214.16 ft²
        </div>

        <div className="col-span-5 row-span-3 bg-yellow-200 border p-1 text-[9px]">
          <b>Kitchen</b>
          <br />
          93.75 ft²
        </div>
      </div>
    </div>
  </div>
);

/* ---------- MAIN ARCHITECT MODULE ---------- */
export default function ArchitectLayout() {
  const [view, setView] = useState("2D");

  return (
    <div className="bg-slate-50 p-4 md:p-6 rounded-xl border">
      
      {/* ---------- 2D VIEW ---------- */}
      {view === "2D" && (
        <div className="flex flex-col items-center">
          <FloorPlan2D />

          <button
            onClick={() => setView("3D")}
            className="mt-6 px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Switch to 3D →
          </button>
        </div>
      )}

      {/* ---------- 3D VIEW ---------- */}
      {view === "3D" && (
        <div className="flex flex-col items-center">
          <div className="w-full h-[50vh] bg-slate-900 rounded-xl flex flex-col items-center justify-center text-white border">
            <h2 className="text-3xl font-bold">3D View</h2>
            <p className="text-indigo-300 mt-2">
              Three.js model will render here
            </p>
          </div>

          <button
            onClick={() => setView("2D")}
            className="mt-6 px-6 py-2 bg-white text-black rounded-lg border font-semibold hover:bg-slate-100 transition"
          >
            ← Back to 2D
          </button>
        </div>
      )}
    </div>
  );
}
