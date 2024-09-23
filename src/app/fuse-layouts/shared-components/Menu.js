import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import BusinessIcon from '@material-ui/icons/Business';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';
//import Typography from '@material-ui/core/Typography';
import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { logoutUser } from 'app/auth/store/userSlice';
// import { Badge } from "@material-ui/core";


function Menu(props) {
  const dispatch = useDispatch();
  const user = useSelector(({ auth }) => auth.user);
  // const unreadCount = useSelector(({ notification }) => notification.unreadCount);
  const [menu, setMenu] = useState(null);
  const menuClick = (event) => {
    setMenu(event.currentTarget);
  };

  const menuClose = () => {
    setMenu(null);
  };


  return (
    <>
      <Button className='min-h-40' onClick={menuClick}>
        <Icon>menu</Icon>Menu
      </Button>

      <Popover
        open={Boolean(menu)}
        anchorEl={menu}
        onClose={menuClose}
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

          <>
            {/* <MenuItem 
             component={Link} 
             to='/dashboard' 
             onClick={menuClose} 
             role='button'>
              <ListItemIcon className='min-w-40'>
                <Icon>dashboard</Icon>
              </ListItemIcon>
              <ListItemText primary='DashBoard' />
            </MenuItem> */}

            <MenuItem
              component={Link}
              to={`/organization/${user.data.id}`}
              onClick={menuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary='Organization' />
            </MenuItem>
 
            <MenuItem 
             component={Link} 
             to='/invite' 
             onClick={menuClose}
             role='button'>
              <ListItemIcon className='min-w-40'>
                <Icon>person_add</Icon>
              </ListItemIcon>
              <ListItemText primary='Invite' />
            </MenuItem>

             {/* <MenuItem
              component={Link}
              to={`/vendors`}
              onClick={menuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <Icon>person</Icon>
              </ListItemIcon>
              <ListItemText primary='Vendors' />
            </MenuItem> */}

             <MenuItem
              component={Link}
              to='/payment'
              onClick={menuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <Icon>money</Icon>
              </ListItemIcon>
              <ListItemText primary='Payment' />
            </MenuItem>
            {user.role === 'admin' ?
            <>
            <MenuItem
              component={Link}
              to='/reportSummary'
              onClick={menuClose}
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
              onClick={menuClose}
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
              to='/contact-us'
              onClick={menuClose}
              role='button'
            >
              <ListItemIcon className='min-w-40'>
                <Icon>message</Icon>
              </ListItemIcon>
              <ListItemText primary='Contact Us' />
            </MenuItem>
          </>
      </Popover>
      <Button className='min-h-40' activeclassname="active"  component={Link} to='/dashboard'>
        <Icon>dashboard</Icon>DashBoard
      </Button>
      <Button className='min-h-40' activeclassname="active"  component={Link} to='/projects'>
        <Icon>whatshot</Icon>Projects
      </Button>
      <Button className='min-h-40' activeclassname="active"  component={Link} to='/vendors'>
        <Icon>person</Icon>Vendors
      </Button>
      {user.role === 'admin' ?
      <Button className='min-h-40' activeclassname="active" component={Link} to='/users'>
        <Icon>person</Icon>Users
      </Button>
      :null}
      {/* <Button className='min-h-40' activeclassname="active" component={Link} to='/notification'>
           <Icon>notifications</Icon>Notifications
           <Badge
              className="pl-12"
              color="secondary"
              showZero
              badgeContent={unreadCount}
            />
      </Button> */}
    </>
  );
}

export default Menu;
