/**
 * Minimal Markdown-to-HTML renderer for blog post content.
 * Handles: h1–h3, bold, italic, inline code, images, hr, paragraphs.
 * No external deps — keeps the bundle light.
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseInline(text: string): string {
  return text
    // Images: ![alt](url)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) =>
      `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="rounded-xl w-full my-6 object-cover" loading="lazy" />`
    )
    // Links: [text](url)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) =>
      `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">${escapeHtml(text)}</a>`
    )
    // Bold+italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-muted/60 text-primary text-sm px-1.5 py-0.5 rounded font-mono">$1</code>');
}

export function renderMarkdown(raw: string): string {
  // Normalise line endings
  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const blocks = text.split(/\n{2,}/);
  const html: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      html.push('<hr class="border-border my-8" />');
      continue;
    }

    // Headings
    const h3 = trimmed.match(/^### (.+)/);
    if (h3) {
      html.push(`<h3 class="text-lg font-display font-bold mt-8 mb-3 text-foreground">${parseInline(h3[1])}</h3>`);
      continue;
    }
    const h2 = trimmed.match(/^## (.+)/);
    if (h2) {
      html.push(`<h2 class="text-2xl font-display font-bold mt-10 mb-4 text-foreground">${parseInline(h2[1])}</h2>`);
      continue;
    }
    const h1 = trimmed.match(/^# (.+)/);
    if (h1) {
      html.push(`<h1 class="text-3xl font-display font-bold mt-10 mb-4 text-foreground">${parseInline(h1[1])}</h1>`);
      continue;
    }

    // Standalone image
    const img = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      html.push(
        `<figure class="my-8"><img src="${escapeHtml(img[2])}" alt="${escapeHtml(img[1])}" class="rounded-xl w-full object-cover" loading="lazy" />${img[1] ? `<figcaption class="text-center text-xs text-muted-foreground mt-2">${escapeHtml(img[1])}</figcaption>` : ""}</figure>`
      );
      continue;
    }

    // Unordered list (lines starting with - or *)
    const lines = trimmed.split("\n");
    if (lines.every((l) => /^[-*] /.test(l.trim()))) {
      const items = lines
        .map((l) => `<li class="mb-1 text-muted-foreground leading-relaxed">${parseInline(l.replace(/^[-*] /, "").trim())}</li>`)
        .join("");
      html.push(`<ul class="list-disc list-outside pl-5 my-4 space-y-1">${items}</ul>`);
      continue;
    }

    // Ordered list
    if (lines.every((l) => /^\d+\. /.test(l.trim()))) {
      const items = lines
        .map((l) => `<li class="mb-1 text-muted-foreground leading-relaxed">${parseInline(l.replace(/^\d+\. /, "").trim())}</li>`)
        .join("");
      html.push(`<ol class="list-decimal list-outside pl-5 my-4 space-y-1">${items}</ol>`);
      continue;
    }

    // Paragraph (join any inner newlines with a space)
    const para = trimmed.replace(/\n/g, " ");
    html.push(`<p class="text-muted-foreground leading-relaxed mb-4 text-justify hyphens-auto">${parseInline(para)}</p>`);
  }

  return html.join("\n");
}

/** Estimate reading time in minutes */
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
