import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Drawer, MenuItem, Typography } from "@mui/material";
import { useGetUser } from "../../hooks/useGetUser";
import GroupsIcon from "@mui/icons-material/Groups";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "..";
import React from "react";
import { UserHeading } from "./userHeading";

export const SideNavBar = () => {
  const drawerWidth = 180;

  const { data } = useGetUser();
  const navigate = useNavigate();
  const { logout } = useAuth();

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
            navigate("/login");
          }}
        >
          Log out
        </Button>
      </MenuItem>
    </div>
  );

  return (
    <Box maxWidth="container.m" minWidth="container.m">
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
        <Box marginY={5}>
          <UserHeading
            firstName={data?.firstName || ""}
            lastName={data?.lastName || ""}
          />
          {menuItems}
        </Box>
      </Drawer>
      <Box flexGrow={1} position="relative" marginLeft={15}>
        <React.Suspense fallback={<></>}>
          <Outlet />
        </React.Suspense>
      </Box>
    </Box>
  );
};
