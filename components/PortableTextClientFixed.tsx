"use client";

import React from "react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

type Props = {
  value?: any;
  className?: string;
  truncate?: boolean;
  words?: number;
  showFirstParagraph?: boolean;
};

function toPlainText(value: any): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return String(value);

  const parts: string[] = [];
  for (const block of value) {
    if (!block) continue;
    if (typeof block === "string") {
      parts.push(block);
      continue;
    }
    if (Array.isArray((block as any).children)) {
      parts.push(
        (block as any).children
          .map((c: any) => (c?.text ? String(c.text) : ""))
          .join("")
      );
      continue;
    }
    if ((block as any).text) {
      parts.push(String((block as any).text));
      continue;
    }
  }
  return parts.join("\n\n");
}

export { toPlainText };

function toPlainWords(value: any, wordCount = 30): string {
  const text = toPlainText(value || "");
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(" ") + "…";
}

function toPlainFirstParagraph(value: any): string {
  if (!value) return "";
  if (typeof value === "string") {
    return value.split(/\n{2,}/)[0] || value;
  }
  const text = toPlainText(value);
  return text.split(/\n{2,}/)[0] || text;
}

export default function PortableTextClientFixed({
  value,
  className,
  truncate,
  words = 55,
  showFirstParagraph,
}: Props) {
  if (!value) return null;

  const isString = typeof value === "string";

  if (truncate) {
    if (isString) {
      return (
        <div className={className}>
          {showFirstParagraph
            ? (value as string).split(/\n{2,}/)[0] || (value as string)
            : toPlainWords(value, words)}
        </div>
      );
    }
    return (
      <div className={className}>
        {showFirstParagraph
          ? toPlainFirstParagraph(value)
          : toPlainWords(value, words)}
      </div>
    );
  }

  const components = {
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-2xl font-bold my-2">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-xl font-semibold my-2">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-lg font-semibold my-2">{children}</h3>
      ),
      normal: ({ children }: any) => <p>{children}</p>,
      blockquote: ({ children }: any) => (
        <blockquote className="pl-4 border-l-2 border-gray-300">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="ml-6 list-disc">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="ml-6 list-decimal">{children}</ol>
      ),
    },
    listItem: ({ children }: any) => <li>{children}</li>,
    marks: {
      strong: ({ children }: any) => <strong>{children}</strong>,
      em: ({ children }: any) => <em>{children}</em>,
      code: ({ children }: any) => (
        <code className="bg-gray-100 p-1 rounded text-sm font-mono">
          {children}
        </code>
      ),
      link: ({ children, value }: any) => {
        const target = value?.href?.startsWith("http") ? "_blank" : undefined;
        return (
          <a
            href={value?.href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className="text-blue-600 underline hover:text-blue-800"
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }: any) => {
        const { asset, alt, caption } = value;
        const { width, height } = asset?.metadata?.dimensions || {};
        return (
          <figure className="my-8 flex flex-col items-center">
            <div className="relative w-full max-w-4xl">
              <Image
                src={asset?.url}
                alt={alt || "Blog image"}
                width={width || 800}
                height={height || 600}
                className="rounded-xl shadow-lg border border-gray-200 object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            {caption && (
              <figcaption className="text-sm text-gray-600 mt-3 text-center italic max-w-md">
                {caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  } as any;

  return (
    <div
      className={`${className || ""} prose max-w-none`}
      style={{ color: "var(--text)" }}
    >
      {isString ? (
        <div>
          {(value as string).split(/\n{2,}/).map((paragraph: string, pIdx: number) => (
            <p key={pIdx}>
              {paragraph.split(/\n/).map((line: string, lIdx: number) => (
                <React.Fragment key={lIdx}>
                  {lIdx > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </p>
          ))}
        </div>
      ) : (
        <PortableText value={value} components={components} />
      )}
    </div>
  );
}
