// Define an ID as being a string or a number
export type ID = string | number;

// Export the type of column as an ID and a string
export type Column = {
    id: ID;
    title: string;
}