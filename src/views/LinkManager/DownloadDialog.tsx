/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";

import {
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
  Paper,
} from "@mui/material";

import {
  FolderRounded,
  DeleteRounded,
  PublishedWithChangesRounded,
  OpenInNewRounded,
  PolicyRounded,
} from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";

import "./LinkManager.scss";

import { downloadFromList } from "../../utils/DownloadManager";

const { ipcRenderer } = window;

interface DownloadDialogProps {
  initList: {
    id: number;
    url: string;
    filename: string;
    filetype: string;
  }[];
  open: boolean;
  onClose: () => void;
}

function DownloadDialog({ initList, open, onClose }: DownloadDialogProps) {
  const theme = useTheme();

  const [downloads, setDownloads] = React.useState(initList);
  const [downloadFolder, setDownloadFolder] = React.useState("");
  const [delaySec, setDelaySec] = React.useState(1);

  const [browser, setBrowser] = React.useState("");

  const [isEligibleForDownload, setEligibleForDownload] = React.useState(false);
  const [isLocked, setLocked] = React.useState(false);
  const [isDownloading, setDownloadingState] = React.useState(false);

  const defaultStatusText: string = "Please click on 'Check list' first.";
  const [statusText, setStatusText] = React.useState(defaultStatusText);
  const [statusTextColor, setStatusTextColor] = React.useState("black");
  React.useEffect(() => {
    if (theme.palette.mode === "dark") {
      setStatusTextColor("white");
    }
  }, [theme, setStatusTextColor]);

  const [downloadCounter, setDownloadCounter] = React.useState(0);
  ipcRenderer.on("increase-progress", () => {
    setDownloadCounter(downloadCounter + 1);
    setStatusText(
      "Downloading... (" + downloadCounter + "/" + downloads.length + ")"
    );
  });

  const [preferredFilename, setPreferredFilename] = React.useState("");
  const [targetedFiletype, setTargetedFiletype] = React.useState("");
  const [replacementFiletype, setReplacementFiletype] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setDownloads(initList);
    }
  }, [open, initList]);

  const resetToDefaultDownloadfolder = () => {
    ipcRenderer
      .invoke("get-setting", "defaultDownloadFolder")
      .then((storedFolder: string) => {
        if (storedFolder) {
          setDownloadFolder(storedFolder);
        } else {
          setDownloadFolder("");
        }
      });
  };

  const resetToDefaultBrowser = () => {
    ipcRenderer
      .invoke("get-setting", "defaultBrowser")
      .then((storedBrowser: string) => {
        if (storedBrowser) {
          setBrowser(storedBrowser);
        } else {
          setBrowser("msedge");
        }
      });
  };

  React.useEffect(() => {
    resetToDefaultDownloadfolder();
  }, []);

  React.useEffect(() => {
    resetToDefaultBrowser();
  }, []);

  const handleCheck = () => {
    const missingFilenameItem = downloads.find((file) => file.filename === "");
    const illegalCharsPattern = /[<>:"/\\|?*]/;
    const illegalFilenameItem = downloads.find((file) =>
      illegalCharsPattern.test(file.filename)
    );
    const folderPath = /^(([a-zA-Z]:\\)|\/)?([\w .-]+\\?\/?)+$/;

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
    } else if (!downloadFolder || !folderPath.test(downloadFolder)) {
      setStatusText("The download folder is empty or invalid!");
      setStatusTextColor("red");
      return;
    } else if (delaySec < 0) {
      setStatusText("A negative interval cannot be set!");
      setStatusTextColor("red");
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
    setDownloadingState(true);

    setStatusText(
      "Downloading... (" + downloadCounter + "/" + downloads.length + ")"
    );
    setStatusTextColor("orange");

    try {
      await downloadFromList(downloads, downloadFolder, delaySec);

      setStatusText("Download finished successfully");
      setDownloadCounter(0);
      setStatusTextColor("green");
    } catch (error) {
      setStatusText("Download failed");
      setStatusTextColor("red");
    }

    setReady(false);
    setDownloadingState(false);
  };

  const handleStopDownload = () => {
    ipcRenderer.send("request-cancel-download");
    setDownloadingState(false);
  };

  const handleSetAllFilenames = () => {
    const updatedDownloads = downloads.map((file) => ({
      ...file,
      filename: preferredFilename,
    }));
    setDownloads(updatedDownloads);
    setPreferredFilename("");
  };

  const handleClearAllFilenames = () => {
    const updatedDownloads = downloads.map((file) => ({
      ...file,
      filename: "",
    }));
    setDownloads(updatedDownloads);
  };

  const handleChooseDownloadFolder = async () => {
    try {
      const folderPath = await ipcRenderer.invoke("open-directory-dialog");
      if (folderPath) {
        setDownloadFolder(folderPath);
      }
    } catch (error) {
      console.error("Failed to open directory dialog:", error);
    }
  };

  const handleClearDownloadFolder = () => {
    setDownloadFolder("");
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

  // Handle filetype change
  const handleFiletypeChange = () => {
    const updatedDownloads = downloads.map((download) => {
      if (download.filetype === targetedFiletype) {
        return { ...download, filetype: replacementFiletype };
      }
      return download;
    });
    setDownloads(updatedDownloads);
    setTargetedFiletype("");
    setReplacementFiletype("");
  };

  // Open in browser
  const handleOpenInBrowser = (url: string, incognito: boolean | undefined) => {
    if (incognito == undefined) {
      incognito = false;
    }

    ipcRenderer.invoke("openInBrowser", url, browser, incognito);
  };

  const onQuit = () => {
    setDownloads(initList);
    setDelaySec(1);
    setStatusText(defaultStatusText);
    setStatusTextColor("black");
    setReady(false);
    setPreferredFilename("");
    setTargetedFiletype("");
    setReplacementFiletype("");
    resetToDefaultDownloadfolder();
    setDownloadCounter(0);
    onClose();
  };
  return (
    <Dialog
      open={open}
      onClose={onQuit}
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
                  </TableCell>
                  <TableCell sx={{ width: "5%" }} className="unselectable">
                    Actions
                  </TableCell>
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
                    <TableCell>
                      <Box display="flex" justifyContent="center">
                        <Tooltip title="Open in browser" placement="top-start">
                          <IconButton
                            onClick={() =>
                              handleOpenInBrowser(download.url, false)
                            }
                          >
                            <OpenInNewRounded />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title="Open in incognito browser"
                          placement="top-start"
                        >
                          <IconButton
                            onClick={() =>
                              handleOpenInBrowser(download.url, true)
                            }
                          >
                            <PolicyRounded />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
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
              Check & lock list
            </Button>
          )}
          {!isDownloading && (
            <Button
              variant="contained"
              color="success"
              onClick={handleStartDownload}
              sx={{ ml: 1 }}
              disabled={!isEligibleForDownload}
            >
              Start Download
            </Button>
          )}
          {isDownloading && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleStopDownload}
              sx={{ ml: 1 }}
            >
              Stop Download
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            onClick={onQuit}
            sx={{ ml: 1 }}
            disabled={isLocked}
          >
            Quit
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            label="New Filename"
            size="small"
            sx={{ mr: 1 }}
            disabled={isLocked}
            value={preferredFilename}
            onChange={(e) => setPreferredFilename(e.target.value)}
          />
          <Button
            variant="outlined"
            sx={{ ml: 1 }}
            onClick={handleSetAllFilenames}
            disabled={isLocked || preferredFilename.trim() === ""}
          >
            Set Filename for All
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 1 }}
            onClick={handleClearAllFilenames}
            disabled={isLocked}
          >
            Clear All Filenames
          </Button>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <Typography>Replace</Typography>
          <TextField
            label="Targeted Filetype"
            size="small"
            sx={{ mr: 1, ml: 1 }}
            value={targetedFiletype}
            placeholder="png"
            disabled={isLocked}
            onChange={(e) => setTargetedFiletype(e.target.value)}
          />
          <Typography>with</Typography>
          <TextField
            label="Replacement Filetype"
            size="small"
            sx={{ mr: 1, ml: 1 }}
            value={replacementFiletype}
            placeholder="jpg"
            disabled={isLocked}
            onChange={(e) => setReplacementFiletype(e.target.value)}
          />
          <Tooltip title="Replace" placement="top-start">
            <IconButton disabled={isLocked} onClick={handleFiletypeChange}>
              <PublishedWithChangesRounded />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            label="Download Folder"
            size="small"
            sx={{ mr: 1 }}
            value={downloadFolder}
            disabled={isLocked}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    disabled={isLocked}
                    onClick={handleChooseDownloadFolder}
                  >
                    <FolderRounded />
                  </IconButton>
                  <IconButton
                    disabled={isLocked}
                    onClick={handleClearDownloadFolder}
                  >
                    <DeleteRounded />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
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
