import * as React from "react";

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Button,
  Tooltip,
  MenuItem,
  Menu,
} from "@mui/material";

import {
  MenuRounded,
  ViewInArRounded,
  SettingsRounded,
} from "@mui/icons-material";

import SettingsDialog from "./SettingsDialog";

import "./Navbar.scss";

import { Link } from "react-router-dom";

const pages = [
  { name: "Modules", link: "/" },
  { name: "About", link: "/about" },
];

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [isSettingsOpen, setOpenSettingsDialog] = React.useState(false);

  const handleOpenSettingsDialog = () => {
    setOpenSettingsDialog(true);
  };

  const handleCloseSettingsDialog = () => {
    setOpenSettingsDialog(false);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <SettingsDialog
        open={isSettingsOpen}
        onClose={handleCloseSettingsDialog}
      />
      <AppBar position="static" sx={{ background: "#0b3781" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <ViewInArRounded
              sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            />
            <Typography
              className="logo-typography-global"
              variant="h6"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              ToolBox
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuRounded />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} component={Link} to={page.link}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <ViewInArRounded
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            />
            <Typography
              className="logo-typography-global"
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                mr: 2,
                display: { xs: "flex", md: "none" },
                flexGrow: 1,
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: ".1rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              ToolBox
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  component={Link}
                  to={page.link}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenSettingsDialog} sx={{ p: 0 }}>
                  <SettingsRounded
                    sx={{
                      display: { xs: "none", md: "flex" },
                      mr: 1,
                      color: "white",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}

export default Navbar;
