import ReactFileViewer from "react-file-viewer";
import React from "react";
import FuseAnimate from "@fuse/core/FuseAnimate";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { Icon, Typography } from "@material-ui/core";
import { Link } from 'react-router-dom';

function terms() {
  const onError = e => {
    console.log(e, "error in file-viewer");
  };

  return (
    <FusePageSimple
      classes={{
        // contentWrapper: "p-0 sm:p-24 pb-80 sm:pb-80 h-full",
        header: "min-h-72 h-72 sm:h-136 sm:min-h-136",
      }}
      header={
        <div className="flex flex-1 items-center justify-between p-8 sm:p-24">
          <div className="flex flex-shrink items-center sm:w-224">
            <div className="flex items-center">
              <FuseAnimate animation="transition.expandIn" delay={300}>
                <Typography
                  className='normal-case flex items-center sm:mb-5'
                  component={Link}
                  role='button'
                  to='/login'
                  color='inherit'
                >
                  <Icon className='mr-4 text-20'>arrow_back</Icon>
                </Typography>
              </FuseAnimate>
              <FuseAnimate animation="transition.slideLeftIn" delay={300}>
                <Typography variant="h6" className="sm:flex">
                  Terms & Conditions
                </Typography>
              </FuseAnimate>
            </div>
          </div>
        </div>
      }
      content={
        <>
          <div className="p-20">
            <FuseAnimate animation="transition.expandIn" delay={300}>
              <ReactFileViewer key={Math.random()} fileType='docx' filePath="assets/Terms and Conditions.docx" onError={onError} />
            </FuseAnimate>
          </div>
        </>
      }
    />
  );
}

export default terms;