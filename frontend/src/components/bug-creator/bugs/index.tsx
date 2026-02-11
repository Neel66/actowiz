import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Collapse,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { getBugs } from '../../../services/bugService';
import { BUG_STATUSES } from '../../../constants/status';
import CreateBug from './CreateBug';
import SubmissionApprovalDialog from './SubmissionApprovalDialog';

interface Submission {
  _id: string;
  description: string;
  proof: Array<{
    path: string;
    type: string;
    originalName: string;
  }>;
  status: string;
  submittedBy: {
    name: string;
  };
  createdAt: string;
  winner: boolean;
}

interface Bug {
  _id: string;
  title: string;
  description: string;
  bountyAmount: number;
  isConfigurable: boolean;
  status: string;
  submissions: Submission[];
}

const BugsCreatorList: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [approvalDialog, setApprovalDialog] = useState<{ open: boolean; submissionId: string }>({ open: false, submissionId: '' });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'primary';
      case 'In Review':
        return 'warning';
      case 'Closed':
        return 'error';
      default:
        return 'default';
    }
  };

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const {bugs} = await getBugs();
        setBugs(Array.isArray(bugs) ? bugs : []);
      } catch (error) {
        console.error('Failed to fetch bugs:', error);
        setBugs([]);
      }
    };
    fetchBugs();
  }, []);

  const filteredBugs = useMemo(() => {
    let filtered = bugs;
    if (searchTerm) {
      filtered = filtered.filter(bug =>
        bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bug.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(bug => bug.status === statusFilter);
    }
    return filtered;
  }, [searchTerm, statusFilter, bugs]);

  const handleCreateBug = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    const fetchBugs = async () => {
      try {
        const {bugs} = await getBugs();
        setBugs(Array.isArray(bugs) ? bugs : []);
      } catch (error) {
        console.error('Failed to fetch bugs:', error);
        setBugs([]);
      }
    };
    fetchBugs();
  };

  const handleRowExpand = (bugId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(bugId)) {
        newSet.delete(bugId);
      } else {
        newSet.add(bugId);
      }
      return newSet;
    });
  };

  const handleApprovalDialogOpen = (submissionId: string) => {
    setApprovalDialog({ open: true, submissionId });
  };

  const handleApprovalDialogClose = () => {
    setApprovalDialog({ open: false, submissionId: '' });
  };

  const handleApprovalStatusUpdate = () => {
    const fetchBugs = async () => {
      try {
        const {bugs} = await getBugs();
        setBugs(Array.isArray(bugs) ? bugs : []);
      } catch (error) {
        console.error('Failed to fetch bugs:', error);
        setBugs([]);
      }
    };
    fetchBugs();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Search Bugs"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              {BUG_STATUSES.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateBug}
          sx={{
            py: 1.5,
            px: 3,
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          Create Bug
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ border: '1px solid #ddd' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Title</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Description</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Bounty Amount</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Submissions</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Status</TableCell>
              <TableCell>Configurable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBugs && filteredBugs.length > 0 ? (
              filteredBugs.map((bug: Bug) => (
                <React.Fragment key={bug._id}>
                  <TableRow>
                    <TableCell sx={{ borderRight: '1px solid #ddd' }}>{bug.title}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #ddd' }}>{bug.description}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #ddd' }}>₹{bug.bountyAmount}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                      <Button
                        size="small"
                        onClick={() => handleRowExpand(bug._id)}
                        startIcon={expandedRows.has(bug._id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      >
                        {bug.submissions.length} Submissions
                      </Button>
                    </TableCell>
                    <TableCell sx={{ borderRight: '1px solid #ddd' }}><Chip label={bug.status} color={getStatusColor(bug.status)} /></TableCell>
                    <TableCell>{bug.isConfigurable ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expandedRows.has(bug._id)} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Submissions
                          </Typography>
                          {bug.submissions.length > 0 ? (
                            <TableContainer component={Paper} sx={{ mt: 1, border: '1px solid #ddd' }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Name</TableCell>
                                    <TableCell sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Description</TableCell>
                                    <TableCell sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Proof</TableCell>
                                    <TableCell sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Winner</TableCell>
                                    <TableCell sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Submitted Date</TableCell>
                                    <TableCell sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Actions</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {bug.submissions.map((submission: Submission) => (
                                    <TableRow key={submission._id}>
                                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                          {submission.submittedBy?.name || 'Unknown User'}
                                        </Box>
                                      </TableCell>
                                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{submission.description}</TableCell>
                                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                                        {submission.proof && submission.proof.length > 0 ? (
                                          <Box>
                                            {submission.proof.map((file, index: number) => (
                                              <Button
                                                key={index}
                                                variant="text"
                                                size="small"
                                                component="a"
                                                href={`/uploads/${file.path}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                                              >
                                                {file.originalName}
                                              </Button>
                                            ))}
                                          </Box>
                                        ) : (
                                          'No proof'
                                        )}
                                      </TableCell>
                                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{submission.winner ? 'Yes' : 'No'}</TableCell>
                                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                                        {new Date(submission.createdAt).toLocaleDateString()}
                                      </TableCell>
                                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>
                                        <Box display="flex" gap={1}>
                                          <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleApprovalDialogOpen(submission._id)}
                                          >
                                            Approve
                                          </Button>
                                        </Box>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No submissions yet.
                            </Typography>
                          )}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {openDialog && <CreateBug open={openDialog} onClose={handleCloseDialog} />}
      {approvalDialog.open && (
        <SubmissionApprovalDialog
          open={approvalDialog.open}
          onClose={handleApprovalDialogClose}
          submissionId={approvalDialog.submissionId}
          onStatusUpdate={handleApprovalStatusUpdate}
        />
      )}
    </Box>
  );
};

export default BugsCreatorList;
