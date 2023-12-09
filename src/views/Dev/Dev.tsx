import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function Dev() {
  return (
    <div>
      <Button component={Link} to={"/dev/encryption"}>
        Encryption Test
      </Button>
    </div>
  );
}

export default Dev;
