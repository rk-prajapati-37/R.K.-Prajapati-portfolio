"use client";

import { PortableText } from "@portabletext/react";

export default function PortableTextClient({ value }: { value: any }) {
  if (!value) return null;

  // If description is stored as a plain string in Sanity, render directly
  if (typeof value === "string") {
    return (
      <div className="prose max-w-none text-gray-700">
        <p>{value}</p>
      </div>
    );
  }

  const components = {
    types: {
      // default block renderer
      block: (props: any) => {
        return <p>{props.children}</p>;
      },
    },
    marks: {
      strong: (props: any) => <strong>{props.children}</strong>,
      em: (props: any) => <em>{props.children}</em>,
      code: (props: any) => <code className="bg-gray-100 px-1 rounded">{props.children}</code>,
    },
  } as any;

  return (
    <div className="prose max-w-none text-gray-700">
      <PortableText value={value} components={components} />
    </div>
  );
}
