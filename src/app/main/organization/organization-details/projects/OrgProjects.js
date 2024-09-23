import React, { useState } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import FuseLoading from "@fuse/core/FuseLoading";
import clsx from "clsx";
import OrgProjectsDialog  from "./OrgProjectsDialog";
import { useSelector } from "react-redux";
import ReactTable from "react-table-6";
import history from "@history";
import Chip from "@material-ui/core/Chip";
import { Typography } from "@material-ui/core";
import "react-table-6/react-table.css";

function OrgProjects(props) {
  const [tabValue, setTabValue] = useState(0);
  const associatedProjects = useSelector(({ organizations }) => organizations.associatedProjects);
  const ownedProjects = useSelector(({ organizations }) => organizations.ownedProjects);
  const orgProjects = useSelector(({ organizations }) => organizations.projects);
  const role = useSelector(({ auth }) => auth.user.role);

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

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    return (
      row[id] !== undefined ?
        String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
      :
        false
    );
  }
 
  return (
    <>
      {role === 'admin'? 
       <FuseAnimate animation="transition.slideUpIn">
         <ReactTable
           className = {clsx("-striped -highlight sm:rounded-16 overflow-hidden ")}
           data = {orgProjects}
           filterable
           defaultFilterMethod = {(filter, row) => filterCaseInsensitive(filter, row) }
           columns={[
           {
              Header: "Project Name",
              className: "font-bold",
              accessor: "title",
              Cell: ({ row }) => (
                <Typography
                  className="font-bold hover:underline cursor-pointer"
                  color="secondary"
                  onClick = {() =>
                    history.push({
                      pathname: `/projects/${row._original._id}`,
                    })
                  }
               >
                  {row._original.title}
                </Typography>
              ),
           },
           {
              Header: "Project Type",
              id: "projectType",
              accessor: (d) => {
                if (d.projectType === "structuralAudit") {
                  return "Structural Audit";
                }
                if (d.projectType === "residential") {
                  return "Residential";
                }
                if (d.projectType === "commercial") {
                  return "Commercial";
                }
                if (d.projectType === "infrastucture") {
                  return "Infrastructure";
               }
               if (d.projectType === "RES-COMM") {
                  return "Residential Cum Commercial";
               }
               if (d.projectType === "other") {
                  return "Other";
               } else {
                  return d.projectType;
               }
              },
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
      :
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
                  <Typography variant="subtitle"> Owned Projects </Typography>
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
              label = {
                <div>
                  <Typography variant="subtitle"> Associated Projects </Typography>
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
              filterable
              defaultFilterMethod = {(filter, row) => filterCaseInsensitive(filter, row) }
              data = {tabValue === 0 ? ownedProjects : associatedProjects}
          columns={[
            {
              Header: "Project Name",
              className: "font-bold",
              accessor: "title",
              Cell: ({ row }) => (
                <Typography
                  className="font-bold hover:underline cursor-pointer"
                  color="secondary"
                  onClick={() =>
                    history.push({
                      pathname: `/projects/${row._original._id}`,
                    })
                  }
                >
                  {row._original.title}
                </Typography>
              ),
            },
            {
              Header: "Project Type",
              id: "projectType",
              accessor: (d) => {
                if (d.projectType === "structuralAudit") {
                  return "Structural Audit";
                }
                if (d.projectType === "residential") {
                  return "Residential";
                }
                if (d.projectType === "commercial") {
                  return "Commercial";
                }
                if (d.projectType === "infrastucture") {
                  return "Infrastructure";
                }
                if (d.projectType === "RES-COMM") {
                  return "Residential Cum Commercial";
                }
                if (d.projectType === "other") {
                  return "Other";
                } else {
                  return d.projectType;
                }
              },
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
      <OrgProjectsDialog />
    </>
   }
    </>
  );
}

export default OrgProjects;
