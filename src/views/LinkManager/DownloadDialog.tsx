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

interface DownloadDialogProps {
  initList: {
    id: number;
    link: string;
    filename: string;
    progress: string;
  }[];
  open: boolean;
  onClose: () => void;
}

function DownloadDialog({ initList, open, onClose }: DownloadDialogProps) {
  // useState hook to manage downloads state
  const [downloads, setDownloads] = React.useState(initList);

  React.useEffect(() => {
    if (open) {
      setDownloads(initList);
    }
  }, [open, initList]);

  const handleCheckLinks = () => {
    console.log("Checking links...");
  };

  const handleStartDownload = () => {
    console.log("Starting download...");
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  // Handle filename change
  const handleFilenameChange = (id: number, newFilename: string) => {
    const updatedDownloads = downloads.map((download) => {
      if (download.id === id) {
        return { ...download, filename: newFilename };
      }
      return download;
    });
    setDownloads(updatedDownloads);
  };

  const onCancel = () => {
    setDownloads(initList);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      onClick={handleBackdropClick}
      maxWidth="md"
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
                  <TableCell>Link</TableCell>
                  <TableCell>Filename</TableCell>
                  <TableCell>Progress</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {downloads.map((download) => (
                  <TableRow key={download.id}>
                    <TableCell>{download.id}</TableCell>
                    <TableCell>{download.link}</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={download.filename}
                        placeholder="filename"
                        onChange={(e) =>
                          handleFilenameChange(download.id, e.target.value)
                        }
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
          />
          <Button variant="outlined" onClick={handleCheckLinks}>
            Check Links for compatibility
          </Button>
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
          Status: Please check the links first!
        </Typography>
      </DialogContent>
    </Dialog>
  );
}

export default DownloadDialog;
