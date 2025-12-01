export function toPlainText(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const parts: string[] = [];
    for (const block of value) {
      if (!block) continue;
      if (typeof block === "string") {
        parts.push(block);
        continue;
      }
      // For block types with children
      if (block.children && Array.isArray(block.children)) {
        const childrenText = block.children.map((c: any) => (c?.text ? String(c.text) : "")).join("");
        parts.push(childrenText);
      } else if (block.text) {
        parts.push(String(block.text));
      } else {
        // Fallback: JSON stringify small piece
        try {
          const t = JSON.stringify(block);
          parts.push(t);
        } catch (err) {
          // ignore
        }
      }
    }
    return parts.join("\n\n");
  }
  try {
    return String(value);
  } catch (err) {
    return "";
  }
}

export function toPlainWords(value: any, wordCount = 30) {
  const text = toPlainText(value || "");
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(" ") + "…";
}

export function toPlainFirstParagraph(value: any) {
  if (!value) return "";
  // If string, prefer first paragraph separated by 2+ newlines
  if (typeof value === "string") {
    const paragraphs = value.split(/\n{2,}/);
    return paragraphs.length ? paragraphs[0] : value;
  }
  // If array (portable text blocks), find first block with non-empty text
  if (Array.isArray(value)) {
    for (const block of value) {
      if (!block) continue;
      if (typeof block === "string") {
        const trimmed = block.trim();
        if (trimmed) return trimmed;
        continue;
      }
      // If block has children with text
      if (block.children && Array.isArray(block.children)) {
        const childrenText = block.children.map((c: any) => (c?.text ? String(c.text) : "")).join("");
        if (childrenText.trim()) return childrenText;
      }
      // If it directly has a text field
      if (block.text) {
        const t = String(block.text);
        if (t.trim()) return t;
      }
    }
    // fallback to joined plain text
    return toPlainText(value).split(/\n{2,}/)[0] || toPlainText(value);
  }
  return toPlainText(value);
}