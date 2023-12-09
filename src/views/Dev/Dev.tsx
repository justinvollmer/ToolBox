import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function Dev() {
  return (
    <div>
      <p>
        This page is for testing and development only! This page will removed
        later on!
      </p>
      <Button component={Link} to={"/dev/encryption"}>
        Encryption Test
      </Button>
    </div>
  );
}

export default Dev;
