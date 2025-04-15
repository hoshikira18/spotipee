import { useEffect, useState } from "react";

interface ScrollPosition {
    top: number;
    left: number;
}

export function useElementScroll(elementRef: React.RefObject<HTMLElement>) {
    const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({
        top: 0,
        left: 0,
    });

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const handleScroll = () => {
            setScrollPosition({
                top: element.scrollTop,
                left: element.scrollLeft,
            });
        };

        element.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            element.removeEventListener("scroll", handleScroll);
        };
    }, [elementRef]);

    return scrollPosition;
}
