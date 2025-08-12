import axios from "axios";


{/**Complete those API calls */}
export const AddTaskApi = async(taskData) =>{
    try{
        const token = localStorage.getItem('token')
        await axios.post("http://127.0.0.1:5000/api/tasks/add_task",
            taskData
        ,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return true;
    }catch(e){
        console.error("Logout API Call Failed: ",e)
        return false;

    }
}

export const getAllTasksApi =  async ()=>{
    try{
        const token = localStorage.getItem('token')
        const {data} = await axios.get("http://127.0.0.1:5000/api/tasks/show_tasks",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return data.data || [];
    }catch(e){
        console.error("Logout API calls: ",e)
    }
}

export const DeleteTaskApi = async(task_id)=>{
    try{
        const token = localStorage.getItem('token')
        await axios.delete("http://127.0.0.1:5000/api/tasks/delete_task",{
            headers:{
                Authorization:`Bearer ${token}`
            },
            data:{task_id}
        })
    }catch(e){
        console.error("Logout API calls: ",e)
    }
}

export const updateTaskApi = async(task_id)=>{
    try{
         const token =localStorage.getItem('token')
         await axios.put("http://127.0.0.1:5000/api/tasks/modify_task",
            {task_id, ...taskData},
         {
            headers:{
                Authorization:`Bearer ${token}`
            }
         })
         
    }catch(e){
        console.error("Logout API calls: ",e)
    }
}