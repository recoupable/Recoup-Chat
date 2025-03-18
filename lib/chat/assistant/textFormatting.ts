/**
 * Formats text content by converting markdown syntax to HTML with proper styling
 */
export const formatText = (text: string): string => {
  try {
    const startsWithHeader = /^#\s+/.test(text);
    
    if (startsWithHeader) {
      const firstLineBreak = text.indexOf('\n');
      if (firstLineBreak > 0) {
        const headerText = text.substring(2, firstLineBreak).trim();
        const restOfText = text.substring(firstLineBreak + 1);
        
        const introParagraph = `<p class="my-4 leading-relaxed">${headerText}.</p>`;
        return introParagraph + formatTextContent(restOfText);
      }
    }
    
    return formatTextContent(text);
  } catch (error) {
    console.error('Error formatting text:', error);
    return `<p class="my-3 leading-relaxed">${text}</p>`;
  }
};

// Helper function to handle the actual text formatting
const formatTextContent = (text: string): string => {
  // Special case for music-related lists (artists, albums, songs)
  text = handleMusicLists(text);
  
  // Handle tables if present
  text = handleSimpleTables(text);
  
  let formattedText = text
    .replace(/^##\s+(.*?)$/gm, '<h2 class="text-lg font-semibold mt-6 mb-2 text-gray-800">$1</h2>')
    .replace(/^#\s+(.*?)$/gm, '<h1 class="text-xl font-bold mt-6 mb-3 text-gray-900">$1</h1>');

  // Handle code blocks
  formattedText = formattedText.replace(
    /```(?:(\w+)\n)?([\s\S]*?)```/g,
    (_, language, code) => {
      const langClass = language ? ` lang-${language}` : '';
      return `<pre class="bg-gray-100 rounded-md p-4 my-4 overflow-x-auto"><code class="text-sm font-mono${langClass}">${code.trim()}</code></pre>`;
    }
  );

  // Handle blockquotes with better styling for important notes
  formattedText = formattedText.replace(
    /(?:^|\n)>\s+(.*?)(?:\n|$)/g,
    (_, content) => {
      // Check if this is an important note/highlight
      if (content.toLowerCase().includes('note') || 
          content.toLowerCase().includes('important') ||
          content.toLowerCase().includes('key') ||
          content.toLowerCase().includes('highlight')) {
        return `<div class="bg-gray-50 border-l-2 border-gray-300 pl-4 py-2 my-4 rounded-r text-gray-700">${content}</div>\n`;
      }
      return `<blockquote class="pl-4 italic border-l-2 border-gray-300 my-4 py-1 text-gray-700">${content}</blockquote>\n`;
    }
  );

  // Handle horizontal rules
  formattedText = formattedText.replace(
    /(?:^|\n)---(?:\n|$)/g,
    '<hr class="my-6 border-t border-gray-200" />\n'
  );

  formattedText = formattedText
    .replace(/\n\s*\n/g, '</p><p class="my-3 leading-relaxed">');

  // Handle links
  formattedText = formattedText.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>'
  );

  // Handle inline code
  formattedText = formattedText.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 text-sm font-mono px-1.5 py-0.5 rounded">$1</code>'
  );

  // Enhanced list handling with spacing between items
  formattedText = formattedText.replace(
    /(?:^|\n)(?:- (.*?)(?:\n|$))+/g,
    (match) => {
      const items = match
        .split('\n')
        .filter((line) => line.startsWith('- '))
        .map((line) => {
          const content = line.replace(/^- /, '');
          // Check if this looks like an artist/song item
          if (/^[A-Za-z0-9\s&]+(,|:|–|-) /.test(content)) {
            const [name, description] = content.split(/(?:,|:|–|-) /, 2);
            return `<li class="leading-relaxed mb-2"><span class="font-semibold">${name}</span>: ${description || ''}</li>`;
          }
          return `<li class="leading-relaxed mb-2">${content}</li>`;
        })
        .join('\n');
      
      return `<ul class="list-disc pl-5 my-4 space-y-1">
        ${items}
      </ul>`;
    }
  );

  // Better ordered list presentation
  formattedText = formattedText.replace(
    /(?:^|\n)(?:\d+\.\s+(.*?)(?:\n|$))+/g,
    (match) => {
      const items = match
        .split('\n')
        .filter((line) => /^\d+\.\s+/.test(line))
        .map((line) => {
          const content = line.replace(/^\d+\.\s+/, '');
          // Check if this looks like a ranked item
          if (/^[A-Za-z0-9\s&]+(,|:|–|-) /.test(content)) {
            const [name, description] = content.split(/(?:,|:|–|-) /, 2);
            return `<li class="leading-relaxed mb-2"><span class="font-semibold">${name}</span>: ${description || ''}</li>`;
          }
          return `<li class="leading-relaxed mb-2">${content}</li>`;
        })
        .join('\n');
      
      return `<ol class="list-decimal pl-5 my-4 space-y-1">
        ${items}
      </ol>`;
    }
  );

  // Improved emphasis formatting with context detection
  formattedText = formattedText
    .replace(/\*\*(.*?)\*\*/g, (_, content) => {
      // If it's a number with % or an important metric, add special highlighting
      if (/^\d+%|\d+\s*%|increased|decreased|grew|fell|up|down/.test(content.toLowerCase())) {
        return `<strong class="font-semibold">${content}</strong>`;
      }
      return `<strong class="font-semibold">${content}</strong>`;
    })
    .replace(/__(.*?)__/g, '<strong class="font-semibold">$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/g, '<em class="italic">$1</em>')
    .replace(/(?<!_)_(?!_)(.*?)(?<!_)_(?!_)/g, '<em class="italic">$1</em>');

  if (
    !formattedText.startsWith('<h1') &&
    !formattedText.startsWith('<h2') &&
    !formattedText.startsWith('<ul') &&
    !formattedText.startsWith('<ol') &&
    !formattedText.startsWith('<p') &&
    !formattedText.startsWith('<pre') &&
    !formattedText.startsWith('<blockquote') &&
    !formattedText.startsWith('<hr') &&
    !formattedText.startsWith('<div') &&
    !formattedText.startsWith('<table')
  ) {
    formattedText = `<p class="my-3 leading-relaxed">${formattedText}</p>`;
  }

  // Remove the forced dividers after headers for a more natural look
  formattedText = formattedText.replace(
    /(<\/h[12]>)/g,
    '$1'
  );

  return formattedText;
};

// Helper function to detect and format music-related lists
const handleMusicLists = (text: string): string => {
  // Detect sections that look like lists of artists, songs, or albums
  const artistListPattern = /(?:^|\n)(?:- ([A-Za-z0-9\s&]+(?:,|:|–|-) .*?)(?:\n|$))+/g;
  
  return text.replace(artistListPattern, (match) => {
    if (match.includes('Top') || match.includes('Artist') || match.includes('Song') || match.includes('Album')) {
      const items = match
        .split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => {
          const content = line.replace(/^- /, '');
          // If this looks like "Name - Description" format
          if (/^[A-Za-z0-9\s&]+(,|:|–|-) /.test(content)) {
            const [name, description] = content.split(/(?:,|:|–|-) /, 2);
            return `<div class="flex flex-col my-1.5 p-2 rounded hover:bg-gray-50">
              <span class="font-semibold">${name}</span>
              <span class="text-gray-700">${description || ''}</span>
            </div>`;
          }
          return line;
        });
      
      // Only transform if we actually found artist/song patterns
      if (items.some(item => item.includes('<div class="flex'))) {
        return `<div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          ${items.join('\n')}
        </div>`;
      }
    }
    
    return match;
  });
};

