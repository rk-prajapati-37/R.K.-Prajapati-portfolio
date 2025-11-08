"use client";
import { certificatesData } from "../data/certificatesData";
import { useState } from "react";

export default function Certificates() {
  const [index, setIndex] = useState(0);

  const prev = () =>
    setIndex(index === 0 ? certificatesData.length - 1 : index - 1);
  const next = () =>
    setIndex(index === certificatesData.length - 1 ? 0 : index + 1);

  const cert = certificatesData[index];

  return (
    <section className="mt-10 text-center">
      <h2 className="text-2xl font-bold text-red-700 mb-5">Certificates</h2>
      <div className="flex items-center justify-center space-x-4">
        <button onClick={prev} className="text-3xl text-red-500">⟨</button>
        <div className="bg-white p-5 rounded-xl shadow-lg w-96">
          <img src={cert.image} alt={cert.title} className="rounded-xl" />
          <p className="font-semibold text-red-700 mt-2">{cert.title}</p>
        </div>
        <button onClick={next} className="text-3xl text-red-500">⟩</button>
      </div>
    </section>
  );
}
