import { educationData } from "../data/educationData";

export default function Education() {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-bold text-red-700 mb-5">Education</h2>
      {educationData.map((edu, i) => (
        <div key={i} className="bg-white p-5 rounded-xl shadow-lg border">
          <p className="text-sm text-red-600">{edu.date}</p>
          <h3 className="font-semibold text-lg">{edu.degree}</h3>
          <p className="italic text-blue-700">{edu.college}</p>
          <p className="text-gray-700 mt-2">{edu.details}</p>
        </div>
      ))}
    </section>
  );
}
