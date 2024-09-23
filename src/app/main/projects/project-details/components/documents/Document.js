import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseLoading from "@fuse/core/FuseLoading";
import { showMessage } from "app/store/fuse/messageSlice";
import {
  deleteDocument,
  getDocument,
  listDocuments,
  listDocumentFolders,
  addDocumentFolder,
  updateFolderName,
  addEntryToSummary,
  routes,
} from "app/main/projects/store/projectsSlice";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import { red, grey, blue } from "@material-ui/core/colors";
import Icon from "@material-ui/core/Icon";
import constants from "app/main/config/constants";
import Input from "@material-ui/core/Input";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from "@material-ui/icons/Edit";
import GridOnIcon from "@material-ui/icons/GridOn";
import ListIcon from "@material-ui/icons/List";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
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
import Backdrop from "@material-ui/core/Backdrop";
import FormControl from "@material-ui/core/FormControl";
import DocumentDetails from "./DocumentDetails";
import FuseAnimateGroup from "@fuse/core/FuseAnimateGroup";
import clsx from "clsx";
import {  dispatchWarningMessage } from "app/utils/MessageDispatcher";
import ReactFileViewer from "react-file-viewer";
import PrismaZoom from "react-prismazoom";

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
    top: +15,
    // color: red[400],
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

