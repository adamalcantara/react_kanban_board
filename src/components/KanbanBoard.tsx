import PlusIcon from "../icons/PlusIcon";
import { useMemo, useState } from "react";
// import the types column defined in its file
import { Column, ID } from "../types";
import ColumnContainer from "./ColumnContainer";
import { DndContext, DragStartEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";

function KanbanBoard() {
    // define columns and set columns and have them set to an empty array, using the type defined in the file
    const [columns, setColumns] = useState<Column[]>([]);
    // array of columns ID which maps over columns, recalculate the array every time the columns array changes
    const columnsID = useMemo(() => columns.map((col) => col.id), [columns]);
    console.log(columns);

    // State for column that is being dragged, has state of column or null just in case there is nothing
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);

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
        <DndContext onDragStart={onDragStart}>
            <div className="m-auto flex gap-4">
                <div className="flex gap-4">
                <SortableContext items={columnsID}>
                    {columns.map( (col) => (
                    <ColumnContainer key={col.id} column={col} deleteColumn={deleteColumn}/>
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
        </DndContext>
    </div>
  );

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
  function onDragStart(event: DragStartEvent) {
      console.log("DRAG START", event);
      if (event.active.data.current?.type === "Column") {
          setActiveColumn(event.active.data.current.column);
          return;
      }
  }
}


// function to generate a random ID
function generateID() {
    return Math.floor(Math.random() * 10001);
}

export default KanbanBoard