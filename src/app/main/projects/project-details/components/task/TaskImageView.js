import {
  Button,
  Dialog,
  DialogContent,
  makeStyles,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    height: "200px",
    width: "500px",
    border: "3px dashed #eeeeee",
    backgroundColor: "#fafafa",
    color: "#bdbdbd",
    marginBottom: "20px",
  },
}));

const TaskImageView = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({
    name: "",
    file: "",
    url: "",
  });

  useEffect(() => {
    if (props.open) {
      setOpen(true);
    }
    if (props.data.file === undefined) {
      setImage({ name: props.data.name, url: "" });
    } else {
      setImage({ name: props.data.name, url: props.data.file });
    }
    // if (props.data.file !== "") {

    // }
  }, [props.open, props.data.name, props.data.file]);

  const handleDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.readAsBinaryString(acceptedFiles[0]);

    reader.onload = () => {
      setImage({
        ...image,
        file: acceptedFiles[0],
        url: `data:${acceptedFiles[0].type};base64,${btoa(reader.result)}`,
      });
      setLoading(false);
    };

    reader.onerror = () => {
      console.log("error on load image");
    };
  };

  const saveImage = () => {
    props.saveImage(image);
    handleClose();
  };

  const handleClose = () => {
    props.close();
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        {image.url === "" ? (
          <Dropzone
            onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
            accept="image/*"
            maxFiles={1}
            multiple={false}
            canCancel={false}
            inputContent="Drop A File"
            styles={{
              // dropzone: { width: 400, height: 200 },
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
                  <CircularProgress />
                )}

                <Typography variant="subtitle1">Upload Image</Typography>
              </div>
            )}
          </Dropzone>
        ) : (
          <>
            <img src={image.url} alt="image" />
            <div className="flex mt-10 gap-10">
              <Button variant="contained" color="primary" onClick={saveImage}>
                Save
              </Button>
              <Button
                variant="contained"
                onClick={() => setImage({ ...image, url: "", file: "" })}
              >
                Remove
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskImageView;
