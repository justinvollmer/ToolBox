/* eslint-disable no-useless-escape */
import * as React from "react";
import {
  Box,
  Button,
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import {
  SaveRounded,
  SaveAsRounded,
  ClearRounded,
  EnhancedEncryptionRounded,
  DeleteRounded,
  DownloadRounded,
  FileUploadRounded,
  RestartAltRounded,
  VisibilityRounded,
  EditRounded,
  FilterListRounded,
} from "@mui/icons-material/";

import FilterDialog from "./FilterDialog";
import EncryptionDialog from "./EncryptionDialog";
import DownloadDialog from "./DownloadDialog";

const { ipcRenderer } = window;

import "./LinkManager.scss";

function LinkManager() {
  // SECTION - Textfield
  const defaultValue =
    "https://example.com/image.jpg\nhttps://example.com/image.jpg\nhttps://example.com/image.jpg";

  const [text, setText] = React.useState(defaultValue);
  const [textPriorChange, setTextPriorChange] = React.useState(defaultValue);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [draggedText, setDraggedText] = React.useState("");

  const handleTextChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setText(event.target.value);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirmClose = () => setConfirmOpen(false);
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setDraggedText((loadEvent.target?.result as string).trim());
        setConfirmOpen(true);
      };
      reader.readAsText(file);
    }
  };
  const handleConfirmReplace = () => {
    setText(draggedText);
    setConfirmOpen(false);
  };
  // !SECTION

  // SECTION - Editor Modes
  const [editMode, activateEdit] = React.useState(false);
  const handleEditMode = () => {
    setTextPriorChange(text);
    activateEdit(true);
  };
  const handleReadOnlyMode = () => {
    activateEdit(false);
  };
  // !SECTION

  // SECTION - Filters
  const [openFilterDialog, setOpenFilterDialog] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState("none");

  const handleOpenFilter = () => setOpenFilterDialog(true);

  const handleCloseFilter = (value: string) => {
    setOpenFilterDialog(false);
    setSelectedFilter(value);
  };
  // !SECTION

  // SECTION - Encryption
  const [openEncryptionDialog, setOpenEncryptionDialog] = React.useState(false);

  const handleOpenEncryption = () => setOpenEncryptionDialog(true);

  const handleCloseEncryption = () => {
    setOpenEncryptionDialog(false);
  };
  // !SECTION

  // SECTION - DownloadManager
  const [isDownloadManagerOpen, setOpenDownloadDialog] = React.useState(false);
  const [initialDownloadsList, setInitialDownloadsList] = React.useState([
    {
      id: 1,
      url: "COULD NOT LOAD",
      filename: "COULD NOT LOAD",
      filetype: "COULD NOT LOAD",
      progress: "COULD NOT LOAD",
    },
  ]);

  const getFileTypeFromUrl = (url: string): string => {
    // Remove trailing slash if it exists
    const urlWithoutTrailingSlash = url.endsWith("/") ? url.slice(0, -1) : url;

    // Regular expression to match the file extension
    const regex = /\.([0-9a-z]+)(?:[\?#]|$)/i;

    // Extract the file extension
    const match = urlWithoutTrailingSlash.match(regex);
    let fileType = match ? match[1] : "jpg";

    // Special handling for webp files
    if (fileType === "webp") {
      fileType = "jpg";
    }

    return fileType;
  };

  const transformTextToList = (
    rawText: string
  ): Array<{
    id: number;
    url: string;
    filename: string;
    filetype: string;
    progress: string;
  }> => {
    const listFromText: Array<{
      id: number;
      url: string;
      filename: string;
      filetype: string;
      progress: string;
    }> = [];

    const textSeperatedByLine = rawText.trim().split("\n");
    let int: number = 1;

    textSeperatedByLine.forEach((line) => {
      if (line != "") {
        const lineSeperatedByValue = line.split(" ", 2);

        const url = lineSeperatedByValue[0].trim();

        const filetype = getFileTypeFromUrl(url);

        if (lineSeperatedByValue.length < 2) {
          lineSeperatedByValue.push("");
        }

        listFromText.push({
          id: int++,
          url: url,
          filename: "",
          filetype: filetype,
          progress: "NOT READY",
        });
      }
    });

    return listFromText;
  };

  const handleOpenDownloadManager = () => {
    const list = transformTextToList(text);
    setInitialDownloadsList(list);
    setOpenDownloadDialog(true);
  };

  const handleCloseDownloadManager = () => {
    setOpenDownloadDialog(false);
  };
  // !SECTION

  // SECTION - File Import
  const openFileDialog = async () => {
    try {
      const content = await ipcRenderer.invoke("open-file-dialog");
      if (content && content.length > 0) {
        setText(content.trim());
      }
    } catch (error) {
      console.error("Error opening file dialog:", error);
    }
  };
  // !SECTION

  // SECTION - File Export
  const exportFile = async () => {
    try {
      const success = await ipcRenderer.invoke("save-file-dialog", text);
      if (success) {
        console.log("File saved successfully");
      } else {
        console.error("File was not saved");
      }
    } catch (error) {
      console.error("Error exporting file:", error);
    }
  };
  // !SECTION

  // SECTION - Speed Dial Buttons
  const readOnlyActions = [
    {
      icon: <EditRounded />,
      name: "Edit",
      function: () => {
        handleEditMode();
        handleClose();
      },
    },
    {
      icon: <FileUploadRounded />,
      name: "Import",
      function: () => {
        openFileDialog();
      },
    },
    {
      icon: <SaveRounded />,
      name: "Export",
      function: () => {
        exportFile();
      },
    },
    {
      icon: <EnhancedEncryptionRounded />,
      name: "Encryption",
      function: () => {
        handleOpenEncryption();
      },
    },
    {
      icon: <DownloadRounded />,
      name: "Download Manager",
      function: () => {
        handleOpenDownloadManager();
      },
    },
  ];

  const editActions = [
    {
      icon: <SaveAsRounded />,
      name: "Save",
      function: () => {
        handleReadOnlyMode();
        handleClose();
      },
    },
    {
      icon: <ClearRounded />,
      name: "Cancel",
      function: () => {
        setText(textPriorChange);
        handleReadOnlyMode();
        handleClose();
      },
    },
    {
      icon: <RestartAltRounded />,
      name: "Reset",
      function: () => {
        setText(defaultValue);
        setTextPriorChange(defaultValue);
        handleReadOnlyMode();
        handleClose();
      },
    },
    {
      icon: <DeleteRounded />,
      name: "Clear",
      function: () => setText(""),
    },
    {
      icon: <FilterListRounded />,
      name: "Filter",
      function: () => {
        handleOpenFilter();
      },
    },
  ];
  // !SECTION

  return (
    <div
      style={{
        margin: "25px",
      }}
    >
      <FilterDialog
        text={text}
        setText={setText}
        selectedValue={selectedFilter}
        open={openFilterDialog}
        onClose={handleCloseFilter}
      />
      <EncryptionDialog
        text={text}
        setText={setText}
        open={openEncryptionDialog}
        onClose={handleCloseEncryption}
      />
      <DownloadDialog
        initList={initialDownloadsList}
        open={isDownloadManagerOpen}
        onClose={handleCloseDownloadManager}
      />
      <Box
        sx={{
          height: "calc(100vh - 114px)",
          transform: "translateZ(0px)",
          flexGrow: 1,
        }}
      >
        <div
          style={{
            maxHeight: "100%",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <TextField
            label="List Content"
            multiline
            minRows={26}
            placeholder="One URL per row"
            variant="filled"
            fullWidth
            InputProps={{
              readOnly: !editMode,
            }}
            value={text}
            onChange={handleTextChange}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          <Dialog open={confirmOpen} onClose={handleConfirmClose}>
            <DialogTitle>Confirm Replacement</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to replace the current content?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleConfirmClose}>Cancel</Button>
              <Button onClick={handleConfirmReplace} color="primary" autoFocus>
                Replace
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Backdrop open={open} />
        {!editMode && (
          <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<VisibilityRounded />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            hidden={editMode}
            FabProps={{ color: "success" }}
          >
            {readOnlyActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={action.function}
              />
            ))}
          </SpeedDial>
        )}
        {editMode && (
          <SpeedDial
            ariaLabel="SpeedDial tooltip example"
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            icon={<EditRounded />}
            onClose={handleClose}
            onOpen={handleOpen}
            open={open}
            hidden={!editMode}
          >
            {editActions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                tooltipOpen
                onClick={action.function}
              />
            ))}
          </SpeedDial>
        )}
      </Box>
    </div>
  );
}

export default LinkManager;
