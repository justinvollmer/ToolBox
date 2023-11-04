import * as React from "react";
import {
  Box,
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  TextField,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

function Editor() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [editMode, activateEdit] = React.useState(false);
  const handleEditMode = () => activateEdit(true);
  const handleReadOnlyMode = () => activateEdit(false);

  const readOnlyActions = [
    {
      icon: <EditIcon />,
      name: "Edit",
      function: () => {
        handleEditMode();
        handleClose();
      },
    },
    { icon: <SaveIcon />, name: "Save" },
    { icon: <LockIcon />, name: "Encryption" },
    { icon: <DownloadIcon />, name: "Download Manager" },
  ];

  const editActions = [
    {
      icon: <VisibilityIcon />,
      name: "Ready Only",
      function: () => {
        handleReadOnlyMode();
        handleClose();
      },
    },
    { icon: <RestartAltIcon />, name: "Reset" },
    { icon: <ClearAllIcon />, name: "Clear" },
  ];

  return (
    <Box sx={{ height: "100%", transform: "translateZ(0px)", flexGrow: 1 }}>
      <TextField
        label="List Content"
        multiline
        rows={30}
        defaultValue="https://example.com/"
        placeholder="One URL per row"
        variant="filled"
        fullWidth
        disabled={!editMode}
      />
      <Backdrop open={open} />
      {!editMode && (
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          icon={<VisibilityIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          hidden={editMode}
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
          icon={<EditIcon />}
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
