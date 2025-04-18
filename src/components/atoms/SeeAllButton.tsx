import { Link } from "react-router-dom";

interface SeeAllButtonProps {
    title?: string;
    link: string;
}
function SeeAllButton({ title = "See all", link = "/" }: SeeAllButtonProps) {
    return (
        <Link to={link} className="text-sm text-zinc-400 hover:underline">
            {title}
        </Link>
    );
}

export default SeeAllButton;
