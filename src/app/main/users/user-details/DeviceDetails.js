import React from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: "70vh",
  },
}));

function DeviceDetails(props) {
  const classes = useStyles();
  const deviceDetailsState = useSelector(
    ({ users }) => users.details.user.deviceInfo
  );
  let date = "";
  let deviceDetails = [];

  // if (deviceDetailsState.length === 0) {
  //   return (
  //     <div className="flex flex-1 items-center justify-center">
  //       No Device Details Found
  //     </div>
  //   );
  // }
  deviceDetailsState.forEach((device) => {
    date = moment(device.date).format("DD-MM-YYYY, hh:mm A");

    deviceDetails.push({
      date: date,
      osName: device.userAgent.os,
      browserName: device.userAgent.browser,
      location: {
        city: device.ipLocation === undefined ? '':device.ipLocation.city,
        state: device.ipLocation === undefined ? '':device.ipLocation.state,
        country: device.ipLocation === undefined ? '':device.ipLocation.country,
        address: device.address === undefined ? '':device.address,
      },
    });
  });

  return (
    <ReactTable
      className={clsx(
        classes.root,
        "-striped -highlight sm:rounded-16 overflow-hidden"
      )}
      data={deviceDetails}
      columns={[
        {
          Header: "Date",
          className: "font-bold",
          accessor: "date",
          Cell: ({ row }) => (
            <Typography
              className="font-bold hover:underline cursor-pointer"
              color="secondary"
            >
              {row._original.date}
            </Typography>
          ),
        },
        {
          Header: "OS",
          accessor: "osName",
        },
        {
          Header: "Browser",
          accessor: "browserName",
        },
        {
          Header: "location",
          headerClassName: "location",
          columns: [
            {
              Header: "City",
              accessor: "location.city",
            },
            {
              Header: "State",
              accessor: "location.state",
            },
            {
              Header: "Country",
              accessor: "location.country",
            },
            {
              Header: "Address",
              accessor: "location.address",
            },
          ],
        },
      ]}
      defaultPageSize={20}
      noDataText="No Device Details found"
    />
  );
}

export default DeviceDetails;
