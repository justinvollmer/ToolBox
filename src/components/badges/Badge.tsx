import * as React from "react";
import { Tooltip } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

import "./Badge.scss";

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconColor?: string;
  learnMoreLink?: string;
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: 5,
  boxShadow: 24,
  p: 4,
};

function Badge({ title, description, icon, iconColor, learnMoreLink }: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let learnMoreElement: JSX.Element | undefined = undefined;

  if (learnMoreLink !== undefined) {
    learnMoreElement = (
      <a className="links" target="_blank" href={learnMoreLink}>
        Learn more
      </a>
    );
  }

  return (
    <>
      <Tooltip title={<span className="unselectable">{title} (Click)</span>}>
        <span
          style={{ color: iconColor }}
          onClick={handleOpen}
          className="clickable"
        >
          {icon}
        </span>
      </Tooltip>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div>
              <span
                style={{ color: iconColor }}
                className="adjust-badge-icon-modal"
              >
                {icon}
              </span>
              <span className="unselectable" style={{ fontWeight: "bold" }}>
                {title}
              </span>
            </div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <span className="unselectable">{description} </span>
            {learnMoreElement}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
export default Badge;
