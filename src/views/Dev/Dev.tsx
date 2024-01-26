import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./Dev.scss";

function Dev() {
  return (
    <div>
      <p className="unselectable">
        This page is for testing and development only! This page will removed
        later on!
      </p>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={"/dev/encryption"}
      >
        Encryption Test
      </Button>
      <Button
        variant="contained"
        color="secondary"
        component={Link}
        to={"/dev/download"}
      >
        Download Test
      </Button>
      <Button
        variant="contained"
        color="error"
        component={Link}
        to={"/dev/ipc"}
      >
        Download Test
      </Button>
    </div>
  );
}

export default Dev;
