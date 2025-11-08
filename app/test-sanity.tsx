"use client";
import { useEffect } from "react";
import { client } from "@/lib/sanityClient";

export default function TestSanity() {
  useEffect(() => {
    client.fetch('*[_type == "blog"][0]{title, slug}').then(console.log).catch(console.error);
  }, []);
  return <div className="p-8">Check your console for Sanity test result.</div>;
}
