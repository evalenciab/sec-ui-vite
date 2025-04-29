import { Typography } from '@mui/material'
import { Routes, Route } from 'react-router'
import MainLayout from './layouts/MainLayout'
import { SearchForAccess } from './pages/SearchForAccess'
import { UserAccessHistory } from './pages/UserAccessHistory'
import { RequestAccess } from './pages/RequestAccess'
import { MaintainApps } from './pages/MaintainApps'
import { Dashboard } from './pages/Dashboard'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
           {/* Search For Access Routes */}
          <Route path="searchForAccess">
            <Route index element={<SearchForAccess />} />
          </Route>
          {/* User Access History Routes */}
          <Route path="userAccessHistory">
            <Route index element={<UserAccessHistory />} />
          </Route>
          {/* Request Access Routes */}
          <Route path="requestAccess">
            <Route index element={<RequestAccess />} />
          </Route>
		  {/* Maintain Apps Routes */}
		  <Route path="maintainApps">
			<Route index element={<MaintainApps />} />
		  </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
