/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { download, downloadFromList } from "../../utils/DownloadManager";

function DevDownload() {
  const [url, setUrl] = React.useState("");
  const [filename, setFilename] = React.useState("");
  const [downloadFolder, setDownloadFolder] = React.useState("./downloads/");
  const [urlList, setUrlList] = React.useState<
    { url: string; filename: string }[]
  >([]);
  const [status, setStatus] = React.useState("");

  const handleDownload = async () => {
    try {
      await download(url, filename, downloadFolder);
      setStatus(`Downloaded ${filename}`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleBulkDownload = async () => {
    try {
      await downloadFromList(urlList, downloadFolder);
      setStatus(`Bulk download complete`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const addToList = () => {
    setUrlList([...urlList, { url, filename }]);
    setUrl("");
    setFilename("");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dev Download Test Page
      </Typography>
      <Box>
        <TextField
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Filename"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Download Folder"
          value={downloadFolder}
          onChange={(e) => setDownloadFolder(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" color="primary" onClick={addToList}>
          Add to List
        </Button>
        <Button variant="contained" color="secondary" onClick={handleDownload}>
          Download
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleBulkDownload}
        >
          Bulk Download
        </Button>
      </Box>
      <Typography variant="body1">{status}</Typography>
    </Container>
  );
}

export default DevDownload;