const Documents = (props) => {
  const classes = useStyles(props);
  const documents = useSelector(({ projects }) => projects.document.documentsArray);
  const documentFolders = useSelector(({ projects }) => projects.documentFolders);
  const route = useSelector(({ projects }) => projects.routes);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const loadingState = useSelector(({ projects }) => projects.loading);
  const userId = useSelector(({ auth }) => auth.user.data.id)
  const team = useSelector(({ projects }) => projects.details.team);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState({
    details: false,
    delete: false,
  });
  const [details, setDetails] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [pageloading, setPageLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [folderDocument, setFolderDocument] = useState([]);
  const [subfolderDocument, setSubFolderDocument] = useState([]);
  const [subFolder, setSubFolder] = useState([]);
  const [filteredDocument, setFilteredDocument] = useState(documents);
  const [view, setView] = useState("list");
  const [folderView, setFolderView] = useState(false);
  const [subfolderView, setSubFolderView] = useState(false);
  const [subfolderId, setSubFolderId] = useState("");
  const [subfolderName, setSubFolderName] = useState("");
  const [folderId, setFolderId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [type, setType] = useState("");
  const dispatch = useDispatch();
  const inputFile = useRef(null);
  const [uploadAccess, setUploadAccess] = useState();
  const [updateAccess, setUpdateAccess] = useState();
  const [viewAccess, setViewAccess] = useState();
  const [deleteAccess, setDeleteAccess] = useState();
  const [folderAccess, setFolderAccess] = useState();
  const role = useSelector(({ auth }) => auth.user);
  const [folderOpen, setFolderOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [folder, setFolder] = useState("");
  const [userRole, setUserRole] = useState("");
  const [viewOpen, setViewOpen] = useState();
  const [file, setFile] = useState("");
  const [fileType, setFileType] = useState("");
  const [title, setTitle] = useState("");
  const [folderList, setFolderList] = useState([]);

  useEffect(() => {
    let filteredDoc=[];
    documents.map((d)=>{
      if(d.folder === undefined)
      {
        filteredDoc.push(d)
      }else if(d.folder.folderId === '')
      {
        filteredDoc.push(d)
      }
    })
    setFilteredDocument(filteredDoc);

    let folderDoc = [], subFolderDoc = [], foldersData = [];
    if(folderView === true){
      documentFolders.map((fdl)=>{
        if(fdl._id === folderId){
          setSubFolder(fdl.subFolders)
        }
      })
      documents.map((fd) => {
        if(fd.folder !== undefined && fd.folder.folderId === folderId)
          {
            if(fd.subfolder === undefined){
              folderDoc.push(fd);
            }else if(fd.subfolder.subfolderId === ''){
              folderDoc.push(fd);
            } 
          } 
      })
      setFolderDocument(folderDoc);
    }

    if(subfolderView === true){
      documents.map((fd) => {
        if(fd.folder !== undefined && fd.folder.folderId === folderId && fd.subfolder.subfolderId === subfolderId)
        {
          subFolderDoc.push(fd);
        }    
      })
      setSubFolderDocument(subFolderDoc);
    }

    if(sessionStorage.getItem("folder") !== null){
      let folder = sessionStorage.getItem("folder");
      let folderDoc = [];

      documentFolders.map((fdl)=>{
        if(fdl.folderName === folder){
          setSubFolder(fdl.subFolders);
          setFolderView(true);
          setFolderName(folder);
          dispatch(routes("FolderDoc"));
          documents.map((fd) => {
              if(fd.folder !== undefined && fd.folder.folderId === fdl._id)
              {
                if(fd.subfolder === undefined){
                  folderDoc.push(fd);
                }else if(fd.subfolder.subfolderId === ''){
                  folderDoc.push(fd);
                }
              }    
          })
        }
      })
      setFolderDocument(folderDoc);  
    }

    documentFolders.map((fdl)=>{
      foldersData.push(fdl);
    })
    setFolderList(foldersData)

  }, [documents, documentFolders]);

  const onError = e => {
    console.log(e, "error in file-viewer");
  };

  useEffect(() =>{
    if(route === 'Documents'){
      setFolderView(false);
      setFolderId("")
      setFolderName("")
      setFolderDocument([])

      setSubFolderView(false);
      setSubFolderId("");
      setSubFolderName("");
      setSubFolderDocument([])
    }
  }, [route])

  useEffect(() => {
   team.map((t)=>{
    if(t._id === role.data.id && t.role === "owner"|| role.role === 'admin')
    {
      setUploadAccess(true);
      setDeleteAccess(true);
      setUpdateAccess(true);
      setViewAccess(true);
      setFolderAccess(true);
      setUserRole("owner");
    }else if(t._id === role.data.id && t.role !== "owner")
    {
      setUploadAccess(t.tab_access.includes("Documents") || t.tab_access.includes("Upload Document"));
      setDeleteAccess(t.tab_access.includes("Documents") || t.tab_access.includes("Delete Document"));
      setUpdateAccess(t.tab_access.includes("Documents") || t.tab_access.includes("Update Document Details"));
      setFolderAccess(t.tab_access.includes("Documents") || t.tab_access.includes("Create/Update Folder"));
      setViewAccess(t.tab_access.includes("Documents") || t.tab_access.includes("View/Download Document"));
    }
   })
  }, []);

  const handleChange = (prop) => (event) => {
    setFolder({ ...folder, [prop]: event.target.value });
  };

  const handleFolderClose = () => {
    setFolderOpen(false);
    setFolder("")
  };

  const createFolder = () => {
    let doc = documentFolders.filter(fold => fold.folderName.toLowerCase() === folder.name.toLowerCase());
    if(doc.length > 0)
    {
      dispatchWarningMessage(dispatch, "Folder is already present.");
    }else{
      setPageLoading(true);
      setFolderOpen(false);
      dispatch(addDocumentFolder({ projectId,folderName:folder.name, folderId: folderId })).then(
        (response) => {
          if (response) {
            setPageLoading(false);
            setFolder("")
            if(subfolderView === true){
              setSubFolderView(false)
            }
          }
        }
      );   
    }
  }

  const updateFolder = () => {
    let doc = documentFolders.filter(fold => fold.folderName.toLowerCase() === folder.name.toLowerCase());
    if(doc.length > 0)
    {
      dispatchWarningMessage(dispatch, "Folder is already present.");
    }else{
    setPageLoading(true);
    setFolderOpen(false);
    dispatch(updateFolderName({ projectId,folderId:folderId,folderName:folder.name,subfolderId: subfolderId})).then(
      (response) => {
        if (response) {
          setPageLoading(false);
          setFolder("");
          if(subfolderId === ''){
            setFolderId("");
            setFolderName("");
          }else{
            setSubFolderId("");
            setFolderView(false)
          }
        }
      }
    );
    }
  }

  let icon = "";

  function handleUploadChange(e) {
    const files = Array.from(e.target.files);
    let x = 0;

    files.map((fl)=>{
      if(fl.size > 3e7){
        x++;
      }
    })

    if (!files.length) {
      return;
    } else {
      if (x > 0) {
        dispatch(
          showMessage({
            message: "File size should not be greter than 30 mb",
            variant: "error",
          })
        );
        return;
      } else {
        setLoading(true);

        const payload = new FormData();
        payload.set("folderId",folderId)
        payload.set("folderName",folderName)
        payload.set("subfolderId",subfolderId)
        payload.set("subfolderName",subfolderName)
        files.forEach((file) => {
          payload.append("file", file);
        });
      
        const options = {
          headers: { "Content-Type": "multipart/form-data" },
        };
        axios
          .post(
            `${constants.BASE_URL}/projects/${projectId}/files/upload`,
            payload,
            options
          )
          .then((response) => {
            if (response.data.code === 200) {
              dispatch(listDocuments(projectId));
              dispatch(listDocumentFolders(projectId));
              if(subfolderView === true){
                setSubFolderView(false)
              }
              setLoading(false);
              dispatch(
                showMessage({
                  message: "File Uploaded Successfully",
                  variant: "success",
                })
              );
            } else {
              setLoading(false);
              dispatch(
                showMessage({
                  message: response.data.message,
                  variant: "error",
                })
              );
            }
          });
      }
    }
  }

  if (!documents) {
    return <FuseLoading />;
  }

  function setIcon(file) {
    let extension = file.split(".").pop().split(/\#|\?/)[0];
    switch (true) {
      case extension === "pdf" || extension === "PDF":
        icon = "assets/icons/pdf.svg";
        break;
      case extension.includes("doc"):
        icon = "assets/icons/doc.svg";
        break;
      case extension.includes("jpg"):
        icon = "assets/icons/jpg.svg";
        break;
      case extension === "png":
        icon = "assets/icons/png.svg";
        break;
      case extension === "dmg":
        icon = "assets/icons/dmg.svg";
        break;
      default:
        icon = "assets/icons/attachment.svg";
    }
  }

  const handleInputChange = (event, documents) => {
    setSearchText(event.target.value);  let folderDoc=[];
    let sText = event.target.value;

    if(folderView === true)
    {
      if(subfolderView === true){
        if (sText !== "") {
          let newDocument = [];
          documents.map((d)=>{
            if(d.folder !== undefined && d.folder.folderId === folderId && d.subfolder.subfolderId === subfolderId)
            {
              if ((d.title && d.title.includes(sText)) || d.file.includes(sText) || d.tags.includes(sText))
              {
                newDocument.push(d);
              }
            }
          })
          setSubFolderDocument(newDocument);
        } else {
          let folderDoc=[];
          documents.map((fd) => {
            if(fd.folder !== undefined && fd.folder.folderId === folderId && fd.subfolder.subfolderId === subfolderId)
            {
              folderDoc.push(fd);
            }   
          })
          setSubFolderDocument(folderDoc);
        }
      }else{
        if (sText !== "") {
            let newDocument = [], newFolders = [];
            documents.map((d)=>{
              if(d.folder !== undefined && d.folder.folderId === folderId)
              {
                if ((d.title && d.title.includes(sText)) || d.file.includes(sText) || d.tags.includes(sText)) 
                {
                  newDocument.push(d);
                }
              }
            })
            setFolderDocument(newDocument);

            documentFolders.map((fdl)=>{
              if(fdl._id === folderId){
                fdl.subFolders.map((sub)=>{
                  if ((sub.name && sub.name.includes(sText) || sub.name.toLowerCase().includes(sText.toLowerCase()))) 
                  {
                    newFolders.push(sub);
                  }
                })
                setSubFolder(newFolders)
              }
            })
        } else {
            let folderDoc=[];
            documents.map((fd) => {
              if(fd.folder !== undefined && fd.folder.folderId === folderId)
                {
                  if(fd.subfolder === undefined){
                    folderDoc.push(fd);
                  }else if(fd.subfolder.subfolderId === ''){
                    folderDoc.push(fd);
                  }
                }    
            })
            setFolderDocument(folderDoc);

            documentFolders.map((fdl)=>{
              if(fdl._id === folderId){
                setSubFolder(fdl.subFolders)
              }
            })
        }
      }
    }else{
      setFilteredDocument([]);
      if (sText !== "") {
        let newDocument = [];
        documents.map((d)=>{
          if(d.folder === undefined)
          {
            if ((d.title && d.title.includes(sText)) || d.file.includes(sText) || d.tags.includes(sText))
            {
              newDocument.push(d);
            }
          }else if(d.folder.folderId === '')
          {
            if ((d.title && d.title.includes(sText)) || d.file.includes(sText) || d.tags.includes(sText))
            {
              newDocument.push(d);
            }
          }
        })

        let foldersData = [];
        documentFolders.map((d)=>{
          if ((d.folderName && d.folderName.includes(sText) || d.folderName.toLowerCase().includes(sText.toLowerCase()) )) 
          {
            foldersData.push(d);
          }
        })

        setFolderList(foldersData);
        setFilteredDocument(newDocument);
      } else {
        let filteredDoc=[];
        documents.map((d)=>{
          if(d.folder === undefined)
          {
            filteredDoc.push(d)
          }else if(d.folder.folderId === '')
          {
            filteredDoc.push(d)
          }
        })

        let foldersData=[];
        documentFolders.map((fdl)=>{
          foldersData.push(fdl);
        })

        setFolderList(foldersData)
        setFilteredDocument(filteredDoc);
      }
    }

  };

  const handleClickOpen = (doc) => {
    //if(userRole === 'owner' || doc.uploadedBy._id === role.data.id){
     setDocumentId(doc._id);
     setOpen({ ...open, delete: true });
    // }else{
    //   dispatchWarningMessage(dispatch, "You don't have access to delete this document.");
    // }
  };

  const handleClose = () => {
    setOpen({ ...open, details: false });
    setDetails(null);
  };

  const openFolder = (folder) =>{
    let folderDoc = [];
    setFolderView(true);
    setFolderName(folder.folderName)
    documentFolders.map((fdl)=>{
      if(fdl._id === folder._id){
        setSubFolder(fdl.subFolders)
      }
    })
    documents.map((fd) => {
      if(fd.folder !== undefined && fd.folder.folderId === folder._id)
      {
        if(fd.subfolder === undefined){
          folderDoc.push(fd);
        }else if(fd.subfolder.subfolderId === ''){
          folderDoc.push(fd);
        }
      }    
    })
    setFolderDocument(folderDoc);
    dispatch(routes("FolderDoc"));
  }

  const openSubFolder = (folder) =>{

    let subfolderDoc = [];
    setSubFolderView(true);
    setSubFolderName(folder.name)
    documents.map((fd) => {
      if(fd.folder !== undefined && fd.folder.folderId === folderId)
      {
        if(fd.subfolder !== undefined){
          if(folder.id === undefined){
            if(fd.subfolder.subfolderName === folder.name){
              subfolderDoc.push(fd);
            }
          }else{
            if(fd.subfolder.subfolderId === folder.id){
              subfolderDoc.push(fd);
            }
          }
        } 
      }    
    })
    setSubFolderDocument(subfolderDoc);
    dispatch(routes("SubfolderDoc"));
  }

  const backFolder = () =>{
    sessionStorage.removeItem("folder");
    if(subfolderView === true){
      setSubFolderView(false)
      setSubFolderId("");
      setSubFolderName("");
      setSubFolderDocument([])
      dispatch(routes("FolderDoc"))
    }else{
      setFolderView(false)
      setFolderId("")
      setFolderName("")
      setFolderDocument([])
      dispatch(routes("Documents"))
    }
  }

  const viewDocument = (details) =>{
    setFileType(details.file.split('.').pop().toLowerCase())
    setFile(details.url)
    setTitle(details.title)
    let reportName = "Document", actionType = "View", title = details.title;
      
    dispatch(addEntryToSummary ({ projectId, userId, reportName, actionType, title }));
    setViewOpen(true)
  }

  return (
    <div>
      <Backdrop className={classes.backdrop} open={loadingState}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="flex flex-1 flex-row w-full mb-12">
        <div className="flex w-full items-center justify-start gap-10" >
          <IconButton
            style={{ backgroundColor: view === "list" ? "#00b0ff" : null }}
            onClick={() => setView("list")}
          >
            <ListIcon />
          </IconButton>
          <IconButton
            style={{ backgroundColor: view === "grid" ? "#00b0ff" : null }}
            onClick={() => setView("grid")}
          >
            <GridOnIcon />
          </IconButton>
 
        </div>
      

        <div className="flex w-md items-end justify-end"  >
          {folderView === false ?
            <div className="flex px-12 flex-row gap-5 ml-40">
             <Button
               variant='contained'
               color='primary'
               disabled = {folderAccess === true ? false :true}
               onClick={() => {
                 setFolder({name:""});
                 setFolderOpen(true);
                 setType("new");
               }}>
                 Create Folder
             </Button>
            </div>:
            <>
             <div className="flex px-12 flex-row gap-5">               
               <Button
                 variant='contained'
                 color='primary'
                 className = "mr-10"
                 onClick={() => {
                   backFolder()
                 }}>
                  <Icon>arrow_back</Icon>
                  <Typography noWrap> Documents </Typography> 
               </Button>
               {subfolderView === false ?
                  <Button        
                    variant='contained'
                    color='primary' 
                    disabled = {folderAccess === true ? false :true}
                    onClick={() => {
                      setFolderOpen(true);
                      setType("new");
                    }}>
                    Create Folder
                  </Button>
               :null}
              </div>
            </>
          }
        </div>
      </div>
      <div className="flex w-full ml-10 pr-10 mb-10 items-center justify-center">
          <FuseAnimate animation="transition.slideUpIn" delay={300}>
            <Paper
              className="flex items-center w-full max-w-512 px-8 py-4 rounded-8"
              elevation={1}
            >
              <Icon color="action">search</Icon>
              <Input
                disabled={loading === true ? true : false}
                placeholder="Search"
                className="flex flex-1 mx-8"
                disableUnderline
                fullWidth
                value={searchText}
                inputProps={{
                  "aria-label": "Search",
                }}
                onChange={(ev) => handleInputChange(ev, documents)}
              />
            </Paper>
          </FuseAnimate>
        </div>
      {folderName !== ''?
        <Typography className="font-bold items-center mb-10" align="center" noWrap> {folderName} - {subfolderName}  </Typography>
      :null}

     {view === "grid" ? (
        <div className="flex justify-center sm:justify-start flex-wrap -mx-8">
          <label
            htmlFor="button-file"
            className="flex items-center justify-center relative w-128 h-128 rounded-4 mx-8 mb-16 overflow-hidden cursor-pointer shadow-1 hover:shadow-5"  
          >
            <input
              ref={inputFile}
              className="hidden"
              id="button-file"
              type="file"
              multiple={true}
              onChange={handleUploadChange}
              disabled={uploadAccess === true ? false :true}
            />

            {loading ? (
              <CircularProgress />
            ) : (
              <Icon fontSize="large" color="action">
                cloud_upload
              </Icon>
            )}
          </label>

          {folderView === false && subfolderView === false?(
            folderList.map((d) => (
             <>
             <div className="w-128 h-148 mx-8 mb-16" key={d._id}>
              <div
                className="flex w-128 h-128 relative rounded-4 mx-8 mb-16 cursor-pointer shadow-1 hover:shadow-5"
                key={d._id}
              >
                <Button
                  className="w-128 h-128"
                  key={d._id} 
                  onClick={updateAccess || viewAccess || folderAccess || uploadAccess ?() => {setFolderId(d._id)
                    openFolder(d)
                    }:() => dispatchWarningMessage(dispatch, "You do not have an access to open a folder.")}
                >
                 <div className="flex flex-col w-128 h-128 items-center justify-center">
                  <Icon fontSize="large" color="action"> folder </Icon>
                  <Typography> {d.folderName} </Typography>
                 </div>
                </Button>
                 {d.folderType === 'document' && folderAccess ?
                 <Icon
                    onClick={() => {
                     setFolder({name:d.folderName}); 
                     setFolderId(d._id)
                     setFolderOpen(true);
                     setType("edit");
                    }}
                    className={classes.folderDelete}
                  >
                    edit
                  </Icon>
                 :null} 
              </div>
             </div>
             </>
            ))):
          null}

          {folderView === true && subfolderView === false ? 
            subFolder.map((d) => (
              <>
              <div className="w-128 h-148 mx-8 mb-16" key={d.id}>
               <div
                 className="flex w-128 h-128 relative rounded-4 mx-8 mb-16 cursor-pointer shadow-1 hover:shadow-5"
                 key={d.id}
               >
                 <Button
                   className="w-128 h-128"
                   key={d.id} 
                   onClick={updateAccess || viewAccess || folderAccess || uploadAccess ?() => {setSubFolderId(d.id)
                     openSubFolder(d)
                     }:() => dispatchWarningMessage(dispatch, "You do not have an access to open a folder.")}
                 >
                  <div className="flex flex-col w-128 h-128 items-center justify-center">
                   <Icon fontSize="large" color="action"> folder </Icon>
                   <Typography> {d.name} </Typography>
                  </div>
                 </Button>
                  {d.type === 'document' && folderAccess ?
                  <Icon
                     onClick={() => {
                      setFolder({name:d.name}); 
                      setSubFolderId(d.id)
                      setFolderOpen(true);
                      setType("edit");
                     }}
                     className={classes.folderDelete}
                   >
                     edit
                   </Icon>
                  :null} 
               </div>
              </div>
              </>
            )):
          null}

          {folderView === false && subfolderView === false ?(
           filteredDocument.map((media) => (
            // <React.Fragment>
            <>
              <div className="w-128 h-148 mx-8 mb-16" key={media._id}>
                <div
                  className="flex w-128 h-128 relative rounded-4 mx-8 mb-16 cursor-pointer shadow-1 hover:shadow-5"
                  key={media._id}
                >
                  <Button
                    className="w-128 h-128"
                    key={media._id}
                    onClick={updateAccess || viewAccess ? () => {
                      setOpen({ ...open, details: true });
                      setDetails(media);
                      dispatch(
                        getDocument({ projectId, documentId: media._id })
                      );
                    }:() => dispatchWarningMessage(dispatch, "You do not have access to view document details.")}
                  >
                    {setIcon(media.file)}
                    <div className="flex flex-col w-128 h-128 items-center justify-between">
                      <img
                        className="w-1/2 h-1/2 mt-20"
                        src={icon}
                        alt={media.file}
                      />
                      <Typography className="mb-10">
                        {media.size ? media.size : ""}
                      </Typography>
                    </div>
                  </Button>
                  {viewAccess && (media.ext === 'jpg'|| media.ext === 'pdf' || media.ext === 'PDF' || media.ext === 'docx' || media.ext === 'doc' || media.ext === 'mp3' || media.ext === 'png'  || media.ext === 'jpeg' || media.ext === 'PNG' || media.ext === 'svg' || media.ext === 'gif') ? 
                  <Icon
                    onClick={() => 
                      {
                        setFileType(media.file.split('.').pop().toLowerCase())
                        setFile(media.url)
                        setTitle(media.title)
                        setViewOpen(true)
                      }}
                    className={classes.productGridImageView}
                  >
                    visibility
                  </Icon>
                  :null}
                  {deleteAccess === true ?
                  <Icon
                    onClick={ () => {
                      handleClickOpen(media);
                    }}
                    className={classes.productGridImageDelete}
                  >
                    delete
                  </Icon>
                  :null}
                </div>

                <div className="flex items-center w-128 h-20 mx-8 py-4">
                  <Typography noWrap>
                    {/* {decodeURI(media.file.replace(/^.*[\\\/]/, ''))} */}
                    {media.title}
                  </Typography>
                </div>
              </div>
            </>
           ))
          ): subfolderView === false ?
           folderDocument.map((media) => (
            // <React.Fragment>
            <>
              <div className="w-128 h-148 mx-8 mb-16" key={media._id}>
                <div
                  className="flex w-128 h-128 relative rounded-4 mx-8 mb-16 cursor-pointer shadow-1 hover:shadow-5"
                  key={media._id}
                >
                  <Button
                    className="w-128 h-128"
                    key={media._id}
                    onClick={updateAccess || viewAccess ? () => {
                      setOpen({ ...open, details: true });
                      setDetails(media);
                      dispatch(
                        getDocument({ projectId, documentId: media._id })
                      );
                    }:() => dispatchWarningMessage(dispatch, "You do not have access to view document details.")}
                  >
                    {setIcon(media.file)}
                    <div className="flex flex-col w-128 h-128 items-center justify-between">
                      <img
                        className="w-1/2 h-1/2 mt-20"
                        src={icon}
                        alt={media.file}
                      />
                      <Typography className="mb-10">
                        {media.size ? media.size : ""}
                      </Typography>
                    </div>
                  </Button>
                  {viewAccess && (media.ext === 'jpg'|| media.ext === 'pdf'|| media.ext === 'PDF' || media.ext === 'docx' || media.ext === 'doc' || media.ext === 'mp3' || media.ext === 'png'  || media.ext === 'jpeg' || media.ext === 'PNG' || media.ext === 'svg' || media.ext === 'gif') ? 
                  <Icon
                    onClick={() => 
                      {
                        setFileType(media.file.split('.').pop().toLowerCase())
                        setFile(media.url)
                        setTitle(media.title)
                        setViewOpen(true)
                      }}
                    className={classes.productGridImageView}
                  >
                    visibility
                  </Icon>
                  :null}
                  {deleteAccess ? 
                  <Icon
                    onClick={() => {
                      handleClickOpen(media);
                    }}
                    className={classes.productGridImageDelete}
                  >
                    delete
                  </Icon>
                  :null}
                </div>

                <div className="flex items-center w-128 h-20 mx-8 py-4">
                  <Typography noWrap>
                    {/* {decodeURI(media.file.replace(/^.*[\\\/]/, ''))} */}
                    {media.title}
                  </Typography>
                </div>
              </div>
            </>
           )):
           subfolderDocument.map((media) => (
            // <React.Fragment>
            <>
              <div className="w-128 h-148 mx-8 mb-16" key={media._id}>
                <div
                  className="flex w-128 h-128 relative rounded-4 mx-8 mb-16 cursor-pointer shadow-1 hover:shadow-5"
                  key={media._id}
                >
                  <Button
                    className="w-128 h-128"
                    key={media._id}
                    onClick={updateAccess || viewAccess ? () => {
                      setOpen({ ...open, details: true });
                      setDetails(media);
                      dispatch(
                        getDocument({ projectId, documentId: media._id })
                      );
                    }:() => dispatchWarningMessage(dispatch, "You do not have access to view document details.")}
                  >
                    {setIcon(media.file)}
                    <div className="flex flex-col w-128 h-128 items-center justify-between">
                      <img
                        className="w-1/2 h-1/2 mt-20"
                        src={icon}
                        alt={media.file}
                      />
                      <Typography className="mb-10">
                        {media.size ? media.size : ""}
                      </Typography>
                    </div>
                  </Button>
                  <>
                  {viewAccess && (media.ext === 'jpg'|| media.ext === 'pdf'|| media.ext === 'PDF' || media.ext === 'docx' || media.ext === 'doc' || media.ext === 'mp3' || media.ext === 'png'  || media.ext === 'jpeg' || media.ext === 'PNG' || media.ext === 'svg' || media.ext === 'gif') ? 
                  <Icon
                    onClick={() => 
                      {
                        setFileType(media.file.split('.').pop().toLowerCase())
                        setFile(media.url)
                        setTitle(media.title)
                        setViewOpen(true)
                      }}
                    className={classes.productGridImageView}
                  >
                    visibility
                  </Icon>
                  :null}
                  </>
                  {deleteAccess ? 
                  <Icon
                    onClick={() => {
                      handleClickOpen(media);
                    }}
                    className={classes.productGridImageDelete}
                  >
                    delete
                  </Icon>
                  :null}
                </div>

                <div className="flex items-center w-128 h-20 mx-8 py-4">
                  <Typography noWrap>
                    {/* {decodeURI(media.file.replace(/^.*[\\\/]/, ''))} */}
                    {media.title}
                  </Typography>
                </div>
              </div>
            </>
           ))}
        </div>
      ) : (
        <div className={clsx(classes.root, "w-full")}>
          <Paper className="w-full shadow-1 h-full">
            <List className="p-0">
              <FuseAnimateGroup
                enter={{
                  animation: "transition.slideUpBigIn",
                }}
              >
              {folderView === false && subfolderView === false ?(
                folderList.map((d) => (
                  <ListItem
                    dense
                    button
                    className={clsx(
                      "border-solid border-b-1 py-16 px-0 sm:px-8"
                    )}
                    key={d._id}
                    onClick={updateAccess || viewAccess || folderAccess || uploadAccess ? () => {setFolderId(d._id)
                      openFolder(d)
                      }:() => dispatchWarningMessage(dispatch, "You do not have access to open folder.")}
                  >
                    <ListItemIcon className="mr-10">
                      <Icon fontSize="large" color="action"> folder </Icon>
                    </ListItemIcon>
                    <ListItemText
                      primary={d.folderName} 
                    />
                     {d.folderType === 'document' && folderAccess ?
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => {
                          setFolder({name:d.folderName}); 
                          setFolderId(d._id)
                          setFolderOpen(true);
                          setType("edit");
                         }}
                        className={classes.productListImageDelete}
                      >
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                    :null}
                  </ListItem>
                ))
              ):null}

              {folderView === true && subfolderView === false ?(
                subFolder.map((d) => (
                  <ListItem
                    dense
                    button
                    className={clsx(
                      "border-solid border-b-1 py-16 px-0 sm:px-8"
                    )}
                    key={d.id}
                    onClick={updateAccess || viewAccess || folderAccess || uploadAccess ? () => {setSubFolderId(d.id)
                      openSubFolder(d)
                    }:() => dispatchWarningMessage(dispatch, "You do not have access to open folder.")}
                  >
                    <ListItemIcon className="mr-10">
                      <Icon fontSize="large" color="action"> folder </Icon>
                    </ListItemIcon>
                    <ListItemText primary={d.name} />
                    {d.type === 'document' && folderAccess ?
                      <ListItemSecondaryAction>
                        <IconButton
                          onClick={() => {
                           setFolder({name:d.name}); 
                           setSubFolderId(d.id)
                           setFolderOpen(true);
                           setType("edit");
                          }}
                          className={classes.productListImageDelete}
                        >
                         <EditIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    :null}
                    </ListItem>
                ))
              ):null}

              {folderView === false && subfolderView === false  ?(
                filteredDocument.map((media) => (
                  <ListItem
                    dense
                    button
                    className={clsx(
                      "border-solid border-b-1 py-16 px-0 sm:px-8"
                    )}
                    key={media._id}
                    onClick={updateAccess || viewAccess ? () => {
                      setOpen({ ...open, details: true });
                      setDetails(media);
                      dispatch(
                        getDocument({ projectId, documentId: media._id })
                      );
                    }:() => dispatchWarningMessage(dispatch, "You do not have access to view document details.")}
                  >
                    {setIcon(media.file)}
                    <ListItemIcon className="mr-10">
                      <img  alt="iconset2" src={icon} />
                    </ListItemIcon>
                    <ListItemText
                      primary={media.title}
                      secondary={media.size}
                    />
                    
                    <ListItemSecondaryAction>
                      {viewAccess && (media.ext === 'jpg'|| media.ext === 'pdf'|| media.ext === 'PDF' || media.ext === 'docx' || media.ext === 'doc' || media.ext === 'mp3' || media.ext === 'png'  || media.ext === 'jpeg' || media.ext === 'PNG' || media.ext === 'svg' || media.ext === 'gif') ?
                        <IconButton
                          onClick={() => viewDocument(media)}
                          className={classes.productListImageView}
                        >
                         <VisibilityIcon />
                        </IconButton>
                      :null} 
                      {deleteAccess ?
                        <IconButton
                          onClick={() => {
                            handleClickOpen(media);
                          }}
                          className={classes.productListImageDelete}
                        >
                          <DeleteIcon />
                        </IconButton>
                      :null}    
                    </ListItemSecondaryAction>
                  </ListItem>
                ))
              ): subfolderView === false ?
              folderDocument.map((media) => (
                <ListItem
                  dense
                  button
                  className={clsx(
                    "border-solid border-b-1 py-16 px-0 sm:px-8"
                  )}
                  key={media._id}
                  onClick={updateAccess || viewAccess ? () => {
                    setOpen({ ...open, details: true });
                    setDetails(media);
                    dispatch(
                      getDocument({ projectId, documentId: media._id })
                    );
                  }:() => dispatchWarningMessage(dispatch, "You do not have access to view document details.")}
                >
                  {setIcon(media.file)}
                  <ListItemIcon className="mr-10">
                    <img alt="iconset1" src={icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary={media.title}
                    secondary={media.size}
                  />
                  
                  <ListItemSecondaryAction>
                    {viewAccess && (media.ext === 'jpg'|| media.ext === 'pdf'|| media.ext === 'PDF' || media.ext === 'docx' || media.ext === 'doc' || media.ext === 'mp3' || media.ext === 'png'  || media.ext === 'jpeg' || media.ext === 'PNG' || media.ext === 'svg' || media.ext === 'gif') ? 
                      <IconButton
                        onClick={() => viewDocument(media)}
                        className={classes.productListImageView}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    :null}
                    {deleteAccess ? 
                      <IconButton
                        onClick={() => {
                          handleClickOpen(media);
                        }}
                        className={classes.productListImageDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    :null} 
                  </ListItemSecondaryAction> 
                </ListItem>
              )):
              subfolderDocument.map((media) => (
                <ListItem
                  dense
                  button
                  className={clsx(
                    "border-solid border-b-1 py-16 px-0 sm:px-8"
                  )}
                  key={media._id}
                  onClick={updateAccess || viewAccess ? () => {
                    setOpen({ ...open, details: true });
                    setDetails(media);
                    dispatch(
                      getDocument({ projectId, documentId: media._id })
                    );
                  }:() => dispatchWarningMessage(dispatch, "You do not have access to view document details.")}
                >
                  {setIcon(media.file)}
                  <ListItemIcon className="mr-10">
                    <img alt="iconset" src={icon} />
                  </ListItemIcon>
                  <ListItemText
                    primary={media.title}
                    secondary={media.size}
                  />
                  
                  <ListItemSecondaryAction>
                    {viewAccess && (media.ext === 'jpg'|| media.ext === 'pdf'|| media.ext === 'PDF' || media.ext === 'docx' || media.ext === 'doc' || media.ext === 'mp3' || media.ext === 'png'  || media.ext === 'jpeg' || media.ext === 'PNG' || media.ext === 'svg' || media.ext === 'gif') ? 
                      <IconButton
                        onClick={() => viewDocument(media)}
                        className={classes.productListImageView}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    :null}
                    {deleteAccess ? 
                      <IconButton
                        onClick={() => {
                          handleClickOpen(media);
                        }}
                        className={classes.productListImageDelete}
                      >
                        <DeleteIcon />
                      </IconButton>
                    :null}
                  </ListItemSecondaryAction>  
                </ListItem>
              ))
              }
              </FuseAnimateGroup>
            </List>
          </Paper>
          <FuseAnimate animation="transition.expandIn" delay={300}>
            <Fab
              color="primary"
              aria-label="upload"
              className={classes.addButton}
              onClick={() => inputFile.current.click()}
              disabled={uploadAccess === true ? false :true}
            >
              <input
                ref={inputFile}
                className="hidden"
                id="button-file"
                type="file"
                multiple={true}
                onChange={handleUploadChange}
              />
              {loading ? (
                <CircularProgress color="secondary" />
              ) : (
                <CloudUploadIcon />
              )}
            </Fab>
          </FuseAnimate>
        </div>
      )}

      <Dialog
        open={open.delete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Document"}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => setOpen({ ...open, delete: false })}
            color="primary"
          >
            Cancel
          </Button>
          {pageloading ? (
            <CircularProgress size={20} />
          ) : (
            <Button
              onClick={() => {
                setPageLoading(true);
                dispatch(deleteDocument({ projectId, documentId })).then(
                  (respose) => {
                    if (respose) {
                      setPageLoading(false);
                      setOpen({ ...open, delete: false });
                      if(subfolderView === true){
                        setSubFolderView(false)
                      }
                    }
                  }
                );
              }}
              color="primary"
              autoFocus
            >
              Ok
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
          open={folderOpen}
          onClose={handleClose} 
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
          <div class="w-auto">
              <FormControl variant="outlined">
                 <TextField
                  variant="outlined"
                  className="my-12"
                  label="Folder Name"
                  value={folder.name}
                  onChange={handleChange("name")}
                />
              </FormControl>
           </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleFolderClose()} color="primary">
              CANCEL
            </Button>
            {type === 'new' ?
              <Button onClick={() => createFolder()} color="primary" autoFocus>
                OK
              </Button>:
             type === 'edit' ?
              <Button onClick={() => updateFolder()} color="primary" autoFocus>
                Update
              </Button>:
             null
            }
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
                 <img alt="viewFile" src={file} />
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

      {open.details ? (
        <DocumentDetails
          open={open.details}
          details={details}
          close={handleClose}
        />
      ) : null}
    </div>
  );
};

export default React.memo(Documents);
