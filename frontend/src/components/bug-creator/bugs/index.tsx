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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getBugs } from '../../../services/bugService';
import { BUG_STATUSES } from '../../../constants/status';
import CreateBug from './CreateBug';

interface Bug {
  id: string;
  title: string;
  description: string;
  bountyAmount: number;
  isConfigurable: boolean;
  status: string;
}

const BugsIndex: React.FC = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

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
              <TableCell sx={{ borderRight: '1px solid #ddd' }}>Status</TableCell>
              <TableCell>Configurable</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBugs && filteredBugs.length > 0 ? (
              filteredBugs.map((bug: Bug) => (
                <TableRow key={bug.id}>
                  <TableCell sx={{ borderRight: '1px solid #ddd' }}>{bug.title}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ddd' }}>{bug.description}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ddd' }}>${bug.bountyAmount}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #ddd' }}><Chip label={bug.status} color={getStatusColor(bug.status)} /></TableCell>
                  <TableCell>{bug.isConfigurable ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {openDialog && <CreateBug open={openDialog} onClose={handleCloseDialog} />}
    </Box>
  );
};

export default BugsIndex;
