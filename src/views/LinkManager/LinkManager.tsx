import * as React from "react";
import {
  Avatar,
  Box,
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  TextField,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import {
  SaveRounded,
  SaveAsRounded,
  ClearRounded,
  LockRounded,
  DeleteRounded,
  DownloadRounded,
  FileUploadRounded,
  RestartAltRounded,
  VisibilityRounded,
  EditRounded,
  FilterListRounded,
  CommentRounded,
  DifferenceRounded,
  CheckBoxOutlineBlankRounded,
  AutoAwesomeMotionRounded,
} from "@mui/icons-material/";

import { blue, green, red } from "@mui/material/colors";

import "./LinkManager.scss";

interface FilterDialogProps {
  text: string;
  setText: (value: string) => void;
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function FilterDialog({
  text,
  setText,
  open,
  selectedValue,
  onClose,
}: FilterDialogProps) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    let splittedText: string[] = text.split("\n").map((e) => e.trim());

    if (value == "emptyLines" || value == "applyAll") {
      splittedText = splittedText.filter((e) => e !== "");
    }

    if (value == "comments" || value == "applyAll") {
      splittedText = splittedText.filter((e) => !e.startsWith("//"));
    }

    if (value == "dulicateLines" || value == "applyAll") {
      splittedText = Array.from(new Set(splittedText));
    }

    setText(splittedText.join("\n"));

    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select a filter</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("emptyLines")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <CheckBoxOutlineBlankRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Remove all empty lines" />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("comments")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <CommentRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Remove all comments"
              secondary="Double slash comments"
            />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("dulicateLines")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <DifferenceRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Remove all duplicate lines"
              secondary="Includes empty lines / spaces"
            />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("applyAll")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: green[100], color: green[600] }}>
                <AutoAwesomeMotionRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Apply all" />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("cancel")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: red[100], color: red[600] }}>
                <ClearRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Cancel" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

function LinkManager() {
  // SECTION - Textfield
  const defaultValue =
    "https://example.com/\nhttps://example.com/\nhttps://example.com/";

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

  // SECTION - File Import
  const openFileDialog = async () => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".txt, .json";

      fileInput.addEventListener("change", async (event) => {
        const file = (event.target as HTMLInputElement)?.files?.[0];

        if (file) {
          try {
            const content = await readFileAsync(file);
            setText(content);
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
    { icon: <SaveRounded />, name: "Export" },
    { icon: <LockRounded />, name: "Encryption" },
    { icon: <DownloadRounded />, name: "Download Manager" },
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
