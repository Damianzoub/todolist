import React, { use, useState } from "react";
import { updateEmailApi, updateUsernameApi ,updatePasswordApi} from "../API/users";
function Settings({ user, darkMode, setDarkMode }) {
  // Local states for inputs
  const [username, setUsername] = useState(user.Username || "");
  const [email, setEmail] = useState(user.email || "");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword,setNewPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');
  // Example handlers (replace these with your backend calls later)
  const handleChangePhoto = () => {
    console.log("Change Picture clicked");
  };
  
  

  //API CALLS ABOVE

  const handleDeletePhoto = () => {
    if (user.photoUrl === user.defaultPhotoUrl) {
      console.log("Delete disabled: using default photo");
      return;
    }
    console.log("Delete Photo clicked, reverting to default photo");
  };

  const handleUpdateUsername = async (newUsername) =>{
    try{
      await updateUsernameApi(newUsername)
      console.log("Username Updated Succesfully: ",newUsername)
    }catch(e){
      console.error("Failed to update the email")
    }
  }

  const handleUpdateEmail = async (newEmail) =>{
    try{
      await updateEmailApi(newEmail)
      console.log("Email Updated Succesfully: ",newEmail)
    }catch(e){
      console.error("Failed to update the email")
    }
  }

  const handleNavigateToPasswordChange = () => {
    setShowPasswordModal(true);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log("Dark mode toggled:", !darkMode);
  };

  return (
    <div className="p-6 w-full mx-auto">
      <h3 className="text-2xl font-semibold mb-6">Settings</h3>

      {/* Photo Section */}
      <section className="mb-8">
        <em className="block mb-2 text-gray-600">Photo</em>
        <img
          src={user.photoUrl}
          alt="User Profile"
          className="w-24 h-24 rounded-full object-cover mb-4"
        />
        <div className="flex space-x-4">
          <button
            onClick={handleChangePhoto}
            className="bg-gray-300 text-black rounded-md px-6 py-4 hover:cursor-pointer hover:bg-gray-400 transition"
          >
            Change Picture
          </button>

          <button
            onClick={handleDeletePhoto}
            disabled={user.photoUrl === user.defaultPhotoUrl}
            className={`rounded-md px-6 py-4 border border-orange-500 ${
              user.photoUrl === user.defaultPhotoUrl
                ? "bg-white text-orange-400 cursor-not-allowed"
                : "bg-white text-orange-600 hover:border-orange-600 cursor-pointer"
            } transition`}
          >
            Delete Photo
          </button>
        </div>
      </section>

      {/* Editable Fields */}
      <section className="mb-8 space-y-6">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block font-semibold mb-1">
            Username:
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <button
              onClick={() => handleUpdateUsername(username)}
              className="bg-orange-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Submit
            </button>
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email:
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 flex-1"
            />
            <button
              onClick={() => handleUpdateEmail(email)}
              className="bg-orange-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </section>

      {/* Password change */}
      <section className="mb-8">
        <button
          onClick={handleNavigateToPasswordChange}
          className="cursor-pointer text-black bg-gray-500 hover:bg-gray-700 px-6 py-3 rounded transition"
        >
          Change Password
        </button>
      </section>

      {/* Dark Mode Toggle */}
      <section className="flex items-center space-x-3">
        <label htmlFor="darkModeToggle" className="font-semibold">
          Dark Mode
        </label>
        <input
          id="darkModeToggle"
          type="checkbox"
          checked={darkMode}
          onChange={handleToggleDarkMode}
          className="w-10 h-6 rounded-full cursor-pointer accent-orange-500"
        />
      </section>
       {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md w-80 space-y-4">
            <h3 className="text-xl font-semibold">Change Password</h3>
            
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />
            <input
              type="password"
              placeholder="Re-type New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-full"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (newPassword !== confirmPassword) {
                    alert("Passwords do not match!");
                    return;
                  }
                  try {
                    await updatePasswordApi(newPassword);  // API Call
                    alert("Password changed successfully!");
                    setShowPasswordModal(false);
                    setNewPassword('');
                    setConfirmPassword('');
                  } catch (e) {
                    console.error("Failed to update password", e);
                    alert("Error updating password");
                  }
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
