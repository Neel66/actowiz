import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { validateBugTitle, validateBugDescription, validateBountyAmount } from '../../../utils/validation';
import { BUG_MESSAGES } from '../../../constants/messages';
import { BUG_STATUSES } from '../../../constants/status';
import CustomSnackbar from '../../common/Snackbar';
import { createBug } from '../../../services/bugService';

interface CreateBugProps {
  open: boolean;
  onClose: () => void;
}

const CreateBug: React.FC<CreateBugProps> = ({ open, onClose }) => {

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    bountyAmount: '',
    isConfigurable: false,
    status: 'Open',
  });
  const [errors, setErrors] = useState({
    title: '',
    description: '',
    bountyAmount: '',
    status: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { title: '', description: '', bountyAmount: '', status: '' };

    if (!validateBugTitle(formData.title)) {
      newErrors.title = BUG_MESSAGES.title;
      valid = false;
    }
    if (!validateBugDescription(formData.description)) {
      newErrors.description = BUG_MESSAGES.description;
      valid = false;
    }
    if (!validateBountyAmount(parseInt(formData.bountyAmount))) {
      newErrors.bountyAmount = BUG_MESSAGES.bountyAmount;
      valid = false;
    }
    if (!formData.status) {
      newErrors.status = BUG_MESSAGES.status;
      valid = false;
    }

    setErrors(newErrors);
    if (valid) {
      setLoading(true);
      try {
        const dataToSend = { ...formData, bountyAmount: parseInt(formData.bountyAmount) };
        await createBug(dataToSend);
        setSnackbar({ open: true, message: BUG_MESSAGES.create, severity: 'success' });
        if (onClose) onClose();
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Bug creation failed';
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Create Bug
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            fullWidth
            id="title"
            label="Bug Title"
            name="title"
            autoComplete="title"
            autoFocus
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            error={!!errors.title}
            helperText={errors.title}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Bug Description"
            name="description"
            autoComplete="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            error={!!errors.description}
            helperText={errors.description}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="bountyAmount"
            label="Bounty Amount"
            name="bountyAmount"
            type="number"
            value={formData.bountyAmount}
            onChange={(e) => setFormData(prev => ({ ...prev, bountyAmount: e.target.value }))}
            error={!!errors.bountyAmount}
            helperText={errors.bountyAmount}
            sx={{ mb: 2 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isConfigurable}
                onChange={(e) => setFormData(prev => ({ ...prev, isConfigurable: e.target.checked }))}
                color="primary"
              />
            }
            label="Configurable Bounty"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              value={formData.status}
              label="Status"
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            >
              {BUG_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            {errors.status && <Typography variant="caption" color="error">{errors.status}</Typography>}
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                Creating Bug...
              </>
            ) : (
              'Create Bug'
            )}
          </Button>
        </Box>
        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateBug;
