import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./Dev.scss";

function Dev() {
  return (
    <div>
      <p className="unselectable">
        This page is for testing and development only! This page will be removed
        later on!
      </p>
      <Button
        variant="contained"
        color="error"
        component={Link}
        to={"/dev/ipc"}
      >
        IPC Test
      </Button>
    </div>
  );
}

export default Dev;
