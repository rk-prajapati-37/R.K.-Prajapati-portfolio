"use client";
import { useEffect } from "react";
import { client } from "@/lib/sanityClient";

export default function TestSanity() {
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await client.fetch(`*[_type == "blog"][0]{title, slug}`);
        console.log("✅ Sanity connected! First blog found:", data);
      } catch (error) {
        console.error("❌ Sanity fetch error:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-xl">
      🔍 Check your browser console for the Sanity test result.
    </div>
  );
}
