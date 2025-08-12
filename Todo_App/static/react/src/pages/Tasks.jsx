import React , {useState,useEffect} from 'react';
import { DeleteTaskApi, getAllTasksApi } from '../API/tasks';

export default function Tasks({userID}){
    const [tasks,setTasks] = useState([]);
    const [currentPage,setCurrentPage] = useState(1);
    
    {/**Still Curious about this */}
    const tasksPerPage = 10;

    useEffect(()=>{
        const fetchTasks = async ()=>{
            const tasksArr = await getAllTasksApi(userID);
            setTasks(tasksArr);
        }
        fetchTasks();
    },[userID]);

    const handleCompleteTask = async (taskID) =>{
        try{
            await DeleteTaskApi(taskID);
            setTasks(prevTasks=> prevTasks.filter(task => task.task_id !== taskID))

        }catch(e){
            alert("Failed to Delete Task. Try again.")
        }
    }

    const groupedTasks = Array.isArray(tasks)
    ? tasks.reduce((groups,task) =>{
      const date = task.due_date;
      if (!groups[date]) groups[date] = [];
      groups[date].push(task);
      return groups
    },{})
      :{};


    const dueDates = Object.keys(groupedTasks).slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);

    return (
        <div className="p-6">
      {dueDates.map(dueDate => (
        <div key={dueDate} className="mb-6">
          <h3 className="text-xl font-bold mb-4">{dueDate}</h3>
          {groupedTasks[dueDate].map(task => (
            <div key={task.task_id} className="flex items-center border rounded p-4 mb-2 shadow-sm">
              <input
                type="checkbox"
                onChange={() => handleCompleteTask(task.task_id)}
                className="w-5 h-5 mr-4 cursor-pointer"
              />
              <div>
                <h4 className="font-semibold">{task.task_name}</h4>
                <p className="text-gray-600">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Pagination Controls */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
    </div>
    )
}