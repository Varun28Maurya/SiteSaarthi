import React, { useState } from "react";
import { X } from "lucide-react";

export default function AddProjectModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    location: "",
    type: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.location) {
      alert("Please fill all fields");
      return;
    }

    const newProject = {
      id: Date.now(),
      name: form.name,
      location: form.location,
      type: form.type || "Residential",
      engineerId: "eng-1",
      status: "On Track",
      materialsPending: 0,
    };

    onAdd(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-end sm:items-center justify-center">

      <div className="bg-white w-full rounded-t-3xl p-5 animate-slideUp">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">New Project</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-4">
          <input
            name="name"
            placeholder="Project / Site Name"
            className="w-full p-4 rounded-xl bg-slate-100 outline-none"
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location (City / Area)"
            className="w-full p-4 rounded-xl bg-slate-100 outline-none"
            onChange={handleChange}
          />

          <select
            name="type"
            className="w-full p-4 rounded-xl bg-slate-100 outline-none"
            onChange={handleChange}
          >
            <option value="">Project Type</option>
            <option>Residential</option>
            <option>Commercial</option>
            <option>Industrial</option>
          </select>
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-orange-500 text-white py-4 rounded-xl font-bold tracking-wide"
        >
          ADD PROJECT
        </button>
      </div>
    </div>
  );
}