import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { showMessage } from "app/store/fuse/messageSlice";
import {
 listDrawings,
 addDrawingFolder,
 updateDrawingFolder,
  routes,
} from "app/main/projects/store/projectsSlice";
import clsx from "clsx";
import Paper from "@material-ui/core/Paper";
import FuseAnimateGroup from "@fuse/core/FuseAnimateGroup";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    Fab,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
    TextField,
    DialogContent,
  } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { red, grey, blue } from "@material-ui/core/colors";
import Icon from "@material-ui/core/Icon";
import EditIcon from "@material-ui/icons/Edit";
import {  dispatchWarningMessage } from "app/utils/MessageDispatcher";
import DrawingList from "./DrawingList";


const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: "60vh",
    overflow: "auto",
  },
  addButton: {
    position: "fixed",
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  productGridImageDelete: {
    position: "absolute",
    top: +4,
    right: +10,
    color: grey[400],
    "&:hover": {
      color: red[400],
    },
    // color: red[400],
  },
  productGridImageView: {
    position: "absolute",
    top: +4,
    left: +4,
    color: grey[400],
    "&:hover": {
      color: blue[400],
    },
  },
  productListImageDelete: {
    color: grey[400],
    "&:hover": {
      color: red[400],
    },
  },

  productListImageView: {
    color: grey[400],
    "&:hover": {
      color: blue[400],
    },
    top: +15,
    // right: +45,
    // top: +2,
  },

  productImageUpload: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  productImageItem: {
    transitionProperty: "box-shadow",
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  folderDelete: {
    position: "absolute",
    top: +4,
    right: +10,
    color: grey[300],
    "&:hover": {
      color: red[400],
    },
    // color: red[400],
  },
  folderEdit: {
    position: "absolute",
    top: +4,
    left: +10,
    color: grey[300],
    "&:hover": {
      color: blue[400],
    },
    // color: red[400],
  },
}));

