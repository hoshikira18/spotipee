import { useRef } from "react";
import { cn } from "../../../utils";
import { customModals } from "./CustomModalProvider";
import { CloseButton } from "@mantine/core";

export interface CustomModalProps {
    modalId: string;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | string;
    withOverlay?: boolean;
    children?: React.ReactNode;
    center?: boolean;
    fullScreen?: boolean;
}

function CustomModal({
    modalId,
    title,
    size = "xl",
    withOverlay = true,
    fullScreen = false,
    children,
}: CustomModalProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Handle click outside the modal to close it
    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            customModals.close(modalId);
        }
    };

    const validSizes = ["sm", "md", "lg", "xl", "2xl", "3xl", "4xl", "5xl", "6xl"];
    const modalSizeClass = validSizes.includes(size) ? `w-${size} max-w-${size}` : size;
    const fullScreenClass =
        fullScreen && "w-screen h-screen max-w-screen max-h-screen rounded-none shadow-none";

    return (
        <div
            className={cn(
                "fixed inset-0 flex justify-center items-center z-50 shadow-md",
                withOverlay && "bg-black/30",
            )}
            onClick={(e) => handleClickOutside(e.nativeEvent)}
        >
            <div
                className={cn(
                    "fade-in",
                    "bg-zinc-800 rounded-lg shadow-lg p-4 min-h-40 overflow-hidden",
                    modalSizeClass,
                    fullScreenClass,
                )}
                style={{
                    width: size,
                    maxWidth: size,
                }}
                ref={ref}
            >
                <ModalTitle title={title} onClose={() => customModals.close(modalId)} />
                <ModalContent>{children}</ModalContent>
            </div>
        </div>
    );
}

export default CustomModal;

const ModalTitle = ({ title, onClose }: { title?: string; onClose: () => void }) => {
    if (!title) return null;
    return (
        <div className="mb-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold text-white">{title}</h1>
            <CloseButton onClick={onClose} />
        </div>
    );
};

const ModalContent = ({ children }: { children: React.ReactNode }) => {
    return <div className="overflow-y-scroll max-h-[calc(100vh-8rem)]">{children}</div>;
};
