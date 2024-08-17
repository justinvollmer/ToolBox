import { Box } from "@mui/material";

import "./Randomizer.scss";

function Randomizer() {
  return (
    <div style={{ margin: "25px" }}>
      <Box
        sx={{
          height: "calc(100vh - 114px)",
          transform: "translateZ(0px)",
          flexGrow: 1,
        }}
      >
        <div
          style={{
            maxHeight: "100%",
            height: "100%",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <h1 className="unselectable">This page is WORK IN PROGRESS!</h1>
        </div>
      </Box>
    </div>
  );
}

export default Randomizer;