// Helper function to handle simple markdown tables
const handleSimpleTables = (text: string): string => {
  // Check for markdown tables (rows starting with |)
  const tablePattern = /(?:^|\n)(\|[^\n]+\|(?:\n\|[^\n]+\|)+)(?:\n|$)/g;
  
  return text.replace(tablePattern, (match) => {
    const lines = match.trim().split('\n');
    
    // Need at least header and separator
    if (lines.length < 2) return match;
    
    // Check if second line is a separator row
    const isSeparator = /^\|[-:\| ]+\|$/.test(lines[1]);
    
    if (!isSeparator) return match;
    
    // Process the table
    const headerRow = lines[0];
    const headers = headerRow
      .split('|')
      .filter(cell => cell.trim() !== '')
      .map(cell => cell.trim());
    
    // Skip the separator row
    const dataRows = lines.slice(2);
    
    // Build the HTML table
    const tableHtml = `<div class="overflow-x-auto my-4">
      <table class="min-w-full border-collapse border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            ${headers.map(header => `<th class="px-4 py-2 text-left text-sm font-semibold">${header}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${dataRows.map(row => {
            const cells = row
              .split('|')
              .filter(cell => cell.trim() !== '')
              .map(cell => cell.trim());
            
            return `<tr class="border-t border-gray-200 hover:bg-gray-50">
              ${cells.map(cell => `<td class="px-4 py-2">${cell}</td>`).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
    
    return tableHtml;
  });
};
