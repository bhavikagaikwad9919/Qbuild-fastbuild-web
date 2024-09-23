import _ from "@lodash";
import moment from "moment";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readNotification } from "../store/notificationSlice";
import Checkbox from "@material-ui/core/Checkbox";

const useStyles = makeStyles((theme) => ({
  mailItem: {
    borderBottom: `1px solid  ${theme.palette.divider}`,

    "&.unread": {
      background: "rgba(0,0,0,0.03)",
    },
    "&.selected": {
      "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        display: "block",
        height: "100%",
        width: 3,
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  avatar: {
    backgroundColor: theme.palette.primary[500],
  },
}));

const NotificationListItem = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const userId = useSelector(({ auth }) => auth.user.data.id);
  const role = useSelector(({ auth }) => auth.user.role);
  let notificationId=props.notify._id;

  return (
    <ListItem
      dense
      button
      className={clsx(classes.mailItem, "py-16 px-8")}
      style={{backgroundColor:props.notify.status !== 1 ? '#bdbdbd':null}}
      onClick={role === 'admin' ? null : () => {
        dispatch(readNotification({notificationId,userId}))
      }}
    >
      {role === 'admin'?
        <Checkbox
          tabIndex={-1}
          disableRipple
          onClick={(event) => {
            event.stopPropagation();
            props.onIdSelect(props.notify._id);
          }}
          checked={props.ids.includes(props.notify._id)}
        />
      :null}
      
      <div className="flex flex-1 flex-col relative overflow-hidden">
        <div className="flex items-center justify-between px-16 pb-8">
          <div className="flex items-center">
            <Typography variant="subtitle1">{props.notify.title}</Typography>
          </div>
          <Typography variant="subtitle1">
            {moment(props.notify.createdAt).format("DD MMM, hh:mm A")}
          </Typography>
        </div>

        <div className="flex items-center justify-between px-16 py-0">
          <div className="flex items-center">
            <Typography color="textSecondary" className="truncate">
              {_.truncate(
               props.notify.description.replace(/<(?:.|\n)*?>/gm, ""),
                {
                  length: 180,
                }
              )}
            </Typography>
          </div>
          <Typography variant="subtitle1">{props.notify.recipient.name}</Typography>

        {/* <div className='flex justify-end px-12'>
          {!_.isEmpty(labels) &&
            props.mail.labels.map((label) => (
              <MailChip
                className='mx-2 mt-4'
                title={labels[label].title}
                color={labels[label].color}
                key={label}
              />
            ))}
        </div> */}
      </div>
      </div>
    </ListItem>
  );
};

export default NotificationListItem;
