import { useRef } from "react";
import { cn } from "../../../utils";
import { customModals } from "./CustomModalProvider";

export interface CustomModalProps {
    modalId: string;
    title?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
    withOverlay?: boolean;
    children?: React.ReactNode;
    center?: boolean;
}

function CustomModal({
    modalId,
    title,
    size = "xl",
    withOverlay = true,
    children,
}: CustomModalProps) {
    const ref = useRef<HTMLDivElement>(null);

    // Handle click outside the modal to close it
    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            customModals.close(modalId);
        }
    };

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
                    "bg-zinc-800 rounded-lg shadow-lg p-4 min-h-40  overflow-hidden",
                    `w-${size}`,
                )}
                ref={ref}
            >
                <ModalTitle title={title} />
                <ModalContent>{children}</ModalContent>
            </div>
        </div>
    );
}

export default CustomModal;

const ModalTitle = ({ title }: { title?: string }) => {
    if (!title) return null;
    return <div className="text-lg font-semibold text-white mb-4">{title}</div>;
};

const ModalContent = ({ children }: { children: React.ReactNode }) => {
    return <div className="overflow-y-scroll max-h-[calc(100vh-8rem)]">{children}</div>;
};
