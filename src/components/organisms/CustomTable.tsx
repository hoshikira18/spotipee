import { Table } from "@mantine/core";
import { cn } from "../../utils";

interface CustomTableProps {
    children?: React.ReactNode;
}
interface HeadProps {
    children?: React.ReactNode;
}
interface BodyProps {
    children?: React.ReactNode;
}
interface RowProps {
    children?: React.ReactNode;
    className?: string;
}
interface HeaderCellProps {
    children?: React.ReactNode;
}
interface CellProps {
    children?: React.ReactNode;
}

const CustomTable = ({ children, ...props }: CustomTableProps) => {
    return (
        <Table striped highlightOnHover withTableBorder withColumnBorders {...props}>
            {children}
        </Table>
    );
};

const Head = ({ children }: HeadProps) => <Table.Thead>{children}</Table.Thead>;

const Body = ({ children }: BodyProps) => <Table.Tbody>{children}</Table.Tbody>;

const Row = ({ children, className }: RowProps) => (
    <Table.Tr className={cn(className)}>{children}</Table.Tr>
);

const HeaderCell = ({ children }: HeaderCellProps) => <Table.Th>{children}</Table.Th>;

const Cell = ({ children }: CellProps) => <Table.Td>{children}</Table.Td>;

CustomTable.Head = Head;
CustomTable.Body = Body;
CustomTable.Row = Row;
CustomTable.HeaderCell = HeaderCell;
CustomTable.Cell = Cell;

export default CustomTable;
