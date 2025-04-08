import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Tooltip,
  useTheme,
  LinearProgress,
  Fade,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import { getMCPCollections, createCollection, assignCollection } from '../../store/slices/collectionSlice';
import { getMCPPartners } from '../../store/slices/partnerSlice';

const statusColors = {
  pending: 'warning',
  assigned: 'info',
  in_progress: 'primary',
  completed: 'success',
  cancelled: 'error',
};

const CollectionsPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { collections, loading, error } = useSelector((state) => state.collections);
  const { partners } = useSelector((state) => state.partner);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [collectionForm, setCollectionForm] = useState({
    name: '',
    location: '',
    scheduledDate: '',
    preferredTime: '',
    notes: '',
    wasteMaterials: ['Plastic'],
  });

  useEffect(() => {
    loadData();
  }, [dispatch]);

  const loadData = () => {
    setIsRefreshing(true);
    Promise.all([
      dispatch(getMCPCollections()),
      dispatch(getMCPPartners())
    ])
    .catch(err => console.error('Collection data loading error:', err))
    .finally(() => setIsRefreshing(false));
  };

  const handleRefresh = () => {
    loadData();
  };

  const handleCreateDialogOpen = () => {
    resetCollectionForm();
    setOpenCreateDialog(true);
  };

  const handleCreateDialogClose = () => {
    setOpenCreateDialog(false);
  };

  const resetCollectionForm = () => {
    setCollectionForm({
      name: '',
      location: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      preferredTime: '10:00 AM - 2:00 PM',
      notes: '',
      wasteMaterials: ['Plastic'],
    });
  };

  const handleCollectionFormChange = (e) => {
    const { name, value } = e.target;
    setCollectionForm({
      ...collectionForm,
      [name]: value,
    });
  };

  const handleWasteMaterialsChange = (e) => {
    setCollectionForm({
      ...collectionForm,
      wasteMaterials: e.target.value,
    });
  };

  const handleCreateCollection = () => {
    dispatch(createCollection(collectionForm))
      .unwrap()
      .then(() => {
        setOpenCreateDialog(false);
        resetCollectionForm();
      })
      .catch(error => {
        console.error('Create collection error:', error);
      });
  };

  const handleAssignDialogOpen = (collection) => {
    setSelectedCollection(collection);
    setSelectedPartner('');
    setOpenAssignDialog(true);
  };

  const handleAssignDialogClose = () => {
    setOpenAssignDialog(false);
  };

  const handlePartnerChange = (e) => {
    setSelectedPartner(e.target.value);
  };

  const handleAssignCollection = () => {
    if (selectedCollection && selectedPartner) {
      dispatch(assignCollection({ 
        collectionId: selectedCollection._id, 
        partnerId: selectedPartner 
      }))
        .unwrap()
        .then(() => {
          setOpenAssignDialog(false);
        })
        .catch(error => {
          console.error('Assign collection error:', error);
        });
    }
  };

  if (loading && !isRefreshing) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={40} thickness={4} sx={{ mb: 2 }} />
        <Typography variant="body1" color="textSecondary">
          Loading collections...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 2, md: 3 },
      backgroundColor: theme.palette.background.default,
    }}>
      {isRefreshing && (
        <LinearProgress 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            height: 3,
            borderRadius: 0
          }} 
        />
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          Collections
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<RefreshIcon />} 
            variant="outlined"
            color="primary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Refresh
          </Button>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained"
            color="primary"
            onClick={handleCreateDialogOpen}
            sx={{ 
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            New Collection
          </Button>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Card 
        elevation={0} 
        sx={{ 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <TableContainer sx={{ 
            overflow: 'auto',
            maxHeight: 'calc(100vh - 220px)',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.divider,
              borderRadius: '8px',
            },
          }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Scheduled Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Preferred Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }}>Assigned To</TableCell>
                  <TableCell sx={{ fontWeight: 600, backgroundColor: theme.palette.background.paper }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collections.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="textSecondary">
                        No collections found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  collections.map((collection) => (
                    <TableRow 
                      key={collection._id}
                      hover
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {collection.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {collection.wasteMaterials?.join(', ')}
                        </Typography>
                      </TableCell>
                      <TableCell>{collection.location}</TableCell>
                      <TableCell>
                        {new Date(collection.scheduledDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{collection.preferredTime}</TableCell>
                      <TableCell>
                        <Chip 
                          label={collection.status.charAt(0).toUpperCase() + collection.status.slice(1)}
                          color={statusColors[collection.status]}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>
                        {collection.assignedTo ? 
                          partners.find(p => p.id === collection.assignedTo)?.name || 'Partner' : 
                          <Typography variant="body2" color="text.secondary">Not assigned</Typography>
                        }
                      </TableCell>
                      <TableCell align="center">
                        {collection.status === 'pending' && (
                          <Tooltip title="Assign to Partner">
                            <IconButton 
                              size="small"
                              onClick={() => handleAssignDialogOpen(collection)}
                              color="primary"
                            >
                              <AssignmentIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create Collection Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={handleCreateDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="medium">Create New Collection</Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Collection Name"
                value={collectionForm.name}
                onChange={handleCollectionFormChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="location"
                label="Location"
                value={collectionForm.location}
                onChange={handleCollectionFormChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="scheduledDate"
                label="Scheduled Date"
                type="date"
                value={collectionForm.scheduledDate}
                onChange={handleCollectionFormChange}
                fullWidth
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="preferredTime"
                label="Preferred Time"
                value={collectionForm.preferredTime}
                onChange={handleCollectionFormChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="waste-materials-label">Waste Materials</InputLabel>
                <Select
                  labelId="waste-materials-label"
                  multiple
                  value={collectionForm.wasteMaterials}
                  onChange={handleWasteMaterialsChange}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {['Plastic', 'Paper', 'Cardboard', 'Metal', 'E-waste', 'Glass', 'Organic'].map((material) => (
                    <MenuItem key={material} value={material}>
                      {material}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="notes"
                label="Notes"
                value={collectionForm.notes}
                onChange={handleCollectionFormChange}
                fullWidth
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCreateDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateCollection} 
            variant="contained" 
            color="primary"
            disabled={loading || !collectionForm.name || !collectionForm.location || !collectionForm.scheduledDate}
          >
            {loading ? 'Creating...' : 'Create Collection'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Partner Dialog */}
      <Dialog 
        open={openAssignDialog} 
        onClose={handleAssignDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="medium">Assign Collection to Partner</Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedCollection && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {selectedCollection.name}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {selectedCollection.location} | {new Date(selectedCollection.scheduledDate).toLocaleDateString()}
              </Typography>
            </Box>
          )}
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="partner-select-label">Select Partner</InputLabel>
            <Select
              labelId="partner-select-label"
              value={selectedPartner}
              onChange={handlePartnerChange}
              label="Select Partner"
            >
              {partners.map((partner) => (
                <MenuItem key={partner.id} value={partner.id}>
                  {partner.name} ({partner.activeCollections} active)
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleAssignDialogClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleAssignCollection} 
            variant="contained" 
            color="primary"
            disabled={loading || !selectedPartner}
          >
            {loading ? 'Assigning...' : 'Assign Partner'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollectionsPage; 