import { Link } from "react-router-dom";

interface SeeAllButtonProps {
    link: string;
}
function SeeAllButton({ link = "/" }: SeeAllButtonProps) {
    return (
        <Link to={link} className="text-sm text-zinc-400 hover:underline">
            See all
        </Link>
    );
}

export default SeeAllButton;
