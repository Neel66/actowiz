import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import Navbar from '../../common/Navbar';
import BugList from '../bug-list';
import { getUserBalance } from '../../../services/userService';

const UserDashboard: React.FC = () => {
  const [balance, setBalance] = useState<string>('');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const data = await getUserBalance();
        setBalance(data.balance);
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };
    fetchBalance();
  }, []);

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" component="div">
              Total Reward: {balance || 0}
            </Typography>
          </CardContent>
        </Card>
        <BugList />
      </Box>
    </Box>
  );
};

export default UserDashboard;
