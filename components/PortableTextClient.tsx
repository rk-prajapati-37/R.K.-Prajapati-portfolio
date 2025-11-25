"use client";

import { PortableText } from "@portabletext/react";

export default function PortableTextClient({ value }: { value: any }) {
  if (!value) return null;

  // If description is stored as a plain string in Sanity, render directly
  if (typeof value === "string") {
    // Preserve newlines — split into paragraphs by two newlines, convert single newline to <br>
    const paragraphs = value.split(/\n{2,}/).map((p) => p.split(/\n/));

    return (
      <div className="prose max-w-none" style={{ color: "var(--text)" }}>
        {paragraphs.map((lines, idx) => (
          <p key={idx}>
            {lines.reduce((acc: any[], line: string, i: number) => {
              if (i > 0) acc.push(<br key={`br-${i}`} />);
              acc.push(line);
              return acc;
            }, [])}
          </p>
        ))}
      </div>
    );
  }

  const components = {
    types: {
      // block renderer: use node.style to decide tag (h1, h2, normal, blockquote, etc.)
      block: ({ children, value }: any) => {
        const style = value?.style || "normal";
        switch (style) {
          case "h1":
            return <h1 className="text-3xl font-bold mb-4">{children}</h1>;
          case "h2":
            return <h2 className="text-2xl font-semibold mb-3">{children}</h2>;
          case "h3":
            return <h3 className="text-xl font-semibold mb-2">{children}</h3>;
          case "blockquote":
            return <blockquote className="border-l-4 pl-4 italic muted">{children}</blockquote>;
          default:
            return <p>{children}</p>;
        }
      },
      list: ({ children, value }: any) => {
        const { listItem, level } = value || {};
        if (listItem === "number") return <ol className={`list-decimal ml-${Math.max(level || 0, 0) * 4}`}>{children}</ol>;
        return <ul className={`list-disc ml-${Math.max(level || 0, 0) * 4}`}>{children}</ul>;
      },
      listItem: ({ children }: any) => <li>{children}</li>,
    },
    marks: {
      strong: (props: any) => <strong>{props.children}</strong>,
      em: (props: any) => <em>{props.children}</em>,
      code: (props: any) => (
        <code className="bg-gray-100 px-1 rounded" style={{ color: "var(--text)" }}>
          {props.children}
        </code>
      ),
      link: ({ children, value }: any) => {
        const target = value?.href && String(value.href).startsWith("http") ? "_blank" : undefined;
        return (
          <a href={value?.href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className="accent">
            {children}
          </a>
        );
      },
    },
  } as any;

  return (
    <div className="prose max-w-none" style={{ color: "var(--text)" }}>
      <PortableText value={value} components={components} />
    </div>
  );
}
