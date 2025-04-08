import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Divider,
  IconButton,
  Alert,
  Chip,
  Button,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as ReadIcon,
  RadioButtonUnchecked as UnreadIcon,
} from '@mui/icons-material';
import { getNotifications, deleteNotification } from '../../store/slices/notificationSlice';

const Notifications = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { notifications, loading, error } = useSelector((state) => state.notifications || { notifications: [], loading: false, error: null });
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, [dispatch]);

  const loadNotifications = () => {
    setIsRefreshing(true);
    dispatch(getNotifications())
      .finally(() => setIsRefreshing(false));
  };

  const handleDelete = (notificationId) => {
    dispatch(deleteNotification(notificationId));
  };

  if (loading && !isRefreshing) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="medium">
          Notifications
        </Typography>
        <Button 
          startIcon={<RefreshIcon />} 
          variant="outlined"
          onClick={loadNotifications}
          disabled={isRefreshing}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        {isRefreshing && (
          <Box sx={{ width: '100%', height: 4, position: 'relative', overflow: 'hidden' }}>
            <Box
              sx={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                animation: 'loading 1.5s infinite linear',
                '@keyframes loading': {
                  '0%': {
                    transform: 'translateX(-100%)',
                  },
                  '100%': {
                    transform: 'translateX(100%)',
                  },
                },
              }}
            />
          </Box>
        )}
        <List sx={{ p: 0 }}>
          {!notifications || notifications.length === 0 ? (
            <ListItem sx={{ py: 3, px: 3 }}>
              <ListItemText 
                primary={
                  <Typography variant="body1" align="center">
                    No notifications
                  </Typography>
                } 
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <React.Fragment key={notification._id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    py: 2, 
                    px: 3,
                    backgroundColor: notification.read ? 'inherit' : `${theme.palette.primary.light}10`,
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      backgroundColor: `${theme.palette.action.hover}`,
                    },
                  }}
                  secondaryAction={
                    <Tooltip title="Delete">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(notification._id)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemIcon sx={{ mt: 1 }}>
                    {notification.read ? 
                      <ReadIcon color="disabled" /> : 
                      <UnreadIcon color="primary" />
                    }
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={notification.read ? 'regular' : 'medium'}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && 
                          <Chip 
                            label="New" 
                            size="small" 
                            color="primary" 
                            sx={{ height: 20 }} 
                          />
                        }
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ display: 'block', mb: 0.5 }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          color="text.secondary"
                        >
                          {new Date(notification.createdAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Notifications; 