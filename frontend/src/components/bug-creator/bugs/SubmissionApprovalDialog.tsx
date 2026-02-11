import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { updateSubmissionStatus } from '../../../services/bugService';

interface SubmissionApprovalDialogProps {
  open: boolean;
  onClose: () => void;
  submissionId: string;
  onStatusUpdate: () => void;
}

const SubmissionApprovalDialog: React.FC<SubmissionApprovalDialogProps> = ({
  open,
  onClose,
  submissionId,
  onStatusUpdate,
}) => {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await updateSubmissionStatus(submissionId, 'Approved');
      onStatusUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to approve submission:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Approve Submission</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Are you sure you want to approve this submission?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleApprove} color="primary" variant="contained" disabled={loading}>
          {loading ? 'Approving...' : 'Approve'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmissionApprovalDialog;
