import React, { useState, useEffect } from "react";
import axios from "axios";
import constants from "app/main/config/constants";
import { showMessage } from "app/store/fuse/messageSlice";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Button } from "@material-ui/core";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";
import { IconButton } from "@material-ui/core";
import clsx from "clsx";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import ReactTable from "react-table-6";
import { getUsers } from "./store/usersSlice";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import CancelIcon from "@material-ui/icons/Cancel";
import history from "@history";
import {
  Dialog,
  DialogActions,
  DialogContent,
  TextField,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  addButton: {
    right: 40,
    bottom: 5,
    zIndex: 99,
  },
  root: {
    maxHeight: "68vh",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  appBar: {
    position: 'relative',
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 3,
    color: '#fff',
  },
}));


const initialFormState = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

const initialErrorState = {
  name: '',
  email: '',
  password: '',
  passwordConfirm: '',
};

function UsersList(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const users = useSelector(({ users }) => users.entities);
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [passwordError, setPasswordError] = useState('');
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getUsers()).then((response) => {
      setData(response.payload);
    });
  }, []);

  function customFilter(value) {
    if (value === 'all') {
      setType("All")
      setData(users);
    } else {
      let newData = users.filter((dt) => dt.status === value);
      setType(value);
      setData(newData);
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  function filterCaseInsensitive(filter, row) {
    const id = filter.pivotId || filter.id;
    if (id === 'brand' || id === 'supplier') {
      return (
        row[id] !== undefined ?
          String(row[id].props.children.toLowerCase()).includes(filter.value.toLowerCase())
          :
          false
      );
    } else {
      return (
        row[id] !== undefined ?
          String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())
          :
          false
      );
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handlePasswordChange = (event) => {
    handleChange(event);
    setPasswordError('');
  };

  const handleConfirmPasswordChange = (event) => {
    handleChange(event);
    setPasswordError('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...initialErrorState };

    if (!form.name) {
      newErrors.name = 'Please enter a name';
      isValid = false;
    } else if (form.name.length > 20) {
      newErrors.name = 'Username cannot exceed 20 characters';
      isValid = false;
    }

    if (!form.email) {
      newErrors.email = 'Please enter an email';
      isValid = false;
    } else if (!isValidEmail(form.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = 'Please enter a password';
      isValid = false;
    } else if (form.password.length < 4) {
      newErrors.password = 'Min character length is 4';
      isValid = false;
    }

    if (!form.passwordConfirm) {
      newErrors.passwordConfirm = 'Please confirm the password';
      isValid = false;
    } else if (form.password !== form.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    handleClose();
    axios
      .post(constants.BASE_URL + '/users/email/register', form)
      .then((response) => {
        if (response.data.message === 'User Registered') {
          
          dispatch(
            showMessage({
              message: 'Verification mail sent to user email.',
              variant: 'success',
              autoHideDuration: null,
            })
          );
          
          dispatch(getUsers()).then((response) => {
            setData(response.payload);
            setLoading(false);
          });
        } else {
          setLoading(false);
          dispatch(
            showMessage({
              message: response.data.message,
              variant: 'error',
            })
          );
        }
      })
      .catch((error) => {
        setLoading(false);
      });

    resetForm();
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const resetForm = () => {
    setForm(initialFormState);
    setErrors(initialErrorState);
    setPasswordError('');
  };

  function canBeSubmitted() {
    return (
      form.name.length > 0 &&
      form.email.length > 0 &&
      form.password > 0 &&
      form.passwordConfirm.length
    );
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper className="w-full rounded-8 shadow-1">
        <div className="flex items-center justify-between px-16 h-64 border-b-1">
          <Typography className="text-16 font-bold">Users List</Typography>
          <Button color="primary" onClick={handleClickOpen} variant="contained" className="mb-8" style={{ padding: '3px 16px' }} nowrap="true">Add User</Button>
        </div>

        <FuseAnimate animation="transition.slideUpIn">
          <ReactTable
            className={clsx(
              classes.root,
              "-striped -highlight sm:rounded-16 overflow-hidden px-6"
            )}
            data={data}
            filterable
            defaultFilterMethod={(filter, row) => filterCaseInsensitive(filter, row)}
            columns={[
              {
                Header: "User Name",
                className: "font-bold",
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%"
                        }}
                      />
                    </div>
                  );
                },
                accessor: "name",
                Cell: ({ row }) => (
                  <a
                    className="cursor-pointer"
                    onClick={() =>
                      history.push({
                        pathname: `/users/${row._original._id}`,
                      })
                    }
                  >
                    {row._original.name}
                  </a>
                ),
              },
              {
                Header: "Role",
                className: "align-center",
                accessor: "department",
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%"
                        }}
                      />
                    </div>
                  );
                },
              },
              {
                Header: "Email",
                className: "align-center",
                accessor: "email",
                Filter: ({ filter, onChange }) => {
                  return (
                    <div style={{ position: "relative" }}>
                      <input
                        onChange={(event) => onChange(event.target.value)}
                        value={filter ? filter.value : ""}
                        style={{
                          width: "100%"
                        }}
                      />
                    </div>
                  );
                },
              },

              {
                Header: "Status",
                className: "align-center",
                id: "status",
                Filter: ({ filter, onChange }) =>
                  <select
                    onChange={event => customFilter(event.target.value)}
                    style={{ width: "100%" }}
                    value={type}
                  >
                    <option value="all">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Deactive">Deactive</option>
                    <option value="Invited">Invited</option>
                    <option value="Deleted">Deleted</option>
                  </select>,
                accessor: (d) =>
                  d.status === 'Active' ? (
                    <Typography className="bg-green-700 text-white inline p-4 rounded truncate">
                      Active
                    </Typography>
                  ) : d.status === 'Inactive' ? (
                    <Typography className="bg-orange-700 text-white inline p-4 rounded truncate">
                      Inactive
                    </Typography>
                  ) : d.status === 'Deleted' ? (
                    <Typography className="bg-red-700 text-white inline p-4 rounded truncate">
                      Deleted
                    </Typography>
                  ) : d.status === 'Invited' ? (
                    <Typography className="bg-blue-700 text-white inline p-4 rounded truncate">
                      Invited
                    </Typography>
                  ) : d.status === 'Deactive' ? (
                    <Typography className="bg-purple-700 text-white inline p-4 rounded truncate">
                      Deactive
                    </Typography>
                  ) : null,
              },
            ]}
            defaultPageSize={10}
            noDataText="No users found"
          />
        </FuseAnimate>
      </Paper>

      <Dialog open={open} onClose={handleClose}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <Typography variant="subtitle1" className="flex w-full items-center justify-start gap-10" color="inherit">
              Add User
            </Typography>
            <IconButton onClick={handleClose}>
              <CancelIcon style={{ color: 'red' }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent className="flex flex-wrap">
          <div className="flex flex-col w-full">
            <TextField
              className="mb-16"
              type="text"
              name="name"
              label="Name"
              autoFocus
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <TextField
              className="mb-16"
              type="text"
              name="email"
              label="Email"
              value={form.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <TextField
              className="mb-16"
              type="password"
              name="password"
              label="Password"
              value={form.password}
              onChange={handlePasswordChange}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
              required
            />
          </div>

          <div className="flex flex-col w-full">
            <TextField
              className="mb-16"
              type="password"
              name="passwordConfirm"
              label="Confirm Password"
              value={form.passwordConfirm}
              onChange={handleConfirmPasswordChange}
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm}
              variant="outlined"
              required
            />
            <p>{passwordError}</p>
          </div>
        </DialogContent>

        <DialogActions>
          <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} disabled={!canBeSubmitted()} >
            Add
          </Button>
          <Button onClick={()=> handleClose()} variant="contained" color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

    </React.Fragment>
  );
}

export default UsersList;