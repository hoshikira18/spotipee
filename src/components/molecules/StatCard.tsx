import { Text } from "@mantine/core";

interface StatCardProps {
    total: string;
}
function StatCard({ total }: StatCardProps) {
    return (
        <div className="border rounded-md p-3">
            <Text>Total</Text>
            <Text fz={"h3"} fw={"bold"}>
                {total}
            </Text>
        </div>
    );
}

export default StatCard;
