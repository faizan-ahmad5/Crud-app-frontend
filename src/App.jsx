import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://crud-app-backend-wine.vercel.app/api/users';

export default function App() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleClickOpen = (index) => {
    setCurrentIndex(index);
    setNewName(users[index].name);
    setNewEmail(users[index].email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (newName && newEmail) {
      const user = { name: newName, email: newEmail };
      try {
        if (currentIndex !== null) {
          await axios.put(`${API_URL}/${users[currentIndex].id}`, user);
        } else {
          await axios.post(API_URL, user);
        }
        fetchUsers();
      } catch (error) {
        console.error('Error saving user:', error);
      }
    }
    handleClose();
  };

  const handleDelete = async (index) => {
    try {
      await axios.delete(`${API_URL}/${users[index].id}`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:',  error);
    }
  };

  const handleAddUser = () => {
    setCurrentIndex(null);
    setNewName('');
    setNewEmail('');
    setOpen(true);
  };

  return (
    <>
      <h1 style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>User Management</h1>
      <Button variant="contained" color="primary" onClick={handleAddUser} style={{ margin: '20px', marginLeft: '25%' }}>Add User</Button>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TableContainer component={Paper} style={{ width: '50%', }}>
          <Table sx={{ minWidth: 200 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleClickOpen(index)} style={{ marginRight: '10px' }}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={() => handleDelete(index)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{currentIndex !== null ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {currentIndex !== null ? 'Edit the details of the user.' : 'Enter the details of the new user.'}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            type="text"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}