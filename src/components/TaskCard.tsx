import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import { ID, Task } from "../types"
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"

interface Props {
    task: Task;
    deleteTask: (id:ID) => void;
    updateTask: (id: ID, content: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: Props) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // useSortable hook to change and order tasks
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id:task.id,
        data:{
            type: "Task",
            task,
        },
        // disable the drag and drop when in edit mode
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }


    const toggleEditMode = () => {
        setEditMode((prev) => !prev);
        setMouseIsOver(false);
    }

    if (isDragging) {
        return <div ref={setNodeRef} style={style} className="
        bg-mainBackgroundColor
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        flex
        text-left
        rounded-xl
        border-2
        border-sky-500
        cursor-grab
        relative
        opacity-50
        "/>
    }

    if (editMode) {
        return   <div ref={setNodeRef} style={style} {...attributes} {...listeners}
        className="
        bg-mainBackgroundColor
        p-2.5
        h-[100px]
        min-h-[100px]
        items-center
        flex
        text-left
        rounded-xl
        hover:ring-2
        hover:ring-inset
        hover:ring-sky-500
        cursor-grab
        relative
        ">
           <textarea className="
           h-[90%]
           w-full
           resize-none
           border-none
           rounded
           bg-transparent
           text-white
           focus:outline-none
           "
           value={task.content}
           autoFocus
           placeholder="Task content here"
           onBlur={toggleEditMode}
           onKeyDown={e => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
           }}
           onChange={(e) => updateTask(task.id, e.target.value)}
           ></textarea>
        </div>
    }

  return (
    <div
    onClick={toggleEditMode} ref={setNodeRef} style={style} {...attributes} {...listeners}
    // If the mouse is over the task, show the delete button
    onMouseEnter={() => {
        setMouseIsOver(true);
    }} 
    onMouseLeave={() => {
        setMouseIsOver(false);
    }} 
    className="
    bg-mainBackgroundColor
    p-2.5
    h-[100px]
    min-h-[100px]
    items-center
    flex
    text-left
    rounded-xl
    hover:ring-2
    hover:ring-inset
    hover:ring-sky-500
    cursor-grab
    relative
    task
    ">
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
        </p>
        { mouseIsOver &&(<button 
        onClick={() => {
            deleteTask(task.id);
        }}
        className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100">
            <TrashIcon />
        </button>)}
    </div>
  )
}

export default TaskCard