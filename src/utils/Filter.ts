function splitText(text: string): string[] {
  return text.split("\n").map((e) => e.trim());
}

function removeEmptyLines(splittedLines: string[]): string[] {
  return splittedLines.filter((e) => e !== "");
}

function removeComments(splittedLines: string[]): string[] {
  return splittedLines.filter((e) => !e.startsWith("//"));
}

function removeDuplicateLines(splittedLines: string[]): string[] {
  return Array.from(new Set(splittedLines));
}

export { splitText, removeEmptyLines, removeComments, removeDuplicateLines };
