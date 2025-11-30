"use client";

import { PortableText } from "@portabletext/react";

export default function PortableTextClient({ value }: { value: any }) {
  if (!value) return null;

  // If description is stored as a plain string in Sanity, render directly
  // utility: convert URLs and emails in a line to anchor nodes
  const parseInlineMarkdown = (text: string) => {
    // Convert simple markdown inline: **bold**, *italic*, `code`
    const parts: any[] = [];
    let rest = String(text);

    // Helper to push text or element
    const pushText = (t: string) => {
      if (!t) return;
      parts.push(t);
    };

    // We'll parse for bold (**text**), italic (*text*), code (`text`), and inline links handled by buildLineNodes
    const mdRegex = /\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = mdRegex.exec(rest))) {
      if (match.index > lastIndex) pushText(rest.slice(lastIndex, match.index));
      if (match[1]) parts.push(<strong key={match.index}>{match[1]}</strong>);
      else if (match[2]) parts.push(<em key={match.index}>{match[2]}</em>);
      else if (match[3]) parts.push(<code key={match.index} className="bg-gray-100 px-1 rounded">{match[3]}</code>);
      lastIndex = (mdRegex.lastIndex || 0);
    }
    if (lastIndex < rest.length) pushText(rest.slice(lastIndex));
    return parts.length ? parts : [text];
  };

  const buildLineNodes = (line: string) => {
    const nodes: any[] = [];
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const mailRegex = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;

    let lastIndex = 0;
    // Process URLs first
    line.replace(urlRegex, (match, url, offset) => {
      const before = line.slice(lastIndex, offset);
      if (before) nodes.push(before);
      nodes.push(
        <a key={`url-${offset}`} href={url} target="_blank" rel="noopener noreferrer" className="accent">
          {url}
        </a>
      );
      lastIndex = offset + match.length;
      return match;
    });
    const rest = line.slice(lastIndex);
    // For emails in the rest of the string
    if (mailRegex.test(rest)) {
      let idx = 0;
      rest.replace(mailRegex, (match, email, offset) => {
        const before = rest.slice(idx, offset);
        if (before) nodes.push(before);
        nodes.push(
          <a key={`mail-${offset}`} href={`mailto:${email}`} className="accent">
            {email}
          </a>
        );
        idx = offset + match.length;
        return match;
      });
      const tail = rest.slice(idx);
      if (tail) nodes.push(...parseInlineMarkdown(tail));
    } else if (!nodes.length) {
      // Nothing matched; parse inline markdown for bold/italic/code
      nodes.push(...parseInlineMarkdown(line));
    } else if (nodes.length && typeof nodes[nodes.length - 1] === "string") {
      // there are nodes and the last node may not include the tail
      const tail = rest;
      if (tail) nodes.push(...parseInlineMarkdown(tail));
    }
    return nodes;
  };

  if (typeof value === "string") {
    // Preserve newlines — split into paragraphs by two newlines, convert single newline to <br>
    const paragraphs = value.split(/\n{2,}/).map((p) => p.split(/\n/));

    return (
      <div className="prose max-w-none" style={{ color: "var(--text)" }}>
        {paragraphs.map((lines, idx) => {
          // Detect if this paragraph is a simple list where every line starts with a list marker
          const listLike = lines.length > 0 && lines.every((ln) => /^\s*([*\-]\s+|\d+\.\s+)/.test(ln));
          const isHeadingCandidate = (ln: string) => {
            const t = String(ln).trim();
            if (!t) return false;
            if (/^[A-Z0-9 \-()]+$/.test(t) && t.length <= 40) return true; // all uppercase short line
            if (/:$/.test(t) && t.length <= 60) return true; // ends with colon
            const words = t.split(/\s+/);
            const titleCaseCount = words.filter((w) => /^[A-Z][a-z]/.test(w)).length;
            if (titleCaseCount >= Math.max(1, Math.floor(words.length / 2)) && words.length <= 6) return true;
            return false;
          };
          // Single-line paragraph as a heading candidate
          const singleHeading = lines.length === 1 && isHeadingCandidate(lines[0]);
          // Detect pattern: heading line followed by list items
          const headingThenList =
            lines.length > 1 &&
            /^\s*([*\-]\s+|\d+\.\s+)/.test(lines[1]) &&
            !/^\s*([*\-]|\d+\.|#)/.test(lines[0]);
          if (headingThenList) {
            const heading = lines[0].trim();
            const listLines = lines.slice(1);
            const isNumbered = listLines.every((ln) => /^\s*\d+\.\s+/.test(ln));
            return (
              <div key={`hl-${idx}`}>
                <h3 className="text-xl font-semibold mb-2">{heading}</h3>
                {isNumbered ? (
                  <ol className="ml-6 list-decimal">
                    {listLines.map((line, i) => (
                      <li key={i}>{parseInlineMarkdown(String(line).replace(/^\s*\d+\.\s+/, ""))}</li>
                    ))}
                  </ol>
                ) : (
                  <ul className="ml-6 list-disc">
                    {listLines.map((line, i) => (
                      <li key={i}>{parseInlineMarkdown(String(line).replace(/^\s*[\*-]\s+/, ""))}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }
          if (singleHeading) {
            // render as heading
            return <h3 key={`sh-${idx}`} className="text-xl font-semibold mb-2">{lines[0]}</h3>;
          }
          if (listLike) {
            const isNumbered = lines.every((ln) => /^\s*\d+\.\s+/.test(ln));
            return (
              <div key={`list-${idx}`}>
                {isNumbered ? (
                  <ol className="ml-6 list-decimal">
                    {lines.map((line, i) => (
                      <li key={i}>{String(line).replace(/^\s*\d+\.\s+/, "")}</li>
                    ))}
                  </ol>
                ) : (
                  <ul className="ml-6 list-disc">
                    {lines.map((line, i) => (
                      <li key={i}>{String(line).replace(/^\s*[\*-]\s+/, "")}</li>
                    ))}
                  </ul>
                )}
              </div>
            );
          }

          return (
            <p key={idx}>
              {lines.reduce((acc: any[], line: string, i: number) => {
                  if (i > 0) acc.push(<br key={`br-${i}`} />);
                  const nodes = buildLineNodes(line);
                  nodes.forEach((n) => acc.push(n));
                  return acc;
                }, [])}
            </p>
          );
        })}
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
