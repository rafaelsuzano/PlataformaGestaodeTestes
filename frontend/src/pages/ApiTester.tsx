import { Box } from '@mui/material';
import ApiTesterSidebar from '../components/api-tester/Sidebar';
import RequestBuilder from '../components/api-tester/RequestBuilder';
import ResponseViewer from '../components/api-tester/ResponseViewer';

// Using simple flexbox for panels since I don't know if react-resizable-panels is installed.
export default function ApiTester() {
  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', overflow: 'hidden', m: -3 }}>
      {/* Left Panel: Sidebar */}
      <ApiTesterSidebar />

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        
        {/* Top Panel: Request Builder */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <RequestBuilder />
        </Box>

        {/* Bottom Panel: Response Viewer */}
        <Box sx={{ height: '40%', minHeight: 200, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <ResponseViewer />
        </Box>

      </Box>
    </Box>
  );
}
