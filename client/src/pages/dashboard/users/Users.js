import { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useValue } from '../../../context/ContextProvider';
import { getUsers } from '../../../actions/user';
import moment from 'moment';
import { grey } from '@mui/material/colors';
import UsersActions from './UsersActions';

const Users = ({ setSelectedLink, link }) => {
  const {
    state: { users, currentUser },
    dispatch,
  } = useValue();

  const [pageSize, setPageSize] = useState(5);
  const [rowId, setRowId] = useState(null);

  useEffect(() => {
    setSelectedLink(link);
    if (users.length === 0) getUsers(dispatch, currentUser);
  }, []);

  const columns = useMemo(
    () => [
      {
        field: 'photoURL',
        headerName: 'Avatar',
        width: 160,
        renderCell: (params) => <Avatar src={params.row.photoURL} />,
        sortable: false,
        filterable: false,
        align: 'center',
        headerAlign: 'center',
      },
      { field: 'name', headerName: 'Name', width: 250 },
      { field: 'email', headerName: 'Email', width: 310 },
      {
        field: 'role',
        headerName: 'Role',
        width: 130,
        type: 'singleSelect',
        valueOptions: ['basic', 'editor', 'admin'],
        editable: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'active',
        headerName: 'Active',
        width: 130,
        type: 'boolean',
        editable: true,
        align: 'center',
        headerAlign: 'center',
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        width: 260,
        renderCell: (params) =>
          moment(params.row.createdAt).format('YYYY-MM-DD HH:MM:SS'),
          align: 'center',
          headerAlign: 'center',
      },
      { field: '_id', headerName: 'Id', width: 220 },
      {
        field: 'actions',
        headerName: 'Actions',
        type: 'actions',
        align: 'center',
        headerAlign: 'center',
        renderCell: (params) => (
          <UsersActions {...{ params, rowId, setRowId }} />
        ),
      },
    ],
    [rowId]
  );

   // Filter out the ID column if it should be hidden
   const filteredColumns = useMemo(() => columns.filter(col => col.field !== '_id'), []);



  return (
    <Box
      sx={{
        height: 400,
        width: '100%',
      }}
    >
      <Typography
        variant="h3"
        component="h3"
        sx={{ textAlign: 'center', mt: 3, mb: 3 }}
      >
        Manage Users
      </Typography>
      <DataGrid
        columns={filteredColumns}
        rows={users}
        getRowId={(row) => row._id}
        pagination
        autoPageSize 
        pageSizeOptions={[5, 10, 20]}
        // pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        sx={{
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === 'light' ? grey[200] : grey[900],
          },
        }}
        onCellEditCommit={(params) => setRowId(params.id)}
      />
    </Box>
  );
};

export default Users;