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
  DialogContent,
  DialogActions,
  Button,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  InputAdornment,
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
  CommentRounded,
  DifferenceRounded,
  CheckBoxOutlineBlankRounded,
  AutoAwesomeMotionRounded,
  KeyRounded,
} from "@mui/icons-material/";

import { blue, green, red } from "@mui/material/colors";

import {
  encrypt,
  decrypt,
  exportKeyToString,
  importStringToKey,
  generateCryptoKey,
} from "../../utils/Encryption";

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

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Dialog onClose={handleClose} open={open} onClick={handleBackdropClick}>
      <DialogTitle className="unselectable">Select a filter</DialogTitle>
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

interface EncryptionProps {
  text: string;
  setText: (value: string) => void;
  open: boolean;
  onClose: () => void;
}

function EncryptionDialog({ text, setText, open, onClose }: EncryptionProps) {
  const [translatedText, setTranslatedText] = React.useState("");
  const [key, setKey] = React.useState("");
  const [savingAbility, setSavingDisabled] = React.useState(true);

  const handleClose = () => {
    onClose();
    setKey("");
    setTranslatedText("");
    setSavingDisabled(true);
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleKeyChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => setKey(event.target.value);

  const handleApplyChanges = () => {
    handleClose();
    setText(translatedText);
  };

  const handleGenerateKey = async () => {
    const newKey: CryptoKey = await generateCryptoKey();
    const newKeyString: string = await exportKeyToString(newKey);
    setKey(newKeyString);
  };

  const handleEncrypt = async () => {
    const cryptoKey: CryptoKey = await importStringToKey(key);

    const result: string = await encrypt(text, cryptoKey);

    setTranslatedText(result);

    if (savingAbility) {
      setSavingDisabled(false);
    }
  };

  const handleDecrypt = async () => {
    const cryptoKey: CryptoKey = await importStringToKey(key);

    const result: string = await decrypt(text, cryptoKey);

    setTranslatedText(result);

    if (savingAbility) {
      setSavingDisabled(false);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      maxWidth="lg"
      fullWidth
      onClick={handleBackdropClick}
    >
      <DialogTitle className="unselectable">
        Encryption / Decryption
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <Typography className="unselectable" variant="button">
              Original Text
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={20}
              value={text}
              InputProps={{ readOnly: true }}
              sx={{ marginBottom: "16px" }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Typography className="unselectable" variant="button">
              Translated Text
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={20}
              value={translatedText}
              InputProps={{ readOnly: true }}
              sx={{ marginBottom: "16px" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className="unselectable" variant="button">
              ENCRYPTION KEY
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              value={key}
              onChange={handleKeyChange}
              placeholder="Leave empty to use default encryption key from the settings"
              sx={{ marginBottom: "16px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <KeyRounded />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            color="warning"
            style={{ marginLeft: "8px" }}
            onClick={handleGenerateKey}
          >
            Generate Encryption Key
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "8px" }}
            onClick={handleEncrypt}
          >
            Encrypt
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "8px" }}
            onClick={handleDecrypt}
          >
            Decrypt
          </Button>
          <Button
            variant="contained"
            color="success"
            style={{ marginLeft: "8px" }}
            onClick={handleApplyChanges}
            disabled={savingAbility}
          >
            Apply Changes
          </Button>
          <Button
            variant="contained"
            color="inherit"
            style={{ marginLeft: "8px" }}
            onClick={handleClose}
          >
            Cancel
          </Button>
        </DialogActions>
      </DialogContent>
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

  // SECTION - Encryption
  const [openEncryptionDialog, setOpenEncryptionDialog] = React.useState(false);

  const handleOpenEncryption = () => setOpenEncryptionDialog(true);

  const handleCloseEncryption = () => {
    setOpenEncryptionDialog(false);
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
      <EncryptionDialog
        text={text}
        setText={setText}
        open={openEncryptionDialog}
        onClose={handleCloseEncryption}
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
