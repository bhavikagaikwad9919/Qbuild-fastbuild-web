import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React from "react";
import { navigateTo } from "app/utils/Navigator";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .logo-icon": {
      width: 34,
      height: 34,
      transition: theme.transitions.create(["width", "height"], {
        duration: theme.transitions.duration.shortest,
        easing: theme.transitions.easing.easeInOut,
      }),
    },
    "& .react-badge, & .logo-text": {
      transition: theme.transitions.create("opacity", {
        duration: theme.transitions.duration.shortest,
        easing: theme.transitions.easing.easeInOut,
      }),
    },
  },
  reactBadge: {
    backgroundColor: "#121212",
    color: "#61DAFB",
  },
}));

function Logo() {
  const classes = useStyles();

  return (
    <div className={clsx(classes.root, "flex items-center")}>
      <img
        className="logo-icon"
        src="assets/images/logos/qbuild-black.svg"
        alt="logo"
      />
      <Typography
        className="text-16 mx-12 font-bold logo-text"
        color="inherit"
        //onClick={() => navigateTo("/projects")}
      >
        QBUILD
      </Typography>
      <div></div>
    </div>
  );
}

export default Logo;
