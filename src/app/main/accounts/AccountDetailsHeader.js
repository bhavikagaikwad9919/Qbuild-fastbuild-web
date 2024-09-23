import React, { useState } from "react";
import {
  Hidden,
  Icon,
  IconButton,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { useDispatch, useSelector } from "react-redux";

function AccountDetailsHeader(props) {

  return (
    <>
      <div className="flex flex-1 items-center justify-between w-full p-8 sm:p-24">
        <div className="flex flex-col items-start w-full pl-32">
          <FuseAnimate animation='transition.slideRightIn' delay={300}>
            <Typography
              className='normal-case flex items-center sm:mb-12'
              component={Link}
              role='button'
              to='/projects'
              color='inherit'
            >
              <Icon className='mr-4 text-20'>arrow_back</Icon>
              Projects
            </Typography>
          </FuseAnimate>

          <FuseAnimate animation="transition.slideLeftIn" delay={300}>
            <Typography variant='h6'>Accounts</Typography>
          </FuseAnimate>
        </div>
        <Hidden lgUp>
          <IconButton
            onClick={(ev) => {
              props.pageLayout.current.toggleLeftSidebar();
            }}
            aria-label="open left sidebar"
          >
            <Icon>menu</Icon>
          </IconButton>
        </Hidden>
      </div>
      <div className="flex items-end justify-end mr-28 gap-12">
        {/* <div
          hidden={
            route === 'Settings' || route === 'Report' || route === 'Documents'
              ? true
              : false
          }
        >
          <Button
            className='mb-6'
            variant='contained'
            color='secondary'
            size='small'
          >
            Add
          </Button>
        </div> */}
        {/* <IconButton
          className="h-40 w-40 p-0"
          // aria-owns={selectedProject.menuEl ? 'project-menu' : undefined}
          aria-haspopup="true"
          onClick={(event) => setAnchor(event.currentTarget)}
        >
          <Icon>more_vert</Icon>
        </IconButton>
        {Boolean(anchor) ? (
          <HeaderList open={true} data={anchor} close={() => setAnchor(null)} />
        ) : null} */}
      </div>
    </>
  );
}

export default AccountDetailsHeader;
