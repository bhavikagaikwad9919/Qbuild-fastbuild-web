import React, { useState, forwardRef, useEffect, useImperativeHandle } from "react";
import Dropzone from "react-dropzone";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Fab from "@material-ui/core/Fab";
import clsx from "clsx";
import FuseAnimate from "@fuse/core/FuseAnimate";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Radio from "@material-ui/core/Radio";
import { showMessage } from "app/store/fuse/messageSlice";
import {
  getProject,
  addBuildingAreas,
  deleteBuildingAreas,
  routes,
  closeNewDialog,
  openNewDialog
} from "app/main/projects/store/projectsSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import constants from "app/main/config/constants";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import Backdrop from "@material-ui/core/Backdrop";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  IconButton,
  InputAdornment,
  ListItemSecondaryAction,
  TextField,
} from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";

const useStyles = makeStyles((theme) => ({
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    height: "200px",
    border: "3px dashed #eeeeee",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    marginBottom: "20px",
  },
  root: {
    width: "100%",
    maxWidth: 360,
    maxHeight: "68vh",
    position: "relative",
    overflow: "auto",
    backgroundColor: theme.palette.background.paper,
  },
  listItem: {
    borderBottom: "1px solid #ccc",
    paddingTop: "0px",
    paddingBottom: "0px",
  },
  listItemIcon: {
    minWidth: "30px",
  },
  addButton: {
    position: "fixed",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

let initialValue = {
  building: "",
  wing: "",
  floor: "",
  flat: "",
};

let initialLoadingValue = {
  building: false,
  wing: false,
  floor: false,
  flat: false,
};

const Upload = forwardRef((props, ref) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const buildingsState = useSelector(
    ({ projects }) => projects.details.buildings
  );
  const projectId = useSelector(({ projects }) => projects.details._id);
  const route = useSelector(({ projects }) => projects.routes);
  const loadingState = useSelector(({ projects }) => projects.loading);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [addValue, setAddValue] = useState(initialValue);
  const [addLoading, setAddLoading] = useState(initialLoadingValue);
  const [selectall, setSelectall] = useState({
    wing: true,
    floor: true,
    flat: true,
  });
  const [open, setOpen] = useState(false);
  const team = useSelector(({ projects }) => projects.details.team);
  const [access, setAccess] = useState();
  const role = useSelector(({ auth }) => auth.user);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);
 
  useEffect(() => {
    team.map((t)=>{
      if(t._id === role.data.id && t.role === "owner"|| role.role === 'admin')
      {
        setAccess(true)
      }else if(t._id === role.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Buildings And Areas");
         if(member[0] === "Buildings And Areas")
         {
           setAccess(true)
         }
      }
   })
  }, [access]);

  
  let buildings = [];
  let wings = [];
  let floors = [];
  let flats = [];

  buildingsState.forEach((build) => {
    buildings.push({ _id: build._id, name: build.name });
    if (value.building.name === build.name) {
      build.wings.forEach((wing) => {
        wings.push({ _id: wing._id, name: wing.name });
        if (value.wing.name === wing.name) {
          wing.floors.forEach((floor) => {
            floors.push({ _id: floor._id, name: floor.index });
            if (value.floor.name === floor.index) {
              floor.flats.forEach((flat) => {
                flats.push({ _id: flat._id, name: flat.number });
              });
            }
          });
        }
      });
    }
  });

  // The component instance will be extended
  // with whatever you return from the callback passed
  // as the second argument
  useImperativeHandle(ref, () => ({
    assignBuilding() {
      let select = value;
      select.building = value.building;
      if (selectall.wing === true) {
        select.wing = "all";
      }
      if (selectall.floor === true) {
        select.floor = "all";
      }
      if (selectall.flat === true) {
        select.flat = "all";
      }
      props.onSelectedBuilding(select);
    },
  }));

  const handleDrop = (acceptedFiles) => {
    setLoading(true);
    let uploadFile = new FormData();
    uploadFile.append("file", acceptedFiles[0]);

    const request = axios({
      method: "post",
      url: `${constants.BASE_URL}/projects/${projectId}/buildings/upload`,
      data: uploadFile,
      headers: { "Content-Type": "multipart/form-data" },
    });
    request.then((response) => {
      if (response.data.code === 200) {
        setLoading(false);
        if (open === true) {
          setOpen(false);
        }
        dispatch(
          showMessage({
            message: "Building Uploaded",
            variant: "success",
          })
        );

        dispatch(getProject(projectId));
      } else {
        setLoading(false);
        dispatch(
          showMessage({
            message: `${response.data.message}`,
            variant: "error",
          })
        );
      }
    });
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  function closeComposeDialog() {
    dispatch(closeNewDialog());
 }


  const handleAdd = (prop) => {
    let form = {};
    if (prop === "building") {
      setAddLoading({ ...addLoading, building: true });
      form.buildingName = addValue.building;
    }
    if (prop === "wing") {
      setAddLoading({ ...addLoading, wing: true });
      form.buildingId = value.building._id;
      form.wingName = addValue.wing;
    }
    if (prop === "floor") {
      setAddLoading({ ...addLoading, floor: true });
      form.buildingId = value.building._id;
      form.wingId = value.wing._id;
      form.floorName = addValue.floor;
    }
    if (prop === "flat") {
      setAddLoading({ ...addLoading, flat: true });
      form.buildingId = value.building._id;
      form.wingId = value.wing._id;
      form.floorId = value.floor._id;
      form.flatNumber = addValue.flat;
    }
    dispatch(addBuildingAreas({ projectId, form })).then(() => {
      dispatch(routes("Upload"))
      setAddValue(initialValue);
      setValue(initialValue);
      setAddLoading(initialLoadingValue);
    });
  };

  const handleDelete = (prop, id) => {
    let form = {};
    if (prop === "building") {
      form.buildingId = id;
    }
    if (prop === "wing") {
      form.buildingId = value.building._id;
      form.wingId = id;
    }
    if (prop === "floor") {
      form.buildingId = value.building._id;
      form.wingId = value.wing._id;
      form.floorId = id;
    }
    if (prop === "flat") {
      form.buildingId = value.building._id;
      form.wingId = value.wing._id;
      form.floorId = value.floor._id;
      form.flatId = id;
    }
    dispatch(deleteBuildingAreas({ projectId, form })).then(() => {
      dispatch(routes("Upload"))
      setLoading(false);
      setAddValue(initialValue);
      setValue(initialValue);
    });
  };

  return !buildingsState.length ? (
    <div className="m-32">
      <Dropzone
        onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        maxFiles={1}
        multiple={false}
        canCancel={false}
        inputContent="Drop A File"
        styles={{
          dropzone: { width: 400, height: 200 },
          dropzoneActive: { borderColor: "green" },
        }}
        disabled={access === true ? false :true}
      >
        {/* <Dropzone
				onDrop={handleDrop}
				accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				multiple={false}
			> */}
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
              <CircularProgress />
            )}

            <Typography variant="subtitle1">
              Upload Buildngs, Wings, Areas (xls,xlsx)
            </Typography>
          </div>
        )}
      </Dropzone>

      <a href="https://fastbuild-dev.s3.ap-south-1.amazonaws.com/sample-template-for-buildings-flats.xlsx">
        Download Sample Template
      </a>
    </div>
  ) : (
    <>
      <div className="flex flex-1 w-full gap-10">
        <Backdrop className={classes.backdrop} open={loadingState}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <FuseAnimate animation="transition.slideUpIn" delay={300}>
          <List
            className={clsx(classes.root, "w-1/4 shadow-1 hover:shadow-5")}
            component="nav"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Buildings
              </ListSubheader>
            }
          >
            <div
              style={{
                height: "60vh",
                overflow: "auto",
                position: "relative",
              }}
              className="flex flex-1 flex-col justify-between"
            >
              <div>
                {buildings.map((item) => (
                  <ListItem className={classes.listItem} key={item._id}>
                    <ListItemIcon className={classes.listItemIcon}>
                      <Radio
                        edge="start"
                        checked={value.building.name === item.name}
                        onChange={(event, newValue) => {
                          setValue({
                            building: item,
                            wing: "",
                            floor: "",
                            flat: "",
                          });
                        }}
                        disabled={access === true ? false :true}
                        value={item.name}
                      />
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        size="small"
                        aria-label="delete"
                        onClick={() => handleDelete("building", item._id)}
                        disabled={access === true ? false :true}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </div>
              {route === "Upload" ? (
                <TextField
                  className="p-6"
                  variant="outlined"
                  size="small"
                  onChange={(event) =>
                    setAddValue({ ...addValue, building: event.target.value })
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {addLoading.building ? (
                          <CircularProgress size={20} />
                        ) : (
                          <IconButton
                            color="primary"
                            disabled={
                              addValue.building.length > 0 ? false : true
                            }
                            className="p-0"
                            onClick={() => handleAdd("building")}
                            disabled={access === true ? false :true}
                          >
                            <AddCircleIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                  }}
                />
              ) : null}
            </div>
          </List>
        </FuseAnimate>
        {value.building !== "" ? (
          <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <List
              className={clsx(classes.root, "w-1/4 shadow-1 hover:shadow-5")}
              component="nav"
              aria-label="secondary mailbox folders"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Wings
                </ListSubheader>
              }
            >
              <div
                style={{
                  height: "60vh",
                  overflow: "auto",
                  position: "relative",
                }}
                className="flex flex-1 flex-col justify-between"
              >
                <div>
                  {route === "Plans" ? (
                    <ListItem className={classes.listItem}>
                      <ListItemIcon className={classes.listItemIcon}>
                        <Radio
                          edge="start"
                          checked={selectall.wing === true}
                          onChange={(event, newValue) => {
                            setSelectall({ ...selectall, wing: true });
                            setValue({
                              ...value,
                              wing: "",
                              floor: "",
                              flat: "",
                            });
                          }}
                          // value={item}
                        />
                      </ListItemIcon>
                      <ListItemText primary="All Wings" />
                    </ListItem>
                  ) : null}
                  {wings.map((item) => (
                    <>
                      <ListItem className={classes.listItem} key={item._id}>
                        <ListItemIcon className={classes.listItemIcon}>
                          <Radio
                            edge="start"
                            checked={value.wing.name === item.name}
                            onChange={(event, newValue) => {
                              setValue({
                                ...value,
                                wing: item,
                                floor: "",
                                flat: "",
                              });
                              setSelectall({ ...selectall, wing: false });
                            }}
                            value={item.name}
                          />
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            aria-label="delete"
                            onClick={() => handleDelete("wing", item._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </>
                  ))}
                </div>
                {route === "Upload" ? (
                  <TextField
                    className="p-6"
                    variant="outlined"
                    size="small"
                    onChange={(event) =>
                      setAddValue({ ...addValue, wing: event.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {addLoading.wing ? (
                            <CircularProgress size={20} />
                          ) : (
                            <IconButton
                              color="primary"
                              disabled={addValue.wing.length > 0 ? false : true}
                              className="p-0"
                              onClick={() => handleAdd("wing")}
                            >
                              <AddCircleIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : null}
              </div>
            </List>
          </FuseAnimate>
        ) : null}
        {value.wing !== "" ? (
          <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <List
              className={clsx(classes.root, "w-1/4 shadow-1 hover:shadow-5")}
              component="nav"
              aria-label="secondary mailbox folders"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Floors
                </ListSubheader>
              }
            >
              <div
                style={{
                  height: "60vh",
                  overflow: "auto",
                  position: "relative",
                }}
                className="flex flex-1 flex-col justify-between"
              >
                <div>
                  {route === "Plans" ? (
                    <ListItem className={classes.listItem}>
                      <ListItemIcon className={classes.listItemIcon}>
                        <Radio
                          edge="start"
                          checked={selectall.floor === true}
                          onChange={(event, newValue) => {
                            setSelectall({ ...selectall, floor: true });
                            setValue({ ...value, floor: "", flat: "" });
                          }}
                          // value={item}
                        />
                      </ListItemIcon>
                      <ListItemText primary="All Floors" />
                    </ListItem>
                  ) : null}
                  {floors.map((item) => (
                    <>
                      <ListItem className={classes.listItem} key={item._id}>
                        <ListItemIcon className={classes.listItemIcon}>
                          <Radio
                            edge="start"
                            checked={value.floor.name === item.name}
                            onChange={(event, newValue) => {
                              setValue({ ...value, floor: item });
                              setSelectall({ ...selectall, floor: false });
                            }}
                            value={item.name}
                          />
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            aria-label="delete"
                            onClick={() => handleDelete("floor", item._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </>
                  ))}
                </div>
                {route === "Upload" ? (
                  <TextField
                    className="p-6"
                    variant="outlined"
                    size="small"
                    onChange={(event) =>
                      setAddValue({ ...addValue, floor: event.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {addLoading.floor ? (
                            <CircularProgress size={20} />
                          ) : (
                            <IconButton
                              color="primary"
                              disabled={
                                addValue.floor.length > 0 ? false : true
                              }
                              className="p-0"
                              onClick={() => handleAdd("floor")}
                            >
                              <AddCircleIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : null}
              </div>
            </List>
          </FuseAnimate>
        ) : null}
        {value.floor !== "" ? (
          <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <List
              className={clsx(classes.root, "w-1/4 shadow-1 hover:shadow-5")}
              component="nav"
              aria-label="secondary mailbox folders"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Areas
                </ListSubheader>
              }
            >
              <div
                style={{
                  height: "60vh",
                  overflow: "auto",
                  position: "relative",
                }}
                className="flex flex-1 flex-col justify-between"
              >
                <div>
                  {route === "Plans" ? (
                    <ListItem className={classes.listItem}>
                      <ListItemIcon className={classes.listItemIcon}>
                        <Radio
                          edge="start"
                          checked={selectall.flat === true}
                          onChange={(event, newValue) => {
                            setSelectall({ ...selectall, flat: true });
                            setValue({ ...value, flat: "" });
                          }}
                          // value={item}
                        />
                      </ListItemIcon>
                      <ListItemText primary="All Flats" />
                    </ListItem>
                  ) : null}
                  {flats.map((item) => (
                    <>
                      <ListItem className={classes.listItem} key={item._id}>
                        {route === "Plans" ? (
                          <ListItemIcon className={classes.listItemIcon}>
                            <Radio
                              edge="start"
                              checked={value.flat.name === item.name}
                              onChange={(event, newValue) => {
                                setValue({ ...value, flat: item });
                                setSelectall({ ...selectall, flat: false });
                              }}
                              value={item.name}
                            />
                          </ListItemIcon>
                        ) : null}
                        <ListItemText primary={item.name} />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            size="small"
                            aria-label="delete"
                            onClick={() => handleDelete("flat", item._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    </>
                  ))}
                </div>
                {route === "Upload" ? (
                  <TextField
                    className="p-6"
                    variant="outlined"
                    size="small"
                    onChange={(event) =>
                      setAddValue({ ...addValue, flat: event.target.value })
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {addLoading.flat ? (
                            <CircularProgress size={20} />
                          ) : (
                            <IconButton
                              color="primary"
                              disabled={addValue.flat.length > 0 ? false : true}
                              className="p-0"
                              onClick={() => handleAdd("flat")}
                            >
                              <AddCircleIcon />
                            </IconButton>
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : null}
              </div>
            </List>
          </FuseAnimate>
        ) : null}
      </div>
      {route === "Upload" ? (
        <FuseAnimate animation="transition.expandIn" delay={300}>
      
          <Fab
            color="primary"
            aria-label="upload"
            className={classes.addButton}
            onClick={() => dispatch(openNewDialog())}
            disabled={access === true ? false :true}
          >
            <CloudUploadIcon />
          </Fab>
        </FuseAnimate>
      ) : null}

      <Dialog open={projectDialog.props.open} maxWidth="sm" onClose={closeComposeDialog}>
        {/* <DialogTitle id="alert-dialog-slide-title">{'Upload building excel file'}</DialogTitle> */}
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <div className="m-32">
            <Dropzone
              onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              maxFiles={1}
              multiple={false}
              canCancel={false}
              inputContent="Drop A File"
              styles={{
                dropzone: { width: 400, height: 200 },
                dropzoneActive: { borderColor: "green" },
              }}
              disabled={access === true ? false :true}
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
                    <CircularProgress />
                  )}
                  <Typography variant="subtitle1">
                    Upload Buildngs, Wings, Flats (xls,xlsx)
                  </Typography>
                </div>
              )}
            </Dropzone>

            <a href="https://fastbuild-dev.s3.ap-south-1.amazonaws.com/sample-template-for-buildings-flats.xlsx">
              Download Sample Template
            </a>
          </div>
        </FuseAnimate>
      </Dialog>
    </>
  );
});

export default React.memo(Upload);
