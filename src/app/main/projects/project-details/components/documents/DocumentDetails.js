import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import {
  Avatar,
  Button,
  Checkbox,
  DialogActions,
  DialogTitle,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDocument,
  updateDocumentAcl,
  clearDocumentDetails,
  removeDocumentAcl,
  addEntryToSummary,
  listDocumentFolders,
} from "app/main/projects/store/projectsSlice";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ReactFileViewer from "react-file-viewer";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import PrismaZoom from "react-prismazoom";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

let initialValues = {
  title: "",
  notes: "",
  tags: [],
  folder:[],
};

const DocumentDetailsDilaog = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const documentDetails = useSelector(
    ({ projects }) => projects.document.detailDocument
  );
  const documentFolders = useSelector(
    ({ projects }) => projects.documentFolders
  );
  const projectId = useSelector(({ projects }) => projects.details._id);
  const team = useSelector(({ projects }) => projects.details.team);
  const user = useSelector(({ auth }) => auth.user);
  const [open, setOpen] = useState({
    main: false,
    teamList: false,
  });
  const [details, setDetails] = useState(initialValues);
  const [folder, setFolder] = useState({folderId:'',folderName:''});
  const [subFolder, setSubFolder] = useState([])
  const [access, setAccess] = useState([]);
  const [loading, setLoading] = useState({
    main: false,
    list: false,
    aclRemove: false,
  });
  const [folderId, setFolderId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [subfolderId, setSubFolderId] = useState("");
  const [subfolderName, setSubFolderName] = useState("");
  const [folderType, setFolderType] = useState("");
  const [viewOpen, setViewOpen] = useState();
  const [file, setFile] = useState("");
  const [type, setType] = useState("");
  const [state, setState] = useState({
    dataLoaded: false,
    rows: null,
    cols: null
  });
  const [viewAccess, setViewAccess] = useState();
  const [updateAccess, setUpdateAccess] = useState();
  const role = useSelector(({ auth }) => auth.user);
  const userId = useSelector(({ auth }) => auth.user.data.id)

  const onError = e => {
    console.log(e, "error in file-viewer");
  };

  useEffect(() => {
    team.map((t)=>{
     if(t._id === role.data.id && t.role === "owner"|| role.role === 'admin')
     {
       setViewAccess(true);
       setUpdateAccess(true);
     }else if(t._id === role.data.id && t.role !== "owner")
     {
       setUpdateAccess(t.tab_access.includes("Documents") || t.tab_access.includes("Update Document Details"));
       setViewAccess(t.tab_access.includes("Documents") || t.tab_access.includes("View/Download Document"));
     }
    })
   }, []);

  useEffect(() => {
    if (props.open) {
      if (documentDetails !== "") {
        setOpen({ ...open, main: true });
        var fileExt = documentDetails.file.split('.').pop();
        setType(fileExt);
        setFile(documentDetails.file);
      }
    }
  }, [props.open, documentDetails]);

  useEffect(() => {
    if (documentDetails !== "") {
      let title = documentDetails.title;
      setDetails({
        ...documentDetails,
        title: title,
      });
      if (documentDetails.acl.length) {
        let newAccess = [];
        documentDetails.acl.forEach((user) => {
          newAccess.push(user.userId);
        });
        setAccess(newAccess);
      }
    }
 
    if(documentDetails.folder !== undefined)
    {
      setFolderId(documentDetails.folder.folderId);
      setFolderName(documentDetails.folder.folderName);
    }

    if(documentDetails.subfolder !== undefined)
    {
      setSubFolderId(documentDetails.subfolder.subfolderId);
      setSubFolderName(documentDetails.subfolder.subfolderName);
    }
  }, [documentDetails]);

  useEffect(() => {
    if (documentFolders) {
      if(documentDetails.folder !== undefined)
      {
        if(documentDetails.folder.folderId !== '' && documentDetails.folder.folderId !== undefined)
        {
          let folder = documentFolders.filter((doc)=> doc._id === documentDetails.folder.folderId);
          if(folder[0].subFolders !== undefined){
            setSubFolder(folder[0].subFolders)
          }
          setFolderType(folder[0].folderType);
        }
      }
    }
  }, [ documentFolders,documentDetails]);

  let foldersName = [];
  documentFolders.forEach((item) => {
    if(item.folderType === 'document')
    {
      foldersName.push({
        folderId: item._id,
        folderName: item.folderName,
        subFolders: item.subFolders
      });
    }
  });

  const handleChange = (prop) => (event) => {
    setDetails({ ...details, [prop]: event.target.value });
  };

  const handleFolder = (prop) =>(event) =>{
    setFolderName(event.target.value);
  }

  const handleSubFolder = (prop) =>(event) =>{
    setSubFolderName(event.target.value);
  }

   const getFolder = (folder) =>{
     if(folder.subFolders !== undefined){
      setSubFolder(folder.subFolders)
    }
     if(folder === "None"){
      setFolderName("");
      setFolderId("");
     }else{
      setFolderId(folder.folderId)
     } 
   }

   const getSubFolder = (folder) =>{
    if(folder === "None"){
      setSubFolderId("")
      setSubFolderName("")
     }else{
      setSubFolderId(folder.id)
      setSubFolderName(folder.name)
     } 
   }

  function handleAddChip(value) {
    let tags = JSON.parse(JSON.stringify(details.tags));
    tags.push(value);
    setDetails({ ...details, tags: tags });
  }

  function handleDeleteChip(chip) {
    let tags = JSON.parse(JSON.stringify(details.tags));
    let newTags = tags.filter((item) => item !== chip);
    setDetails({ ...details, tags: newTags });
  }

  const handleAcl = (value) => {
    let user = access.find((user) => user._id === value);
    if (user) {
      let acl = access.filter((user) => user._id !== value);
      setAccess(acl);
    } else {
      setAccess([...access, { _id: value }]);
    }
  };

  const submitAcl = () => {
    setLoading({ ...loading, list: true });
    dispatch(
      updateDocumentAcl({ projectId, documentId: details._id, ids: access })
    ).then(() => {
      setLoading({ ...loading, list: false });
      setOpen({ ...open, teamList: false });
    });
  };

  const handleDeleteUser = (id) => {
    setLoading({ ...loading, aclRemove: true });
    dispatch(
      removeDocumentAcl({ projectId, documentId: details._id, id })
    ).then(() => {
      setLoading({ ...loading, aclRemove: false });
    });
  };

  const checkOwner = () => {
    let access = false;
    let member = team.find((member) => member._id === user.data.id);
    if (member) {
      if (member.role === "owner") {
        access = true;
      }
    }
    return access;
  };

  const checked = (id) => {
    let status = false;
    access.forEach((user) => {
      if (user._id === id) {
        status = true;
      }
    });
    return status;
  };

  const setIcon = () => {
    if (details && details.file) {
      let icon = "";
      let extension = details.file.split(".").pop().split(/\#|\?/)[0];
      switch (true) {
        case extension === "pdf":
          icon = "assets/icons/pdf.svg";
          break;
        case extension.includes("doc"):
          icon = "assets/icons/doc.svg";
          break;
        case extension.includes("jp"):
          icon = details.file;
          break;
        case extension === "png":
          icon = details.file;
          break;
        case extension === "dmg":
          icon = "assets/icons/dmg.svg";
          break;
        default:
          icon = "assets/icons/attachment.svg";
      }
      return icon;
    }
  };

  const handleSubmit = () => {
    setLoading({ ...loading, main: true });
 
    let form={
      "acl":details.acl,
      "file":details.file,
      "size":details.size,
      "status": details.status,
      "tags": details.tags,
      "title": details.title,
      "uploadDate": details.uploadDate,
      "uploadedBy":details.uploadedBy,
      "_id": details._id,
      "folder":{folderId:folderId,folderName,folderName},
      "subfolder" : { subfolderId : subfolderId, subfolderName : subfolderName}
      }

    dispatch(
      updateDocument({ projectId, documentId: details._id, form })
    ).then((response) => {
      setLoading({ ...loading, main: false });
      handleClose();
    });
  };

  const handleClose = () => {
    setDetails(initialValues);
    dispatch(clearDocumentDetails());
    setOpen({ main: false, teamList: false });
    props.close();
  };

  const viewDocument = () =>{
    setViewOpen(true)
    let reportName = "Document", actionType = "View", title = details.title; 
    dispatch(addEntryToSummary ({ projectId, userId, reportName, actionType, title }));
  }

  const downloadDocument = () =>{
    let reportName = "Document", actionType = "Download", title = details.title; 
    dispatch(addEntryToSummary ({ projectId, userId, reportName, actionType, title }));
  }

  return (
    <>
      <div>
        <Dialog open={open.main} fullWidth maxWidth="md">
          <DialogContent className="p-20">
            <div className="flex flex-1 flex-col w-full gap-12 mb-12">
              <div className="flex flex-1 flex-row gap-10 w-full">
                <Paper
                  className="flex items-center justify-center  w-128 h-128 rounded-8 px-8 py-4"
                  elevation={1}
                >
                  <img style={{ height: "100px" }} src={setIcon()}></img>
                </Paper>
                <div className="flex flex-1 flex-col gap-32">
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="File Name"
                    name="title"
                    onChange={handleChange("title")}
                    value={details ? details.title : null}
                  />
                  <div className="flex flex-row items-center gap-10 ml-12">
                    {details.acl && details.acl.length && updateAccess ? (
                      <>
                        {/* <Icon>account_circle</Icon> */}
                        {details.acl.map((user) => (
                          <Chip
                            key={user.userId.name}
                            variant="outlined"
                            avatar={
                              <Avatar
                                alt="profile"
                                src={user.userId.profilePicture}
                              />
                            }
                            color="primary"
                            label={user.userId.name}
                            onDelete={() => handleDeleteUser(user.userId._id)}
                            // onClick={() => setOpen({ ...open, teamList: true })}
                          />
                        ))}
                        {loading.aclRemove ? (
                          <CircularProgress size={20} />
                        ) : null}
                      </>
                    ) : (
                      <>
                        <Icon>lock</Icon>
                        <Typography
                          variant="subtitle1"

                          // onClick={() => setOpen({ ...open, teamList: true })}
                        >
                          Private
                        </Typography>
                      </>
                    )}
                    {user.role === "admin" || checkOwner() ? (
                      <Typography
                        variant="button"
                        className="cursor-pointer text-blue-700 uderline"
                        onClick={() => setOpen({ ...open, teamList: true })}
                      >
                        Edit Access
                      </Typography>
                    ) : null}
                  </div>
                </div>
              </div>
              <TextField
                multiline
                rows={3}
                variant="outlined"
                name="notes"
                label="Notes"
                onChange={handleChange("notes")}
                value={details.notes}
              />
              <ChipInput
                className="w-full"
                alwaysShowPlaceholder
                label="Tags"
                value={details.tags}
                onAdd={(chip) => {
                  handleAddChip(chip);
                }}
                onDelete={(chip) => handleDeleteChip(chip)}
                newChipKeyCodes={[13, 32, 188]}
                variant="outlined"
              />
              {folderType !== 'checklist'? 
               <FormControl
                 variant="outlined"
                 className="w-full"
               >
              <InputLabel id="demo-simple-select-outlined-label">
                 Folder
              </InputLabel>
               <Select
                id="demo-dialog-select"
                value={folderName}
                onChange={handleFolder("folder")}
               >
                   <MenuItem key="none" value="None" onClick={() => getFolder("None")}>None</MenuItem>
                  {foldersName.map((fname) => (
                    <MenuItem key={fname.folderId} value={fname.folderName} onClick={() => getFolder(fname)}>
                     {fname.folderName}
                    </MenuItem>
                  ))}
               </Select>
               </FormControl>
                :null}

              {folderName !== '' && folderType !== 'checklist' && subFolder.length > 0 ?
                <FormControl
                 variant="outlined"
                 className="w-full"
                >
                 <InputLabel id="demo-simple-select-outlined-label">
                   Sub-Folder
                 </InputLabel>
                 <Select
                   id="demo-dialog-select"
                   value={subfolderName}
                   onChange={handleSubFolder("subfolder")}
                 >
                   <MenuItem key="none" value="None" onClick={() => getSubFolder("None")}>None</MenuItem>
                    {subFolder.map((fname) => (
                      <MenuItem key={fname.id} value={fname.name} onClick={() => getSubFolder(fname)}>
                       {fname.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              :null}  
            </div>
          </DialogContent>
          <DialogActions>
            <div className="flex flex-1 flex-row gap-10 w-full">
              {loading.main ? (
                <CircularProgress size={20} />
              ) : (
                <Button
                  color="primary"
                  variant="contained"
                  size="small"
                  disabled={updateAccess === true ? false : true}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              )}

              {type === 'jpg'|| type === 'pdf' || type === 'docx' || type === 'doc' || type === 'mp3' || type === 'png'  || type === 'jpeg' || type === 'PNG' || type === 'svg' || type === 'gif'?
                <Button
                 size="small"
                 variant="contained"
                 onClick={() => viewDocument()}
                >
                 View
                </Button>
              :null}
              <Button
                href={details ? details.file : null}
                color="secondary"
                size="small"
                onClick={() => downloadDocument()}
                download
              >
                <CloudDownloadIcon />
              </Button>

              <Button variant="contained" color="primary" size="small" onClick={handleClose}>
                Close
              </Button>
              {/* <Button
                href={details ? details.file : null}
                size="small"
                download
              >
                Download
              </Button> */}
            
            </div>
          </DialogActions>
        </Dialog>
      </div>
      {open.teamList ? (
        <Dialog
          open={open.teamList}
          onClose={() => setOpen({ ...open, teamList: false })}
        >
          <DialogTitle>Select Team Members</DialogTitle>
          <DialogContent>
            <List>
              {team.map((member) =>
                user.data.id !== member._id ? (
                  <>
                    <ListItem
                      key={member._id}
                      button
                      dense
                      onClick={() => handleAcl(member._id)}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={checked(member._id)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemIcon>
                        <Avatar src={member.picture} alt={member.name} />
                      </ListItemIcon>
                      <ListItemText>{member.name}</ListItemText>
                    </ListItem>
                  </>
                ) : null
              )}
            </List>
            {loading.list ? (
              <CircularProgress size={20} />
            ) : (
              <Button variant="contained" onClick={submitAcl} color="primary">
                Save
              </Button>
            )}
          </DialogContent>
        </Dialog>
      ) : null}
      
      <Dialog
          fullScreen
          open={viewOpen}
        >
          <DialogTitle id="alert-dialog-title">{details.title}</DialogTitle>: 
          <DialogContent className="items-center justify-center">
            <div>
              {type === 'pdf' || type === 'docx' || type === 'doc' || type === 'mp3' || type === 'mp4'?
               <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
                 <ReactFileViewer key={Math.random()} fileType={type} filePath={file} onError={onError} />
               </PrismaZoom>
              :type === 'png'  || type === 'jpeg' || type === 'PNG' || type === 'svg' || type === 'gif'|| type === 'jpg'  ?
               <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
                 <img src={file} />
               </PrismaZoom>
              :null}  
            </div> 
          </DialogContent>
          <DialogActions>
           <Button onClick={() => setViewOpen(false)} variant="contained" color="primary">
             CLOSE
           </Button>
          </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(DocumentDetailsDilaog);
