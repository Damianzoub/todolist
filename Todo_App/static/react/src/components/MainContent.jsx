import Settings from "../pages/Settings";
import Home from "../pages/Home";
import Add_Task from "../pages/Add_Task";
import Dashboard from "../pages/Dashboard";
import Calendar from "../pages/Calendar";
import {jwtDecode} from 'jwt-decode';
import Tasks from "../pages/Tasks";
import { getAllTasksApi } from "../API/tasks";
import { useEffect, useState } from "react";
export default function MainContent({activeItem, darkMode , setDarkMode, user}){
    const username = user?.Username ?? user?.username ?? "Guest"
    const email = user?.email
    const photoUrl = user?.photoUrl
    const token = localStorage.getItem('token');
    let userID = null;
    if (token){
        try{
            const decoded = jwtDecode(token)
            userID = decoded.user_id
        }catch(e){
            console.error("Failed to decode JWT",e);
        }
    }
    //FETCH TASKS 
    const [tasks,setTasks] = useState([])
    const [loadingTasks, setLoadingTasks] = useState(null)

    useEffect(()=>{
        const fetchTasks = async () =>{
            try{
                const arr = await getAllTasksApi();
                setTasks(Array.isArray(arr)? arr : (arr?.data ?? []));
            }catch(e){
                console.error("Failed to fetch tasks",e);
                setTasks([]);
            }finally{
                setLoadingTasks(false);
            }
        }
        if (token) fetchTasks();
    },[token,userID])

    switch (activeItem){
        case "Home":
            return <Home userID={userID}/>;
        case "Add Task":
            return <Add_Task userID = {userID}/>;
        case "Dashboard":
            return <Dashboard/>;
        case "Calendar":
            if (loadingTasks) return <div className="p-4">Loading Calendar...</div>
            return (
                <Calendar tasks={tasks} onTaskClick={(t)=> console.log("Task clicked:",t)}
                onDayClick={(iso,dayTasks) => console.log("Day Clicked: ",iso,dayTasks)}/>
            )
        case "Tasks":
            return <Tasks userID={userID}/>
        case "Settings":
            return <Settings user={{
                Username:username,
                email:email,
                photoUrl:photoUrl,
                defaultPhotoUrl:"https://via.placeholder.com/150"
            }} darkMode={darkMode} setDarkMode={setDarkMode}/>;
            {/* Put the GET info for the users here  */}
        default:
            return <Home/>;
        
    }
}

