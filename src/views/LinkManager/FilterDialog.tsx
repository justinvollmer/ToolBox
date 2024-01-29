import * as React from "react";
import {
  Avatar,
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";

import {
  ClearRounded,
  CommentRounded,
  DifferenceRounded,
  CheckBoxOutlineBlankRounded,
  AutoAwesomeMotionRounded,
} from "@mui/icons-material/";

import { blue, green, red } from "@mui/material/colors";

import "./LinkManager.scss";

interface FilterDialogProps {
  text: string;
  setText: (value: string) => void;
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

function FilterDialog({
  text,
  setText,
  open,
  selectedValue,
  onClose,
}: FilterDialogProps) {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    let splittedText: string[] = text.split("\n").map((e) => e.trim());

    if (value == "emptyLines" || value == "applyAll") {
      splittedText = splittedText.filter((e) => e !== "");
    }

    if (value == "comments" || value == "applyAll") {
      splittedText = splittedText.filter((e) => !e.startsWith("//"));
    }

    if (value == "dulicateLines" || value == "applyAll") {
      splittedText = Array.from(new Set(splittedText));
    }

    setText(splittedText.join("\n"));

    onClose(value);
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <Dialog onClose={handleClose} open={open} onClick={handleBackdropClick}>
      <DialogTitle className="unselectable">Select a filter</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("emptyLines")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <CheckBoxOutlineBlankRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Remove all empty lines" />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("comments")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <CommentRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Remove all comments"
              secondary="Double slash comments"
            />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("dulicateLines")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <DifferenceRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Remove all duplicate lines"
              secondary="Includes empty lines / spaces"
            />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("applyAll")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: green[100], color: green[600] }}>
                <AutoAwesomeMotionRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Apply all" />
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton
            autoFocus
            onClick={() => handleListItemClick("cancel")}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: red[100], color: red[600] }}>
                <ClearRounded />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Cancel" />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

export default FilterDialog;
