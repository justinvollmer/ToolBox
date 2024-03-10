import * as React from "react";
import { TextField, Button } from "@mui/material/";
const { ipcRenderer } = window;

const DevIPC = () => {
  const [message, setMessage] = React.useState("");

  const sendMessage = () => {
    if (message != "") {
      ipcRenderer.send("send-message", message);
      setMessage("");
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <TextField
        label="Message"
        variant="outlined"
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginBottom: "20px" }}
      />
      <Button variant="contained" color="primary" onClick={sendMessage}>
        Send Message
      </Button>
    </div>
  );
};

export default DevIPC;
