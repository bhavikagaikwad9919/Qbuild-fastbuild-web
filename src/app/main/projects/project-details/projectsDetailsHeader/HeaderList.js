import React, { useState, useEffect } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import DropZone from '../../extra-components/DropZone';
import {
  exportInventory,
  exportVendor,
} from 'app/main/projects/store/projectsSlice';

function HeaderList(props) {
  const dispatch = useDispatch();
  const route = useSelector(({ projects }) => projects.routes);
  const projectDetails = useSelector(({ projects }) => projects.details);
  const projectName = useSelector(({ projects }) => projects.details.title);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState({
    inventory: false,
  });
  useEffect(() => {
    if (props.open) {
      setAnchorEl(props.data);
    }
  }, [props.open]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    props.close();
  };

  return (
    <>
      <div>
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          {/* <MenuItem
            onClick={() => {
              handleClose();
            }}
          >
            Add
          </MenuItem> */}
          {route === 'Inventory' || route === 'Vendors' ? (
            <>
              <MenuItem
                onClick={() => {
                  setOpen({ ...open, inventory: true });
                }}
              >
                Import
              </MenuItem>
              <MenuItem
                onClick={() => {
                  if (route === 'Inventory') {
                    dispatch(
                      exportInventory({ projectId: projectDetails._id,projectName:projectName })
                    );
                  } else if (route === 'Vendors') {
                    dispatch(exportVendor({ projectId: projectDetails._id,projectName:projectName }));
                  }
                  handleClose();
                }}
              >
                Export
              </MenuItem>
            </>
          ) : null}
        </Menu>
      </div>
      {open.inventory ? (
        <DropZone
          open={true}
          close={() => {
            setOpen({ ...open, inventory: false });
            handleClose();
          }}
        />
      ) : null}
    </>
  );
}

export default HeaderList;
