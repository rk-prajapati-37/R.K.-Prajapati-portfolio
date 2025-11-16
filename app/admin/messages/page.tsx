"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Message = {
  _id: string;
  name: string;
  email: string;
  mobile?: string;
  message: string;
  createdAt: string;
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/contact`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMessages(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      setDeleting(id);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/contact/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      alert("Failed to delete message");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📬 Contact Messages</h1>
          <p className="text-gray-600">
            {messages.length} {messages.length === 1 ? "message" : "messages"} received
          </p>
        </motion.div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
            ⚠️ {error}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No messages yet. Check back later! 📭</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{msg.name}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(msg.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => deleteMessage(msg._id)}
                    disabled={deleting === msg._id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {deleting === msg._id ? "Deleting..." : "Delete"}
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-red-600 hover:underline font-medium"
                    >
                      {msg.email}
                    </a>
                  </div>
                  {msg.mobile && (
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <a
                        href={`tel:${msg.mobile}`}
                        className="text-red-600 hover:underline font-medium"
                      >
                        {msg.mobile}
                      </a>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-4 rounded">
                    {msg.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
