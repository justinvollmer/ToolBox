import * as React from "react";
import {
  Box,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  styled,
  Switch,
  FormGroup,
  FormControlLabel,
  TextField,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  FolderRounded,
  DeleteRounded,
  SaveRounded,
  PasswordRounded,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { ThemeContext } from "../../components/theme/ThemeContext";

const { ipcRenderer } = window;

import "./Settings.scss";

function GeneralSettingsTab() {
  const [language, setLanguage] = React.useState("en");
  const [downloadFolder, setDownloadFolder] = React.useState("");

  React.useEffect(() => {
    ipcRenderer
      .invoke("get-setting", "defaultDownloadFolder")
      .then((storedFolder: string) => {
        if (storedFolder) {
          setDownloadFolder(storedFolder);
        }
      });
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value);
  };

  const handleChooseDownloadFolder = async () => {
    try {
      const folderPath = await ipcRenderer.invoke("open-directory-dialog");
      if (folderPath) {
        setDownloadFolder(folderPath);
        ipcRenderer.invoke("set-setting", "defaultDownloadFolder", folderPath);
      }
    } catch (error) {
      console.error("Failed to open directory dialog:", error);
    }
  };

  const handleClearDownloadFolder = async () => {
    setDownloadFolder("");
    ipcRenderer.invoke("delete-setting", "defaultDownloadFolder");
  };

  return (
    <>
      <Box sx={{ minWidth: 120, marginBottom: "10px" }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Language</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={language}
            label="Language"
            onChange={handleChange}
            disabled
          >
            <MenuItem value={"en"}>EN</MenuItem>
            <MenuItem value={"de"}>DE</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        <TextField
          label="Default Download Folder"
          size="small"
          sx={{ mr: 1, width: "500px" }}
          value={downloadFolder}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleChooseDownloadFolder}>
                  <FolderRounded />
                </IconButton>
                <IconButton onClick={handleClearDownloadFolder}>
                  <DeleteRounded />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
}

function AppearanceSettingsTab() {
  const theme = useTheme();
  const { toggleTheme } = React.useContext(ThemeContext);

  const initThemeValue: boolean = theme.palette.mode === "dark" ? true : false;
  const [themeSwitchState, setThemeSwitchState] =
    React.useState<boolean>(initThemeValue);

  const handleThemeSwitch = () => {
    setThemeSwitchState(!themeSwitchState);
    toggleTheme();
  };

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    "& .MuiSwitch-switchBase": {
      margin: 1,
      padding: 0,
      transform: "translateX(6px)",
      "&.Mui-checked": {
        color: "#fff",
        transform: "translateX(22px)",
        "& .MuiSwitch-thumb:before": {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            "#fff"
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
        },
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
      width: 32,
      height: 32,
      "&::before": {
        content: "''",
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
      },
    },
    "& .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      borderRadius: 20 / 2,
    },
  }));

  return (
    <FormGroup>
      <FormControlLabel
        control={<MaterialUISwitch sx={{ m: 1 }} />}
        label="Theme <Light | Dark>"
        checked={themeSwitchState}
        onChange={handleThemeSwitch}
      />
    </FormGroup>
  );
}

function EncryptionSettingsTab() {
  const [encryptionKey, setEncryptionKey] = React.useState("");
  const [textfieldType, setTextFieldType] = React.useState("password");

  React.useEffect(() => {
    ipcRenderer
      .invoke("get-setting", "defaultEncryptionKey")
      .then((storedKey: string) => {
        if (storedKey) {
          setEncryptionKey(storedKey);
        }
      });
  }, []);

  const handleEncryptionKeyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEncryptionKey(event.target.value);
  };

  const handleSetEncryptionKey = () => {
    ipcRenderer.invoke("set-setting", "defaultEncryptionKey", encryptionKey);
  };

  const handleClearEncryptionKey = () => {
    setEncryptionKey("");
    ipcRenderer.invoke("delete-setting", "defaultEncryptionKey");
  };

  const handleTextfieldTypeChange = () => {
    if (textfieldType == "password") {
      setTextFieldType("text");
      return;
    } else {
      setTextFieldType("password");
      return;
    }
  };

  return (
    <Box>
      <TextField
        label="Default Encryption Key"
        size="small"
        sx={{ mr: 1, width: "500px" }}
        value={encryptionKey}
        onChange={handleEncryptionKeyChange}
        type={textfieldType}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTextfieldTypeChange}>
                <PasswordRounded />
              </IconButton>
              <IconButton onClick={handleSetEncryptionKey}>
                <SaveRounded />
              </IconButton>
              <IconButton onClick={handleClearEncryptionKey}>
                <DeleteRounded />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}

export { GeneralSettingsTab, AppearanceSettingsTab, EncryptionSettingsTab };
