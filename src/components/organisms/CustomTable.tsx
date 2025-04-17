import { Table, type TableProps } from "@mantine/core";

interface CustomTableProps extends TableProps {
    children?: React.ReactNode;
}
interface HeadProps extends React.ComponentPropsWithoutRef<"thead"> {
    children?: React.ReactNode;
}
interface BodyProps extends React.ComponentPropsWithoutRef<"tbody"> {
    children?: React.ReactNode;
}
interface RowProps extends React.ComponentPropsWithoutRef<"tr"> {
    children?: React.ReactNode;
}
interface HeaderCellProps extends React.ComponentPropsWithoutRef<"th"> {
    children?: React.ReactNode;
}
interface CellProps extends React.ComponentPropsWithoutRef<"td"> {
    children?: React.ReactNode;
}

const CustomTable = ({ children, ...props }: CustomTableProps) => {
    return (
        <Table highlightOnHover {...props}>
            {children}
        </Table>
    );
};

const Head = ({ children, ...props }: HeadProps) => (
    <Table.Thead {...props}>{children}</Table.Thead>
);

const Body = ({ children, ...props }: BodyProps) => (
    <Table.Tbody {...props}>{children}</Table.Tbody>
);

const Row = ({ children, ...props }: RowProps) => (
    <Table.Tr
        {...props}
        style={{
            border: "none",
        }}
    >
        {children}
    </Table.Tr>
);

const HeaderCell = ({ children, ...props }: HeaderCellProps) => (
    <Table.Th {...props}>{children}</Table.Th>
);

const Cell = ({ children, ...props }: CellProps) => <Table.Td {...props}>{children}</Table.Td>;

CustomTable.Head = Head;
CustomTable.Body = Body;
CustomTable.Row = Row;
CustomTable.HeaderCell = HeaderCell;
CustomTable.Cell = Cell;

export default CustomTable;
