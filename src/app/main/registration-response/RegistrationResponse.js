import React, { useState, useEffect } from 'react';
import { Card, CardContent, Grow, Typography } from '@material-ui/core';
import { darken } from '@material-ui/core/styles/colorManipulator';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { userDeviceInfo, FirebaseMessaging } from 'app/auth/store/loginSlice';
import { setUserData } from "app/auth/store/userSlice";
import axios from 'axios';
import history from '@history';
import clsx from 'clsx';
import constants from 'app/main/config/constants';
import { unreadCount } from "app/main/notifications/store/notificationSlice";
import jwtService from "app/services/jwtService";
import { Link } from "react-router-dom";

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

function RegistrationResponse(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(
        `${constants.BASE_URL}/users/${props.match.params.id}/${props.match.params.token}/verify`
      )
      .then((response) => {
        if (response.data.message === 'User Verified') {
          jwtService.setSession(response.data.data.access_token);
          dispatch(setUserData(response.data.data));
          FirebaseMessaging(dispatch);
          userDeviceInfo(response.data.data._id);
          dispatch(unreadCount(response.data.data._id));
          dispatch(
            showMessage({
              message: response.data.message,
              variant: 'success',
            })
          );
          history.push({
            pathname: "/onBoarding",
          });
          setLoading(false);
        } else {
          setLoading(false);
          dispatch(
            showMessage({
              message: response.data.message,
              variant: 'error',
            })
          );
        }
      });
  }, [props.match.params.id, props.match.params.token, dispatch]);

  const [loading, setLoading] = useState(true);

  return (
    <div
      className={clsx(
        classes.root,
        'flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32'
      )}
    >
      <div className='flex flex-col items-center justify-center w-full'>
        <Grow in={true}>
          <Card className='w-full max-w-400'>
            <CardContent className='flex flex-col items-center justify-center text-center p-20'>
              {loading ? (
                <CircularProgress />
              ) : (
                <React.Fragment>
                  <img
                    className='w-128 m-20'
                    src='assets/images/logos/qbuild-black.svg'
                    alt='logo'
                  />
                  <Typography variant='subtitle1' className='mb-16'>
                    There is error while verifying your account please contact
                    administrator
                  </Typography>
                  <div className="flex flex-col items-center justify-center pt-32 pb-24">
                    <Link className="font-medium" to="/pages/auth/login">
                      Go back to login
                    </Link>
                  </div>
                </React.Fragment>
              )} 
            </CardContent>
          </Card>
        </Grow>
      </div>
    </div>
  );
}

export default RegistrationResponse;
