import * as React from "react";

import {
  Box,
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";

import "./Randomizer.scss";

const { ipcRenderer } = window;

const jsonTestData = {
  title: "List title",
  content: [
    {
      name: "Item 1",
      description: "Desc",
      options: ["Option1", "Option2"],
      ref: ["https://example.com"],
    },
    {
      name: "Item 2",
      description: "Desc",
      options: ["Option1", "Option2"],
    },
    {
      name: "Item 3",
      description: "Desc",
      options: ["Option1", "Option2"],
    },
  ],
};

function Randomizer() {
  const [isShowingJSON, setShowingJSON] = React.useState(false);
  const [jsonObj, setJsonObj] = React.useState(Object);
  const [output, setOutput] = React.useState("");
  const [jsonObjLength, setJsonObjLength] = React.useState(0);

  const [amount, setAmount] = React.useState(1);
  const [isAllowingDuplicates, setAllowingDuplicates] = React.useState(false);

  const [isLockedReset, setLockedReset] = React.useState(true);
  const [isLockedClear, setLockedClear] = React.useState(true);
  const [isVisibleExample, setVisibleExample] = React.useState(true);

  const handleShowingJSON = () => {
    setShowingJSON(!isShowingJSON);
  };

  const handleClear = () => {
    setOutput("");
    setLockedClear(true);
  };

  const handleReset = () => {
    setOutput("");
    setJsonObj(Object);
    setAmount(1);
    setJsonObjLength(0);
    setLockedReset(true);
    setLockedClear(true);
    setVisibleExample(true);
    setShowingJSON(false);
    setAllowingDuplicates(false);
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
        setJsonObjLength(content.content.length);
        setLockedReset(false);
        setVisibleExample(false);
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

      let res: string = `Name: ${jsonObj.content[n1 - 1].name} | Description: ${
        jsonObj.content[n1 - 1].description
      } > Option: ${jsonObj.content[n1 - 1].options[n2 - 1]}`;

      if (jsonObj.content[n1 - 1].ref) {
        for (let i = 0; i < jsonObj.content[n1 - 1].ref.length; i++) {
          res += `\n\t${jsonObj.content[n1 - 1].ref[i]}`;
        }
      }

      setOutput(res);
      setLockedClear(false);
      setShowingJSON(false);
    } catch (error) {
      setOutput(
        `Error: There has been an error in identifying the JSON structure! (${error})`
      );
    }
  };

  const bulkRandomize = () => {
    if (!(amount <= jsonObjLength && amount > 0) && !isAllowingDuplicates) {
      setOutput(
        `Error: There has been an error in setting the amount of generated output!`
      );
      return;
    }

    const jsonObjInstance = JSON.parse(JSON.stringify(jsonObj));
    const resArr: Array<string> = [];

    try {
      for (let i = 1; i <= amount; i++) {
        const n1: number = getRandomNumber(jsonObjInstance.content.length);
        const n2: number = getRandomNumber(
          jsonObjInstance.content[n1 - 1].options.length
        );

        let newOutput: string = `${i}. Name: ${
          jsonObjInstance.content[n1 - 1].name
        } | Description: ${
          jsonObjInstance.content[n1 - 1].description
        } > Option: ${jsonObjInstance.content[n1 - 1].options[n2 - 1]}`;

        if (jsonObjInstance.content[n1 - 1].ref) {
          for (let j = 0; j < jsonObjInstance.content[n1 - 1].ref.length; j++) {
            newOutput += `\n\t${jsonObjInstance.content[n1 - 1].ref[j]}`;
          }
        }

        resArr.push(newOutput);

        if (!isAllowingDuplicates) {
          jsonObjInstance.content.splice(n1 - 1, 1);
        }
      }

      let res = "";
      resArr.forEach((element) => {
        res += "\n" + element;
      });

      setOutput(res.trim());
      setLockedClear(false);
      setShowingJSON(false);
    } catch (error) {
      setOutput(
        `Error: There has been an error in identifying the JSON structure or length! (${error})`
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
              Import JSON
            </Button>
            {!isLockedReset && (
              <Button
                variant="contained"
                color="success"
                sx={{ mt: "20px", mb: "20px", ml: "5px", mr: "5px" }}
                onClick={randomize}
              >
                Start Randomize
              </Button>
            )}
            {!isLockedClear && (
              <Button
                variant="contained"
                color="error"
                sx={{ mt: "20px", mb: "20px", ml: "5px", mr: "5px" }}
                onClick={handleClear}
              >
                Clear Output
              </Button>
            )}
            {!isLockedReset && (
              <Button
                variant="contained"
                color="error"
                sx={{ mt: "20px", mb: "20px", ml: "5px" }}
                onClick={handleReset}
              >
                Reset
              </Button>
            )}
          </div>
          {!isLockedReset && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TextField
                label="Amount"
                size="small"
                sx={{ mr: 1, width: "120px" }}
                variant="filled"
                type="number"
                value={amount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (
                    !isNaN(value) &&
                    value <= jsonObjLength &&
                    value > 0 &&
                    !isAllowingDuplicates
                  ) {
                    setAmount(value);
                  } else if (
                    isAllowingDuplicates &&
                    !isNaN(value) &&
                    value > 0
                  ) {
                    setAmount(value);
                  } else {
                    setAmount(1);
                  }
                }}
              />
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox />}
                  label={<Typography>allow duplicates</Typography>}
                  checked={isAllowingDuplicates}
                  onChange={() => {
                    setAllowingDuplicates(!isAllowingDuplicates);
                  }}
                />
              </FormGroup>
              <Button
                variant="contained"
                color="success"
                sx={{ mb: "20px", ml: "5px", mr: "5px" }}
                onClick={bulkRandomize}
              >
                Bulk Randomize
              </Button>
            </div>
          )}
          {!isLockedReset && (
            <TextField
              value={output}
              fullWidth
              multiline
              maxRows={20}
              className="unselectable"
              label="Output"
              InputProps={{
                readOnly: true,
              }}
            />
          )}
          {isVisibleExample && (
            <div>
              <Typography className="unselectable" sx={{ mt: "10px" }}>
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
          )}
        </div>
      </Box>
    </div>
  );
}

export default Randomizer;
