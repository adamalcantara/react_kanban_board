import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
// import the types column defined in its file
import { Column, ID, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

function KanbanBoard() {
    // define columns and set columns and have them set to an empty array, using the type defined in the file
    const [columns, setColumns] = useState<Column[]>([]);
    // array of columns ID which maps over columns, recalculate the array every time the columns array changes
    const columnsID = useMemo(() => columns.map((col) => col.id), [columns]);
    console.log(columns);

    // State for tasks
    const [tasks, setTasks] = useState<Task[]>([]);

    // State for column that is being dragged, has state of column or null just in case there is nothing
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

    const [activeTask, setActiveTask] = useState<Task | null>(null);


    // Define clicks that are drag clicks and clicks that are regular clicks
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, //A distance of 3 px will constitute a drag
            }
        })
    );

  return (
    // Outer div
    <div className="
    m-auto
    flex
    min-h-screen
    w-full
    items-center
    overflow-x-auto
    overflow-y-hidden
    px-[40px]
    ">
        {/* Container for the columns, wrapped in DndContext for drag and drop capability */}
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
            <div className="m-auto flex gap-4">
                <div className="flex gap-4">
                <SortableContext items={columnsID}>
                    {columns.map( (col) => (
                    <ColumnContainer 
                    key={col.id} 
                    column={col} 
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks.filter((task) => task.columnID === col.id)}
                    />
                ))}
                
                </SortableContext>
                </div>
                <button 
                onClick={() => {
                    createNewColumn();
                }}
                className="
                h-[60px]
                w-[350px]
                min-w-[350px]
                cursor-pointer
                rounded-lg
                bg-mainBackgroundColor
                border-2
                border-columnBackgroundColor
                p-4
                ring-sky-500
                hover:ring-2
                flex
                gap-2
                ">
                    <PlusIcon />
                    Add Column</button>
            </div>

        {/* Drag overlay, which is where the column is while being dragged*/}
        {createPortal(
        <DragOverlay>
            {activeColumn && (
            <ColumnContainer 
                column={activeColumn} 
                deleteColumn={deleteColumn} 
                updateColumn={updateColumn} 
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={deleteTask}
                tasks={tasks.filter((task) => task.columnID === activeColumn.id
                )}
                />
            )}
            {
                activeTask && <TaskCard 
                task={activeTask} 
                deleteTask={deleteTask} 
                updateTask={updateTask} 
                />
            }
        </DragOverlay>,
        // put the element inside the document body
        document.body
    )}
        </DndContext>
    </div>
  );

  function createTask(columnID: ID) {
    const newTask: Task = {
        id: generateID(),
        columnID,
        content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks,newTask]);
  }


  function deleteTask(id:ID) {
    const newTasks = tasks.filter(task => task.id !==id);
    setTasks(newTasks);
}

function updateTask(id: ID, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }


  function createNewColumn() {
    // define column to add and have it use the type of column
    const columnToAdd: Column = {
        // ID is defined by the generate ID function
        id: generateID(),
        title: `Column ${columns.length + 1}`
    }

    // set columns to all previous columns plus columns from columnToAdd function
    setColumns([...columns, columnToAdd]);
  }

//   Function to delete the columns
  function deleteColumn(id: ID) {
    const filteredColumns = columns.filter(col => col.id !== id);
    setColumns(filteredColumns);
  }

  function updateColumn(id: ID, title: string) {
    const newColumns = columns.map(col => {

        // if the id is not the one we want, return it as is
        if(col.id !==id) return col;
        // otherwise return new column
        return{ ...col, title };
    });

    setColumns(newColumns);
  }
//   Function for when a column is being dragged
  function onDragStart(event: DragStartEvent) {
      console.log("DRAG START", event);
      if (event.active.data.current?.type === "Column") {
          setActiveColumn(event.active.data.current.column);
          return;
      }
      if (event.active.data.current?.type === "Task") {
        setActiveTask(event.active.data.current.task);
        return;
      }
  }
//   Function for when dragging stops
function onDragEnd(event: DragEndEvent) {
    // When drag ends, remove drag overlay components
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    // Define variables for the column being dragged, and the column it is over
    const activeColumnID = active.id;
    const overColumnID = over.id;

    // If the IDs are identical, stop and do nothing
    if(activeColumnID === overColumnID)return;
    
    setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(col => col.id === activeColumnID);
        const overColumnIndex = columns.findIndex(col => col.id === overColumnID);

        // arrayMove from dnd, swap the active column index with over column index
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
    })
}
function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeID = active.id;
    const overID = over.id;

    // If the IDs are identical, stop and do nothing
    if(activeID === overID)return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    // Dropping a task over another task
if (isActiveATask && isOverATask) {
    setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeID);
        const overIndex = tasks.findIndex((t) => t.id === overID);

            tasks[activeIndex].columnID = tasks[overIndex].columnID;

        return arrayMove(tasks, activeIndex, overIndex);
    })
}

    // dropping a task over a column
    
}
}
// END OF KANBAN BOARD FUNCTION



// function to generate a random ID. This is OUTSIDE the KanbanBoard function
function generateID() {
    return Math.floor(Math.random() * 10001);
}

export default KanbanBoard