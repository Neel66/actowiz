import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Grid, Paper, Avatar, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { validateEmail, validatePassword } from '../../utils/validation';
import { AUTH_MESSAGES } from '../../constants/messages';
import CustomSnackbar from '../common/Snackbar';
import { loginUser } from '../../services/authService';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(false);

  // submit the login form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: '', password: '' };
    if (!validateEmail(formData.email)) {
      newErrors.email = AUTH_MESSAGES.email;
      valid = false;
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = AUTH_MESSAGES.password;
      valid = false;
    }
    setErrors(newErrors);
    if (valid) {
      setLoading(true);
      try {
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem('token', response.token);
        setSnackbar({ open: true, message: AUTH_MESSAGES.login, severity: 'success' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Login failed';
        setSnackbar({ open: true, message: errorMessage, severity: 'error' });
      } finally {
        setLoading(false);
      }
    }
  };



  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{ mb: 3 }}
            />
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
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <Grid container justifyContent="center">
              <Grid>
                <Typography variant="body2" sx={{ display: 'inline' }}>
                  Don't have an account?
                </Typography>
                <Button
                  onClick={() => navigate('/register')}
                  sx={{
                    color: 'primary.main',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        <CustomSnackbar
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        />
    </Box>
  );
};

export default Login;
