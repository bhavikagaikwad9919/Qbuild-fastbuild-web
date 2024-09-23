import {
  successMessage,
  errorMessage,
  warningMessage,
} from "app/store/fuse/messageSlice";

export function dispatchSuccessMessage(dispatch, message) {
  dispatch(
    successMessage({
      message: message,
      variant: "success",
    })
  );
}

export function dispatchErrorMessage(dispatch, message) {
  dispatch(
    errorMessage({
      message: message,
    })
  );
}

export function dispatchWarningMessage(dispatch, message) {
  dispatch(
    warningMessage({
      message: message,
    })
  );
}
