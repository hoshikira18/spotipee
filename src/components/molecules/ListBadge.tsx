import { Badge } from "@mantine/core";

interface ListBadgeProps {
    items: string[];
}
function ListBadge({ items }: ListBadgeProps) {
    return (
        <div className="space-x-2">
            {items?.map((item) => (
                <Badge variant="light" key={item}>
                    <span className="hover:underline">{item}</span>
                </Badge>
            ))}
        </div>
    );
}

export default ListBadge;
