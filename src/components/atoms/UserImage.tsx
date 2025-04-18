import { Edit2 } from "iconsax-react";
import { cn } from "../../utils";

interface UserImageProps {
    imageUrl: string;
    alt: string;
    onClick?: () => void;
    className?: string;
}

function UserImage({ className, imageUrl, alt, onClick }: UserImageProps) {
    return (
        <div className={cn("group relative h-full overflow-hidden", className)}>
            <img
                src={imageUrl}
                alt={alt}
                className="h-full aspect-square object-cover rounded-md shadow-lg"
            />
            <button
                type="button"
                onClick={onClick}
                className="absolute inset-0 invisible group-hover:visible flex items-center justify-center bg-black/50 transition-all duration-150 rounded-md"
            >
                <Edit2 size={60} />
            </button>
        </div>
    );
}

export default UserImage;
