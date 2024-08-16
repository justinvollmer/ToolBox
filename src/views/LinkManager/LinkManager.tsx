/* eslint-disable no-useless-escape */
import * as React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SaveAsRoundedIcon from "@mui/icons-material/SaveAsRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import EnhancedEncryptionRoundedIcon from "@mui/icons-material/EnhancedEncryptionRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import FileUploadRoundedIcon from "@mui/icons-material/FileUploadRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";

import FilterDialog from "./FilterDialog";
import EncryptionDialog from "./EncryptionDialog";
import DownloadDialog from "./DownloadDialog";

const { ipcRenderer } = window;

import "./LinkManager.scss";

function LinkManager() {
  // SECTION - Textfield
  const [defaultValue, setDefaultValue] = React.useState("");
  const [text, setText] = React.useState("");
  const [textPriorChange, setTextPriorChange] = React.useState("");

  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [draggedText, setDraggedText] = React.useState("");

  const handleTextChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setText(event.target.value);

  React.useEffect(() => {
    ipcRenderer
      .invoke("get-setting", "defaultListContent")
      .then((storedList: string) => {
        if (storedList) {
          //const copyStoredList = storedList;
          setDefaultValue(storedList);
          setText(storedList);
          setTextPriorChange(storedList);
        }
      });
  }, []);

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
  }> => {
    const listFromText: Array<{
      id: number;
      url: string;
      filename: string;
      filetype: string;
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
      icon: <EditRoundedIcon />,
      name: "Edit",
      function: () => {
        handleEditMode();
        handleClose();
      },
    },
    {
      icon: <FileUploadRoundedIcon />,
      name: "Import",
      function: () => {
        openFileDialog();
      },
    },
    {
      icon: <SaveRoundedIcon />,
      name: "Export",
      function: () => {
        exportFile();
      },
    },
    {
      icon: <EnhancedEncryptionRoundedIcon />,
      name: "Encryption",
      function: () => {
        handleOpenEncryption();
      },
    },
    {
      icon: <DownloadRoundedIcon />,
      name: "Download Manager",
      function: () => {
        handleOpenDownloadManager();
      },
    },
  ];

  const editActions = [
    {
      icon: <SaveAsRoundedIcon />,
      name: "Save",
      function: () => {
        handleReadOnlyMode();
        handleClose();
      },
    },
    {
      icon: <ClearRoundedIcon />,
      name: "Cancel",
      function: () => {
        setText(textPriorChange);
        handleReadOnlyMode();
        handleClose();
      },
    },
    {
      icon: <RestartAltRoundedIcon />,
      name: "Reset",
      function: () => {
        setText(defaultValue);
        setTextPriorChange(defaultValue);
        handleReadOnlyMode();
        handleClose();
      },
    },
    {
      icon: <DeleteRoundedIcon />,
      name: "Clear",
      function: () => setText(""),
    },
    {
      icon: <FilterListRoundedIcon />,
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
            icon={<VisibilityRoundedIcon />}
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
            icon={<EditRoundedIcon />}
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
