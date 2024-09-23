import React from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import { useSelector } from "react-redux";
import { Typography } from "@material-ui/core";
import history from "@history";

const useStyles =makeStyles((theme) => ({
  root: {
    maxHeight: "76vh",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function OrganizationList(props) {
  const classes = useStyles();
  const role = useSelector(({ auth }) => auth.user.role);

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
    <FuseAnimate animation="transition.slideUpIn">
      {role ==='admin'?
       <ReactTable
         className={clsx( classes.root,"-striped -highlight sm:rounded-16 overflow-hidden px-6")}
         data={props.data}
         defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
         columns={[
          {
           Header: "Name",
           className: "font-bold cursor-pointer",
           style: { 'white-space': 'unset' },
           filterable: true,
           accessor: "name",
           Cell: ({ row }) => (
             <Typography
               color="secondary"
               className={role !=='admin' ? "font-bold hover:underline cursor-pointer" : "font-bold hover:underline"}
               onClick={() =>
                history.push({
                  pathname: `/organization/details/${row._original._id}`,
                })
              }
             >
               {row.name}
             </Typography>
           ),
          },
          {
           Header: "Contact",
           className: "align-center",
           accessor: "contact",
           filterable: true,
          },
          {
           Header: "Location",
           className: "align-center",
           accessor: "address",
           filterable: true,
          },
          {
           Header: "Created By",
           className: "align-center",
           accessor: "createdBy",
           filterable: true,
          },
         ]}
         defaultPageSize={20}
         noDataText="No Organization found"
       />
      :
      <ReactTable
        className={clsx(
          classes.root,
          "-striped -highlight sm:rounded-16 overflow-hidden px-6"
        )}
        data={props.data}
        defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
        columns={[
          {
            Header: "Name",
            className: "font-bold",
            style: { 'white-space': 'unset' },
            filterable: true,
            accessor: "name",
            Cell: ({ row }) => (
              <Typography
                color="secondary"
                className={role !=='admin' ? "font-bold hover:underline cursor-pointer" : "font-bold hover:underline"}
                onClick={() =>
                  history.push({
                    pathname: `/organization/details/${row._original._id}`,
                  })
                }
              >
                {row.name}
              </Typography>
            ),
          },
          {
            Header: "Contact",
            className: "align-center",
            accessor: "contact",
            filterable: true,
          },
          {
            Header: "Location",
            className: "align-center",
            accessor: "address",
            filterable: true,
         },
        ]}
        defaultPageSize={20}
        noDataText="No Organization found"
      />}
    </FuseAnimate>
    </>  
  )
}

export default OrganizationList;
