import React, { useState,useRef,useEffect } from 'react';
import {
  Button,
  Hidden,
  Icon,
  IconButton,
  Typography,
} from '@material-ui/core';
import history from "@history";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from 'react-router-dom';
import FuseAnimate from '@fuse/core/FuseAnimate';
import { useDispatch, useSelector } from 'react-redux';
import { openNewDialog} from '../store/sitesSlice';
import { back } from 'app/main/organization/store/organizationSlice';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    backgroundColor: "transparent",
  },
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    flexGrow: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    overflow: "hidden",
    display: "block",
    width: "100%",
  },
  videos: {
    position: "fixed",
    right: "0",
    bottom: "0",
    transform: "translateX(calc((100% - 100vw) / 2))"
  },
}));

function SiteDetailsHeader(props) {
  const dispatch = useDispatch();
  const details = useSelector(({ sites }) => sites.details);
  const route = useSelector(({ sites }) => sites.routes);
  const role = useSelector(({ auth }) => auth.user);
  const [text, setText] = useState();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if(route === 'Projects')
    {
      setText("Create Project");
      setShow(true);
    }else{
      setShow(false);
    }
  }, [route]);

  return (
    <>
      <div className='flex flex-1 items-center justify-between w-full p-8 sm:p-24'>
        <div className='flex flex-col items-start w-full'>
          <FuseAnimate animation='transition.slideRightIn' delay={300}>
            <Typography
              className='normal-case flex items-center sm:mb-5'
              component={Link}
              role='button'
              onClick={() => {
                history.goBack();
                dispatch(back());
              }}
              color='inherit'
            >
              <Icon className='mr-4 text-20'>arrow_back</Icon>
             Sites
            </Typography>
          </FuseAnimate>

          <FuseAnimate animation='transition.slideLeftIn' delay={300}>
            <Typography variant='h6'>{details.name}</Typography>
          </FuseAnimate>
        </div>
      </div>
      <div className='flex items-center px-8 h-full overflow-x-auto'>
        {/* {show === true ? 
          <Button variant="contained" className="mb-8" onClick={()=> dispatch(openNewDialog())} style={{padding:'3px 16px'}} noWrap>{ text }</Button>   
         : null} */}

        <Hidden lgUp>
          <IconButton
            onClick={(ev) => {
              props.pageLayout.current.toggleLeftSidebar();
            }}
            aria-label='open left sidebar'
          >
            <Icon>menu</Icon>
          </IconButton>
        </Hidden>
      </div>
    </>
  );
}

export default SiteDetailsHeader;
