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
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function FilterDialog({ open, selectedValue, onClose }: FilterDialogProps) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
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
            <ListItemText primary="Remove all duplicate lines" />
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

  const [editMode, activateEdit] = React.useState(false);
  const handleEditMode = () => {
    setTextPriorChange(text);
    activateEdit(true);
  };
  const handleReadOnlyMode = () => {
    activateEdit(false);
  };

  const [openFilterDialog, setOpenFilterDialog] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState("none");

  const handleOpenFilter = () => setOpenFilterDialog(true);

  const handleCloseFilter = (value: string) => {
    setOpenFilterDialog(false);
    setSelectedFilter(value);
  };

  const readOnlyActions = [
    {
      icon: <EditRounded />,
      name: "Edit",
      function: () => {
        handleEditMode();
        handleClose();
      },
    },
    { icon: <FileUploadRounded />, name: "Import" },
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

  return (
    <div
      style={{
        margin: "25px",
      }}
    >
      <FilterDialog
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
