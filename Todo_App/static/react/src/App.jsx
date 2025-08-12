import {Home,LayoutDashboard,Calendar,Layers,Settings,CirclePlus} from "lucide-react"
import Sidebar, {SidebarItem} from './components/Sidebar'
import MainContent from "./components/MainContent"
import React,{ useEffect, useState, useSyncExternalStore } from "react"
import {useLocation} from 'react-router-dom'
import { getCurrentUserApi } from "./API/users"
function App() {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [activeItem, setActiveItem] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Capture token from URL and fetch user
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const fetchUser = async () => {
      try {
        const data = await getCurrentUserApi();
        setUser({
          Username: data.username,
          email: data.email,
          photoUrl: data.photoUrl ?? "https://via.placeholder.com/150",
          defaultPhotoUrl: "https://via.placeholder.com/150",
        });
      } catch (e) {
        console.error("Error fetching user info", e);
        setUser(null);
      }
    };

    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/app/");
      fetchUser();                         // fetch immediately after saving
    } else if (localStorage.getItem("token")) {
      fetchUser();                         // page refresh case
    }
  }, [location]);


  return (
    <div className={`flex h-screen ${darkMode ? 'bg-black text-white': 'bg-white text-black'}`}>
      {/*Sidebar */}
      <div className='flex'>
        <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} user={user}>
            <SidebarItem icon={<Home size={20}/>} text="Home" alert  />
            <SidebarItem icon={<CirclePlus size={20}/>}text="Add Task"/>
            <SidebarItem icon={<LayoutDashboard size={20}/>} text="Dashboard" />
            <SidebarItem icon={<Calendar size={20}/>}text="Calendar" />
            <SidebarItem icon={<Layers size={20}/>} text='Tasks'/>
            <SidebarItem icon={<Settings size={20}/>} text="Settings"/>
          </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-auto">
          <MainContent activeItem={activeItem} darkMode={darkMode} setDarkMode = {setDarkMode}
          user={user}/>
      </div>
    </div>
  )
}

export default App
