import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import { useDispatch, useSelector } from 'react-redux';
import { routes } from 'app/main/projects/store/projectsSlice';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { updateTemplate } from 'app/main/projects/store/projectsSlice';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  DialogContentText,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Backdrop from "@material-ui/core/Backdrop";
import FormControl from "@material-ui/core/FormControl";
import ChipInput from "material-ui-chip-input";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex-container',
    maxHeight: '68vh',
  },
  list: {
    display: 'flex',
    overflow: 'auto',
    maxHeight: '30vh',
    flexDirection: 'column',
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  delete: {
    color: "red",
  },
}));

function TemplateDetails() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const templateDetails = useSelector(
    ({ projects }) => projects.template.detailTemplate
  );
  const projectId = useSelector(({ projects }) => projects.details._id);
  // const { form, handleChange, setForm } = useForm(
  //   templateDetails.templateItems
  // );
  const [form, setForm] = React.useState(templateDetails.templateItems);
  const [edit, setEdit] = React.useState(false);
  const [values, setValues] = React.useState({
    title: templateDetails.details.title,
    description: templateDetails.details.description,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [step, setStep] = useState("");
  const [format, setFormat] = useState("");
  const [index, setIndex] = useState('');
  const [remove, setRemove] = useState(false);
  const [itemName, setItemName] = useState('')

  const handleChange = (event, p, q) => {
    if (q === undefined) {
      let newForm = JSON.parse(JSON.stringify(form));
      newForm[p]={[event.target.value]:newForm[p][Object.keys(newForm[p])[0]]}
      setForm(newForm);
    } else {
      let newForm = JSON.parse(JSON.stringify(form));
      newForm[p][Object.keys(newForm[p])[0]][q].title = event.target.value;
      setForm(newForm);
    }
  };

  const editTemplate = () =>{ 
    let newForm = {};
    newForm.title = values.title;
    newForm.description = values.description;
    newForm.templateItems = JSON.parse(JSON.stringify(form));
    let templateId = templateDetails.details._id;
    setLoading(true);
     dispatch(updateTemplate({ projectId, templateId, newForm})).then((response) => {
       handleClose();
       setLoading(false);
       setEdit(false);
     });
  }

  const handleChangeStep = (prop) => (event) => {
    setStep(event.target.value );
  };

  const handleChangeFormat = (prop) => (event) => {
    setFormat(event.target.value );
  };

  function handleAddItem(value) {
    setItems((items) => [...items, value]);
  }

  function handleDeleteItem(Item, index) {
    setItems(items.filter((item) => item !== Item));
  }

  const AddItems = () =>{
    let tempItems = [];
    if(templateDetails.details.templateType === 'Normal')
    {
      items.forEach((item) => {
        tempItems.push({"title":item,"categoryFormat":"text","uniqueId":FuseUtils.generateGUID()})
      }) 
      setForm([...form, {[step]:tempItems}]) 
    }else{
      let temp = form.filter((itm)=>Object.getOwnPropertyNames(itm)[0] === step);
      if(temp.length > 0){
        dispatchWarningMessage(dispatch, "Sorry!! Entered Item is already present.");
      }else{
        if(index !== ''){
          let newItem = {[step] : [{"title":step,"categoryFormat":format,"uniqueId":FuseUtils.generateGUID()}]};
          form.forEach((fm)=>{
            tempItems.push(fm)
          })
          tempItems.splice(index, 0, newItem);
          setForm(tempItems) 
        }else{
          tempItems.push({"title":step,"categoryFormat":format,"uniqueId":FuseUtils.generateGUID()}) 
          setForm([...form, {[step]:tempItems}]) 
        }
      }   
    }
    setEdit(true);
    handleClose()
  }

  const handleClose = () => {
    setOpen(false);
    setStep("");
    setItems([]);
    setFormat("");
    setIndex('');
    setItemName('');
  };

  const disableButton = () => {
    if(templateDetails.details.templateType !== 'Normal')
    {
      return (
        step.length > 0 &&
        format.length > 0 
      );
    }else{
      return (
        step.length > 0 &&
        items.length > 0 
      );
    }
  }

  function deleteItem(){
    let tempItems = [];
    form.forEach((fm)=>{
      tempItems.push(fm)
    })
    tempItems.splice(index, 1);
    setForm(tempItems);
    setRemove(false); 
  }

  return (
    <div className={clsx(classes.root, 'flex flex-1 w-full h-full')}>
      <Paper className='w-full h-full'>
       <div className="flex items-center justify-between px-16">
        <div className="flex justify-Start mt-12 mb-12">
         <Typography className="font-bold" color="primary" >
           Template Details
         </Typography>
        </div>
        <div className='flex justify-end mt-12 mr-24 mb-12'>
         <Backdrop className={classes.backdrop} open={loading}>
           <CircularProgress color="inherit" />
         </Backdrop>
         <Typography
            className='font-bold cursor-pointer'
            color='secondary'
            onClick={() => dispatch(routes('Templates'))}
         >
            Back To Templates List
         </Typography>
        </div>
       </div>
        <div className='flex flex-col w-full gap-8 p-20'>
          <div className='flex flex-row gap-12'>
            <Typography variant='subtitle1'>Title :</Typography>
            {edit && templateDetails.details.templateType === 'Normal' ? (
              <TextField
                value={values.title}
                onChange={(event) => {
                  setValues({ ...values, title: event.target.value });
                }}
              />
            ) : (
              <Typography className='font-bold' variant='subtitle1'>
                {values.title}
              </Typography>
            )}
          </div>
          <div className='flex flex-row gap-12'>
            <Typography variant='subtitle1'>Description :</Typography>
            {edit && templateDetails.details.templateType === 'Normal' ? (
              <TextField
                value={values.description}
                onChange={(event) => {
                  setValues({ ...values, description: event.target.value });
                }}
              />
            ) : (
              <Typography className='font-bold' variant='subtitle1'>
                {values.description}
              </Typography>
            )}
          </div>
          <Typography variant='subtitle1'>Template Items :</Typography>
          {edit ?
            <div className='flex items-end justify-end mr-28 gap-12'>
              <Button variant='contained'color='primary'
                onClick={() => {
                  setOpen(true)
                }}
              >
                Add Template Items
              </Button>
            </div>
          :null}
     
          <div className={classes.list}>
            {form.map((item, p) => (
              <>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel1a-content'
                    id='panel1a-header'
                  >
                    {edit && templateDetails.details.templateType === 'Normal' ? (
                      <>
                      <TextField
                        key={p}
                        name='category'
                        fullWidth
                        value={Object.getOwnPropertyNames(item)}
                        onChange={(event) => handleChange(event, p)}
                      />
                    </>
                    ) : (
                      <Typography className='font-bold'>
                        {Object.getOwnPropertyNames(item)}
                      </Typography>
                    )}
                  </AccordionSummary>

                  <AccordionDetails className='p-0'>
                  {templateDetails.details.templateType === 'Normal' ?
                    <List component='div' disablePadding fullWidth>
                      {item[Object.keys(item)[0]].map((element, q) => (
                        <ListItem className={classes.nested}>
                          {edit ? (
                            <TextField
                              key={q}
                              fullWidth
                              style={{ width : "925px" }}
                              value={element.title}
                              onChange={(event) => {
                                handleChange(event, p, q);
                              }}
                            />
                          ) : (
                            <ListItemText primary={element.title} />
                          )}
                        </ListItem>
                      ))}
                    </List>
                    : 
                    edit ? 
                    <>
                    <div className='flex items-end justify-end ml-10 mb-10 gap-12'>
                    <Button variant='contained'color='secondary'
                      onClick={() => {
                        setOpen(true)
                        setIndex(p);
                      }}
                    >
                      Add Item
                    </Button>
                    </div>
                    <IconButton
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setRemove(true);
                        setIndex(p);
                        setItemName(Object.getOwnPropertyNames(item))
                      }}
                    >
                      <Icon className={classes.delete}>delete</Icon>
                    </IconButton>
                    </>:null
                  }
                  </AccordionDetails>
                </Accordion>
              </>
            ))}
            
          </div>
          <div className='flex flex-row py-6 gap-10'>
            {edit ? (
              <>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={() => {
                   editTemplate();
                  }}
                >
                  Save
                </Button>
                <Button variant='contained' onClick={() =>{
                  setEdit(false)
                  setForm(templateDetails.templateItems)}}>
                  Cancel
                </Button>
              </>
            ) : (
              // templateDetails.details.templateType === 'Normal' ?
              <Button
                variant='contained'
                color='primary'
                onClick={() => setEdit(true)}
              >
                Edit
              </Button>
              // :null
            )}
          </div>
        </div>
      </Paper>

      <Dialog
          open={open}
          onClose={handleClose} 
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Add Template Items"}</DialogTitle>
          <DialogContent>
          <div class="w-auto">
          {templateDetails.details.templateType === 'Normal' ? 
              <FormControl variant="outlined">
                 <TextField
                  variant="outlined"
                  className="my-12"
                  label="Steps"
                  defaultValue={step}
                 onChange={handleChangeStep("step")}
                />
                  <ChipInput
                    id="Items"
                    label="Items"
                    value={items}
                    onAdd={(item) => handleAddItem(item)}
                    onDelete={(item, index) => handleDeleteItem(item, index)}
                    newChipKeyCodes={[13, 188]}
                    variant="outlined"
                   />
                    <Typography variant="subtitle1" className="mb-16">
                  (Input item and press Enter)
                </Typography>
              </FormControl>
            :
            <>
            <FormControl variant="outlined">
               <TextField
                 variant="outlined"
                 className="my-16"
                 label="Item Name"
                 required
                 defaultValue={step}
                 onChange={handleChangeStep("step")}
               />
               <FormControl required variant="outlined" className=" my-16">
                 <InputLabel id="demo-simple-select-outlined-label">
                   Select Type
                 </InputLabel>
                 <Select
                   value={format}
                   onChange={handleChangeFormat("format")}
                   label="Select Type"
                 >
                   <MenuItem value="Document">Document</MenuItem>
                   <MenuItem value="text">Only Mark</MenuItem>
                 </Select>
               </FormControl>
            </FormControl>
          </>
         } 
           </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleClose()} color="primary">
              CANCEL
            </Button>
              <Button disabled={!disableButton()} onClick={() => AddItems()} color="primary" autoFocus>
                OK
              </Button>
          </DialogActions>
      </Dialog>
      <Dialog open={remove} onClose={remove}>
       <DialogTitle id="alert-dialog-title">Delete Item</DialogTitle>
       <DialogContent>
         <DialogContentText id="alert-dialog-description">
            Are you sure want to delete {itemName}?
         </DialogContentText>
       </DialogContent>
       <DialogActions>
       <Button onClick={() => setRemove(false)} color="primary">
          NO
       </Button>
       <Button
         onClick={() => {
           deleteItem()
         }}
         color="primary"
         autoFocus
       >
         YES
      </Button>
    </DialogActions>
  </Dialog>
    </div>
  );
}

export default TemplateDetails;
