import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main', elevation: 4 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Bug Creator Dashboard
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          sx={{
            py: 1,
            px: 3,
            fontSize: '1rem',
            fontWeight: 'bold',
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
