import { Column } from "../types";

interface Props {
    column: Column;
}

function ColumnContainer(props: Props) {
    const {column} = props;
  return (
    <div className="
    bg-columnBackgroundColor
    w-[350px]
    h-[500px]
    max-h-[500px]
    rounded-md
    flex
    flex-col
    ">
        {/* Column Title */}
        {column.title}
        {/* Column task container */}
        <div className="flex flex-grow">Content</div>
        {/* Column footer */}
        <div>Footer</div>
        </div>
  )
}

export default ColumnContainer;