const DrawingRegister = (props) => {
  const classes = useStyles(props);
  const drawingFolders = useSelector(({ projects }) => projects.drawingFolders);
  const loadingState = useSelector(({ projects }) => projects.loading);
  const [addOpen, setAddOpen] = useState(false);
  const [folderOpen, setFolderOpen] = useState(false);
  const [folder, setFolder] = useState({name: "", type: ""});
  const [type, setType] = useState("");
  const route = useSelector(({ projects }) => projects.routes);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [folderId, setFolderId] = useState("");
  const [folderName, setFolderName] = useState("");
  const dispatch = useDispatch();
  const [pageloading, setPageLoading] = useState(false);
  const team = useSelector(({ projects }) => projects.details.team);
  const [access, setAccess] = useState(false);
  const user = useSelector(({ auth }) => auth.user);

  const [hide, setHide] = useState(false);

  useEffect(() => {
    team.forEach((t)=>{
      if((t._id === user.data.id && t.role === "owner") || user.user === 'admin')
      {
        setAccess(true)
      }else if(t._id === user.data.id && t.role !== "owner")
      {
         const member=t.tab_access.filter((i)=>i === "Drawing Register");
         console.log(member)
         if(member[0] === "Drawing Register")
         {
           setAccess(true)
         }
      }

      if(t._id === user.data.id && t.role === "CIDCO Official"){
        setHide(true)
      }
   })
  }, [access, user.data.id, user.role, team]);
  
  const handleChange = (prop) => (event) => {
    setFolder({ ...folder, [prop]: event.target.value });
  };

  const handleFolderClose = () => {
    setAddOpen(false);
    setFolder({name:"", type:""})
  };

  const createFolder = () => {
     let doc = drawingFolders.filter(fold => fold.folderName.toLowerCase() === folder.name.toLowerCase());
     if(doc.length > 0)
     {
        dispatchWarningMessage(dispatch, "Folder is already present.");
     }else{
      setPageLoading(true);
      setAddOpen(false);
      dispatch(addDrawingFolder({ projectId,folderName:folder.name, folderType: folder.type })).then(
        (response) => {
          if (response) {
            setPageLoading(false);
            setFolder({name: '', type : ''})
          }
        }
      );   
     }
   }

  const openFolder = async (value) =>{
    await dispatch(listDrawings({ projectId, folderId:value._id })).then(
      (response) => {
        setFolderOpen(true);
        setFolder(value)
      }
    );
  }

  const onClose = () =>{
    setFolderOpen(false);
    setFolder({ name: '', type: ''})
  }

  const updateFolder = () => {
    let list = drawingFolders.filter(df=> df.folderName.toLowerCase() !== folderName.toLowerCase());
    let doc = list.filter(fold => fold.folderName.toLowerCase() === folder.name.toLowerCase());
    if(doc.length > 0)
    {
      dispatchWarningMessage(dispatch, "Folder is already present.");
    }else{
    setPageLoading(true);
    setAddOpen(false);
    dispatch(updateDrawingFolder({ projectId,folderId:folderId,folderName:folder.name,folderType: folder.type})).then(
      (response) => {
        if (response) {
          setPageLoading(false);
          setFolder({ name: '', type: ''});
        }
      }
    );
    }
  }

  const disableButton = () => {
    return (
      folder.name.length > 0 &&
      folder.type.length > 0 
    );
  };

  
  return (
    <div>
      <Backdrop className={classes.backdrop} open={loadingState}>
         <CircularProgress color="inherit" />
      </Backdrop>

      {folderOpen ? 
         <DrawingList data ={folder} close={onClose}/>
        :
       <>
         <div className="flex flex-1 flex-row w-full mb-12">
            <div className="flex w-full items-center justify-start gap-10" >
              <Typography className="text-16 font-bold">Drawing Register</Typography>
            </div>
            <div className="flex w-full items-end justify-end"  >
                <div className="flex px-12 flex-row gap-5 ml-40">
                  {hide === true ? null :
                    <Button
                     variant='contained'
                     color='primary'
                     onClick={access ? () => {
                        setFolder({name:"", type:""});
                        setAddOpen(true);
                        setType("new");
                     }:() =>  dispatchWarningMessage(dispatch, "You don't have an access to create a folder.")}
                    >
                      Create Folder
                    </Button>
                  }
                </div>
            </div>
         </div>
 
         <div className={clsx(classes.root, "w-full")}>
           { drawingFolders.length > 0 ?
             <Paper className="w-full shadow-1 h-full">
              <List className="p-0">
                <FuseAnimateGroup  enter={{ animation: "transition.slideUpBigIn"}}>
                 {drawingFolders.map((d) => (
                    <ListItem
                      dense
                      button
                      className={clsx(
                        "border-solid border-b-1 py-16 px-0 sm:px-8"
                      )}
                      key={d._id}
                      onClick={access ? () => {
                          setFolderId(d._id)
                          setFolderName(d.name)
                          openFolder(d)
                        }:() => dispatchWarningMessage(dispatch, "You don't have an access to view a folder details.")}
                    >
                      <ListItemIcon className="mr-10">
                        <Icon fontSize="large" color="action"> folder </Icon>
                      </ListItemIcon>
                      <ListItemText noWrap
                        primary={d.folderName} 
                      />
                        <ListItemSecondaryAction>
                          {hide === true ? null :
                           <IconButton
                               onClick={access ? () => {
                                 setFolder({name: d.folderName, type: d.folderType}); 
                                 setFolderId(d._id)
                                 setFolderName(d.folderName)
                                 setAddOpen(true);
                                 setType("edit");
                                }:()=> dispatchWarningMessage(dispatch, "You don't have an access to update a folder details.")}
                               
                                className={classes.productListImageDelete}
                           >
                               <EditIcon />
                           </IconButton>
                          } 
                        </ListItemSecondaryAction>
                    </ListItem>
                 ))}
                </FuseAnimateGroup>
              </List>
             </Paper>
            : 
              <Typography noWrap>Folders not found. Please Create. </Typography>
            }
         </div>

         <Dialog
            open={addOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
           {type === 'new' ?
             <DialogTitle id="alert-dialog-title">{"Create Folder"}</DialogTitle>:
           type === 'edit' ?
             <DialogTitle id="alert-dialog-title">{"Update Folder"}</DialogTitle>:
            null 
           }     
          <DialogContent>
            <div className="w-auto">
              <FormControl variant="outlined">
                 <TextField
                  variant="outlined"
                  label="Folder Name"
                  value={folder.name}
                  style={{width:"300px"}}
                  onChange={handleChange("name")}
                />
                 <TextField
                  variant="outlined"
                  label="Discp"
                  className="my-10"
                  value={folder.type}
                  onChange={handleChange("type")}
                />
              </FormControl>
            </div>
          </DialogContent>
          <DialogActions>
            {type === 'new' ?
              <Button disabled={!disableButton()}  onClick={() => createFolder()} color="primary" autoFocus>
                Add
              </Button>:
             type === 'edit' ?
              <Button disabled={!disableButton()} onClick={() => updateFolder()}   color="primary" autoFocus>
                Update
              </Button>:
             null
            }
            <Button onClick={() => handleFolderClose()} color="primary">
              CLOSE
            </Button>
            
          </DialogActions>
         </Dialog> 
       </>
      }
    </div>
  );
};

export default React.memo(DrawingRegister);
