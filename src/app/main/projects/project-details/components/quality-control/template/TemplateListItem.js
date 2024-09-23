import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import {
  routes,
  detailTemplate,
  downloadTemplate,
} from 'app/main/projects/store/projectsSlice';

const ITEM_HEIGHT = 48;

function TemplateListItem(props) {
  const dispatch = useDispatch();
  const projectId = useSelector(({ projects }) => projects.details._id);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ListItem
      id={FuseUtils.generateGUID()}
      className={clsx('border-solid border-b-1 py-16 px-0 sm:px-8')}
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        dispatch(detailTemplate(props.todo));
        dispatch(routes('Template-Details'));
      }}
      dense
      button
    >
      <Checkbox
        tabIndex={-1}
        disableRipple
        checked={props.ids.includes(props.todo._id)}
        onClick={(ev) => {
          ev.stopPropagation();
          props.onIdSelect(props.todo._id);
        }}
      />
      <div className='flex-col w-full relative overflow-hidden px-8'>
        <Typography
          variant='subtitle1'
          className='todo-title truncate'
          color={props.todo.completed ? 'textSecondary' : 'inherit'}
        >
          {props.todo.title}
        </Typography>

        <Typography color='textSecondary' className='todo-notes truncate'>
          {props.todo.description === undefined
            ? null
            : _.truncate(props.todo.description.replace(/<(?:.|\n)*?>/gm, ''), {
                length: 90,
              })}
        </Typography>
      </div>
      <ListItemSecondaryAction>
        <IconButton
          aria-label='more'
          aria-controls='long-menu'
          aria-haspopup='true'
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id='long-menu'
          anchorEl={anchorEl}
          keepMounted
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
        >
          <MenuItem
            key='download'
            onClick={() =>
              dispatch(
                downloadTemplate({ projectId, templateId: props.todo._id })
              )
            }
          >
            download
          </MenuItem>
        </Menu>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default TemplateListItem;
