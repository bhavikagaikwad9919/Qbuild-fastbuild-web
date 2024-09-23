import React from 'react';
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import FuseAnimate from '@fuse/core/FuseAnimate';
import axios from 'axios';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import constants from 'app/main/config/constants';
import { useForm } from '@fuse/hooks';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import { showMessage } from 'app/store/fuse/messageSlice';
import { Link } from 'react-router-dom';
import history from '@history';

const useStyles = makeStyles((theme) => ({
  root: {
    background:
      'radial-gradient(' +
      darken(theme.palette.primary.dark, 0.5) +
      ' 0%, ' +
      theme.palette.primary.dark +
      ' 80%)',
    color: theme.palette.primary.contrastText,
  },
}));

function ResetPassword(props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const { form, handleChange, resetForm } = useForm({
    password: '',
    passwordConfirm: '',
  });

  function isFormValid() {
    return (
      form.password.length > 0 &&
      form.password.length > 3 &&
      form.password === form.passwordConfirm
    );
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setLoading(true);
    const response = await axios.post(
      `${constants.BASE_URL}/users/${props.match.params.id}/${props.match.params.token}/password/change`,
      {
        password: form.password,
      }
    );
    if (response.data.code === 200) {
      dispatch(
        showMessage({
          message: response.data.message,
          variant: 'success',
        })
      );

      history.push({
        pathname: '/login',
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

    resetForm();
  }

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32'
      )}
    >
      <div className='flex flex-col items-center justify-center w-full'>
        <FuseAnimate animation='transition.expandIn'>
          <Card className='w-full max-w-384'>
            <CardContent className='flex flex-col items-center justify-center p-32'>
              <img
                className='w-128 m-32'
                src='assets/images/logos/qbuild-black.svg'
                alt='logo'
              />

              <Typography variant='h6' className='mb-32'>
                CREATE YOUR PASSWORD
              </Typography>

              <form
                name='resetForm'
                noValidate
                className='flex flex-col justify-center w-full'
                onSubmit={handleSubmit}
              >
                <TextField
                  className='mb-16'
                  label='Password'
                  type='password'
                  name='password'
                  value={form.password}
                  onChange={handleChange}
                  variant='outlined'
                  required
                  fullWidth
                />

                <TextField
                  className='mb-16'
                  label='Password (Confirm)'
                  type='password'
                  name='passwordConfirm'
                  value={form.passwordConfirm}
                  onChange={handleChange}
                  variant='outlined'
                  required
                  fullWidth
                />
                {loading ? (
                  <div className='flex justify-center'>
                    <CircularProgress />
                  </div>
                ) : (
                  <Button
                    variant='contained'
                    color='primary'
                    className='w-224 mx-auto mt-16'
                    aria-label='Reset'
                    disabled={!isFormValid()}
                    type='submit'
                  >
                    CREATE MY PASSWORD
                  </Button>
                )}
              </form>

              <div className='flex flex-col items-center justify-center pt-32 pb-24'>
                <Link className='font-medium' to='/login'>
                  Go back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default ResetPassword;
