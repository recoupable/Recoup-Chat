/**
 * Formats text content by converting markdown syntax to HTML and formatting lists
 */
export const formatText = (text: string): string => {
  return (
    text
      // Format discography-style content with pipe separators
      .replace(
        /^(#+ .*Discography.*)\n+(.+\n)*((?:\| .+\n)+)/gm,
        (match, header, intro, tableContent) => {
          // Process the table-like content with pipes
          const rows = tableContent.trim().split('\n');
          
          // Create a formatted discography section
          return `
            ${header}
            ${intro || ''}
            <div class="overflow-x-auto my-4">
              <table class="min-w-full border-collapse text-sm">
                <tbody>
                  ${rows.map((row: string) => {
                    const cells = row.split('|').filter(Boolean).map((cell: string) => cell.trim());
                    return `
                      <tr class="border-b border-gray-100">
                        ${cells.map((cell: string) => `<td class="py-2 px-3">${cell}</td>`).join('')}
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `;
        }
      )
      
      // Format tables with pipe syntax
      .replace(
        /^\|(.*)\|\s*\n\|([-|]+)\|\s*\n((^\|.*\|\s*\n)+)/gm,
        (match, headerRow, separatorRow, bodyRows) => {
          const headers = headerRow
            .split('|')
            .filter(Boolean)
            .map((cell: string) => cell.trim());
          
          const rows = bodyRows
            .trim()
            .split('\n')
            .map((row: string) => 
              row
                .split('|')
                .filter(Boolean)
                .map((cell: string) => cell.trim())
            );
          
          return `
            <div class="overflow-x-auto my-4">
              <table class="min-w-full border-collapse text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    ${headers.map((header: string) => 
                      `<th class="py-2 px-3 text-left font-semibold">${header}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((row: string[]) => 
                    `<tr class="border-b border-gray-100">
                      ${row.map((cell: string) => 
                        `<td class="py-2 px-3">${cell}</td>`
                      ).join('')}
                    </tr>`
                  ).join('')}
                </tbody>
              </table>
            </div>
          `;
        }
      )
      
      // Format simple tables with dash and pipe separators
      .replace(
        /^([^\n]+)\n([-|]+)\n([\s\S]+?)(?=\n\n|$)/gm,
        (match, headerRow, separatorRow, bodyRows) => {
          // Check if this is actually a table format
          if (!/\|/.test(headerRow) || !/\|/.test(bodyRows)) {
            return match;
          }
          
          const headers = headerRow
            .split('|')
            .map((cell: string) => cell.trim());
          
          const rows = bodyRows
            .trim()
            .split('\n')
            .map((row: string) => 
              row
                .split('|')
                .map((cell: string) => cell.trim())
            );
          
          return `
            <div class="overflow-x-auto my-4">
              <table class="min-w-full border-collapse text-sm">
                <thead>
                  <tr class="border-b border-gray-200">
                    ${headers.map((header: string) => 
                      `<th class="py-2 px-3 text-left font-semibold">${header}</th>`
                    ).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${rows.map((row: string[]) => 
                    `<tr class="border-b border-gray-100">
                      ${row.map((cell: string) => 
                        `<td class="py-2 px-3">${cell}</td>`
                      ).join('')}
                    </tr>`
                  ).join('')}
                </tbody>
              </table>
            </div>
          `;
        }
      )
      
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
      .replace(/^(?!<h[1-6]|<div|<p|<hr|<table)(.+)$/gm, '<p class="my-2">$1</p>')
  );
};
