import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CameraAlt as CameraIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';

interface AboutProps {
  isLoggedIn: boolean;
}

const About: React.FC<AboutProps> = ({ isLoggedIn }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Janson Ho',
    title: 'Travel Enthusiast & Photographer',
    background: 'Passionate traveler with a love for capturing moments and exploring new cultures. I believe that travel is not just about seeing new places, but about experiencing different ways of life and broadening our perspectives.',
    profilePicture: '',
    workExperience: [
      {
        id: 1,
        company: 'Tech Company',
        position: 'Software Engineer',
        duration: '2020 - Present',
        description: 'Developing innovative solutions and contributing to cutting-edge projects.',
      },
      {
        id: 2,
        company: 'Startup',
        position: 'Full Stack Developer',
        duration: '2018 - 2020',
        description: 'Built scalable web applications and led development teams.',
      },
    ],
    hobbies: ['Photography', 'Hiking', 'Cooking', 'Reading', 'Travel Planning'],
  });

  const [editingData, setEditingData] = useState(profileData);

  const handleSave = () => {
    setProfileData(editingData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingData(profileData);
    setIsEditing(false);
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditingData({
          ...editingData,
          profilePicture: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addWorkExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      duration: '',
      description: '',
    };
    setEditingData({
      ...editingData,
      workExperience: [...editingData.workExperience, newExperience],
    });
  };

  const updateWorkExperience = (id: number, field: string, value: string) => {
    setEditingData({
      ...editingData,
      workExperience: editingData.workExperience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const removeWorkExperience = (id: number) => {
    setEditingData({
      ...editingData,
      workExperience: editingData.workExperience.filter(exp => exp.id !== id),
    });
  };

  const addHobby = (hobby: string) => {
    if (hobby && !editingData.hobbies.includes(hobby)) {
      setEditingData({
        ...editingData,
        hobbies: [...editingData.hobbies, hobby],
      });
    }
  };

  const removeHobby = (hobbyToRemove: string) => {
    setEditingData({
      ...editingData,
      hobbies: editingData.hobbies.filter(hobby => hobby !== hobbyToRemove),
    });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: '#2c3e50',
          fontFamily: 'Georgia, serif'
        }}>
          About Me
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Get to know me better
        </Typography>
        {isLoggedIn && (
          <Button
            variant={isEditing ? "outlined" : "contained"}
            startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            sx={{
              background: isEditing ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderColor: '#667eea',
              color: isEditing ? '#667eea' : 'white',
              '&:hover': {
                background: isEditing ? 'rgba(102, 126, 234, 0.1)' : 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            height: 'fit-content',
            position: 'sticky',
            top: 20
          }}>
            <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
              <Avatar
                src={profileData.profilePicture}
                sx={{
                  width: 200,
                  height: 200,
                  border: '4px solid white',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }}
              />
              {isEditing && (
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 8,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                  component="label"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    style={{ display: 'none' }}
                  />
                  <CameraIcon />
                </IconButton>
              )}
            </Box>

            {isEditing ? (
              <Box sx={{ textAlign: 'left' }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={editingData.name}
                  onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                  sx={{ mb: 2 }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Title"
                  value={editingData.title}
                  onChange={(e) => setEditingData({ ...editingData, title: e.target.value })}
                  sx={{ mb: 2 }}
                  variant="outlined"
                />
                <TextField
                  fullWidth
                  label="Background"
                  multiline
                  rows={4}
                  value={editingData.background}
                  onChange={(e) => setEditingData({ ...editingData, background: e.target.value })}
                  variant="outlined"
                />
              </Box>
            ) : (
              <Box>
                <Typography variant="h4" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  fontFamily: 'Georgia, serif'
                }}>
                  {profileData.name}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                  {profileData.title}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6, textAlign: 'left' }}>
                  {profileData.background}
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Content Section */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Work Experience */}
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <WorkIcon sx={{ mr: 2, color: '#667eea', fontSize: 28 }} />
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  fontFamily: 'Georgia, serif'
                }}>
                  Work Experience
                </Typography>
              </Box>

              {isEditing ? (
                <Box>
                  {editingData.workExperience.map((exp, index) => (
                    <Box key={exp.id} sx={{ mb: 3, p: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Company"
                            value={exp.company}
                            onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Position"
                            value={exp.position}
                            onChange={(e) => updateWorkExperience(exp.id, 'position', e.target.value)}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <TextField
                            fullWidth
                            label="Duration"
                            value={exp.duration}
                            onChange={(e) => updateWorkExperience(exp.id, 'duration', e.target.value)}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                          <TextField
                            fullWidth
                            label="Description"
                            multiline
                            rows={2}
                            value={exp.description}
                            onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeWorkExperience(exp.id)}
                        sx={{ mt: 1 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    onClick={addWorkExperience}
                    sx={{ borderColor: '#667eea', color: '#667eea' }}
                  >
                    Add Experience
                  </Button>
                </Box>
              ) : (
                <Box>
                  {profileData.workExperience.map((exp, index) => (
                    <Box key={exp.id} sx={{ mb: 3, pb: 3, borderBottom: index < profileData.workExperience.length - 1 ? '1px solid #e0e0e0' : 'none' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                        {exp.position}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        {exp.company} • {exp.duration}
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {exp.description}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Hobbies */}
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FavoriteIcon sx={{ mr: 2, color: '#667eea', fontSize: 28 }} />
                <Typography variant="h5" sx={{ 
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  fontFamily: 'Georgia, serif'
                }}>
                  Hobbies & Interests
                </Typography>
              </Box>

              {isEditing ? (
                <Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {editingData.hobbies.map((hobby) => (
                      <Chip
                        key={hobby}
                        label={hobby}
                        onDelete={() => removeHobby(hobby)}
                        sx={{
                          borderColor: '#667eea',
                          color: '#667eea',
                          '&:hover': {
                            background: '#667eea',
                            color: 'white'
                          }
                        }}
                      />
                    ))}
                  </Box>
                  <TextField
                    size="small"
                    label="Add hobby"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const target = e.target as HTMLInputElement;
                        addHobby(target.value);
                        target.value = '';
                      }
                    }}
                    variant="outlined"
                  />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {profileData.hobbies.map((hobby) => (
                    <Chip
                      key={hobby}
                      label={hobby}
                      variant="outlined"
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          background: '#667eea',
                          color: 'white'
                        }
                      }}
                    />
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Save Button */}
      {isEditing && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            Save Changes
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default About; 