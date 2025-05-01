export function replaceLatexDelimiters(content: string): string {
    if (!content) return "";
    return content
        .replace(/\\\[/g, "$")
        .replace(/\\\]/g, "$")
        .replace(/\\\(/g, "$$")
        .replace(/\\\)/g, "$$")
        .replace(/\(\\\(/g, "$")
        .replace(/\\\)\)/g, "$");
}
