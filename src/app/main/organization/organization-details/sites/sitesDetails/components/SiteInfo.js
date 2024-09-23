import React, { useRef, useState, useEffect } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import {
  Divider,
  Typography,
  Button,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  IconButton,
  AppBar,
  Toolbar
} from "@material-ui/core";
import "react-table-6/react-table.css";
import { TextFieldFormsy } from "@fuse/core/formsy";
import Formsy from "formsy-react";
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import { updateSite  } from "../../store/sitesSlice";
import Dropzone from "react-dropzone";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Accordion, AccordionSummary, AccordionDetails,} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputLabel from "@material-ui/core/InputLabel";
import { Icon } from "@material-ui/core";
import FuseUtils from "@fuse/utils";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  appBar: {
    position: 'relative',
  },
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

function SiteInfo(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const details = useSelector(({ sites }) => sites.details);
  const [editOpen, setEditOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false); 
  const formRef = useRef(null);
  const [values, setValues] = useState({
    _id:'',
    name: '',
    address: '',
    reraNo: '',
    ctsNo: '',
  });
  const [image, setImage] = useState({
    name: "",
    file: "",
    url: "",
  });
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [photoDate, setPhotoDate]=React.useState(new Date());
  const [photoData, setPhotoData]=  useState([]);
  const [imageId, setImageId] = useState('');
  const [deletedPhoto, setDeletedPhoto] = useState([]);
  const [removePhoto, setRemovePhoto] = useState({})

  const [hide, setHide] = useState();
  const members = useSelector( ({ organizations }) => organizations.members);
  const user = useSelector(({ auth }) => auth.user);

  useEffect(() => {
    let member = members.filter((t)=> t._id === user.data.id && t.designation === "CIDCO Official");
  
    if(member.length > 0){
      setHide(true)
    }else{
      setHide(false)
    }
  }, [members]);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  function editSite(data){
    setEditOpen(true)
    setValues({
      _id:data._id,
      name:data.name,
      address:data.address,
      reraNo:data.reraNo,
      ctsNo: data.ctsNo
    })

    if(data.images !== undefined){
      setPhotoData(data.images)
    }else{
      setPhotoData([])
    }
  }

  function disableButton() {
    setIsFormValid(false);
  }
  
  function enableButton() {
    setIsFormValid(true);
  }

  const handleDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.readAsBinaryString(acceptedFiles[0]);
    reader.onload = () => {
      setImage({
        ...image,
        name: acceptedFiles[0].name,
        file: acceptedFiles[0],
        url: `data:${acceptedFiles[0].type};base64,${btoa(reader.result)}`,
      });
      setLoading(false);
    };

    reader.onerror = () => {
      console.log("error on load image");
    };
  };

  const handleClose = () => {
    props.close();
    setAddOpen(false);
  };

  const handleClosePhoto =()=>{
    setAddOpen(false);
    setOpen(false);
    setRemovePhoto({});
  }

  function  handleOpenFirst(sitePhoto){
    setDialogType("Edit");
    setAddOpen(true);
    setPhotoDate(sitePhoto.photoDate);
    if(sitePhoto.siteImage === undefined){
      setImage({
        name: "",
        file: "",
        url: "",
      })
    }else{
      setImage(sitePhoto.siteImage);
    }

    setImageId(sitePhoto._id);
  }

  const addSitePhotos= () =>{
    let temp = [];
    photoData.map((pd)=>{
       temp.push(pd);
    })
    let data = {
      _id: FuseUtils.generateGUID(),
      photoDate: photoDate,
      siteImage: image
    }

    temp.push(data)
    setAddOpen(false);
    setImage({
      name: "",
      file: "",
      url: "",
    });

    setPhotoDate(new Date())
    setPhotoData(temp)

    let deleteImages = JSON.parse(JSON.stringify(deletedPhoto));
    if(removePhoto.url !== '' && removePhoto.url !== undefined){
      deleteImages.push(removePhoto);
    }
    setDeletedPhoto(deleteImages);
  }

  const changeSitePhoto =()=>{
    let mat2 = JSON.parse(JSON.stringify(photoData));
    mat2.map(build =>{
      if(build._id === imageId){
        build.siteImage = image;
        build.photoDate = photoDate;
      }
    })
    setImage({
      name: "",
      file: "",
      url: "",
    });
    setPhotoDate(new Date())
    setPhotoData(mat2)
    setAddOpen(false);

    let deleteImages = JSON.parse(JSON.stringify(deletedPhoto));
    if(removePhoto.url !== '' && removePhoto.url !== undefined){
      deleteImages.push(removePhoto);
    }
    setDeletedPhoto(deleteImages);
  }

  const handleDateChange = (date) => {
    setPhotoDate(date);
  };

  const handleSiteClose=()=>{
    setEditOpen(false);
    setAddOpen(false); 
    setDeletedPhoto([]);
  }
    
  const disableButton1 = () => {
    return (
      image.url.length > 0 
    );
  };

  const disableButton2 = () => {
    return (
      photoData.length > 0 &&
      values.name.length > 0
    );
  };

  const removeImages = (image) => {
    setRemovePhoto(image);
    setImage({ ...image, url: "", file: "" })
  }

  const deletePhotoData = (id) =>{
    let photos = JSON.parse(JSON.stringify(photoData));
    let deletePhoto = photos.filter((mat) => mat._id === id);
    let filterPhotos = photos.filter((mat) => mat._id !== id)
    let deleteImages = JSON.parse(JSON.stringify(deletedPhoto));
    deletePhoto.forEach((image)=>{
      deleteImages.push(image);
    })
    setPhotoData(filterPhotos);
    setDeletedPhoto(deleteImages);
  }

  function handleSubmit () {
    setPageLoading(true);
    setEditOpen(false);
    let siteImages = [], deletedImages = [], siteDate = [];
    let site = new FormData();
    site.set("address",values.address);
    site.set("name", values.name);
    site.set("reraNo", values.reraNo);
    site.set("ctsNo", values.ctsNo);


    photoData.forEach((file) => {
      if(file.siteImage.file === undefined){
        siteImages.push(file)
      }else{
        siteDate.push(file.photoDate)
        site.append("site",file.siteImage.file);
      }
    });

    site.set("siteDate",JSON.stringify(siteDate));
    site.set("siteImages",JSON.stringify(siteImages));

    deletedPhoto.forEach((file) => {
      if(file.siteImage === undefined){
        deletedImages.push(file)
      }else{
        if(file.siteImage.file === undefined){
          deletedImages.push(file.siteImage)
        }
      }  
    });
    site.append("deletedImages",JSON.stringify(deletedImages));

    dispatch(
      updateSite({
        organizationId: props.organizationId,
        siteId: details._id,
        site: site,
      })
    ).then((response)=>{
      setPageLoading(false);
    });

    setAddOpen(false);
    setOpen(false);
    setPhotoData([]);
    setDeletedPhoto([]);
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={pageLoading}>
        <CircularProgress color='inherit' />
      </Backdrop>
      <FuseAnimate animation="transition.slideUpIn">
       <>
          <div className="p-16 sm:p-24">
            <div className="flex flex-1 w-full mb-12">
              <div className="mr-10">
                <Typography className= "font-bold">Name:</Typography>
                <Typography variant="subtitle2">
                  {details.name}
                </Typography>
              </div>
            </div>
            <Divider />
            {hide === false ?
              <div className="flex flex-1 w-full my-12">
                <div className="mr-10">
                  <Typography className= "font-bold">Rera No:</Typography>
                  <Typography variant="subtitle2">{details.reraNo}</Typography>
                </div>
                <div className="mr-10">
                  <Typography className= "font-bold">CTS No:</Typography>
                  <Typography variant="subtitle2">{details.ctsNo}</Typography>
                </div>
              </div>
            :null}
            
            <Divider />
            <div className="flex flex-1 w-full mb-12">
              <div className="mr-10">
                <Typography className= "font-bold">Address:</Typography>
                <Typography variant="Subtitle2" className="pt-4">
                  {details.address}
                </Typography>
              </div>
            </div>
            {details.images !== undefined ?
              details.images.length > 0 ?
                <Accordion variant="outlined" >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <div className="grid grid-cols-2 divide-x-8 divide-gray-400">
                     <Typography color="textPrimary" className="font-bold"> Site Photos</Typography> 
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="flex flex-col w-full">
                      <List
                       component="nav"
                       aria-label="mailbox folders"
                      >
                        <div class="grid grid-cols-2">
                        {details.images.map((img) => (
                          <div className="flex flex-1 w-full mb-12">
                            <div className="mr-10">
                              <Typography className= "font-bold">{moment(img.photoDate).format('DD-MM-YYYY')}</Typography>
                              {img.siteImage !== undefined?
                                <img src={img.siteImage.url} height="350" width="350" alt="image" />
                              :null}
                            </div>
                          </div>
                        ))}
                        </div>
                      </List>
                    </div>
                  </AccordionDetails>
                </Accordion>
               :
              null
            :null}
           
            <Divider />
          </div>
          <div className="flex w-full items-end justify-start ml-20 mb-25">
            <>
              {hide === false ?
                <Button
                  style={{ backgroundColor: "orange" }}
                  variant="contained"
                  onClick={() => editSite(details)}
                >
                  Update Info
                </Button>
              :null}
            </> 
          </div>
       </>
      </FuseAnimate>
      <Formsy
        onValid={enableButton}
        onInvalid={disableButton}
        ref={formRef}
      >
       <Dialog open={editOpen} className={classes.dialog}  fullWidth maxWidth='sm'>
         <FuseAnimateGroup
           enter={{ animation: 'transition.slideUpBigIn' }}
           leave={{ animation: 'transition.slideUpBigOut' }}
         >
           <DialogTitle id='checklist-dialog-title'>Update Site Info</DialogTitle>
           <DialogContent>
             <div className="flex flex-1 flex-col">
               <TextFieldFormsy
                 className="mb-24"
                 label="Name"
                 autoFocus
                 id="name"
                 name="name"
                 value={values.name}
                 onChange={handleChange("name")}
                 variant="outlined"
                 required
               />
               <TextFieldFormsy
                 className="mb-24"
                 label="Address"
                 autoFocus
                 id="address"
                 name="address"
                 value={values.address}
                 onChange={handleChange("address")}
                 variant="outlined"
                 required
                 multiline
                 rows={2}
               />
                <div class="grid grid-cols-2 divide-x divide-gray-400">
                <TextFieldFormsy
                 className="w-3/4 mb-24"
                 label="Rera No"
                 autoFocus
                 id="reraNo"
                 name="reraNo"
                 value={values.reraNo}
                 onChange={handleChange("reraNo")}
                 variant="outlined"
               />
               <TextFieldFormsy
                 className="w-3/4 mb-24"
                 label="CTS No"
                 autoFocus
                 id="ctsNo"
                 name="ctsNo"
                 value={values.ctsNo}
                 onChange={handleChange("ctsNo")}
                 variant="outlined"
                 required
               />
                </div>
                <Accordion variant="outlined" >
                    <AccordionSummary
                       expandIcon={<ExpandMoreIcon />}
                       aria-controls="panel1a-content"
                       id="panel1a-header"
                    >
                        <div className="grid grid-cols-2 divide-x-8 divide-gray-400">
                          <Typography color="textPrimary">Upload Site Photo</Typography> 
                        </div>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="flex flex-col w-full">
                      <List
                    component="nav"
                    // className={classes.root}
                    aria-label="mailbox folders"
                  >
                    
                    {photoData.map((item) => (
                      <React.Fragment>
                        <Grid container alignItems="center" direction="row">
                          <Grid item xs={11}>
                            <ListItem
                              button
                              key={item._id}
                                  onClick={(ev) => {
                                    handleOpenFirst(
                                      item
                                    );
                                  }}
                            >
                              {item.siteImage === undefined ?
                                <ListItemText
                                  primary={"Date - " + moment(item.photoDate).format("DD-MM-YYYY") + " Image - "}
                                />
                              :
                                <ListItemText
                                  primary={"Date - " + moment(item.photoDate).format("DD-MM-YYYY") + " Image - " + item.siteImage.name}
                                />
                              }  
                            </ListItem>
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton
                              onClick={() => deletePhotoData(item._id)}
                              variant="contained"
                            >
                              <Icon className={classes.delete}>delete</Icon>
                            </IconButton>
                          </Grid>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </List>
                  <div className="mt-10">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() =>{
                                   setAddOpen(true)
                                   setDialogType("new")
                                }}
                            >
                               Add
                            </Button>
                        </div>
                      
                      </div>
                   
                        
                    </AccordionDetails>
                </Accordion>
             </div>
           </DialogContent>
            {/* site info  */}
            <DialogActions className="justify-start pl-16">
              <Button
               variant="contained"
               color="primary"
               type="submit"
               disabled={!disableButton2()} 
               onClick={() => handleSubmit()}
              >
                save
              </Button>
              <Button onClick={() => handleSiteClose()} variant='contained'>
               Cancel
              </Button>
            </DialogActions>
          </FuseAnimateGroup>
        </Dialog>

        <Dialog
          open={addOpen}
          onClose={()=>handleClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <AppBar position="static" elevation={1}>
            <Toolbar>
              <Typography variant='subtitle1' color='inherit'>
                {dialogType === 'new' ? 'Add Image Details' : 'Update Image Details'}
              </Typography>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <DatePicker
                required
                format="dd/MM/yyyy"
                label="Select Date"
                className="w-full mb-10 "
                value={photoDate}
                onChange={handleDateChange}
                inputVariant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </MuiPickersUtilsProvider>
            {image.url===  ''?(  
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
            ):
            (
              <>
                <img src={image.url} height="350" width="350" alt="image" />
                <div className="flex mt-10 gap-10">
                  <Button
                    variant="contained"
                    onClick={() => removeImages(image)}
                  >
                    Remove
                  </Button>
                </div>
              </>
            )}
              
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>handleClosePhoto()} color="primary">
              CANCEL
            </Button>
              {dialogType === "Edit" ? (
                <Button disabled={!disableButton1()}  onClick={() => changeSitePhoto()} color="primary" autoFocus>
                  OK
                </Button>
              ) : (
                <Button disabled={!disableButton1()} onClick={() => addSitePhotos()} color="primary" autoFocus>
                  OK
                </Button>
              )}
          </DialogActions>
        </Dialog>
      </Formsy>
    </React.Fragment>
  );
}

export default SiteInfo;
