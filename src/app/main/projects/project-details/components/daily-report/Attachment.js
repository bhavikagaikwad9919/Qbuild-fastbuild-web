import React, { useRef, useState, useEffect } from 'react';
import FuseUtils from '@fuse/utils';
import { Typography, Icon, IconButton, Fab, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { updateAttachments, uploadAttachments, deleteAttachments,
  saveReport,
  openEditDialog,
  closeNewDialog,
  getDetailReport, } from 'app/main/projects/store/projectsSlice';
  import {
    Button,
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
  } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import ReactFileViewer from "react-file-viewer";
import PrismaZoom from "react-prismazoom";
import { grey, blue } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) =>({
  addButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 99,
  },
  delete: {
    color: "red",
  },
  view: {
    color: grey[400],
    "&:hover": {
      color: blue[400],
    },
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

function Attachment(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const attachments = useSelector(({ projects }) => projects.attachments);
  const [files, setFiles] = React.useState(attachments);
  const [attachId, setAttachId] = useState("");
  const loading = useSelector(({ projects }) => projects.loading);
  const [delete1, setDelete1] = useState(false);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [deleteAccess, setDeleteAccess] = useState();
  const [createAccess, setCreateAccess] = useState();
  const team = useSelector(({ projects }) => projects.details.team);
  const role = useSelector(({ auth }) => auth.user);
  const [viewOpen, setViewOpen] = useState();
  const [file, setFile] = useState("");
  const [fileType, setFileType] = useState("");
  const [title, setTitle] = useState("");

  const inputFile = useRef(null);
  const onButtonClick = () => {
    inputFile.current.click();
  };

  const onError = e => {
    console.log(e, "error in file-viewer");
  };

  let attachmentList = [];
  attachmentList = [...attachments];

  useEffect(() => {
    team.map((t)=>{
     if(t._id === role.data.id && t.role === "owner"|| role.role === 'admin' || role.role === 'purchaseOfficer')
     {
       setDeleteAccess(true);
       setCreateAccess(true);
     }else if(t._id === role.data.id && t.role !== "owner")
     {
       setDeleteAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Remove Daily Data Entries"));
       setCreateAccess(t.tab_access.includes("Daily Data") || t.tab_access.includes("Create/Update Daily Data"));
     }
    })
   }, []);


  useEffect(() => {
    dispatch(updateAttachments(files));
  }, [files]);

  function handleUploadChange(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    } else {
      props.onSelectFiles(file);
      // let attach = {
      //   _id: FuseUtils.generateGUID(),
      //   name: file.name,
      //   size: file.size,
      // };
      //setFiles([...files, attach]);

      if(props.data.Dialogtype === 'edit')
      {
        let bodyFormData = new FormData();
        bodyFormData.append("attachments", file);
        dispatch(uploadAttachments({ projectId, reportId : props.data.data._id, Data : bodyFormData})).then(
          (response) => {
            dispatch(getDetailReport({ projectId,reportId:props.data.data._id})).then(
              (response) => {
                let row = {
                  "_id": response.payload._id,
                  "createdAt": response.payload.createdAt,
                  "submittedDate": response.payload.submittedDate,
                  "approvalDate": response.payload.approvalDate,
                  "status": response.payload.status === 0 ? 'Inactive' :response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' :response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted':null,
                }
                dispatch(openEditDialog(row));
              }
            );
          }
        );
      }else{
        let bodyFormData = new FormData();
        bodyFormData.set("wing", "");
        bodyFormData.set("building", "");
        bodyFormData.set("floor", "");
        bodyFormData.set("flat", "");
        bodyFormData.set("inventory", JSON.stringify([]));
        bodyFormData.set("labour", JSON.stringify([]));
        bodyFormData.set("hindrance", JSON.stringify([]));
        bodyFormData.set("sitevisitor", JSON.stringify([]));
        bodyFormData.set("staff", JSON.stringify([]));
        bodyFormData.set("notes", JSON.stringify([]));
        bodyFormData.set("consumption", JSON.stringify([]));
        bodyFormData.set("equipment", JSON.stringify([]));
        bodyFormData.set("workProgress", JSON.stringify([]));
        bodyFormData.set("existingAttachments", JSON.stringify([]));
        bodyFormData.append("attachments", file);
        bodyFormData.set("date", props.date);

        dispatch(saveReport({ projectId, formData: bodyFormData })).then(
          (response) => {
            if(response.payload === undefined)
            {
              props.onClose();
            }else{
              dispatch(getDetailReport({ projectId: projectId, reportId: response.payload._id })).then(
                () => {
                  dispatch(closeNewDialog())
                  dispatch(openEditDialog(response.payload));
                }
              );
            }
          }
        );
      }
      // props.onCountChange({ attachment: attachments.length });
    }
  }

  function deleteList(attachments, id) {
    if(props.data.Dialogtype === 'edit')
    {
      setDelete1(true);
      setAttachId(id);
    }
    //attachments = attachments.filter((item) => item._id !== id);
    //setFiles(attachments);
  }

  function removeAttachment() {
    let attach = JSON.parse(JSON.stringify(attachments));
    let deletedAttach = attach.filter((item) => item._id !== attachId);
    setDelete1(false);
    dispatch(deleteAttachments({ projectId, reportId:props.data.data._id,Data:deletedAttach})).then(
      (response) => {
        dispatch(getDetailReport({ projectId,reportId:props.data.data._id})).then(
          (response) => {
            let row = {
              "_id": response.payload._id,
              "createdAt": response.payload.createdAt,
              "submittedDate": response.payload.submittedDate,
              "approvalDate": response.payload.approvalDate,
              "status": response.payload.status === 0 ? 'Inactive' :response.payload.status === 1 ? 'New' : response.payload.status === 2 ? 'Submitted' :response.payload.status === 3 ? 'Approved' : response.payload.status === 4 ? 'Reverted':null,
            }
            dispatch(openEditDialog(row));
          }
        );
      }
    );
  }


  if (!attachments.length) {
    return (
      <div className='flex flex-1 items-center justify-center h-full'>
        <Typography color='textSecondary' variant='h5'>
          There are no Attachments!
        </Typography>
        <input
          //   accept='image/*'
          ref={inputFile}
          className='hidden'
          id='button-file'
          type='file'
          onChange={handleUploadChange}
          //onChange={handleUploadChange}
        />
        <Fab
          color='primary'
          aria-label='add'
          disabled={createAccess === true ? false :true}
          className={classes.addButton}
          onClick={onButtonClick}
        >
          <Icon>project_add</Icon>
        </Fab>
      </div>
    );
  }

  return (
    <React.Fragment>
      <List
        component='nav'
        // className={classes.root}
        //aria-label='mailbox folders'
      >
        {attachments.map((item) => (
          // <React.Fragment>
          <Grid container alignItems='center' direction='row'>
            <Grid item xs={10}>
              <ListItem button key={item._id} component='a' href={item.url}>
                <ListItemText
                  primary={item.name}
                  secondary={item.size + ' kb'}
                />
              </ListItem>
            </Grid>
            <Grid className="flex flex-1 flex-row gap-10 w-sm" item xs={1}>
              <>
                {(item.url.split('.').pop().toLowerCase() === 'jpg'|| item.url.split('.').pop().toLowerCase() === 'pdf' || item.url.split('.').pop().toLowerCase() === 'PDF' || item.url.split('.').pop().toLowerCase() === 'docx' || item.url.split('.').pop().toLowerCase() === 'doc' || item.url.split('.').pop().toLowerCase() === 'mp3' || item.url.split('.').pop().toLowerCase() === 'png'  || item.url.split('.').pop().toLowerCase() === 'jpeg' || item.url.split('.').pop().toLowerCase() === 'PNG' || item.url.split('.').pop().toLowerCase() === 'svg' || item.url.split('.').pop().toLowerCase() === 'gif') ? 
                  <IconButton
                    onClick={() => 
                      {
                        setFileType(item.url.split('.').pop().toLowerCase())
                        setFile(item.url)
                        setTitle(item.name)
                        setViewOpen(true)
                      }
                    }
                  >
                    <Icon className={classes.view}>visibility</Icon>  
                  </IconButton>
                :null}
                <IconButton
                  onClick={ deleteAccess ? () => deleteList(attachments, item._id):
                    () => dispatchWarningMessage(dispatch, "You do not have access to delete this entry. Contact Project Owner.")
                  }
                  variant="contained"
                >
                 <Icon className={classes.delete}>delete</Icon>
                </IconButton>
              </>
            </Grid>
          </Grid>
          // </React.Fragment>
        ))}
      </List>

      <input
        //   accept='image/*'
        ref={inputFile}
        className='hidden'
        id='button-file'
        type='file'
        onChange={handleUploadChange}
        //onChange={handleUploadChange}
      />
      <Fab
        color='primary'
        aria-label='add'
        disabled={createAccess === true ? false :true}
        className={classes.addButton}
        onClick={onButtonClick}
      >
        <Icon>add</Icon>
      </Fab>
      <Dialog open={delete1}>
        <Backdrop className={classes.backdrop} open={loading}>
         <CircularProgress color="inherit" />
       </Backdrop>
       <DialogTitle id="alert-dialog-slide-title">
         Do you want to remove Attachment ?
       </DialogTitle>
       <DialogActions>
          <Button
            onClick={() => {
            setDelete1(false);
           }}
           color="primary"
          >
           No
          </Button>
          <Button
           onClick={() => {removeAttachment()}}
           color="primary"
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen
        open={viewOpen}
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>: 
        <DialogContent className="items-center justify-center">
          <div>
            {fileType === 'pdf'|| fileType === 'PDF' || fileType === 'docx' || fileType === 'doc' || fileType === 'mp3' || fileType === 'mp4'?
              <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
               <ReactFileViewer key={Math.random()} fileType={fileType} filePath={file} onError={onError} />
              </PrismaZoom>
            :fileType === 'png'  || fileType === 'jpeg' || fileType === 'PNG' || fileType === 'svg' || fileType === 'gif'|| fileType === 'jpg'  ?
              <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
                <img src={file} />
              </PrismaZoom>
            :null}  
          </div> 
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => 
            {
              setViewOpen(false)
              setFileType('')
              setFile('')
              setTitle('')
            }}
            variant="contained" 
            color="primary"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default Attachment;
