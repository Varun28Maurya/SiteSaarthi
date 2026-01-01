import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
  const mountRef = useRef(null);
  useEffect(() => {
  if (view !== "3D" || !mountRef.current) return;

  const container = mountRef.current;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);

  // Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(20, 20, 20);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Load GLB
  const loader = new GLTFLoader();
loader.load("/models/house.glb", (gltf) => {
  const model = gltf.scene;
  scene.add(model);

  // 🔲 Compute bounding box
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // 🎯 Center the model
  model.position.sub(center);

  // 📸 Auto-fit camera
  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

  cameraZ *= 1.2; // adjust zoom here if needed

  camera.position.set(cameraZ, cameraZ, cameraZ);
  camera.lookAt(0, 0, 0);

  // 🎮 Update controls
  controls.target.set(0, 0, 0);
  controls.minDistance = cameraZ * 0.5;
  controls.maxDistance = cameraZ * 3;
  controls.update();
});


  // 🔁 RESIZE HANDLER (THIS IS THE KEY)
  const handleResize = () => {
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  window.addEventListener("resize", handleResize);

  // Render loop
  let frameId;
  const animate = () => {
    frameId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  };
  animate();

  // Cleanup
  return () => {
    window.removeEventListener("resize", handleResize);
    cancelAnimationFrame(frameId);
    controls.dispose();
    renderer.dispose();
  };
}, [view]);


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
          <div
            ref={mountRef}
            className="w-full h-[50vh] bg-white rounded-xl border overflow-hidden"
          />


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
