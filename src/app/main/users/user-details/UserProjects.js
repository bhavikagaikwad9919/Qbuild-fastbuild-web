import React, { useState } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import FuseLoading from "@fuse/core/FuseLoading";
import clsx from "clsx";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

function UserProjects(props) {
  const [tabValue, setTabValue] = useState(0);
  const associatedProjects = useSelector(
    ({ users }) => users.details.associatedProjects
  );
  const ownedProjects = useSelector(({ users }) => users.details.ownedProjects);

  function handleChangeTab(event, value) {
    setTabValue(value);
  }
  if (ownedProjects === 0 || associatedProjects === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        {/* <Typography color="textSecondary" variant="h5">
					There are no projects!
				</Typography> */}
        <FuseLoading />;
      </div>
    );
  }
  // deviceDetailsState.forEach(device => {
  // 	console.log('date', device.date);
  // 	date = moment(device.date).format('DD-MM-YYYY, hh:mm');
  // 	deviceDetails.push({
  // 		date: date,
  // 		osName: device.osName,
  // 		browserName: device.browserName
  // 	});
  // });
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
        <Tab className="h-64 normal-case" label="Owned Projects" />
        <Tab className="h-64 normal-case" label="Associated Projects" />
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
                <Typography 
                  className="font-bold hover:underline cursor-pointer"
                  color="secondary" 
                >
                  {row._original.title}
                </Typography>
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
    </>
  );
}

export default UserProjects;
