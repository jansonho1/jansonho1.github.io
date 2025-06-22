import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Grid from '@mui/material/Grid';
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Tabs,
  Tab,
  Fab,
  Tooltip,
  ImageList,
  ImageListItem,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Collections as GalleryIcon,
} from '@mui/icons-material';

interface Photo {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
  uploadDate: Date;
  description?: string;
}

interface PhotoUploadProps {
  isLoggedIn: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ isLoggedIn }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [activeTab, setActiveTab] = useState(1);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPhotos: Photo[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      uploadDate: new Date(),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    setSnackbar({ open: true, message: `${acceptedFiles.length} photo(s) uploaded successfully!`, severity: 'success' });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const handleDelete = (photoId: string) => {
    setPhotos((prev) => {
      const photo = prev.find(p => p.id === photoId);
      if (photo) {
        URL.revokeObjectURL(photo.url);
      }
      return prev.filter(p => p.id !== photoId);
    });
    setSnackbar({ open: true, message: 'Photo deleted successfully!', severity: 'success' });
  };

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a');
    link.href = photo.url;
    link.download = photo.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSnackbar({ open: true, message: 'Download started!', severity: 'success' });
  };

  const handleShare = (photo: Photo) => {
    setSelectedPhoto(photo);
    setShareUrl(`${window.location.origin}/photo/${photo.id}`);
    setShareDialogOpen(true);
  };

  const handleView = (photo: Photo) => {
    setSelectedPhoto(photo);
    setViewDialogOpen(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setSnackbar({ open: true, message: 'Share link copied to clipboard!', severity: 'success' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <Box>
      {/* Header with Tabs - Only show upload tab when logged in */}
      {isLoggedIn && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
            <Tab icon={<UploadIcon />} label="Upload Photos" />
            <Tab icon={<GalleryIcon />} label="Photo Gallery" />
          </Tabs>
        </Box>
      )}

      {/* Upload Section */}
      {isLoggedIn && activeTab === 0 && (
        <Box>
          <Paper
            {...getRootProps()}
            sx={{
              p: 4,
              textAlign: 'center',
              border: '2px dashed #667eea',
              background: isDragActive ? '#e3f2fd' : '#f8f9fa',
              cursor: 'pointer',
              mb: 3,
              transition: 'all 0.3s ease',
              borderRadius: 3,
              '&:hover': {
                background: '#e3f2fd',
                borderColor: '#5a6fd8',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              },
            }}
          >
            <input {...getInputProps()} />
            <UploadIcon sx={{ fontSize: 48, color: '#667eea', mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              {isDragActive ? 'Drop photos here...' : 'Drag & drop photos here'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select files
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#667eea' }}>
              Supports: JPG, PNG, GIF, WebP
            </Typography>
          </Paper>

          {/* Upload Stats */}
          {photos.length > 0 && (
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
                Upload Summary
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">Total Photos</Typography>
                  <Typography variant="h6" sx={{ color: '#2c3e50' }}>{photos.length}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">Total Size</Typography>
                  <Typography variant="h6" sx={{ color: '#2c3e50' }}>
                    {formatFileSize(photos.reduce((acc, photo) => acc + photo.size, 0))}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">Latest Upload</Typography>
                  <Typography variant="h6" sx={{ color: '#2c3e50' }}>
                    {photos.length > 0 ? formatDate(photos[photos.length - 1].uploadDate) : 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="body2" color="text.secondary">Actions</Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setActiveTab(1)}
                    startIcon={<GalleryIcon />}
                    sx={{ borderColor: '#667eea', color: '#667eea' }}
                  >
                    View Gallery
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          )}
        </Box>
      )}

      {/* Gallery Section */}
      <Box>
        {photos.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
            <GalleryIcon sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
            <Typography variant="h5" gutterBottom sx={{ color: '#2c3e50', fontWeight: 'bold' }}>
              No photos uploaded yet
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
              {isLoggedIn ? 'Upload some photos to see them in the gallery' : 'Photos will appear here once uploaded'}
            </Typography>
            {isLoggedIn && (
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setActiveTab(0)}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                Upload Photos
              </Button>
            )}
          </Paper>
        ) : (
          <ImageList sx={{ width: '100%', height: 'auto' }} cols={4} rowHeight={300} gap={16}>
            {photos.map((photo) => (
              <ImageListItem key={photo.id} sx={{ 
                position: 'relative',
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                }
              }}>
                <img
                  src={photo.url}
                  alt={photo.name}
                  loading="lazy"
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: 12,
                  }}
                  onClick={() => handleView(photo)}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}
      </Box>

      {/* Floating Action Button to switch tabs */}
      {isLoggedIn && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
        >
          <Tooltip title={activeTab === 0 ? 'View Gallery' : 'Upload Photos'}>
            {activeTab === 0 ? <GalleryIcon /> : <AddIcon />}
          </Tooltip>
        </Fab>
      )}

      {/* View Photo Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedPhoto?.name}
          {isLoggedIn && (
            <IconButton
              sx={{ position: 'absolute', right: 8, top: 8 }}
              onClick={() => selectedPhoto && handleDelete(selectedPhoto.id)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedPhoto && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.name}
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Size: {formatFileSize(selectedPhoto.size)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Uploaded: {formatDate(selectedPhoto.uploadDate)}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => selectedPhoto && handleDownload(selectedPhoto)} startIcon={<DownloadIcon />}>
            Download
          </Button>
          <Button onClick={() => selectedPhoto && handleShare(selectedPhoto)} startIcon={<ShareIcon />}>
            Share
          </Button>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onClose={() => setShareDialogOpen(false)}>
        <DialogTitle>Share Photo</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Share URL"
            value={shareUrl}
            onChange={(e) => setShareUrl(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={copyToClipboard}>Copy Link</Button>
          <Button onClick={() => setShareDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PhotoUpload; 