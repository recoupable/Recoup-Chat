/**
 * Formats text content by converting markdown syntax to HTML and formatting lists
 */
export const formatText = (text: string): string => {
  return (
    text
      // Convert headers (# Header) to styled headers
      .replace(/^###\s+(.*?)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^##\s+(.*?)$/gm, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>')
      .replace(/^#\s+(.*?)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
      
      // Convert **text** to <strong>text</strong> (bold)
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      
      // Convert *text* or _text_ to <em>text</em> (italics)
      .replace(/(\*|_)(.*?)\1/g, '<em class="italic">$2</em>')
      
      // Convert `code` to <code>code</code>
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      
      // Format bullet lists
      .replace(
        /^[*\-•]\s+(.*?)(?:\n|$)/gm,
        '<div class="flex gap-2 my-1 ml-1"><span class="min-w-[12px]">•</span><span>$1</span></div>'
      )
      
      // Format numbered lists while preserving original numbers
      .replace(
        /(?:^\d+\.\s+[^\n]+\n?)+/gm,
        (match) => `<div class="flex flex-col gap-1 my-3">
        ${match
          .split("\n")
          .filter(Boolean)
          .map(
            (line) => `<div class="flex gap-2 ml-1">
            <span class="min-w-[20px] font-medium">${line.match(/^\d+/)?.[0]}.</span>
            <span>${line.replace(/^\d+\.\s+/, "")}</span>
          </div>`
          )
          .join("\n")}
      </div>`
      )
      
      // Add paragraph spacing
      .replace(/\n\n/g, '</p><p class="my-3">')
      
      // Format horizontal rules
      .replace(/^---+$/gm, '<hr class="my-4 border-t border-gray-200" />')
      
      // Wrap content in paragraphs if not already wrapped
      .replace(/^(?!<h[1-6]|<div|<p|<hr)(.+)$/gm, '<p class="my-2">$1</p>')
  );
};
