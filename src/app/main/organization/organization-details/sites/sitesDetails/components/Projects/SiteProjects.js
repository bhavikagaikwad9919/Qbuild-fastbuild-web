import React, { useRef, useEffect, useState } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import FuseLoading from "@fuse/core/FuseLoading";
import clsx from "clsx";
import { useDispatch, useSelector } from "react-redux";
import SiteProjectsDialog  from "./SiteProjectsDialog";
import ReactTable from "react-table-6";
import history from "@history";
import Chip from "@material-ui/core/Chip";
import { Typography } from "@material-ui/core";
import "react-table-6/react-table.css";
import { getOrganization  } from "app/main/organization/store/organizationSlice";

function SiteProjects(props) {
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const associatedProjects = useSelector(({ sites }) => sites.associatedProjects);
  const ownedProjects = useSelector(({ sites }) => sites.ownedProjects);

  function handleChangeTab(event, value) {
    setTabValue(value);
  }

  if (ownedProjects === 0 || associatedProjects === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <FuseLoading />;
      </div>
    );
  }
 
  return (
    <>
      <Tabs
        value={tabValue}
        onChange={handleChangeTab}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        classes={{ root: "flex flex-1 w-full h-20" }}
      >
        <Tab 
          className="h-64 normal-case" 
          label={
            <div>
              <Typography variant="subtitle">
                Owned Projects
              </Typography>
              <Chip
                className="ml-12"
                label={ownedProjects === undefined ? 0 : ownedProjects.length}
                size="small"
                color="primary"
              />
            </div>
          }
        />
        <Tab
         className="h-64 normal-case" 
         label={
          <div>
            <Typography variant="subtitle">
              Associated Projects
            </Typography>
            <Chip
              className="ml-12"
              label={associatedProjects === undefined ? 0 : associatedProjects.length}
              size="small"
              color="primary"
            />
          </div>
         }
        />
      </Tabs>
      <FuseAnimate animation="transition.slideUpIn">
        <ReactTable
          className={clsx("-striped -highlight sm:rounded-16 overflow-hidden ")}
          data={tabValue === 0 ? ownedProjects : associatedProjects}
          columns={[
            {
              Header: "Project Name",
              className: "font-bold",
              accessor: "title",
              Cell: ({ row }) => (
                <a
                  className="cursor-pointer"
                  onClick={() =>
                    history.push({
                      pathname: `/projects/${row._original._id}`,
                    })
                  }
                >
                  {row._original.title}
                </a>
              ),
            },
            {
              Header: "Project Type",
              accessor: "projectType",
            },
            {
              Header: "Location",
              accessor: "location",
            },
          ]}
          defaultPageSize={10}
          noDataText="No Projects found"
        />
      </FuseAnimate>
      <SiteProjectsDialog organizationId = {props.organizationId} />
    </>
  );
}

export default SiteProjects;
