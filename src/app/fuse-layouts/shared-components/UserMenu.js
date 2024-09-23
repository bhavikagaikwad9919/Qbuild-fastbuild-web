import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from 'app/auth/store/userSlice';
import { Badge } from "@material-ui/core";

function UserMenu(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  const unreadCount = useSelector(({ notification }) => notification.unreadCount);
  const [userMenu, setUserMenu] = useState(null);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };

  return (
    <>
       <Button className='min-h-40' activeclassname="active" component={Link} to='/notification'>
           <Icon>notifications</Icon>
           <Badge
              className="pl-5 pb-10"
              color="secondary"
              showZero
              badgeContent={unreadCount}
            />
      </Button>
      <Button className='min-h-40' onClick={userMenuClick}>
        {/* <div className='hidden md:flex flex-col mx-6 items-end'>
          <Typography component='span' className='normal-case font-bold flex'>
            {user.data.displayName}
          </Typography>
          <Typography className='text-11 capitalize' color='textSecondary'>
            {user.role.toString()}
            {(!user.role ||
              (Array.isArray(user.role) && user.role.length === 0)) &&
              'Guest'}
          </Typography>
        </div> */}

        {user.data.photoURL ? (
          <Avatar className='mx-4' alt='user photo' src={user.data.photoURL} />
        ) : (
          <Avatar className='mx-4'>{user.data.displayName[0]}</Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        classes={{
          paper: 'py-8',
        }}
      >
        {!user.role || user.role.length === 0 ? (
          <>
            <MenuItem role="text">
            {user.data.photoURL ? (
          <Avatar className='mx-4' alt='user photo' src={user.data.photoURL} />
        ) : (
          <Avatar className='mx-4'>{user.data.displayName[0]}</Avatar>
        )}
              <ListItemText
                primary={user.data.displayName}
                secondary= {user.data.email} 
              />
            </MenuItem>
            <MenuItem component={Link} to='/login' role='button'>
              <ListItemIcon className='min-w-40'>
                <Icon>lock</Icon>
              </ListItemIcon>
              <ListItemText primary='Login' />
            </MenuItem>
            <MenuItem component={Link} to='/register' role='button'>
              <ListItemIcon className='min-w-40'>
                <Icon>add</Icon>
              </ListItemIcon>
              <ListItemText primary='Register' />
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem role='text'>
              {user.data.photoURL ? (
                <ListItemIcon className='min-w-40'>
                  <Avatar alt='user photo' src={user.data.photoURL} />
                </ListItemIcon>
              ) : (
                <ListItemIcon className='min-w-40'>
                  <Avatar>{user.data.displayName[0]}</Avatar>
                </ListItemIcon>
              )}
              <ListItemText 
                primary={user.data.displayName}
                secondary= {user.data.email} 
              />
            </MenuItem>
            {/* <MenuItem
              component={Link}
              to='/pages/profile'
              onClick={userMenuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary='My Profile' />
            </MenuItem> */}
            <MenuItem
              component={Link}
              to={`/accounts/${user.data.id}`}
              onClick={userMenuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <Icon>account_circle</Icon>
              </ListItemIcon>
              <ListItemText primary='Accounts' />
            </MenuItem>
            <MenuItem
              component={Link}
              to='/organization'
              onClick={userMenuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <Icon>businessIcon</Icon>
              </ListItemIcon>
              <ListItemText primary='Organization' />
            </MenuItem>
            <MenuItem
              component={Link}
              to='/projects'
              onClick={userMenuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <Icon>pagesIcon</Icon>
              </ListItemIcon>
              <ListItemText primary='Projects' />
            </MenuItem>

            {user.role === 'admin' ?
              <>
                <MenuItem 
                  component={Link} 
                  to='/dashboard' 
                  onClick={userMenuClose} 
                  role='button'
                >
                  <ListItemIcon className='min-w-40'>
                    <Icon>dashboard</Icon>
                  </ListItemIcon>
                  <ListItemText primary='DashBoard' />
                </MenuItem> 

                <MenuItem
                  component={Link}
                  to='/users'
                  onClick={userMenuClose}
                  role='button'
                >
                  <ListItemIcon className='min-w-40'>
                   <Icon>people</Icon>
                  </ListItemIcon>
                  <ListItemText primary='Users' />
                </MenuItem>

                <MenuItem
                  component={Link}
                  to='/reportSummary'
                  onClick={userMenuClose}
                  role='button'
                >
                  <ListItemIcon className='min-w-40'>
                    <Icon>report</Icon>
                  </ListItemIcon>
                  <ListItemText primary='Report Summary' />
                </MenuItem>
            
                <MenuItem
                  component={Link}
                  to='/dataStructure'
                  onClick={userMenuClose}
                  role='button'
                >
                  <ListItemIcon className='min-w-40'>
                    <Icon>report</Icon>
                  </ListItemIcon>
                  <ListItemText primary='Data Structure' />
                </MenuItem> 
              </>
            :null}

            <MenuItem
              component={Link}
              to='/vendors'
              onClick={userMenuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
              <Icon>storeIcon</Icon>
              </ListItemIcon>
              <ListItemText primary='Vendors' />
            </MenuItem>
            <MenuItem
              onClick={() => {
                dispatch(logoutUser());
                userMenuClose();
              }}
            >
              <ListItemIcon className='min-w-40'>
                <Icon>exit_to_app</Icon>
              </ListItemIcon>
              <ListItemText primary='Logout' />
            </MenuItem>
          </>
        )}
      </Popover>
    </>
  );
}

export default UserMenu;
