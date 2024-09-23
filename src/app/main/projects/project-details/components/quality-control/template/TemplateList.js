import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Backdrop from '@material-ui/core/Backdrop';
import clsx from 'clsx';
//import _ from '@lodash';
import FuseAnimate from '@fuse/core/FuseAnimate';
import List from '@material-ui/core/List';
import FuseAnimateGroup from '@fuse/core/FuseAnimateGroup';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { useDispatch, useSelector } from 'react-redux';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import {
  addTemplate,
  deleteTemplates,
  routes,
  downloadTemplate,
  detailTemplate,
  openNewDialog,
  closeNewDialog
} from 'app/main/projects/store/projectsSlice';
import TemplateListItem from './TemplateListItem';
import ReactTable from "react-table-6";
import Checkbox from "@material-ui/core/Checkbox";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";

const useStyles = makeStyles((theme) => ({
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    height: '100px',
    border: '3px dashed #eeeeee',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    marginBottom: '20px',
  },
  root: {
    width: '100%',
    //maxWidth: 360,
    maxHeight: '68vh',
    position: 'relative',
    overflow: 'auto',
    backgroundColor: theme.palette.background.paper,
  },
  root1: {
    display: 'flex-container',
    maxHeight: '68vh',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
  },
  deleteButton: {
    position: 'fixed',
    right: 100,
    bottom: 5,
    zIndex: 99,
  },
  delete: {
    color: 'red',
  },
  listItem: {
    borderBottom: '1px solid #ccc',
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  listItemIcon: {
    minWidth: '30px',
  },
  addButton: {
    position: 'fixed',
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const TemplateList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const loadingState = useSelector(({ projects }) => projects.loading);
  const projectId = useSelector(({ projects }) => projects.details._id);
  const templates = useSelector(({ projects }) => projects.template);
  const [values, setValues] = useState({
    title: '',
    description: '',
    file: '',
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const projectDialog = useSelector(({ projects }) => projects.projectDialog);

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleDrop = (acceptedFiles) => {
    setLoading(true);

    setValues({ ...values, file: acceptedFiles[0] });
    setLoading(false);
  };

  const disableButton = () => {
    return (
      values.title.length > 0 &&
      values.description.length > 0 
     // && !_.isEmpty(values.file)
    );
  };

  const handleIdChange = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((_id) => _id !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = () => {
    let form = new FormData();
    form.set('title', values.title);
    form.set('description', values.description);
    form.append('templateFile', values.file);
    dispatch(addTemplate({ projectId, form })).then((response) => {
      closeComposeDialog()
    });
  };

  function closeComposeDialog() {
    dispatch(closeNewDialog());
    setValues({
      title: '',
      description: '',
      file: '',
    })
 }

 const selectAllIds = () => {
  if (selectedIds.length === templates.templateArray.length) {
    setSelectedIds([]);
  } else {
    let ids = [];
    templates.templateArray.forEach((item) => {
      ids.push(item._id);
    });
    setSelectedIds(ids);
  }
};

function callTemplate(data){
  dispatch(detailTemplate(data));
  dispatch(routes('Template-Details'));
}

function filterCaseInsensitive(filter, row) {
  const id = filter.pivotId || filter.id;
  return (
    row[id] !== undefined ?
      String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
    :
      false
  );
}

  return (
    <>
      {!templates.templateArray.length ? (
        <div className='flex flex-1 w-full h-full'>
          <Paper className='w-full rounded-8 shadow-1'>
          <div className="flex items-center justify-between px-16">
              <div className="flex justify-Start mt-12 mb-12">
               <Typography className="font-bold" color="primary" >
                 Templates
               </Typography>
              </div>
              <div className='flex justify-end mt-12 mr-24'>
                <Typography className='font-bold cursor-pointer'color='secondary' onClick={() => dispatch(routes('Quality-Control'))}>
                  Back To Checklists
                </Typography>
              </div>
            </div>
            <Typography style={{ textAlign: 'center' }}>
              There are no Templates
            </Typography>
          </Paper>
        </div>
      ) : (
        <div className={clsx(classes.root1)}>
          <div className="flex items-center justify-between px-16">
            <div className="flex justify-Start mt-12 mb-12">
              <Typography className="font-bold" color="primary" >
                Templates
              </Typography>
            </div>
            <div className='flex justify-end mt-12 mr-24 mb-12'>
              <Typography className='font-bold cursor-pointer'color='secondary' onClick={() => dispatch(routes('Quality-Control'))}>
                Back To Checklists
              </Typography>
            </div>
          </div>
          <Backdrop className={classes.backdrop} open={loadingState}>
           <CircularProgress color='inherit' />
          </Backdrop>
          <FuseAnimate animation="transition.slideUpIn" delay={100}>
            <ReactTable
              className={classes.root}
              getTrProps={(state, rowInfo, column) => {
                return {
                  className: "items-center justify-center",
                };
              }}
              data={templates.templateArray}
              defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row) }
              filterable
              columns={[
              {
                Header: () => (
                 <Checkbox
                    onClick={(event) => {
                      event.stopPropagation();
                      selectAllIds();
                    }}
                   checked={
                     selectedIds.length === Object.keys(templates.templateArray).length &&
                     selectedIds.length > 0
                   }
                 />
                ),
                accessor: "",
                Cell: (row) => {
                  return (
                   <Checkbox
                     onClick={(event) => {
                       event.stopPropagation();
                       handleIdChange(row.value._id);
                     }}
                     checked={selectedIds.includes(row.value._id)}
                   />
                  );
                },
                className: "justify-center",
                sortable: false,
                filterable: false,
                width: 55,
              },
              {
                Header: "Name",
                accessor: "title",
                style: { 'white-space': 'unset' },
                Cell: ({ row }) => (
                 <a className="cursor-pointer"
                   onClick={() => { callTemplate(row._original)}}
                 >
                    {row._original.title}
                 </a>
               ),
               Filter: ({ filter, onChange }) => {
                return (
                  <div style={{ position: "relative" }}>
                    <input
                      onChange={(event) => onChange(event.target.value)}
                      value={filter ? filter.value : ""}
                      style={{
                        width: "100%",
                        backgroundColor: "#DCDCDC",
                        color: "#222222",
                      }}
                    />
                    <Icon
                      style={{
                        position: "absolute",
                        right: "10px",
                        lineHeight: "30px",
                      }}
                    >
                      search
                    </Icon>
                  </div>
                );
              },
               className: "font-bold",
              },
              {
               Header: "Created By",
               style: { 'white-space': 'unset' },
               accessor: 'createdBy',
               className: "justify-center",
               Filter: ({ filter, onChange }) => {
                return (
                  <div style={{ position: "relative" }}>
                    <input
                      onChange={(event) => onChange(event.target.value)}
                      value={filter ? filter.value : ""}
                      style={{
                        width: "100%",
                        backgroundColor: "#DCDCDC",
                        color: "#222222",
                      }}
                    />
                    <Icon
                      style={{
                        position: "absolute",
                        right: "10px",
                        lineHeight: "30px",
                      }}
                    >
                      search
                    </Icon>
                  </div>
                );
              },
              },
              {
               Header: " Created Date",
               style: { 'white-space': 'unset' },
               accessor: "createdDate",
               className: "justify-center",
               Filter: ({ filter, onChange }) => {
                return (
                  <div style={{ position: "relative" }}>
                    <input
                      onChange={(event) => onChange(event.target.value)}
                      value={filter ? filter.value : ""}
                      style={{
                        width: "100%",
                        backgroundColor: "#DCDCDC",
                        color: "#222222",
                      }}
                    />
                    <Icon
                      style={{
                        position: "absolute",
                        right: "10px",
                        lineHeight: "30px",
                      }}
                    >
                      search
                    </Icon>
                  </div>
                );
              },
              },
              {
               Header: 'Download',
               style: { 'white-space': 'unset' },
               id:'download',
               accessor: "download",
               Cell: ({ row }) => (
                 <>
                   <a
                     className="cursor-pointer"
                     onClick={() =>
                        dispatch(
                          downloadTemplate({ projectId, templateId: row._original._id })).then((response) => {

                          }
                        )
                     }
                   >
                     Download
                   </a>
                  </>
                ),
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%",
                          backgroundColor: "#DCDCDC",
                          color: "#222222",
                        }}
                      />
                      <Icon
                        style={{
                          position: "absolute",
                          right: "10px",
                          lineHeight: "30px",
                        }}
                      >
                        search
                      </Icon>
                    </div>
                  );
                },
                className: 'font-bold',
              }
            ]}
            defaultPageSize={5}
            noDataText="No Templates found"
          />
        </FuseAnimate>
          {/* <List className='p-0'>
            <FuseAnimateGroup
              enter={{
                animation: 'transition.slideUpBigIn',
              }}
            >
              {templates.templateArray.map((temp) => (
                <TemplateListItem
                  todo={temp}
                  key={temp._id}
                  onIdSelect={handleIdChange}
                  ids={selectedIds}
                />
              ))}
            </FuseAnimateGroup>
          </List> */}
        </div>
      )}
      {selectedIds.length ? (
        <FuseAnimate animation='transition.expandIn' delay={300}>
          <Fab
            className={classes.deleteButton}
            color='primary'
            aria-label='delete'
            onClick={() => setDeleteOpen(true)}
          >
            <Icon className={classes.delete}>delete</Icon>
          </Fab>
        </FuseAnimate>
      ) : null}
      <FuseAnimate animation='transition.expandIn' delay={300}>
        <Fab
          color='primary'
          aria-label='add'
          className={classes.addButton}
          onClick={() => dispatch(openNewDialog())}
        >
          <Icon>add</Icon>
        </Fab>
      </FuseAnimate>

      <Dialog open={projectDialog.props.open} {...projectDialog.props} fullWidth maxWidth='sm'>
        <Backdrop className={classes.backdrop} open={loadingState}>
          <CircularProgress color='inherit' />
        </Backdrop>
        <FuseAnimateGroup
          enter={{
            animation: 'transition.slideUpBigIn',
          }}
          leave={{
            animation: 'transition.slideUpBigOut',
          }}
        >
          <DialogTitle id='checklist-dialog-title'>Add Template</DialogTitle>
          <DialogContent>
            <div className='flex flex-1 flex-col w-full gap-10'>
              <TextField
                value={values.title}
                onChange={handleChange('title')}
                id='outlined-basic'
                name='title'
                label='Title'
                variant='outlined'
              />
              <TextField
                value={values.description}
                onChange={handleChange('description')}
                id='outlined-multiline-static'
                name='description'
                label='Description'
                multiline
                rows={3}
                variant='outlined'
              />
              <Dropzone
                onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                maxFiles={1}
                multiple={false}
                canCancel={false}
                inputContent='Drop A File'
                styles={{
                  dropzone: { width: 400, height: 100 },
                  dropzoneActive: { borderColor: 'green' },
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps({
                      className: clsx(classes.dropzone, 'cursor-pointer'),
                    })}
                  >
                    <input {...getInputProps()} />
                    {loading === true ? (
                      <CircularProgress />
                    ) : values.file !== '' ? (
                      <CloudDoneIcon
                        style={{ color: 'green' }}
                        fontSize='large'
                      />
                    ) : (
                      <CloudUploadIcon fontSize='large' />
                    )}

                    <Typography variant='subtitle1'>
                      Upload Template File (xls,xlsx)
                    </Typography>
                    {values.file.name ? (
                      <Typography variant='subtitle1'>
                        {values.file.name}
                      </Typography>
                    ) : null}
                  </div>
                )}
              </Dropzone>
              <a 
                onClick={() => dispatchWarningMessage(dispatch, "Please do not change the first row of sample template.")}
                href='https://fastbuild-dev.s3.amazonaws.com/6138941c69058e7eac6f3f0d/documents/Sample_Template.xlsx'
              >
                Download Sample Template
              </a>
              <div className='flex flex-1 flex-row gap-10 my-12'>
                <Button
                  disabled={!disableButton()}
                  onClick={handleSubmit}
                  variant='contained'
                  color='primary'
                >
                  Save
                </Button>
                <Button onClick={() => closeComposeDialog()} variant='contained'>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </FuseAnimateGroup>
      </Dialog>
      <Dialog open={deleteOpen}>
        <Backdrop className={classes.backdrop} open={loadingState}>
          <CircularProgress color='inherit' />
        </Backdrop>
        <DialogTitle id='alert-dialog-slide-title'>
          Delete Selected Templates ?
        </DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteOpen(false);
            }}
            color='primary'
          >
            No
          </Button>
          <Button
            onClick={() => {
              dispatch(
                deleteTemplates({ projectId, values: selectedIds })
              ).then((response) => {
                setSelectedIds([]);
                setDeleteOpen(false);
              });
            }}
            color='primary'
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default React.memo(TemplateList);
