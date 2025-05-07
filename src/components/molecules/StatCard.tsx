interface StatCardProps {
    total: string;
}
function StatCard({ total }: StatCardProps) {
    return (
        <div className="border rounded-md p-3">
            <span>Total</span>
            <span className="block font-semibold text-2xl">{total}</span>
        </div>
    );
}

export default StatCard;
