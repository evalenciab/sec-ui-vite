import { Typography } from '@mui/material'
import { Routes, Route } from 'react-router'
import MainLayout from './layouts/MainLayout'
import { SearchForAccess } from './pages/SearchForAccess'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Typography variant="body1">Dashboard...</Typography>} />
           {/* Search For Access Routes */}
          <Route path="searchForAccess">
            <Route index element={<SearchForAccess />} />
          </Route>
          {/* User Access History Routes */}
          <Route path="userAccessHistory">
            <Route index element={<div>User Access History</div>} />
          </Route>
          {/* Request Access Routes */}
          <Route path="requestAccess">
            <Route index element={<div>Request Access</div>} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
