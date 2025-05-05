import { Loader } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

const LazyChart = ({
    Component,
    playlistId,
}: { Component: React.FC<{ playlistId: string }>; playlistId: string }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 },
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [playlistId]);

    useEffect(() => {
        setIsVisible(false);
    }, [playlistId]);

    if (!isVisible)
        return (
            <div ref={ref} className="h-screen flex items-center justify-center">
                <Loader />
            </div>
        );

    return <div ref={ref}>{isVisible && <Component playlistId={playlistId} />}</div>;
};

export default LazyChart;
