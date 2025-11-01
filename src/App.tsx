import { Outlet } from 'react-router';
import './App.css'
import SideBarNav from './components/SideBarNav/SideBarNav'

function App() {

  return (
    <div className='grid grid-cols-[250px_1fr] gap-0 justify-end min-h-screen'>
      <SideBarNav />
      <Outlet />
    </div>
  )
}

export default App
