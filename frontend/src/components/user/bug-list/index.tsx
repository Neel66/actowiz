import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
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
  Button,
  Collapse,
  Typography,
} from '@mui/material';
import { Send as SendIcon, ExpandMore as ExpandMoreIcon, ExpandLess as ExpandLessIcon } from '@mui/icons-material';
import { getBugs } from '../../../services/userService';
import { BUG_STATUSES } from '../../../constants/status';
import SubmissionDialog from '../../common/SubmissionDialog';

interface Submission {
  _id: string;
  description: string;
  proof: Array<{
    path: string;
    type: string;
    originalName: string;
  }>;
  status: string;
  submittedBy: string;
  createdAt: string;
  winner: boolean;
}

interface Bug {
  _id: string;
  title: string;
  description: string;
  bountyAmount: number;
  status: string;
  submissions?: Submission[];
}

const BugList: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'secondary';
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

  useEffect(() => {
    const fetchBugs = async () => {
      try {
        const { bugs: fetchedBugs } = await getBugs();
        setBugs(Array.isArray(fetchedBugs) ? fetchedBugs : []);
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

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
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
      <TableContainer component={Paper} sx={{ border: '1px solid #ddd' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Title</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Description</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Bounty</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Submissions</TableCell>
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Current Status</TableCell>
              <TableCell>Actions</TableCell>
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
                        {bug.submissions?.length || 0} Submissions
                      </Button>
                    </TableCell>
                    <TableCell sx={{ borderRight: '1px solid #ddd' }}><Chip label={bug.status} color={getStatusColor(bug.status)} /></TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<SendIcon />}
                        onClick={() => {
                          setSelectedBug(bug);
                          setDialogOpen(true);
                        }}
                      >
                        Submit
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={expandedRows.has(bug._id)} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                          <Typography variant="h6" gutterBottom component="div">
                            Submissions
                          </Typography>
                          {bug.submissions && bug.submissions.length > 0 ? (
                            <TableContainer component={Paper} sx={{ mt: 1, border: '1px solid #ddd' }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Description</TableCell>
                                    <TableCell sx={{ borderRight: '1px solid #ddd', fontWeight: 'bold' }}>Winner</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Submitted Date</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {bug.submissions.map((submission: Submission) => (
                                    <TableRow key={submission._id}>
                                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{submission.description}</TableCell>
                                      <TableCell sx={{ borderRight: '1px solid #ddd' }}>{submission.winner ? 'Yes' : 'No'}</TableCell>
                                      <TableCell>{new Date(submission.createdAt).toLocaleDateString()}</TableCell>
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
      <SubmissionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        bug={selectedBug}
      />
    </Box>
  );
};

export default BugList;
