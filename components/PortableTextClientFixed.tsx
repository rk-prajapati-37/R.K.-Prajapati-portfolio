"use client";

import React from "react";
import { PortableText } from "@portabletext/react";
import { toPlainWords, toPlainFirstParagraph } from "../lib/portableText";

type Props = {
  value?: any;
  className?: string;
  truncate?: boolean;
  words?: number;
  showFirstParagraph?: boolean;
};

export default function PortableTextClientFixed({ value, className, truncate, words = 55, showFirstParagraph }: Props) {
  if (!value) return null;
  const isString = typeof value === "string";

  if (truncate) {
    if (isString) {
      return <div className={className}>{showFirstParagraph ? (value.split(/\n{2,}/)[0] || value) : toPlainWords(value, words)}</div>;
    }
    return <div className={className}>{showFirstParagraph ? toPlainFirstParagraph(value) : toPlainWords(value, words)}</div>;
  }

  const components = {
    block: {
      h1: ({ children }: any) => <h1 className="text-2xl font-bold my-2">{children}</h1>,
      h2: ({ children }: any) => <h2 className="text-xl font-semibold my-2">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-lg font-semibold my-2">{children}</h3>,
      normal: ({ children }: any) => <p>{children}</p>,
      blockquote: ({ children }: any) => <blockquote className="pl-4 border-l-2">{children}</blockquote>,
    },
    list: {
      bullet: ({ children }: any) => <ul className="ml-6 list-disc">{children}</ul>,
      number: ({ children }: any) => <ol className="ml-6 list-decimal">{children}</ol>,
    },
    listItem: ({ children }: any) => <li>{children}</li>,
    marks: {
      strong: ({ children }: any) => <strong>{children}</strong>,
      em: ({ children }: any) => <em>{children}</em>,
      code: ({ children }: any) => <code className="bg-gray-100 p-1 rounded text-sm font-mono">{children}</code>,
      link: ({ children, value }: any) => {
        const target = value?.href?.startsWith("http") ? "_blank" : undefined;
        return (
          <a href={value?.href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined} className="text-blue-600 underline">
            {children}
          </a>
        );
      },
    },
  } as any;

  return (
    <div className={className}>
      {isString ? (
        <div className="prose max-w-none" style={{ color: "var(--text)" }}>
          {value.split(/\n{2,}/).map((p: string, i: number) => (
            <p key={i}>{p.split(/\n/).map((line, li) => (<React.Fragment key={li}>{li > 0 && <br />}{line}</React.Fragment>))}</p>
          ))}
        </div>
      ) : (
        <div className="prose max-w-none" style={{ color: "var(--text)" }}>
          <PortableText value={value} components={components} />
        </div>
      )}
    </div>
  );
}
