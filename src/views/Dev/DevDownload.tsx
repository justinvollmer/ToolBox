/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { download, downloadFromList } from "../../utils/DownloadManager";

import "./Dev.scss";

function DevDownload() {
  const [url, setUrl] = React.useState("https://i.imgur.com/jbKNByH.jpg");
  const [filename, setFilename] = React.useState("imageName");
  const [filetype, setFiletype] = React.useState("jpg");
  const [downloadFolder] = React.useState("./src/downloads");
  const [urlList, setUrlList] = React.useState<
    { url: string; filename: string; filetype: string }[]
  >([]);

  const handleDownload = async () => {
    try {
      await download(url, filename, downloadFolder, filetype);
    } catch (error: any) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleBulkDownload = async () => {
    try {
      await downloadFromList(urlList, downloadFolder);
    } catch (error: any) {
      console.log(`Error: ${error.message}`);
    }
  };

  const addToList = () => {
    setUrlList([...urlList, { url, filename, filetype }]);
    setUrl("");
    setFilename("");
  };

  return (
    <Container sx={{ margin: "25px" }}>
      <Typography variant="h4" gutterBottom className="unselectable">
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
          label="Filetype"
          value={filetype}
          onChange={(e) => setFiletype(e.target.value)}
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
    </Container>
  );
}

export default DevDownload;
