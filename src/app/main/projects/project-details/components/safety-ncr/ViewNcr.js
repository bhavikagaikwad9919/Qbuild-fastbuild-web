import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import {
  Button,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import moment from "moment/moment";
import { useDispatch } from "react-redux";
import PrismaZoom from "react-prismazoom";
import _ from "@lodash";
import { dispatchWarningMessage } from "app/utils/MessageDispatcher";
import ReactFileViewer from "react-file-viewer";

const useStyles = makeStyles((theme) => ({
  page: {
    width: "21cm",
    minHeight: "29.7cm",
    padding: "2cm",
    margin: "1cm auto",
    border: " 1px #D3D3D3 solid",
    borderRadius: "5px",
    background: "white",
    boxShadow: " 0 0 5px rgba(0, 0, 0, 0.1)",
  },
  page1: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100vh",
    margin: "20px",
    alignItems: "start",
    justifyContent: "center",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
 },
  table: {
    minWidth: 500,
  },
  zoom: {
    display: "inline-block",
    width: "100%",
    maxWidth: "640px",
    Height: "100vh",
  },
  img: {
    pageBreakAfter: "always",
    overflow: "auto",
    // pageBreakBefore: "always",
  },
  data: {
    pageBreakBefore: "always",
    pageBreakAfter: "always",
  },
  list: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  pagebreak:{
    pageBreakInside: "avoid",
  }
}));

const ViewNcr = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [details, setDetails] = useState({});

  useEffect(() => {
    let ncrData = {};
    let day = 24 * 60 * 60 * 1000;
    let date = new Date();
    let today = moment(date).format("DD-MM-YYYY");

    if (props.open) {
      if(props.data.ncrDoc.length > 0){
        var fileExt = props.data.ncrDoc[0].pictureUrl.split('.').pop();
        setUrl(props.data.ncrDoc[0].pictureUrl);
        setType(fileExt);
        setOpen(true);
      }else{
        dispatchWarningMessage(dispatch, "NCR document not found.")
        setOpen(false);
        props.close();
      }
    }

    if(props.data){
        let startDate = moment(props.data.issueDate).format('DD-MM-YYYY');
        ncrData.refNo = props.data.refNo;
        ncrData.description = props.data.description;
        ncrData.ncrStatus = props.data.status;

        if (props.data.issueDate.slice(-1) === 'Z') {
            ncrData.issueDate = moment(props.data.issueDate).format('Do MMMM YYYY');
        }
  
        if(props.data.closingDate !== undefined && props.data.closingDate !== null){
           let endDate = moment(props.data.closingDate).format('DD-MM-YYYY');
          if (props.data.closingDate.slice(-1) === 'Z') {
            ncrData.closingDate = moment(props.data.closingDate).format('Do MMMM YYYY');
          }
   
          ncrData.age = Math.round(Math.abs((process(endDate) - process(startDate)) / day));
        }else{
            ncrData.closingDate = '';
            ncrData.age = Math.round(Math.abs((process(today) - process(startDate)) / day));
        }

        setDetails(ncrData);
    }

  }, [props.open]);

  const onError = e => {
    console.log(e, "error in file-viewer");
  };

  function createData(title, ans,reason, item) {
    return { title, ans, reason, item };
  }

  function process(date){
    var parts = date.split("-");
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }

  const handleClose = () => {
    setOpen(false);
    props.close();
  };

  return (
    <div>
      <Dialog fullScreen maxWidth="md" open={open}>
        <DialogTitle id="alert-dialog-title">{details === undefined ? '' : details.refNo}</DialogTitle>: 
        <DialogContent className="items-center justify-center">
          <PrismaZoom className={classes.zoom} maxZoom={20} topBoundary={120}>
            <ReactFileViewer key={Math.random()} fileType={type} filePath={url} onError={onError} />
          </PrismaZoom>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose()}
            variant="contained" color="primary"
          >
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default React.memo(ViewNcr);
