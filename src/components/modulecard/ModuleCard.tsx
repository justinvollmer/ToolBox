import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActionArea, CardActions } from "@mui/material";

import { Link } from "react-router-dom";

interface Props {
  title: string;
  description: string;
  moduleLink: string;
  coverImg?: string;
  buttonAction?: () => void;
}

function ModuleCard({
  title,
  description,
  moduleLink,
  coverImg,
  buttonAction,
}: Props) {
  let buttonActionElement = undefined;
  if (buttonAction != undefined) {
    buttonActionElement = (
      <CardActions>
        <Button size="small" color="primary" onClick={buttonAction}>
          INFO
        </Button>
      </CardActions>
    );
  }

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea component={Link} to={moduleLink}>
        <CardMedia
          component="img"
          height="140"
          image={coverImg}
          alt="cover image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      {buttonActionElement}
    </Card>
  );
}

export default ModuleCard;
