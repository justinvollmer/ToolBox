import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

import { Link } from "react-router-dom";

import "./ModuleCard.scss";

interface Props {
  title: string;
  description: string;
  moduleLink: string;
  coverImg?: string;
  info?: string;
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

function ModuleCard({ title, description, moduleLink, coverImg, info }: Props) {
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
    cardCover = <div className="default-card-cover">{title}</div>;
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
                {title}
              </span>
            </div>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <span className="unselectable">{info}</span>
          </Typography>
        </Box>
      </Modal>
    </>
  );
}

export default ModuleCard;
