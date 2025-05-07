interface StatCardProps {
    total: string;
}
function StatCard({ total }: StatCardProps) {
    return (
        <div className="border rounded-md p-3">
            <span className="text-sm">Total</span>
            <span className="block font-semibold text-lg">{total}</span>
        </div>
    );
}

export default StatCard;
