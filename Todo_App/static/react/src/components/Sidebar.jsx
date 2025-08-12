import logo from "../../../image/todoist.png"
import {ChevronFirst,ChevronLast,MoreVertical} from 'lucide-react'
import React, { createContext, useContext, useState } from "react" 
import ProfileMenu from "./ProfileMenu";
const SidebarContext = createContext();




export default function Sidebar({children, activeItem,setActiveItem, user }){
    const [expanded,setExpanded] = useState(true)
    const username = user?.Username ?? user?.username ?? "Guest";
    const email = user?.email ?? "";
    return (
        <>
            <aside className="h-screen">
                <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                    <div className="p-4 pb-2 flex justify-between items-center">
                        <img src={logo} className={`overflow-hidden transition-all ${expanded?"w-32":"w-0"}`}/>
                        <button onClick={()=>setExpanded((curr)=> !curr)} 
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
                            {expanded ? <ChevronFirst/> : <ChevronLast/>}
                        </button>
                    </div>

                    <SidebarContext.Provider value={{expanded}}>
                        <ul className="flex-1 px-2 ">
                            {React.Children.map(children,(child)=>{
                                if (!React.isValidElement(child)) return child;
                                return React.cloneElement(child,{
                                        active: child.props.text === activeItem,
                                        onClick: ()=>setActiveItem(child.props.text),
                                 })
                            })}
                        </ul>
                    </SidebarContext.Provider>

                    
                    <div className="border-t flex p-3">
                        {/**<img src="" alt="Users Profile Image" className="w-10 h-10 rounded-md" /> */}
                        {/*Users Image Above*/}
                        <div className={`flex justify-between items-center 
                            overflow-hidden transition-all ${expanded?"w-52 ml-3":"w-0"}`}>
                            <div className="leading-4 ">
                                <h4 className="font-semibold">
                                    {username}
                                </h4>
                                <span className="text-xs text-gray-600">
                                    {email}
                                </span>
                                <ProfileMenu />
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>
        </>
    )
}


export function SidebarItem({icon, text, active, alert, onClick}) {
    const { expanded } = useContext(SidebarContext);
    return (
      <li
        onClick={onClick}
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
          ${active ? "bg-orange-100 text-orange-800" : "hover:bg-indigo-50 text-gray-600"}`}
      >
        {icon}
        <span className={`overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}`}>{text}</span>
        {alert && (
          <div className={`absolute right-2 w-2 h-2 rounded bg-orange-400 ${expanded ? "" : "top-2"}`} />
        )}
        {!expanded && (
          <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-orange-100 text-orange-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0">
            {text}
          </div>
        )}
      </li>
    );
  }
  