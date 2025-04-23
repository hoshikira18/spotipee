import type { ReactNode } from "react";
import { cn } from "../../utils";
import SeeAllButton from "../atoms/SeeAllButton";

interface HomeSectionProps {
    title: string;
    children: ReactNode;
    className?: string;
    seeAllLink?: string;
}

function HomeSection({ title, seeAllLink, children, className }: HomeSectionProps) {
    return (
        <div className={cn("relative bg-zinc-900 h-60 rounded-md font-spotify", className)}>
            <div className="overflow-x-auto flex absolute left-0 right-0 flex-col bg-zinc-900/60 rounded-md p-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold hover:underline px-3">{title}</h2>
                    {seeAllLink && <SeeAllButton link={seeAllLink} />}
                </div>
                <div className="flex pb-2 overflow-x-scroll">{children}</div>
            </div>
        </div>
    );
}

export default HomeSection;
