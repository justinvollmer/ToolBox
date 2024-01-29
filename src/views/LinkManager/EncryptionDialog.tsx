import * as React from "react";
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  InputAdornment,
  Typography,
} from "@mui/material";

import { KeyRounded } from "@mui/icons-material/";

import {
  encrypt,
  decrypt,
  exportKeyToString,
  importStringToKey,
  generateCryptoKey,
} from "../../utils/Encryption";

import "./LinkManager.scss";

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
              rows={15}
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
              rows={15}
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

export default EncryptionDialog;
