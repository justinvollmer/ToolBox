import * as React from "react";
import {
  Box,
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  TextField,
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

import "./LinkManager.scss";

function LinkManager() {
  // SECTION - Textfield
  const defaultValue =
    "https://example.com/image.jpg\nhttps://example.com/image.jpg\nhttps://example.com/image.jpg";

  const [text, setText] = React.useState(defaultValue);
  const [textPriorChange, setTextPriorChange] = React.useState(defaultValue);

  const handleTextChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setText(event.target.value);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
      link: "COULD NOT LOAD",
      filename: "COULD NOT LOAD",
      progress: "NOT READY",
    },
  ]);

  const transformTextToList = (
    rawText: string
  ): Array<{
    id: number;
    link: string;
    filename: string;
    progress: string;
  }> => {
    const listFromText: Array<{
      id: number;
      link: string;
      filename: string;
      progress: string;
    }> = [];

    const textSeperatedByLine = rawText.trim().split("\n");
    let int: number = 1;

    textSeperatedByLine.forEach((line) => {
      if (line != "") {
        const lineSeperatedByValue = line.split(" ", 2);

        if (lineSeperatedByValue.length < 2) {
          lineSeperatedByValue.push("");
        }

        listFromText.push({
          id: int++,
          link: lineSeperatedByValue[0],
          filename: lineSeperatedByValue[1],
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
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".txt";

      fileInput.addEventListener("change", async (event) => {
        const file = (event.target as HTMLInputElement)?.files?.[0];

        if (file) {
          try {
            const content = await readFileAsync(file);
            setText(content.trim());
          } catch (error) {
            console.error("Error reading file:", error);
          }
        }
      });

      fileInput.click();
    } catch (error) {
      console.error("Error opening file dialog:", error);
    }
  };

  const readFileAsync = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          reject(new Error("Failed to read file as text."));
        } else {
          resolve(reader.result as string);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  // !SECTION

  // SECTION - File Export
  const exportFile = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "file.txt";
    link.click();
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
          />
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
