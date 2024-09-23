import FuseAnimate from "@fuse/core/FuseAnimate";
import FuseAnimateGroup from "@fuse/core/FuseAnimateGroup";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Fab from "@material-ui/core/Fab";
import Icon from "@material-ui/core/Icon";
import NotificationListItem from "./NotificationListItem";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import { deleteNotifications } from "../store/notificationSlice";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/AddCircle';
import { IconButton } from "@material-ui/core";
import { DialogContent, TextField, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";
import { getUsers } from "app/main/users/store/usersSlice";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { getNotification, getNotificationForAdmin, addNotifications } from "../store/notificationSlice";

const useStyles = makeStyles((theme) => ({
  mailItem: {
    borderBottom: `1px solid  ${theme.palette.divider}`,

    "&.unread": {
      background: "rgba(0,0,0,0.03)",
    },
    "&.selected": {
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        display: "block",
        height: "100%",
        width: 3,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  avatar: {
    backgroundColor: theme.palette.primary[500],
  },
  deleteButton: {
    position: "fixed",
    right: 100,
    bottom: 5,
    zIndex: 99,
    color: "white",
    backgroundColor: "red",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: "#fff",
  },
}));


function NotificationList(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const entities = useSelector(({ notification }) => notification.entities);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const [ loading, setLoading] = useState(false)
  const [page, setPage] = useState(1);
  const role = useSelector(({ auth }) => auth.user.role);
  const count = useSelector(({ notification }) => notification.count);
  const [hide, setHide] = useState(false)
  const [filteredData, setFilteredData] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false)
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([])
  const [memberIds, setMemberIds] = useState([])
  const [list, setList] = useState({
    title: "",
    description: "",
  });
  const [text, setText] = useState('');

  let limit = 10;
 
  useEffect(() => {
    if(role === 'admin'){
      setLoading(true);
      dispatch(getNotificationForAdmin({userId, page, limit, text})).then((res)=>{
        setLoading(false);
      })
      if(count > 0){
        if(Math.ceil(count / limit) > page){
          setHide(false)
        }else{
          setHide(true)
        }
      }else{
        setHide(true)
      }
    }else{
      dispatch(getNotification(userId))
    }

  }, [dispatch, userId, count]);

  useEffect(() => {
    dispatch(getUsers()).then((response) => {
      let temp = [];
      response.payload.forEach((res)=>{
        if(res.status === 'Active'){
          temp.push(res);
        }
      })
      setUsers(temp);
    });
  }, []);

  const handleChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((_id) => _id !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // useDeepCompareEffect(() => {
  //   dispatch(getMails(routeParams));
  // }, [dispatch, routeParams]);

  useEffect(() => {
    // function getFilteredArray() {
    //   if (searchText.length === 0) {
    //     return mails;
    //   }
    //   return FuseUtils.filterArrayByString(mails, searchText);
    // }

    // if (mails) {
    //   setFilteredData(getFilteredArray());
    // }
    setFilteredData(entities);
  }, []);

  function AddUser(newValue){
    let tempNames = [], tempIds = [];
    newValue.forEach((val)=>{
      tempIds.push(val._id);
      tempNames.push(val.name)
    })
    setMembers(newValue);
    setMemberIds(tempIds);
  }

  function AddNotification(){
    setLoading(true);
    setAddOpen(false);
    let data = {
      title: list.title,
      description: list.description,
      membersIds: memberIds
    }

    dispatch(addNotifications({data, userId, page, limit})).then((res)=>{
      setLoading(false);
      handleClose()
    })

  }

  function removeNotifications(){
    setOpen(false);
    setLoading(true);
    dispatch(deleteNotifications({ selectedIds, userId, page:1, limit:10 })).then(
      (response) => {
        setSelectedIds([]);
        setLoading(false);
      }
    );
  }

  const handleChanges = (prop) => (event) => {
    setList({ ...list, [prop]: event.target.value });
  };

  const handleChangeText = (prop) => (event) => {
    console.log(event.target.value)
    setText(event.target.value);
  };

  function handleNext(){
    setLoading(true);
    dispatch(getNotificationForAdmin({userId, page: page + 1, limit, text})).then((res)=>{
      setLoading(false);
      setPage(page + 1)
    })
    if(count > 0){
      if(Math.ceil(count / limit) > page){
        setHide(false)
      }else{
        setHide(true)
      }
    }else{
      setHide(true)
    }
  }

  function handlePrevious(){
    setLoading(true);
    dispatch(getNotificationForAdmin({userId, page: page - 1, limit, text})).then((res)=>{
      setLoading(false);
      setPage(page - 1)
    })
    if(count > 0){
      if(Math.ceil(count / limit) > page){
        setHide(false)
      }else{
        setHide(true)
      }
    }else{
      setHide(true)
    }
  }

  function handleSearchText(){
    setLoading(true);
    dispatch(getNotificationForAdmin({userId, page: 1, limit, text})).then((res)=>{
      setLoading(false);
      setPage(1)
    })
    if(count > 0){
      if(Math.ceil(count / limit) > 1){
        setHide(false)
      }else{
        setHide(true)
      }
    }else{
      setHide(true)
    }
  }

  const disableButton = () => {
    return (
      memberIds.length > 0 &&
      list.title.length > 0 &&
      list.description.length > 0
    );
  };

  function handleClose(){
    setAddOpen(false)
    setList({ title: "", description: ""})
    setMembers([]);
    setMemberIds([]);
  }


  if (!entities) {
    return null;
  }

  if (entities.length === 0) {
    return (
      <FuseAnimate delay={100}>
        <div className="flex flex-1 items-center justify-center h-full">
          <Typography color="textSecondary" variant="h5">
            No notifications yet
          </Typography>
        </div>
      </FuseAnimate>
    );
  }

  return (
    <>
    <Backdrop className={classes.backdrop} open={loading}>
      <CircularProgress color="inherit" />
    </Backdrop>
    {role === 'admin' ?
      <div className="flex items-center justify-between px-16 h-64 border-b-1">
        <div>
          <TextField label="Title" value={text} onChange={handleChangeText("title")} className="text-16 font-bold"/>
          <IconButton variant="contained" onClick={()=> handleSearchText()} className="mb-8 mr-8 mt-10" style={{padding:'3px 16px'}}>
            <SearchIcon />
          </IconButton>
        </div>
        
        <Typography className="text-30 font-500 rounded-4 px-8 py-4">
          <IconButton onClick={()=> handlePrevious()} disabled={page === 1} variant="contained" className="mb-8" style={{padding:'3px 16px'}}>
            <ArrowBackIosIcon />
          </IconButton>
          {page}
          <IconButton onClick={()=> handleNext()} disabled={hide} variant="contained" className="mb-8 mr-8" style={{padding:'3px 16px'}}>
            <ArrowForwardIosIcon />
          </IconButton>
          <IconButton className="mb-8 mr-8" style={{padding:'3px 16px'}}>
            <AddIcon onClick={()=> setAddOpen(true)} />
          </IconButton>
        </Typography> 
      </div>
    :null}
      
    <List className="p-0">
      <FuseAnimateGroup
        enter={{
          animation: "transition.slideUpBigIn",
        }}
      >
        {entities.map((noti) => (
          <NotificationListItem notify={noti} key={noti._id}  ids={selectedIds} onIdSelect={handleChange} />
        ))}
      </FuseAnimateGroup>
    </List>
    {selectedIds.length ? (
      <FuseAnimate animation="transition.expandIn" delay={300}>
        <Fab
          className={classes.deleteButton}
          aria-label="delete"
          onClick={() => setOpen(true)}
        >
          <Icon>delete</Icon>
        </Fab>
      </FuseAnimate>
    ) : null}

    <Dialog open={open}>
      <DialogTitle id="alert-dialog-slide-title"> Delete Selected Notifications ? </DialogTitle>
      <DialogActions>
        <Button
          onClick={() => { setOpen(false) }}
          color="primary"
        >
          No
        </Button>
        <Button
          onClick={() => {
            removeNotifications()
          }}
          color="primary"
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>

    <Dialog fullWidth maxWidth="sm" open={addOpen}>
      <DialogTitle> Send Notification </DialogTitle>
      <DialogContent>
        <Autocomplete
          value = {members}
          multiple
          id="tags-outlined"
          options={users}
          fullWidth
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => { 
            AddUser(newValue);
          }}
          renderOption={(option) =>{
            if(option.name === undefined){
              return option.name;
            }else{
              return option.name;
            }
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select User"
              variant="outlined"
            />
          )}
        />
        <FormControl fullWidth variant="outlined" className="mt-10 w-full">
          <InputLabel id="demo-simple-select-outlined-label"> Select Type </InputLabel>
          <Select id="date format" value={list.title} onChange={handleChanges("title")} label="Select Type">
            <MenuItem value="Invoice">Invoice</MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          className="mt-10 w-full"
          multiline
          rows="3"
          label="Description"
          value={list.description}
          onChange={handleChanges("description")}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          disabled={!disableButton()}
          onClick={() => {
            AddNotification()   
          }}
        >
          Send
        </Button>
        <Button variant="contained" onClick={() =>{ handleClose() }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
    </>
  );
}

export default NotificationList;
