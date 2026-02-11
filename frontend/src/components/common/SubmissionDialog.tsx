import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
} from '@mui/material';
import { Close as CloseIcon, Send as SendIcon, CloudUpload as CloudUploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {submitBugFix} from '../../services/bugService';

interface Bug {
  _id: string;
  title: string;
}

interface SubmissionDialogProps {
  open: boolean;
  onClose: () => void;
  bug: Bug | null;
}

const SubmissionDialog = ({
  open,
  onClose,
  bug,
}: SubmissionDialogProps) => {
  const [description, setDescription] = useState('');
  const [proof, setProof] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [descriptionError, setDescriptionError] = useState('');
  const [fileError, setFileError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!bug) return;

    let valid = true;

    if (!description.trim()) {
      setDescriptionError('Description is required.');
      valid = false;
    } else if (description.trim().length < 5) {
      setDescriptionError('Description must be at least 5 characters long.');
      valid = false;
    } else {
      setDescriptionError('');
    }

    if (proof.length < 1) {
      setFileError('At least one file must be uploaded.');
      valid = false;
    } else if (proof.length > 3) {
      setFileError('Maximum 3 files can be uploaded.');
      valid = false;
    } else {
      setFileError('');
    }

    if (!valid) return;

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('bugId', bug._id);
      proof.forEach((file) => {
        formData.append('proof', file);
      });

      await submitBugFix(formData);

      setDescription('');
      setProof([]);
      setDescriptionError('');
      setFileError('');
      onClose();
    } catch {
      setFileError('Failed to submit bug fix. Please try again.');
    }
  };

  const handleClose = () => {
    setDescription('');
    setProof([]);
    setDescriptionError('');
    setFileError('');
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const maxSize = 5 * 1024 * 1024;
    let hasError = false;
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setFileError(`File ${file.name} exceeds 5 MB limit.`);
        hasError = true;
        return false;
      }
      return true;
    });
    if (!hasError) {
      setFileError('');
    }
    setProof(prev => {
      const newProof = [...prev, ...validFiles];
      return newProof.slice(0, 3);
    });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    const maxSize = 5 * 1024 * 1024;
    let hasError = false;
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setFileError(`File ${file.name} exceeds 5 MB limit.`);
        hasError = true;
        return false;
      }
      return true;
    });
    if (!hasError) {
      setFileError('');
    }
    setProof(prev => {
      const newProof = [...prev, ...validFiles];
      return newProof.slice(0, 3);
    });
  };

  const handleRemoveFile = (index: number) => {
    setProof(prev => prev.filter((_, i) => i !== index));
  };

  if (!bug) return null;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
      <DialogTitle>Submissions for Bug: {bug!.title}</DialogTitle>
      <DialogContent>
        <TextField
          label="Description of fix"
          multiline
          rows={4}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!descriptionError}
          helperText={descriptionError}
          sx={{ mb: 2 }}
        />
        {fileError && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {fileError}
          </Alert>
        )}
        <Box
          sx={{
            border: '2px dashed',
            borderColor: isDragOver ? 'primary.main' : 'grey.400',
            borderRadius: 1,
            p: 2,
            textAlign: 'center',
            backgroundColor: isDragOver ? 'action.hover' : 'transparent',
            transition: 'all 0.3s ease',
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Typography variant="body1" sx={{ mb: 1 }}>
            Proof (images / video / sample files)
          </Typography>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            accept="image/*,video/*,.pdf,.doc,.docx,.txt,.zip,.rar"
          />
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={handleUploadClick}
            fullWidth
          >
            {proof.length > 0 ? `${proof.length} file(s) selected` : 'Choose or Drag Files'}
          </Button>
          {proof.length > 0 && (
            <List dense sx={{ mt: 1 }}>
              {proof.map((file, index) => (
                <ListItem key={index} secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveFile(index)}>
                    <DeleteIcon />
                  </IconButton>
                }>
                  <ListItemText primary={file.name} />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} startIcon={<CloseIcon />} variant="outlined" color="error">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" startIcon={<SendIcon />}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SubmissionDialog;
