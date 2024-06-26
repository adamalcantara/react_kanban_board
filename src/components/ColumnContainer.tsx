import { Column, ID, Task } from "../types";
import TrashIcon from "../icons/TrashIcon";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"; 
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

// Define the column prop
interface Props {
    column: Column;
    deleteColumn: (id: ID) => void;

    // function to update the column name
    updateColumn: (id: ID, title: string) => void;

    // create task
    createTask: (columnID: ID) => void;
    deleteTask:(id:ID) => void;
    updateTask:(id: ID, content: string) => void;
    tasks: Task[];
}

function ColumnContainer(props: Props) {
    // Set column equal to props
    const { column, deleteColumn, updateColumn, createTask, tasks, deleteTask, updateTask } = props;

    // state for editing title
    const [editMode, setEditMode] = useState(false);

    const tasksIDs = useMemo(() => {
        return tasks.map(task => task.id);
    }, [tasks]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id:column.id,
        data:{
            type: "Column",
            column,
        },
        // disable the drag and drop when in edit mode
        disabled: editMode,
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    // If a column is being dragged, use this styling for the column's background state
    if (isDragging) {
        return (
        <div ref={setNodeRef} style={style} 
        className="
        bg-columnBackgroundColor
        opacity-60
        border-2
        border-sky-500
        w-[350px]
        h-[500px]
        max-h-[500px]
        rounded-md
        flex
        flex-col
        "
        ></div>);
    }

  return (
    // Div for each column
    <div 
    // Set the reference of the column container to setNodeRef (Dnd kit library will handle this div)
    ref={setNodeRef}
    // Use the styling the dnd CSS library is providing
    style={style}
    className="
    bg-columnBackgroundColor
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    ">
        {/* Column header */}
        {/* Column title */}
        <div 
        {...attributes}
        {...listeners}
        // When clicked, activate the edit mode
        onClick={() => {
            setEditMode(true);
        }}
        className="
        bg-mainBackgroundColor
        text-md
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
        border-columnBackgroundColor
        border-4
        flex
        items-center
        justify-between
        ">
            {/* The inside box of the header */}
            <div className="flex gap-2">    
                <div className="
                flex
                justify-center
                items-center
                bg-columnBackgroundColor
                px-2
                py-1
                text-sm
                rounded-full
                ">0</div>
                {!editMode && column.title}
                {editMode && (
                <input 
                className="
                bg-black
                focus:border-sky-500
                border
                rounded
                outline-none
                px-2
                "
                value={column.title}
                onChange={e => updateColumn(column.id, e.target.value)}
                autoFocus 
                // When focus is anywhere else, set it back to column title
                onBlur={() => {
                    setEditMode(false);
                }}
                // Set the edit mode to false if Enter key is hit
                onKeyDown={e => {
                    if (e.key !== "Enter")return;
                    setEditMode(false);
                }}
                />)
                }
            </div>
            <button 
            // On the click of the button, delete the column whose id is pressed
            onClick={() => {
                deleteColumn(column.id);
            }}
            className="
            stroke-gray-500
            hover:stroke-white
            hover:bg-columnBackgroundColor
            rounded
            px-1
            py-2
            ">
                <TrashIcon />
            </button>
        </div>

        {/* Column task container */}
        <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIDs}>
            {            
            tasks.map((task) => (
                <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>
            ))}
        </SortableContext>
        </div>
        {/* Column footer */}
        <button className="
        flex
        gap-2
        items-center
        border-columnBackgroundColor
        border-2
        rounded-md
        p-4
        border-x-columnBackgroundColor
        hover:bg-mainBackgroundColor
        hover:text-sky-500
        active:bg-black
        "
        onClick={() => {
            createTask(column.id);
        }}
        ><PlusIcon />Add Task</button>
        </div>
  )
}

export default ColumnContainer;
