"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none font-mono
      prose-headings:text-text-primary prose-headings:font-mono prose-headings:font-bold
      prose-h2:text-sm prose-h2:border-b prose-h2:border-border prose-h2:pb-1 prose-h2:mb-3
      prose-h3:text-xs prose-h3:text-accent
      prose-p:text-text-primary prose-p:text-xs prose-p:leading-relaxed
      prose-li:text-text-primary prose-li:text-xs
      prose-strong:text-accent
      prose-code:text-accent prose-code:bg-bg prose-code:px-1 prose-code:rounded prose-code:text-[10px]
      prose-table:text-xs
      prose-th:text-text-secondary prose-th:font-normal prose-th:border-border
      prose-td:border-border prose-td:text-text-primary
      prose-blockquote:border-accent prose-blockquote:text-text-secondary prose-blockquote:italic
      prose-a:text-accent prose-a:no-underline hover:prose-a:underline
    ">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
