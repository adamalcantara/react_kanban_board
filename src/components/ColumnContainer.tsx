import { Column, ID } from "../types";
import TrashIcon from "../icons/TrashIcon";

// Define the column prop
interface Props {
    column: Column;
    deleteColumn: (id: ID) => void;
}

function ColumnContainer(props: Props) {
    // Set column equal to props
    const { column, deleteColumn } = props;

  return (
    // Div for each column
    <div className="
    bg-columnBackgroundColor
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    ">
        {/* Column header */}
        <div className="
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
