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
  const [delaySec, setDelaySec] = React.useState(1);

  const [isEligibleForDownload, setEligibleForDownload] = React.useState(false);
  const [isLocked, setLocked] = React.useState(false);

  const defaultStatusText: string = "Please click on 'Check list' first.";
  const [statusText, setStatusText] = React.useState(defaultStatusText);
  const [statusTextColor, setStatusTextColor] = React.useState("black");

  React.useEffect(() => {
    if (open) {
      setDownloads(initList);
    }
  }, [open, initList]);

  const handleCheck = () => {
    const missingFilenameItem = downloads.find((file) => file.filename === "");
    const illegalCharsPattern = /[<>:"/\\|?*]/;
    const illegalFilenameItem = downloads.find((file) =>
      illegalCharsPattern.test(file.filename)
    );

    if (missingFilenameItem) {
      setStatusText("There are entries with missing filenames!");
      setStatusTextColor("red");
      return;
    } else if (illegalFilenameItem) {
      setStatusText(
        "There are entries with illegal characters in their filenames!"
      );
      setStatusTextColor("red");
      return;
    } else {
      setStatusText("Ready to start the download!");
      setStatusTextColor("green");
      setReady(true);
    }
  };

  const handleUnlock = () => {
    setStatusText(defaultStatusText);
    setStatusTextColor("black");
    setReady(false);
  };

  const setReady = (isReady: boolean) => {
    setEligibleForDownload(isReady);
    setLocked(isReady);
  };

  const handleStartDownload = async () => {
    setReady(true);
    setEligibleForDownload(false);

    setStatusText("Downloading...");
    setStatusTextColor("orange");

    const strippedDownloads = downloads.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ progress, ...rest }) => rest
    );

    try {
      await downloadFromList(strippedDownloads, downloadFolder, delaySec);

      setStatusText("Download finished successfully");
      setStatusTextColor("green");
    } catch (error) {
      setStatusText("Download failed");
      setStatusTextColor("red");
    }

    setReady(false);
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
    setDelaySec(1);
    setStatusText(defaultStatusText);
    setStatusTextColor("black");
    setReady(false);
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
      <DialogTitle className="unselectable">Download Manager</DialogTitle>
      <DialogContent>
        <Box sx={{ maxHeight: "60vh", overflow: "auto" }}>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell className="unselectable">ID</TableCell>
                  <TableCell sx={{ maxWidth: 200 }} className="unselectable">
                    URL
                  </TableCell>{" "}
                  {/* Longer width for url */}
                  <TableCell sx={{ width: "30%" }} className="unselectable">
                    Filename
                  </TableCell>{" "}
                  {/* Medium width for filename */}
                  <TableCell sx={{ width: "10%" }} className="unselectable">
                    Filetype
                  </TableCell>{" "}
                  {/* Smaller width for filetype */}
                  <TableCell className="unselectable">Progress</TableCell>
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
                        disabled={isLocked}
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
                        disabled={isLocked}
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
            disabled={isLocked}
            type="number"
            value={delaySec}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setDelaySec(value);
              } else {
                setDelaySec(0);
              }
            }}
          />
          {isLocked && isEligibleForDownload && (
            <Button variant="outlined" onClick={handleUnlock} sx={{ ml: 1 }}>
              Unlock
            </Button>
          )}
          {!isLocked && (
            <Button variant="outlined" onClick={handleCheck} sx={{ ml: 1 }}>
              Check list
            </Button>
          )}
          <Button
            variant="outlined"
            onClick={handleStartDownload}
            sx={{ ml: 1 }}
            disabled={!isEligibleForDownload}
          >
            Start Download
          </Button>
          <Button variant="outlined" onClick={onCancel} sx={{ ml: 1 }}>
            Cancel
          </Button>
        </Box>
        <Typography
          variant="body2"
          sx={{ mt: 2, color: statusTextColor }}
          className="unselectable"
        >
          Status: {statusText}
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default DownloadDialog;
