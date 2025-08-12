import { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import axios from "axios"
import { logoutApi } from "../API/users";
export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // Close menu if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* MoreVertical icon button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-1.5 rounded-md bg-gray-50 hover:bg-gray-100 cursor-pointer"
        aria-label="Toggle profile menu"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <MoreVertical />
      </button>

      {/* Dropdown above the icon */}
      {open && (
        <div
          className="relative  bottom-full mb-2 right-0 w-36 bg-white rounded-md shadow-lg border border-gray-200 z-50"
        >
          <button
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              handleLogout();
            }}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}


const handleLogout = async () =>{
  try{
      await logoutApi();
      window.location.href = "http://127.0.0.1:5000/"
  }catch(e){
    console.error('Logout Failed in UI Handler: ',e)
  }
}
