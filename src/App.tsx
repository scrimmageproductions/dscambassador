import { Routes, Route } from 'react-router-dom'
import { AmbassadorSessionProvider } from './context/AmbassadorSession'
import { BootLoader } from './components/ui/BootLoader'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Program } from './pages/Program'
import { Kit } from './pages/Kit'
import { Campus } from './pages/Campus'
import { Events } from './pages/Events'
import { Apply } from './pages/Apply'
import { Guidelines } from './pages/Guidelines'
import { HQ } from './pages/HQ'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <AmbassadorSessionProvider>
      <BootLoader />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="program" element={<Program />} />
          <Route path="kit" element={<Kit />} />
          <Route path="campus" element={<Campus />} />
          <Route path="events" element={<Events />} />
          <Route path="apply" element={<Apply />} />
          <Route path="guidelines" element={<Guidelines />} />
          <Route path="hq" element={<HQ />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AmbassadorSessionProvider>
  )
}

export default App
