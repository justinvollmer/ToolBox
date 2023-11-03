import * as React from "react";
import {
  Container,
  Paper,
  Button,
  Box,
  Typography,
  Modal,
} from "@mui/material";
import { Link } from "react-router-dom";
import Editor from "../../components/editor/Editor";

import "./LinkManager.scss";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "75vh",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  greenButton: {
    backgroundColor: "#4CAF50",
    color: "white",
  },
  blueButton: {
    backgroundColor: "#2196F3",
    color: "white",
  },
  grayButton: {
    backgroundColor: "#323232",
    color: "white",
  },
  header: {
    marginBottom: "16px",
    fontWeight: "bold",
  },
};

function LinkManagerMenu() {
  const [open, setOpen] = React.useState(true);
  const handleClose = () => setOpen(false);

  return (
    <Modal
      open={open}
      onClose={undefined}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Container maxWidth="sm" sx={styles.container}>
        <Paper elevation={3} sx={{ padding: "16px", textAlign: "center" }}>
          <Typography className="unselectable" variant="h4" sx={styles.header}>
            Link-Manager
          </Typography>
          <Box sx={styles.buttonContainer}>
            <Button
              variant="contained"
              sx={{ ...styles.greenButton, width: "100%" }}
              onClick={handleClose}
            >
              Create
            </Button>
            <Button
              variant="contained"
              sx={{ ...styles.blueButton, width: "100%" }}
            >
              Import
            </Button>
            <Button
              variant="contained"
              sx={{ ...styles.grayButton, width: "100%" }}
              component={Link}
              to={"../"}
            >
              Go Back
            </Button>
          </Box>
        </Paper>
      </Container>
    </Modal>
  );
}

function LinkManager() {
  return (
    <>
      <br />
      <LinkManagerMenu />
      <Container>
        <Editor />
      </Container>
    </>
  );
}

export default LinkManager;
