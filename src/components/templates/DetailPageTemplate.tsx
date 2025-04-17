import { useRef } from "react";
import TrackServices from "../../services/TrackServices";
import { cn } from "../../utils";
import { Play } from "../atoms/icons";
import { useElementScroll } from "../../hooks/useElementScroll";
import AuthWrapper from "./AuthWrapper";

interface DetailPageTemplateProps {
    children?: React.ReactNode;
    className?: string;
    playButtonRef: React.RefObject<HTMLDivElement>;
    uris?: string[];
    title?: string;
}

function DetailPageTemplate({ children, playButtonRef, uris, title }: DetailPageTemplateProps) {
    const ref = useRef<HTMLDivElement>(null);
    const { top: currentScrollTop } = useElementScroll(ref);

    const isPlayButtonVisible = () => {
        if (!playButtonRef.current) {
            return false;
        }
        const headerHeight = 64;
        const topbarHeight = 64;
        return (
            playButtonRef.current.getBoundingClientRect().bottom < headerHeight + topbarHeight + 50
        );
    };

    const calOpacity = () => {
        if (!playButtonRef.current) {
            return 0;
        }
        const headerHeight = 64;
        const topbarHeight = 64;
        const scrollTop = currentScrollTop + headerHeight + topbarHeight;
        const opacity = Math.max(
            0,
            Math.min(1, (scrollTop - playButtonRef.current.offsetTop) / 50),
        );
        return opacity;
    };

    return (
        <AuthWrapper>
            <div
                ref={ref}
                className="relative bg-zinc-900 h-full rounded-md font-spotify overflow-y-scroll"
            >
                <div
                    className={cn(
                        "sticky top-0 right-0 left-0 z-10 py-2 px-3 bg-stone-900 transition-opacity",
                    )}
                    style={{ opacity: calOpacity() }}
                >
                    <div
                        className={cn(
                            "flex items-center transition-opacity duration-200",
                            isPlayButtonVisible() ? "opacity-100" : "opacity-0",
                        )}
                    >
                        <button
                            type="button"
                            className={cn(
                                "min-w-12 h-12 flex items-center justify-center bg-green-500 rounded-full hover:bg-green-400 hover:scale-105 text-black",
                            )}
                            onClick={() => {
                                if (!uris) return;
                                TrackServices.play(uris);
                            }}
                        >
                            <Play />
                        </button>
                        <span className={"text-3xl font-bold text-zinc-200 px-4"}>{title}</span>
                    </div>
                </div>
                {children}
            </div>
        </AuthWrapper>
    );
}

export default DetailPageTemplate;
