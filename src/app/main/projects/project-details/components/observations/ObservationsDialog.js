import FuseUtils from "@fuse/utils";
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { addObservation, closeNewDialog, } from "app/main/projects/store/projectsSlice";
import { useDispatch, useSelector } from "react-redux";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const ObservationsDialog = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loading = useSelector(({ projects }) => projects.loading);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const observations = useSelector(
    ({ projects }) => projects.observations.observationsArray
  );
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);

  // useEffect(() => {
  //   if (props.open) {
  //     setOpen(true);
  //   }
  // }, [props.open]);



  useEffect(() => {
    if (projectDialog.props.open) {
      setOpen(true);
    }
  }, [projectDialog.props.open]);

  function handleUploadChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.readAsBinaryString(file);

    reader.onload = () => {
      setImages([
        ...images,
        {
          id: FuseUtils.generateGUID(),
          url: `data:${file.type};base64,${btoa(reader.result)}`,
          type: "image",
          file: file,
        },
      ]);
    };

    reader.onerror = () => {
      console.log("error on load image");
    };
  }
  const disableButton = () => {
    return title.length > 0;
  };
  const handleSubmit = () => {
      const check=observations.filter((item) => item.title === title);
  
    if(check.length > 0)
    {
      dispatchWarningMessage(dispatch, "Observation already added.Please Check!!!");
    }else{
      let payload = new FormData();
      payload.set("title", title);
      payload.set("description", description);
      if (images.length) {
        images.forEach((img) => {
          payload.append("picture", img.file);
        });
      }
    
      dispatch(addObservation({ projectId, payload })).then((response) => {
        setTitle("");
        setImages([]);
        closeComposeDialog();
      });
    }

  };

  function closeComposeDialog() {
    dispatch(closeNewDialog());
  }

  return (
    <Dialog open={open} {...projectDialog.props} fullWidth maxWidth="md">
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <DialogTitle>Add Observation</DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-10">
        <FormControl variant="outlined" className="mt-8">
          <InputLabel id="demo-simple-select-outlined-label">
            Observation
          </InputLabel>
           <Select
             labelId="demo-simple-select-outlined-label"
             id="demo-simple-select-outlined"
             value={title}
             onChange={(event) => setTitle(event.target.value)}
             label="Observation">
                <MenuItem value="Doors & Windows">Doors & Windows</MenuItem>
                <MenuItem value="Columns & Beam reinforcement">Columns & Beam reinforcement</MenuItem>
                <MenuItem value="Uneven settlement of flooring">Uneven settlement of flooring</MenuItem>
                <MenuItem value="Foundation settlement">Foundation settlement</MenuItem>
                <MenuItem value="Deflections / sagging ">Deflections / sagging</MenuItem>
                <MenuItem value="Major cracks in column /beams">Major cracks in column /beams</MenuItem>
                <MenuItem value="Seepages / Leakages">Seepages / Leakages</MenuItem>
                <MenuItem value="Condition of Staircase area / Comman passages">Condition of Staircase area / Comman passages</MenuItem>
                <MenuItem value="Lift Walls">Lift Walls</MenuItem>
                <MenuItem value="U.G. Tank">U.G. Tank</MenuItem>
                <MenuItem value="Condition OHT / Column">Condition OHT / Column</MenuItem>
                <MenuItem value="Parapet at terraces">Parapet at terraces</MenuItem>
                <MenuItem value="Chajjas">Chajjas</MenuItem>
                <MenuItem value="Common areas">Common areas</MenuItem>
                <MenuItem value="Toilet blocks">Toilet blocks</MenuItem>
                <MenuItem value="Terrace / Water proofing">Terrace / Water proofing</MenuItem>
                <MenuItem value="Test carried out on structure/ observations">Test carried out on structure/ observations</MenuItem>
                <MenuItem value="Distress Mapping Plan & photographs">Distress Mapping Plan & photographs</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
           </Select>
         </FormControl>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <div className="flex justify-center sm:justify-start flex-wrap -mx-8">
            <label
              htmlFor="button-file"
              className={clsx(
                classes.productImageUpload,
                "flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
              )}
            >
              <input
                accept="image/*"
                className="hidden"
                id="button-file"
                type="file"
                onChange={handleUploadChange}
              />
              <Icon fontSize="large" color="action">
                cloud_upload
              </Icon>
            </label>
            {images.map((media) => (
              <div
                //   onClick={() => setFeaturedImage(media.id)}
                //   onKeyDown={() => setFeaturedImage(media.id)}
                role="button"
                tabIndex={0}
                className={clsx(
                  "flex items-center justify-center relative w-128 h-128 rounded-8 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"
                )}
                key={media.id}
              >
                <img
                  className="max-w-none w-auto h-full"
                  src={media.url}
                  alt="product"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <div className="flex items-end gap-10">
          <Button
            variant="contained"
            color="primary"
            disabled={!disableButton()}
            onClick={handleSubmit}
          >
            Save
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              closeComposeDialog()
            }}
          >
            Cancel
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ObservationsDialog;
