import _ from "lodash";

function splitLines(text: string): string[] {
  const splittedText: string[] = text.split("\n");
  return splittedText;
}

function removeEmptyLines(text: string | string[]): string {
  if (typeof text == "string") {
    console.log("ist String");
  } else if (Array.isArray(text)) {
    console.log("ist String[]");
  }

  return "nichts";
}

export { splitLines, removeEmptyLines };
