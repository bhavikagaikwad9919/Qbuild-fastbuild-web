import React, { useState, useEffect, useCallback } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Tab, Tabs } from "@material-ui/core";
import Team from "../team/Team";
import Settings from "./Settings";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    header: {
      minHeight: "100px",
      // maxHeight: "80px",
    },
    container: {
      position: "relative",
    },
    input: {
      color: "white",
    },
  }));

const StyledBadge = withStyles((theme) => ({
    badge: {
      right: -15,
      top: 13,
    },
}))(Badge);

function SettingsPanel(){

    const classes = useStyles();
    const loading = useSelector(({ projects }) => projects.loading);
    const team = useSelector(({ projects }) => projects.details.team);
    const [selectedTab, setSelectedTab] = useState("details");


  const handleTabChange = (event, value) => {
    setSelectedTab(value);
  };

  return (
    <React.Fragment>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <FusePageSimple
          classes={{
           contentWrapper: "p-0",
           header: "min-h-10 h-0 sm:h-0 sm:min-h-0",
          }}

          header={ <></> }
          
          contentToolbar={
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                value="details"
                label={
                  <StyledBadge color="secondary">
                    Details
                  </StyledBadge>
                }
              />
              <Tab
                value="team"
                label={
                  <StyledBadge 
                   badgeContent={team.length}
                   color="secondary">
                    Team
                  </StyledBadge>
                }
              />
            </Tabs>
          }
          content={
            <React.Fragment>
              
              <div className="shadow-3">
                {selectedTab === "team" && (
                  <Team />
                )}
                {selectedTab === "details" && (
                  <Settings />
                )}
              </div>
            </React.Fragment>
          }
          //innerScroll
        />
    </React.Fragment>
    )
}

export default React.memo(SettingsPanel);