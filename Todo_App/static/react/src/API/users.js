import axios from "axios";

const token = localStorage.getItem('token');

export const updateEmailApi = async (newEmail) =>{
    try {
        const {data}= await axios.post("http://127.0.0.1:5000/api/users/updateEmail",{newEmail},{
            headers:{
                Authorization: `Bearer ${token}`
            }
        })
        return data
    }catch(e){
      console.error(`API CALL FAILED: ${e}`)
    }
}

export const getCurrentUserApi = async () =>{
    const {data} = await axios.get("http://127.0.0.1:5000/api/users/me",{
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    return data
}

export const updateUsernameApi = async (newUsername) =>{
    try{
      const {data} = await axios.post("http://127.0.0.1:5000/api/users/updateUsername",{newUsername},{
        headers:{
            Authorization: `Bearer ${token}`
        }
      })
      return data
    }catch(e){
      console.error(`API CALLED FAILED: ${e}`)
    }
}

export const logoutApi = async ()=>{
    try{
        await axios.post('http://127.0.0.1:5000/api/users/logout',{},{
            headers:{
                Authorization: `Bearer ${token}`
            }
        });
        localStorage.removeItem('token');
        window.location.href='http://127.0.0.1:5000/';
    }catch (e){
        console.error("Failed occured: ",e)
    }
}


export const updatePasswordApi = async (newPassword)=>{
    try{
        const {data} =  await axios.post("http://127.0.0.1:5000/api/users/updatePassword",{newPassword},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return data
    }catch(e){
        console.error("API CALL FAILED: ",e)
    }
}