import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import { darken } from "@material-ui/core/styles/colorManipulator";
import { makeStyles } from "@material-ui/styles";
import FuseAnimate from "@fuse/core/FuseAnimate";
import clsx from "clsx";
import constants from "app/main/config/constants";
import FileCopyOutlinedIcon from "@material-ui/icons/FileCopyOutlined";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  WhatsappIcon,
  TwitterIcon,
  LinkedinIcon,
} from "react-share";

const useStyles = makeStyles((theme) => ({
  root: {
    background:
      "radial-gradient(" +
      darken(theme.palette.primary.dark, 0.5) +
      " 0%, " +
      theme.palette.primary.dark +
      " 80%)",
    color: theme.palette.primary.contrastText,
  },
}));

function Invite() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const reffCode = useSelector(({ auth }) => auth.user.data.referralCode);
  const shareUrl = `https://console.qbuild.app/invite/${reffCode}/register`;
  function isFormValid() {
    return emails.length > 0;
  }
  function handleAddChip(value) {
    const re = /\S+@\S+\.\S+/;

    if (re.test(String(value).toLowerCase())) {
      setEmails((emails) => [...emails, value]);
    }
  }
  function handleDeleteChip(chip, index) {
    setEmails(emails.filter((item) => item !== chip));
  }

  function handleSubmit() {
    setLoading(true);

    axios.post(constants.BASE_URL + "/invite", { emails }).then((response) => {
      if (response.data.message === "Users Invited") {
        setEmails([]);
        setLoading(false);
        dispatch(
          showMessage({
            message: "Email Sent To Users",
            variant: "success",
            autoHideDuration: null,
          })
        );
      }
    });
  }

  return (
    <div
      className={clsx(
        classes.root,
        "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-22"
      )}
    >
      <div className="flex flex-col items-center justify-center w-full">
        <FuseAnimate animation="transition.expandIn">
          <Card className="w-full max-w-384">
            <CardContent className="flex flex-col items-center justify-center p-22 mb-24">
              {loading ? (
                <CircularProgress />
              ) : (
                <React.Fragment>
                  <Typography variant="h6" className="mt-12 mb-2">
                    SEND INVITE LINK
                  </Typography>
                  <Typography variant="subtitle1" className="mb-16">
                    (Input email Id and press Enter)
                  </Typography>

                  <ChipInput
                    className="w-full mb-12"
                    alwaysShowPlaceholder
                    label="Emails"
                    value={emails}
                    onAdd={(chip) => handleAddChip(chip)}
                    onDelete={(chip, index) => handleDeleteChip(chip, index)}
                    newChipKeyCodes={[13, 32, 188]}
                    variant="outlined"
                    helperText="press Enter to add more"
                  />

                  <Button
                    onClick={() => handleSubmit()}
                    variant="contained"
                    color="primary"
                    className="w-224 mx-autojustify-center my-24"
                    aria-label="Reset"
                    disabled={!isFormValid()}
                  >
                    SEND INVITE LINK
                  </Button>

                  <div className="flex flex-1 flex-row items-center justify-start gap-12">
                    <FacebookShareButton url={shareUrl} quote="QBuild">
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <WhatsappShareButton url={shareUrl} quote="QBuild">
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <EmailShareButton url={shareUrl} quote="QBuild">
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                    <TwitterShareButton url={shareUrl} quote="QBuild">
                      <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl} quote="QBuild">
                      <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <IconButton
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      style={{
                        color: "blue",
                        maxWidth: "32px",
                        maxHeight: "32px",
                        minWidth: "32px",
                        minHeight: "32px",
                      }}
                    >
                      <FileCopyOutlinedIcon />
                    </IconButton>
                  </div>
                </React.Fragment>
              )}
            </CardContent>
          </Card>
        </FuseAnimate>
      </div>
    </div>
  );
}

export default Invite;
