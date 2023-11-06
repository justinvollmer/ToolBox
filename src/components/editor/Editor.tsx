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
  LockRounded,
  DeleteRounded,
  DownloadRounded,
  FileUploadRounded,
  RestartAltRounded,
  VisibilityRounded,
  EditRounded,
} from "@mui/icons-material/";

function Editor() {
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
      function: () => setText(defaultValue),
    },
    {
      icon: <DeleteRounded />,
      name: "Clear",
      function: () => setText(""),
    },
  ];

  return (
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
  );
}

export default Editor;
