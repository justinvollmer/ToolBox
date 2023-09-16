import { Container, Paper, Button, Box, Typography } from "@mui/material";

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
  header: {
    marginBottom: "16px",
    fontWeight: "bold",
  },
};

function LinkManagerMenu() {
  return (
    <Container maxWidth="sm" sx={styles.container}>
      <Paper elevation={3} sx={{ padding: "16px", textAlign: "center" }}>
        <Typography className="unselectable" variant="h4" sx={styles.header}>
          Link-Manager
        </Typography>
        <Box sx={styles.buttonContainer}>
          <Button
            variant="contained"
            sx={{ ...styles.greenButton, width: "100%" }}
          >
            Create
          </Button>
          <Button
            variant="contained"
            sx={{ ...styles.blueButton, width: "100%" }}
          >
            Import
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export { LinkManagerMenu };
