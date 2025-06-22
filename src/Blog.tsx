import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Grid,
  Paper,
  Fab,
  Slider,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flight as FlightIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';

interface BlogEntry {
  id: string;
  title: string;
  content: string;
  location: string;
  date: string;
  tags: string[];
  imageUrl?: string;
}

interface BlogProps {
  isLoggedIn: boolean;
}

const Blog: React.FC<BlogProps> = ({ isLoggedIn }) => {
  const [entries, setEntries] = useState<BlogEntry[]>([
    {
      id: '1',
      title: 'Exploring the Streets of Tokyo',
      content: 'My first day in Tokyo was absolutely incredible. The blend of traditional culture and modern technology is fascinating. I spent hours wandering through the narrow alleys of Asakusa, discovering hidden ramen shops and ancient temples. The contrast between the serene Senso-ji Temple and the bustling Shibuya crossing perfectly captures the essence of this amazing city.',
      location: 'Tokyo, Japan',
      date: '2024-03-15',
      tags: ['Japan', 'Culture', 'Food', 'Temples'],
    },
    {
      id: '2',
      title: 'Hiking in the Swiss Alps',
      content: 'The crisp mountain air and breathtaking views of the Swiss Alps made every step worth it. Starting from Zermatt, I hiked through pristine alpine meadows filled with wildflowers. The Matterhorn stood majestically in the background, its snow-capped peak glistening in the sunlight. This was truly a once-in-a-lifetime experience.',
      location: 'Zermatt, Switzerland',
      date: '2024-02-20',
      tags: ['Switzerland', 'Hiking', 'Mountains', 'Nature'],
    },
    {
      id: '3',
      title: 'Sunset in Santorini',
      content: 'Watching the sunset from Oia was like witnessing a painting come to life. The white-washed buildings against the deep blue Aegean Sea created a perfect backdrop for the golden hour. The narrow cobblestone streets and blue-domed churches made every corner a photographer\'s dream.',
      location: 'Santorini, Greece',
      date: '2024-01-10',
      tags: ['Greece', 'Islands', 'Sunset', 'Photography'],
    },
    {
      id: '4',
      title: 'Street Food in Bangkok',
      content: 'The vibrant street food scene in Bangkok is a sensory overload in the best way possible. From the sizzling woks of Pad Thai to the aromatic Tom Yum soup, every bite tells a story of Thai culture and tradition. The night markets are a food lover\'s paradise.',
      location: 'Bangkok, Thailand',
      date: '2023-12-05',
      tags: ['Thailand', 'Food', 'Street Food', 'Culture'],
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BlogEntry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<BlogEntry>>({
    title: '',
    content: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
  });
  const [selectedDate, setSelectedDate] = useState<[number, number]>([2023, 2024]);

  // Get unique years from entries
  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(entries.map(entry => new Date(entry.date).getFullYear())));
    return uniqueYears.sort((a, b) => a - b);
  }, [entries]);

  // Filter entries based on selected date range
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const entryYear = new Date(entry.date).getFullYear();
      return entryYear >= selectedDate[0] && entryYear <= selectedDate[1];
    });
  }, [entries, selectedDate]);

  const handleAddEntry = () => {
    const entry: BlogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEntry.title || '',
      content: newEntry.content || '',
      location: newEntry.location || '',
      date: newEntry.date || new Date().toISOString().split('T')[0],
      tags: newEntry.tags || [],
    };
    setEntries([entry, ...entries]);
    setNewEntry({
      title: '',
      content: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
    });
    setDialogOpen(false);
  };

  const handleEditEntry = (entry: BlogEntry) => {
    setEditingEntry(entry);
    setNewEntry(entry);
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingEntry) {
      setEntries(entries.map(entry => 
        entry.id === editingEntry.id 
          ? { ...editingEntry, ...newEntry }
          : entry
      ));
    }
    setIsEditing(false);
    setEditingEntry(null);
    setNewEntry({
      title: '',
      content: '',
      location: '',
      date: new Date().toISOString().split('T')[0],
      tags: [],
    });
    setDialogOpen(false);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const handleAddTag = (tag: string) => {
    if (tag && !newEntry.tags?.includes(tag)) {
      setNewEntry({
        ...newEntry,
        tags: [...(newEntry.tags || []), tag],
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewEntry({
      ...newEntry,
      tags: newEntry.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold', 
          color: '#2c3e50',
          fontFamily: 'Georgia, serif'
        }}>
          Travel Blog
        </Typography>
        {isLoggedIn && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            Add Entry
          </Button>
        )}
      </Box>

      <Grid container spacing={4}>
        {/* Timeline Sidebar */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            height: 'fit-content',
            position: 'sticky',
            top: 20
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimelineIcon sx={{ mr: 1, color: '#667eea' }} />
              <Typography variant="h6" sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                Timeline
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Filter by year: {selectedDate[0]} - {selectedDate[1]}
            </Typography>
            
            <Box sx={{ px: 2, py: 3 }}>
              <Slider
                value={selectedDate}
                onChange={(event, newValue) => setSelectedDate(newValue as [number, number])}
                valueLabelDisplay="auto"
                min={Math.min(...years)}
                max={Math.max(...years)}
                step={1}
                marks={years.map(year => ({ value: year, label: year.toString() }))}
                sx={{
                  '& .MuiSlider-thumb': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                  '& .MuiSlider-track': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#e0e0e0',
                  }
                }}
              />
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Showing {filteredEntries.length} of {entries.length} posts
            </Typography>
          </Paper>
        </Grid>

        {/* Blog Entries */}
        <Grid size={{ xs: 12, md: 9 }}>
          {filteredEntries.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
              <FlightIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
              <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                No posts found for this time period
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting the timeline or add new posts when logged in.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {filteredEntries.map((entry) => (
                <Grid size={{ xs: 12, lg: 6 }} key={entry.id}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                  }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" gutterBottom sx={{ 
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        fontFamily: 'Georgia, serif'
                      }}>
                        {entry.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <LocationIcon sx={{ mr: 1, fontSize: 'small', color: '#667eea' }} />
                        <Typography variant="body2" color="text.secondary">
                          {entry.location}
                        </Typography>
                        <DateIcon sx={{ ml: 2, mr: 1, fontSize: 'small', color: '#667eea' }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(entry.date)}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {entry.content.length > 200 
                          ? `${entry.content.substring(0, 200)}...` 
                          : entry.content
                        }
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {entry.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
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
                    </CardContent>
                    {isLoggedIn && (
                      <CardActions>
                        <Button size="small" onClick={() => handleEditEntry(entry)}>
                          <EditIcon sx={{ mr: 1 }} />
                          Edit
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteEntry(entry.id)}
                        >
                          <DeleteIcon sx={{ mr: 1 }} />
                          Delete
                        </Button>
                      </CardActions>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          {isEditing ? 'Edit Blog Entry' : 'Add New Blog Entry'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Title"
            value={newEntry.title}
            onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Location"
            value={newEntry.location}
            onChange={(e) => setNewEntry({ ...newEntry, location: e.target.value })}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={newEntry.date}
            onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Content"
            multiline
            rows={6}
            value={newEntry.content}
            onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
            sx={{ mb: 2 }}
            variant="outlined"
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
              {newEntry.tags?.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
            <TextField
              size="small"
              label="Add tag"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement;
                  handleAddTag(target.value);
                  target.value = '';
                }
              }}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={isEditing ? handleSaveEdit : handleAddEntry}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {isEditing ? 'Save' : 'Add Entry'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Blog; 