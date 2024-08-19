import * as React from "react";

import { Box, Button, Typography } from "@mui/material";

import "./Randomizer.scss";

const { ipcRenderer } = window;

const jsonTestData = {
  title: "List title",
  content: [
    {
      name: "Item 1",
      description: "Desc",
      options: ["Option1", "Option2"],
    },
    {
      name: "Item 2",
      description: "Desc",
      options: ["Option1", "Option2"],
    },
    {
      name: "Item 3",
      description: "Desc",
      options: ["Op1tion", "Option2"],
    },
  ],
};

function Randomizer() {
  const [isShowingJSON, setShowingJSON] = React.useState(false);
  const [jsonObj, setJsonObj] = React.useState(Object);
  const [output, setOutput] = React.useState("");
  const [isLocked, setLocked] = React.useState(true);

  const handleShowingJSON = () => {
    setShowingJSON(!isShowingJSON);
  };

  const handleReset = () => {
    setOutput("");
    setJsonObj(Object);
    setLocked(true);
  };

  const openFileDialog = async () => {
    const filters: Array<object> = [
      { name: "JSON Files", extensions: ["json"] },
    ];

    try {
      const contentRaw = await ipcRenderer.invoke("open-file-dialog", filters);
      const content = JSON.parse(contentRaw);

      if (content) {
        setJsonObj(content);
        setLocked(false);
      }
    } catch (error) {
      console.error("Error opening file dialog:", error);
    }
  };

  const getRandomNumber = (maxNumber: number) => {
    return Math.floor(Math.random() * maxNumber) + 1;
  };

  const randomize = () => {
    try {
      const n1: number = getRandomNumber(jsonObj.content.length);
      const n2: number = getRandomNumber(
        jsonObj.content[n1 - 1].options.length
      );

      const res: string = `Name: ${
        jsonObj.content[n1 - 1].name
      } | Description: ${jsonObj.content[n1 - 1].description} > Option: ${
        jsonObj.content[n1 - 1].options[n2 - 1]
      }`;

      setOutput(res);
    } catch (error) {
      setOutput(
        `Error: There has been an error in identifying the JSON structure! (${error})`
      );
    }
  };

  return (
    <div style={{ margin: "25px" }}>
      <Box
        sx={{
          height: "calc(100vh - 114px)",
          transform: "translateZ(0px)",
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h1 className="unselectable">Randomizer!</h1>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Button
              variant="contained"
              sx={{ mt: "20px", mb: "20px", mr: "5px" }}
              onClick={openFileDialog}
            >
              Import JSON List
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={isLocked}
              sx={{ mt: "20px", mb: "20px", ml: "5px", mr: "5px" }}
              onClick={randomize}
            >
              Start Randomize
            </Button>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: "20px", mb: "20px", ml: "5px" }}
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
          <Typography className="unselectable">{output}</Typography>
          <Typography className="unselectable" sx={{ mt: "40px" }}>
            The imported JSON should have the following structure:
          </Typography>
          {!isShowingJSON && (
            <Button
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleShowingJSON}
              sx={{ mt: "20px", mb: "20px" }}
            >
              Show JSON example
            </Button>
          )}
          {isShowingJSON && (
            <pre
              onClick={handleShowingJSON}
              style={{
                textAlign: "left",
                backgroundColor: "#f5f5f5",
                padding: "15px",
                borderRadius: "5px",
                maxWidth: "600px",
                overflowX: "auto",
                marginTop: "20px",
              }}
              className="unselectable"
            >
              {JSON.stringify(jsonTestData, null, 2)}
            </pre>
          )}
        </div>
      </Box>
    </div>
  );
}

export default Randomizer;
