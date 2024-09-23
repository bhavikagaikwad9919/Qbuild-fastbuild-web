import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FuseAnimate from "@fuse/core/FuseAnimate";
import Dropzone from "react-dropzone";
import Typography from "@material-ui/core/Typography";
import { useDispatch, useSelector } from "react-redux";
import {
  importInventory,
  importVendor,
} from "app/main/projects/store/projectsSlice";
import { routes } from "../store/actions/projects.actions";

const useStyles = makeStyles((theme) => ({
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    height: "200px",
    border: "3px dashed #eeeeee",

    color: "#bdbdbd",
    marginBottom: "20px",
  },
}));

function DropZone(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const projectDetails = useSelector(({ projects }) => projects.details);
  const route = useSelector(({ projects }) => projects.routes);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
  }, [props.open]);

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  const handleDrop = (acceptedFiles) => {
    if (acceptedFiles.length) {
      setLoading(true);
      let payload = new FormData();
      payload.append("file", acceptedFiles[0]);
      if (route === "Vendors") {
        dispatch(importVendor({ projectId: projectDetails._id, payload })).then(
          (response) => {
            setLoading(false);
            handleClose();
          }
        );
      }
      if (route === "Inventory") {
        dispatch(
          importInventory({ projectId: projectDetails._id, payload })
        ).then((response) => {
          setLoading(false);
          handleClose();
        });
      }
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" onClose={handleClose}>
      <FuseAnimate animation="transition.expandIn" delay={300}>
        <div className="m-32">
          <Dropzone
            onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
            // acceptedFiles={[
            //   '.csv, text/csv, application/csv, text/x-csv, application/x-csv',
            // ]}
            accept=".csv"
            maxFiles={1}
            multiple={false}
            canCancel={false}
            inputContent="Drop A File"
            styles={{
              dropzone: { width: 400, height: 200 },
              dropzoneActive: { borderColor: "green" },
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps({
                  className: clsx(classes.dropzone, "cursor-pointer"),
                })}
              >
                <input {...getInputProps()} />
                {loading === false ? (
                  <CloudUploadIcon fontSize="large" />
                ) : (
                  <CircularProgress color="secondary" />
                )}
                {route === "Inventory" ? (
                  <>
                    <Typography variant="subtitle1">
                      Import Excel (.csv) for Inventory
                    </Typography>
                    <Typography variant="subtitle1">
                      (File Items will append on exisiting Inventory)
                    </Typography>
                  </>
                ) : route === "Vendors" ? (
                  <>
                    <Typography variant="subtitle1">
                      Import Excel (.csv) for Sub-Contractors
                    </Typography>
                    <Typography variant="subtitle1">
                      (File Items will append on exisiting Sub-Contractors)
                    </Typography>
                  </>
                ) : null}
              </div>
            )}
          </Dropzone>

          {/* <a href='https://fastbuild-dev.s3.ap-south-1.amazonaws.com/sample-template-for-buildings-flats.xlsx'>
            Download Sample Template
          </a> */}
        </div>
      </FuseAnimate>
    </Dialog>
  );
}

export default DropZone;
