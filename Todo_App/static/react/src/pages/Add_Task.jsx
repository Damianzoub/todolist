import React,{useState} from "react"
import { AddTaskApi } from "../API/tasks"




function Add_Task({ userID }){
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate,setDueDate] = useState('');
    const [priority,setPriority] = useState(4);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        const done = await AddTaskApi({task_name:taskName,description,due_date:dueDate,priority})
        if (done) alert("Task created successfully")
        else alert("Error creating task");
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div>
                <label htmlFor="taskName" className="block font-semibold">Task Name:</label>
                <input type='text' name="taskName" id='taskName' value={taskName} onChange={(e)=>{setTaskName(e.target.value)}}
                className="border px-3 py-2 w-full rounded"/>
            </div>
            <div>
                <label htmlFor="description" className="block font-semibold">Description:</label>
                <textarea name="description" id="description" onChange={(e) =>setDescription(e.target.value)}
                 className="border px-3 py-2 w-full rounded"/>
            </div>
            <div>
                <label htmlFor="dueDate" className="block font-semibold">Due Date:</label>
                <input type='date' name="dueDate" id='dueDate' value={dueDate}
                onChange={(e)=> setDueDate(e.target.value)} className="border px-3 py-2 w-full rounded"/>
            </div>
            <div>
                <label htmlFor="priority" className="block font-semibold">Priority:</label>
                <select name="priority" value={priority} id="priority"
                onChange={(e)=> setPriority(parseInt(e.target.value))} className="border px-3 py-2 w-full rounded">
                    <option value={1}>Very High</option>
                    <option value={2}>High</option>
                    <option value={3}>Medium</option>
                    <option value={4}>Low</option>
                </select>
            </div>
            <button type="submit" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">Add Task</button>
        </form>
    )
}

export default Add_Task;