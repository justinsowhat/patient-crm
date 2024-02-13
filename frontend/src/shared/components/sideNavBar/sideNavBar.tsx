import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Drawer, MenuItem, Toolbar } from "@mui/material";
import { useGetUser } from "../../hooks/useGetUser";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "..";
import React, { useEffect } from "react";
import { UserHeading } from "./userHeading";

export const SideNavBar = () => {
  const drawerWidth = 180;

  const { data } = useGetUser();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // TODO: abstract this
  const menuItems = (
    <div style={{ marginTop: "5px" }}>
      <MenuItem sx={{ marginY: "3px" }} onClick={() => {}}>
        <GroupsIcon />
        <Button onClick={() => navigate("/patients")}>Patients</Button>
      </MenuItem>

      <MenuItem sx={{ marginY: "3px" }} onClick={() => {}}>
        <LogoutIcon />
        <Button
          onClick={() => {
            logout();
            location.reload();
          }}
        >
          Log out
        </Button>
      </MenuItem>
    </div>
  );

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar /> {/* Provides spacing for content below app bar */}
        <Box marginY={5}>
          <UserHeading
            firstName={data?.firstName || ""}
            lastName={data?.lastName || ""}
          />
          {menuItems}
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowX: "hidden",
          width: "85vw",
        }}
      >
        <React.Suspense fallback={<>Loading...</>}>
          <Outlet />
        </React.Suspense>
      </Box>
    </Box>
  );
};
