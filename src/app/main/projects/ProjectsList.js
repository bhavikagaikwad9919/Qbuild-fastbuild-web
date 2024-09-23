import React from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import ReactTable from "react-table-6";
import { Typography } from "@material-ui/core";
import "react-table-6/react-table.css";
import history from "@history";
import moment from 'moment';
import { routes } from "./store/projectsSlice";

const useStyles = makeStyles({
  root: {
    maxHeight: "76vh",
  },
});

function ProjectsList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const projects = useSelector(({ projects }) => projects.entities);
  const role = useSelector(({ auth }) => auth.user.role);

  let list = [], _id = '', title = '', teamCount = 0, plansCount = 0, docCount = 0,
   siteId = '', projectType = '', organizationId = '', organizationName = '', location = '',
   lastUpdatedBy = '', lastUpdatedDate = '';

   if(projects.length > 0)
   {
    projects.forEach((pro) =>{
      _id = pro._id;
      title = pro.title;
      teamCount = pro.team.length;
      plansCount = pro.plans.length;
      docCount = pro.documents.length;
      siteId = pro.siteId;
      projectType = pro.projectType;
      organizationId = pro.organizationId;
      organizationName = pro.organizationName;
      location = pro.location;
      lastUpdatedBy = pro.lastUpdatedBy === undefined ? '' : pro.lastUpdatedBy.name;
      lastUpdatedDate = pro.lastUpdatedDate === undefined ? '' : moment(pro.lastUpdatedDate).format('Do MMMM YYYY, h:mm A');
    
      list.push({ _id, title, teamCount, plansCount, docCount, siteId, projectType, organizationId, organizationName, location, lastUpdatedBy, lastUpdatedDate });
    }) 
   }

  if (projects.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center h-full">
        <FuseLoading />;
      </div>
    );
  }

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    if(id === 'teamCount' || id === 'plansCount' || id === 'docCount' ){
       let newId = row[id].toString();
      return (
        newId !== undefined ?
          String(newId.toLowerCase()).startsWith(filter.value.toLowerCase())
        :
          false
      );
    }else{
      return (
        row[id] !== undefined ?
          String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
        :
          false
      );
    }
   
  }

  function callProject(prData){
    if(prData.projectType === "structuralAudit"){
      dispatch(routes("Plans"));
    }else{
      dispatch(routes("Dashboard"));
    }
    history.push({
      pathname: `/projects/${prData._id}`,
    })
  }

  return (
    <FuseAnimate animation="transition.slideUpIn">
      {role === 'admin' ?
      <ReactTable
       className={clsx(
         classes.root,
         "-striped -highlight overflow-hidden px-6"
       )}
       data={list}
       defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
       columns={[
        {
          Header: "Project Name",
          className: "font-bold",
          style: { 'white-space': 'unset'},
          filterable: true,
          accessor: "title",
          Cell: ({ row }) => (
             <Typography
               className="font-bold hover:underline cursor-pointer"
               color="secondary"
               onClick={() => callProject(row._original)}
             >
               {row._original.title}
             </Typography>
          ),
          Filter: ({ filter, onChange }) => {
            return (
              <div style={{ position: "relative" }}>
                <input
                  onChange={(event) => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{
                    width: "100%",
                    backgroundColor: "#DCDCDC",
                    color: "#222222",
                  }}
                />
              </div>
            );
          },
        },
        {
          Header: "Project Type",
          id: "projectType",
          width: 150,
          style: { 'white-space': 'unset' },
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
          Filter: ({ filter, onChange }) => {
            return (
              <div style={{ position: "relative" }}>
                <input
                  onChange={(event) => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{
                    width: "100%",
                    backgroundColor: "#DCDCDC",
                    color: "#222222",
                  }}
                />
              </div>
            );
          },
          filterable: true,
        },
        {
          Header: "Location",
          accessor: "location",
          style: { 'white-space': 'unset' },
          filterable: true,
          Filter: ({ filter, onChange }) => {
            return (
              <div style={{ position: "relative" }}>
                <input
                  onChange={(event) => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{
                    width: "100%",
                    backgroundColor: "#DCDCDC",
                    color: "#222222",
                  }}
                />
              </div>
            );
          },
        },
        {
          Header: "Organization",
          accessor: "organizationName",
          style: { 'white-space': 'unset' },
          filterable: true,
          Filter: ({ filter, onChange }) => {
            return (
              <div style={{ position: "relative" }}>
                <input
                  onChange={(event) => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{
                    width: "100%",
                    backgroundColor: "#DCDCDC",
                    color: "#222222",
                  }}
                />
              </div>
            );
          },
        },
        {
          Header: "Members",
          width: 100,
          style: { 'text-align': 'center', 'white-space': 'unset' },
          accessor: "teamCount",
          Filter: ({ filter, onChange }) => {
            return (
              <div style={{ position: "relative" }}>
                <input
                  onChange={(event) => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{
                    width: "100%",
                    backgroundColor: "#DCDCDC",
                    color: "#222222",
                  }}
                />
              </div>
            );
          },
          filterable: true,
        },
        {
          Header: "Plans",
          width: 100,
          style: { 'text-align': 'center' },
          accessor: "plansCount",
          Filter: ({ filter, onChange }) => {
            return (
              <div style={{ position: "relative" }}>
                <input
                  onChange={(event) => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{
                    width: "100%",
                    backgroundColor: "#DCDCDC",
                    color: "#222222",
                  }}
                />
              </div>
            );
          },
          filterable: true,
        },
        {
          Header: "Documents",
          width: 100,
          style: { 'text-align': 'center' },
          accessor: "docCount",
          Filter: ({ filter, onChange }) => {
            return (
              <div style={{ position: "relative" }}>
                <input
                  onChange={(event) => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{
                    width: "100%",
                    backgroundColor: "#DCDCDC",
                    color: "#222222",
                  }}
                />
              </div>
            );
          },
          filterable: true,
        },
        {
          Header: "UpdatedBy",
          width: 150,
          style: { 'text-align': 'center' },
          accessor: "lastUpdatedBy",
          Filter: ({ filter, onChange }) => {
            return (
              <div style={{ position: "relative" }}>
                <input
                  onChange={(event) => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{
                    width: "100%",
                    backgroundColor: "#DCDCDC",
                    color: "#222222",
                  }}
                />
              </div>
            );
          },
          filterable: true,
        },
        {
          Header: "Updated Date",
          width: 150,
          style: { 'text-align': 'center','white-space': 'unset' },
          accessor: "lastUpdatedDate",
          Filter: ({ filter, onChange }) => {
            return (
              <div style={{ position: "relative" }}>
                <input
                  onChange={(event) => onChange(event.target.value)}
                  value={filter ? filter.value : ""}
                  style={{
                    width: "100%",
                    backgroundColor: "#DCDCDC",
                    color: "#222222",
                  }}
                />
              </div>
            );
          },
          filterable: true,
        },
       ]}
       defaultPageSize={20}
       noDataText="No projects found"
      />
     :
     <ReactTable
     className={clsx(classes.root, "-striped -highlight overflow-hidden px-6")}
     data={
       role === "admin"
       ? projects
       : props.tab === "ownedProjects"
       ? projects.ownedProjects.data
       : props.tab === "associatedProjects"
       ? projects.associatedProjects.data
       : []
      }
    defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
    columns={[
      {
        Header: "Project Name",
        className: "font-bold",
        filterable: true,
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
        Filter: ({ filter, onChange }) => {
          return (
            <div style={{ position: "relative" }}>
              <input
                onChange={(event) => onChange(event.target.value)}
                value={filter ? filter.value : ""}
                style={{
                  width: "100%",
                  backgroundColor: "#DCDCDC",
                  color: "#222222",
                }}
              />
            </div>
          );
        },
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
        Filter: ({ filter, onChange }) => {
          return (
            <div style={{ position: "relative" }}>
              <input
                onChange={(event) => onChange(event.target.value)}
                value={filter ? filter.value : ""}
                style={{
                  width: "100%",
                  backgroundColor: "#DCDCDC",
                  color: "#222222",
                }}
              />
            </div>
          );
        },
        filterable: true,
      },
      {
        Header: "Location",
        accessor: "location",
        filterable: true,
        Filter: ({ filter, onChange }) => {
          return (
            <div style={{ position: "relative" }}>
              <input
                onChange={(event) => onChange(event.target.value)}
                value={filter ? filter.value : ""}
                style={{
                  width: "100%",
                  backgroundColor: "#DCDCDC",
                  color: "#222222",
                }}
              />
            </div>
          );
        },
      },
      {
        Header: "Organization",
        accessor: "organizationName",
        filterable: true,
        Filter: ({ filter, onChange }) => {
          return (
            <div style={{ position: "relative" }}>
              <input
                onChange={(event) => onChange(event.target.value)}
                value={filter ? filter.value : ""}
                style={{
                  width: "100%",
                  backgroundColor: "#DCDCDC",
                  color: "#222222",
                }}
              />
            </div>
          );
        },
      },
    ]}
    defaultPageSize={20}
    noDataText="No projects found"
     />}
    </FuseAnimate>
  );
}

export default ProjectsList;
