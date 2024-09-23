import { makeStyles } from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import React, { useState, useEffect } from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import { Typography, Button } from "@material-ui/core";
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    background: "white",
  },
  input: {
    color: "white",
  },
}));

function NotificationHeader(props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <div className="flex flex-1 px-16">
    <div className="flex flex-shrink items-center sm:w-224">
      <div className="flex flex-col items-start w-full">
        <FuseAnimate animation="transition.expandIn" delay={300}>
          <Typography
            className='normal-case flex items-center sm:mb-5'
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
          {/* <Icon className="text-32 mr-12">notifications</Icon> */}
          <Typography variant="h6" className=" sm:flex">
            Notifications
          </Typography>
        </FuseAnimate>
      </div>
    </div>
  </div>
    // <div className="flex flex-1">
    //   <Paper
    //     className="flex items-center bg-white w-full h-48 sm:h-56 p-16 ltr:pl-4 lg:ltr:pl-16 rtl:pr-4 lg:rtl:pr-16 rounded-8"
    //     elevation={1}
    //   >
    //     <Icon color="primary">search</Icon>

    //     <Input
    //       color="secondary"
    //       //   placeholder={t('SEARCH_PLACEHOLDER')}
    //       className="px-16"
    //       disableUnderline
    //       fullWidth
    //       // value={searchText}
    //       inputProps={{
    //         "aria-label": "Search",
    //         // className: classes.input,
    //       }}
    //       // onChange={(ev) => dispatch(setMailsSearchText(ev))}
    //     />
    //   </Paper>
    // </div>
  );
}

export default NotificationHeader;
