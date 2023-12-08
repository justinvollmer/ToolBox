import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

import { WorkInProgress } from "../badges/BadgeCollection";

import { Link } from "react-router-dom";

import "./ModuleCard.scss";

interface Props {
  title: string;
  description: string;
  moduleLink: string;
  coverImg?: string;
  info?: string;
  released?: boolean;
  mainDeveloper?: string;
  mainDeveloperBadge?: React.ReactNode;
  contributors?: string;
  contributorBadge?: React.ReactNode; // the Badge will be appended once at the very end
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

function ModuleCard({
  title,
  description,
  moduleLink,
  coverImg,
  info,
  released,
  mainDeveloper,
  mainDeveloperBadge,
  contributors,
  contributorBadge,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let cardCover = undefined;
  if (coverImg != undefined) {
    cardCover = (
      <CardMedia
        component="img"
        height="140"
        image={coverImg}
        alt="cover image"
      />
    );
  } else {
    cardCover = (
      <div
        style={{
          height: "140px",
          color: "white",
          backgroundColor: "gray",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "x-large",
        }}
      >
        {title}
      </div>
    );
  }

  let infoElement = undefined;
  if (info != undefined) {
    infoElement = (
      <CardActions>
        <Button size="small" color="primary" onClick={handleOpen}>
          INFO
        </Button>
      </CardActions>
    );
  }

  let mainDeveloperElement = undefined;
  let contributorsElement = undefined;
  if (mainDeveloper != undefined) {
    if (contributors != undefined) {
      contributorsElement = (
        <div className="unselectable">
          Contributor(s):
          <p className="credited-name">{contributors}</p>
          {contributorBadge}
        </div>
      );
    }

    mainDeveloperElement = (
      <>
        <hr />
        <div className="unselectable">
          Main Developer:
          <p className="credited-name">{mainDeveloper}</p>
          {mainDeveloperBadge}
        </div>
        {contributorsElement}
      </>
    );
  }

  let assignedBadge = undefined;
  if (!released) {
    assignedBadge = WorkInProgress();
  }

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea component={Link} to={moduleLink}>
          {cardCover}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
        {infoElement}
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <div>
              <span className="unselectable" style={{ fontWeight: "bold" }}>
                {title} {assignedBadge}
              </span>
            </div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <span className="unselectable">{info}</span>
            {mainDeveloperElement}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default ModuleCard;
