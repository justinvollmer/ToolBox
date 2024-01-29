const getFileTypeFromUrl = (url: string): string => {
  // Regular expression to match the file extension
  const regex = /\.([0-9a-z]+)(?:[\?#]|$)/i;

  // Extract the file extension
  const match = url.match(regex);
  let fileType = match ? match[1] : "jpg";

  // Special handling for webp files
  if (fileType === "webp") {
    fileType = "jpg";
  }

  return fileType;
};

console.log(getFileTypeFromUrl("https://example.com/jojo.jpg"));
