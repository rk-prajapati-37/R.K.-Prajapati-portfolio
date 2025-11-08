"use client";

import { PortableText } from "@portabletext/react";

export default function PortableTextClient({ value }: { value: any }) {
  return (
    <div className="prose max-w-none">
      <PortableText value={value} />
    </div>
  );
}
