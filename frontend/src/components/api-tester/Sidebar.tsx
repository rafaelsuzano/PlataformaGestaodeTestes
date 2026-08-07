import { Box, Typography, IconButton, Tooltip, Divider, Select, MenuItem, FormControl } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import FolderIcon from '@mui/icons-material/Folder';
import HttpIcon from '@mui/icons-material/Http';
import AddIcon from '@mui/icons-material/Add';
import { useApiTestingStore } from '../../store/apiTestingStore';

export default function ApiTesterSidebar() {
  const { collections, environments, selectedEnvironmentId, setSelectedEnvironment, setActiveRequest } = useApiTestingStore();

  return (
    <Box sx={{ width: 280, height: '100%', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', bgcolor: 'rgba(11, 15, 25, 0.4)' }}>
      {/* Environment Selector */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
          ENVIRONMENT
        </Typography>
        <FormControl fullWidth size="small">
          <Select
            value={selectedEnvironmentId || 'none'}
            onChange={(e) => setSelectedEnvironment(e.target.value === 'none' ? null : e.target.value)}
            sx={{ bgcolor: 'rgba(0,0,0,0.2)' }}
          >
            <MenuItem value="none">No Environment</MenuItem>
            {environments.map(env => (
              <MenuItem key={env.id} value={env.id}>{env.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />

      {/* Collections Tree */}
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'bold' }}>
          COLLECTIONS
        </Typography>
        <Tooltip title="Nova Collection">
          <IconButton size="small"><AddIcon fontSize="small" /></IconButton>
        </Tooltip>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
        <SimpleTreeView>
          {collections.map(col => (
            <TreeItem key={col.id} itemId={col.id} label={
              <Box sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}>
                <FolderIcon sx={{ fontSize: 18, mr: 1, color: '#fbc02d' }} />
                <Typography variant="body2">{col.name}</Typography>
              </Box>
            }>
              {/* Fake request for demonstration since requests are not yet in the store tree */}
              <TreeItem itemId={`${col.id}-req-1`} label={
                <Box 
                  sx={{ display: 'flex', alignItems: 'center', p: 0.5 }}
                  onClick={() => setActiveRequest({
                    id: `${col.id}-req-1`,
                    name: 'Exemplo Request',
                    method: 'GET',
                    url: 'https://api.exemplo.com/v1/users',
                    expectedStatus: 200,
                    headers: JSON.stringify([{ key: 'Content-Type', value: 'application/json' }])
                  })}
                >
                  <HttpIcon sx={{ fontSize: 18, mr: 1, color: '#4caf50' }} />
                  <Typography variant="body2">Exemplo Request</Typography>
                </Box>
              } />
            </TreeItem>
          ))}
        </SimpleTreeView>
      </Box>
    </Box>
  );
}
