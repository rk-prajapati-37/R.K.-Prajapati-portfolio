"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus(null);

    // Validation
      // Validation: name and message required; either valid email OR valid mobile required
      if (!form.name || !form.message) {
        setStatus({ ok: false, msg: "Name and message are required." });
        return;
      }

    if (form.name.trim().length < 2) {
      setStatus({ ok: false, msg: "Name must be at least 2 characters." });
      return;
    }

    // Email validation
      // At least one contact: valid email OR valid mobile
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const mobileClean = form.mobile ? form.mobile.replace(/\s|-/g, "") : "";
      const mobileValid = mobileClean && /^\d{7,15}$/.test(mobileClean);
      const emailValid = form.email && emailRegex.test(form.email);

      if (!emailValid && !mobileValid) {
        setStatus({ ok: false, msg: "Please provide a valid email address or mobile number." });
        return;
      }

    if (form.message.trim().length < 10) {
      setStatus({ ok: false, msg: "Message must be at least 10 characters." });
      return;
    }

    // Phone validation (optional but if provided, must be valid)
      // Phone validation (if provided)
      if (form.mobile && !/^\d{7,15}$/.test(mobileClean)) {
        setStatus({ ok: false, msg: "Please enter a valid phone number." });
        return;
      }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus({ ok: true, msg: json?.message || "Message sent." });
        setForm({ name: "", email: "", mobile: "", message: "" });
      } else {
        setStatus({ ok: false, msg: json?.error || "Failed to send." });
      }
    } catch (err: any) {
      setStatus({ ok: false, msg: err?.message || "Failed to send." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-gray-800 mb-8">GET IN TOUCH</h2>

        {/* Contacts Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h1.28a2 2 0 011.948 1.515l.3 1.2A2 2 0 0010.48 7H12a2 2 0 012 2v1.5a2 2 0 01-.586 1.414l-1.5 1.5a8 8 0 004.586 4.586l1.5-1.5A2 2 0 0120.5 16H22a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-700 mb-1">Phone</h4>
            <p className="text-sm text-gray-500">+91 8082 06 8480</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-700 mb-1">Email</h4>
            <p className="text-sm text-gray-500">r.k.prajapati0307@gmail.com</p>
            <p className="text-sm text-gray-500">prajapatirohit0307@gmail.com</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 12.414A5 5 0 1012 13l4.243 4.243a6 6 0 108.485-8.485L21.121 8.879" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-700 mb-1">Address</h4>
            <p className="text-sm text-gray-500 text-center">Siddhivinayak Chawl, Sabe Gaon, Diva (E) - 400612</p>
          </div>
        </div>

        {/* Form and message area */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full p-4 rounded-full border border-gray-100 shadow-inner"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-4 rounded-full border border-gray-100 shadow-inner"
                />
                <input
                  type="text"
                  placeholder="Mobile"
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  className="w-full p-4 rounded-full border border-gray-100 shadow-inner"
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <textarea
                placeholder="Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full h-full min-h-[220px] p-6 rounded-2xl border border-gray-100 shadow-inner resize-none"
                required
              />

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </div>
          </form>

          {status && (
            <div className={`mt-6 p-4 rounded-md ${status.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {status.msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
