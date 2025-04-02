import type { User } from "../../types";
import { getImage } from "../../utils";

type ProfileButton = {
    currentUser: User;
};

function ProfileButton({ currentUser }: ProfileButton) {
    const image = getImage(64, currentUser?.images);
    return (
        <div className="bg-purple-800 w-full aspect-square rounded-full flex items-center justify-center overflow-hidden">
            {image ? (
                <img src={image} alt="user-image" />
            ) : (
                <span>{currentUser?.display_name.charAt(0)}</span>
            )}
        </div>
    );
}

export default ProfileButton;
