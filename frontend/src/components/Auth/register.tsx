import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography, Grid, Paper, Avatar, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import { validateEmail, validatePassword, validateName } from '../../utils/validation';
import { ROLES } from '../../constants/roles';
import { AUTH_MESSAGES } from '../../constants/messages';
import CustomSnackbar from '../common/Snackbar';
import {registerUser} from '../../services/authService';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });
  const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '', role: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(false);

  // submit the register form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { name: '', email: '', password: '', confirmPassword: '', role: '' };
    if (!validateName(formData.name)) {
      newErrors.name = AUTH_MESSAGES.name;
      valid = false;
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = AUTH_MESSAGES.email;
      valid = false;
    }
    if (!validatePassword(formData.password)) {
      newErrors.password = AUTH_MESSAGES.password;
      valid = false;
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = AUTH_MESSAGES.confirmPassword;
      valid = false;
    }
    if (!formData.role) {
      newErrors.role = AUTH_MESSAGES.role;
      valid = false;
    }
    setErrors(newErrors);
    if (valid) {
      setLoading(true);
      try {
        await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        setSnackbar({ open: true, message: AUTH_MESSAGES.register, severity: 'success' });
        navigate('/sign-in');
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Registration failed';
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
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
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
              autoComplete="new-password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: 'action.active' }} />,
              }}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="normal" error={!!errors.role}>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={formData.role}
                label="Role"
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              >
                {ROLES.map((role) => (
                  <MenuItem key={role.value} value={role.value}>
                    {role.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.role && <Typography variant="caption" color="error">{errors.role}</Typography>}
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
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
            <Grid container justifyContent="center">
              <Grid>
                <Typography variant="body2" sx={{ display: 'inline' }}>
                  Already have an account?
                </Typography>
                <Button
                  onClick={() => navigate('/sign-in')}
                  sx={{
                    color: 'primary.main',
                    textTransform: 'none',
                    fontSize: '1rem',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  Sign In
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

export default Register;
