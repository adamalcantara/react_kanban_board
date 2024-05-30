import { Column, ID } from "../types";
import TrashIcon from "../icons/TrashIcon";
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities"; 

// Define the column prop
interface Props {
    column: Column;
    deleteColumn: (id: ID) => void;
}

function ColumnContainer(props: Props) {
    // Set column equal to props
    const { column, deleteColumn } = props;

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id:column.id,
        data:{
            type: "Column",
            column,
        }
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    // If a column is being dragged, use this styling for the column's background state
    if (isDragging) {
        return <div ref={setNodeRef} style={style} 
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
        ></div>
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
                {column.title}
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
        <div className="flex flex-grow">Content</div>
        {/* Column footer */}
        <div>Footer</div>
        </div>
  )
}

export default ColumnContainer;
