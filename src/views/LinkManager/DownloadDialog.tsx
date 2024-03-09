import * as React from "react";
import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";

import "./LinkManager.scss";

import { downloadFromList } from "../../utils/DownloadManager";

interface DownloadDialogProps {
  initList: {
    id: number;
    url: string;
    filename: string;
    filetype: string;
    progress: string;
  }[];
  open: boolean;
  onClose: () => void;
}

function DownloadDialog({ initList, open, onClose }: DownloadDialogProps) {
  // useState hook to manage downloads state
  const [downloads, setDownloads] = React.useState(initList);
  const [downloadFolder] = React.useState("./src/downloads");
  const [delayInSeconds, setDelayInSeconds] = React.useState(1);

  React.useEffect(() => {
    if (open) {
      setDownloads(initList);
    }
  }, [open, initList]);

  const handleStartDownload = () => {
    console.log("Starting download...");

    const strippedDownloads = downloads.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ id, progress, ...rest }) => rest
    );

    downloadFromList(strippedDownloads, downloadFolder);
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  // Handle filename change
  const handleFilenameChange = (
    id: number,
    newFilename: string,
    newFiletype: string
  ) => {
    const updatedDownloads = downloads.map((download) => {
      if (download.id === id) {
        return { ...download, filename: newFilename, filetype: newFiletype };
      }
      return download;
    });
    setDownloads(updatedDownloads);
  };

  const onCancel = () => {
    setDownloads(initList);
    setDelayInSeconds(1);
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      onClick={handleBackdropClick}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle>Download Manager</DialogTitle>
      <DialogContent>
        <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell sx={{ maxWidth: 200 }}>URL</TableCell>{" "}
                  {/* Longer width for url */}
                  <TableCell sx={{ width: "30%" }}>Filename</TableCell>{" "}
                  {/* Medium width for filename */}
                  <TableCell sx={{ width: "10%" }}>Filetype</TableCell>{" "}
                  {/* Smaller width for filetype */}
                  <TableCell>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {downloads.map((download) => (
                  <TableRow key={download.id}>
                    <TableCell>{download.id}</TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {download.url}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={download.filename || ""}
                        placeholder="filename"
                        onChange={(e) =>
                          handleFilenameChange(
                            download.id,
                            e.target.value,
                            download.filetype
                          )
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={download.filetype || ""}
                        placeholder="jpg"
                        onChange={(e) =>
                          handleFilenameChange(
                            download.id,
                            download.filename,
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>{download.progress}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            label="Interval (seconds/image)"
            size="small"
            sx={{ mr: 1 }}
            type="number"
            value={delayInSeconds}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setDelayInSeconds(value);
              } else {
                setDelayInSeconds(0);
              }
            }}
          />
          <Button
            variant="outlined"
            onClick={handleStartDownload}
            sx={{ ml: 1 }}
          >
            Start Download
          </Button>
          <Button variant="outlined" onClick={onCancel} sx={{ ml: 1 }}>
            Cancel
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Status: Please check the URLs first!
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default DownloadDialog;
