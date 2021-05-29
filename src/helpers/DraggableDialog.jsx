import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function DraggableDialog({children, sectionTitle, ...props}) {
  return (
    <Dialog
      PaperComponent={PaperComponent}
      fullWidth
      {...props}
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Add New {sectionTitle}
      </DialogTitle>
      <DialogContent dividers={true}>
        {children}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} color="secondary" variant="outlined">
          Close
        </Button>
        <Button onClick={props.onSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
