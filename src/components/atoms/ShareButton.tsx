import { useClipboard } from "@mantine/hooks";
import BoxArrowIcon from "./icons/ShareIcon";
import { cn } from "../../utils";
import { notifications } from "@mantine/notifications";

interface ShareButtonProps {
    content: string;
    icon?: React.ReactNode;
    className?: string;
}

function ShareButton({ content, icon, className = "" }: ShareButtonProps) {
    const clipboard = useClipboard({ timeout: 10000 });

    return (
        <button
            type="button"
            onClick={() => {
                clipboard.copy(content);
                notifications.show({
                    message: "Copied to clipboard",
                    color: "green",
                });
            }}
            className={cn("text-zinc-300", className)}
        >
            {icon || <BoxArrowIcon size={24} />}
        </button>
    );
}

export default ShareButton;
