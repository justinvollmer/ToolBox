import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";

import "./Settings.scss";

import {
  GeneralSettingsTab,
  AppearanceSettingsTab,
  EncryptionSettingsTab,
} from "./SettingsTabs";

interface SettingsTabProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function SettingsTabPanel({
  children,
  index,
  value,
  ...other
}: SettingsTabProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const [value, setValue] = React.useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleClose = () => {
    setValue(0);
    onClose();
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
      <DialogContent>
        <Box
          sx={{
            maxHeight: "60vh",
            overflow: "auto",
            display: "flex",
          }}
        >
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            orientation="vertical"
            variant="scrollable"
          >
            <Tab label="General" {...a11yProps(0)} />
            <Tab label="Appearance" {...a11yProps(1)} />
            <Tab label="Encryption" {...a11yProps(2)} />
          </Tabs>

          <SettingsTabPanel value={value} index={0}>
            <GeneralSettingsTab />
          </SettingsTabPanel>
          <SettingsTabPanel value={value} index={1}>
            <AppearanceSettingsTab />
          </SettingsTabPanel>
          <SettingsTabPanel value={value} index={2}>
            <EncryptionSettingsTab />
          </SettingsTabPanel>
        </Box>
        <DialogActions sx={{ display: "flex", justifyContent: "end" }}>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
