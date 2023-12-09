/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";

import {
  encrypt,
  decrypt,
  importStringToKey,
  exportKeyToString,
} from "../../utils/Encryption";

function DevEncryption() {
  const [originalText, setOriginalText] = useState("");
  const [keyInput, setKeyInput] = useState("");
  const [encryptedText, setEncryptedText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [encryptedTextInput, setEncryptedTextInput] = useState("");

  const handleEncrypt = async () => {
    try {
      // Import the key from the input
      const key = await importStringToKey(keyInput);

      // Encrypt the original text
      const encrypted = await encrypt(originalText, key);
      setEncryptedText(encrypted);

      // Clear the decrypted text
      setDecryptedText("");
    } catch (err: any) {
      console.error("Encryption error:", err.message);
    }
  };

  const handleDecryptText = async () => {
    try {
      // Import the key from the input
      const key = await importStringToKey(keyInput);

      // Decrypt the encrypted text input
      const decryptedTextInput = await decrypt(encryptedTextInput, key);
      setDecryptedText(decryptedTextInput);
    } catch (err: any) {
      console.error("Decryption error:", err.message);
    }
  };

  const handleGenerateKey = async () => {
    try {
      // Generate a random key
      const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
      );

      // Export the key to a string
      const keyString = await exportKeyToString(key);

      // Set the key input field
      setKeyInput(keyString);
    } catch (err: any) {
      console.error("Key generation error:", err.message);
    }
  };

  return (
    <div>
      <TextField
        label="Original Text"
        value={originalText}
        onChange={(e) => setOriginalText(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <TextField
        label="Key"
        value={keyInput}
        onChange={(e) => setKeyInput(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />

      <Button onClick={handleGenerateKey} variant="contained" color="primary">
        Generate Key
      </Button>

      <Button onClick={handleEncrypt} variant="contained" color="primary">
        Encrypt
      </Button>

      <Typography variant="h6">Encrypted Output:</Typography>
      <TextField
        value={encryptedText}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        InputProps={{
          readOnly: true,
        }}
      />

      <TextField
        label="Encrypted Text Input"
        value={encryptedTextInput}
        onChange={(e) => setEncryptedTextInput(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />

      <Button onClick={handleDecryptText} variant="contained" color="primary">
        Decrypt Text
      </Button>

      <Typography variant="h6">Decrypted Output:</Typography>
      <TextField
        value={decryptedText}
        fullWidth
        margin="normal"
        multiline
        rows={4}
        InputProps={{
          readOnly: true,
        }}
      />

      <Button onClick={handleDecryptText} variant="contained" color="primary">
        Decrypt with Original Key
      </Button>
    </div>
  );
}

export default DevEncryption;
