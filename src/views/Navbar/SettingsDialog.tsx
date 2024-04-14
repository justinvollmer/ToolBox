import * as React from "react";
import { Dialog, DialogTitle } from "@mui/material";

import "./SettingsDialog.scss";

interface Props {
  open: boolean;
  onClose: () => void;
}

function SettingsDialog({ open, onClose }: Props) {
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onClick={handleBackdropClick}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle className="unselectable">Settings</DialogTitle>
    </Dialog>
  );
}

export default SettingsDialog;
