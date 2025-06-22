import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container, 
  Box, 
  Tabs, 
  Tab, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  InputAdornment,
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArticleIcon from '@mui/icons-material/Article';
import LoginIcon from '@mui/icons-material/Login';
import InstagramIcon from '@mui/icons-material/Instagram';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LogoutIcon from '@mui/icons-material/Logout';
import './App.css';
import PhotoUpload from './PhotoUpload';
import About from './Resume';
import Blog from './Blog';

function App() {
  const [tab, setTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleLogin = () => {
    if (loginForm.username === 'janson.ho1' && loginForm.password === 'mywebsite') {
      setIsLoggedIn(true);
      setLoginDialogOpen(false);
      setLoginForm({ username: '', password: '' });
      setLoginError('');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleInstagramClick = () => {
    window.open('https://www.instagram.com/your_instagram_handle/', '_blank');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
            Travel Portfolio
          </Typography>
          
          {/* Instagram Button */}
          <IconButton
            onClick={handleInstagramClick}
            sx={{ 
              color: 'white', 
              mr: 2,
              '&:hover': { 
                background: 'rgba(255,255,255,0.1)',
                transform: 'scale(1.1)',
                transition: 'all 0.3s ease'
              }
            }}
            title="Follow on Instagram"
          >
            <InstagramIcon />
          </IconButton>

          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <IconButton
              onClick={handleLogout}
              sx={{ 
                color: 'white',
                '&:hover': { 
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'scale(1.1)',
                  transition: 'all 0.3s ease'
                }
              }}
              title="Logout"
            >
              <LogoutIcon />
            </IconButton>
          ) : (
            <Button
              onClick={() => setLoginDialogOpen(true)}
              startIcon={<LoginIcon />}
              sx={{ 
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': { 
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.5)'
                }
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
        
        {/* Navigation Tabs */}
        <Toolbar sx={{ background: 'rgba(255,255,255,0.1)' }}>
          <Tabs 
            value={tab} 
            onChange={handleTabChange} 
            textColor="inherit" 
            indicatorColor="secondary" 
            sx={{ 
              width: '100%',
              '& .MuiTab-root': {
                color: 'white',
                fontWeight: 500,
                fontSize: '1.1rem',
                '&:hover': {
                  background: 'rgba(255,255,255,0.1)',
                }
              }
            }}
          >
            <Tab icon={<WorkIcon />} label="About" />
            <Tab icon={<PhotoCameraIcon />} label="Photography" />
            <Tab icon={<ArticleIcon />} label="Blog" />
          </Tabs>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 4 }}>
        {tab === 0 && (
          <Box>
            <About isLoggedIn={isLoggedIn} />
          </Box>
        )}
        {tab === 1 && (
          <Box>
            <Typography variant="h3" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: '#2c3e50',
              textAlign: 'center',
              mb: 4,
              fontFamily: 'Georgia, serif'
            }}>
              Photography Portfolio
            </Typography>
            <PhotoUpload isLoggedIn={isLoggedIn} />
          </Box>
        )}
        {tab === 2 && (
          <Box>
            <Blog isLoggedIn={isLoggedIn} />
          </Box>
        )}
      </Container>

      {/* Login Dialog */}
      <Dialog 
        open={loginDialogOpen} 
        onClose={() => setLoginDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center', 
          fontWeight: 'bold',
          fontSize: '1.5rem',
          color: '#2c3e50'
        }}>
          Admin Login
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {loginError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {loginError}
            </Alert>
          )}
          <TextField
            fullWidth
            label="Username"
            value={loginForm.username}
            onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setLoginDialogOpen(false)}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogin}
            variant="contained"
            disabled={!loginForm.username || !loginForm.password}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default App;
