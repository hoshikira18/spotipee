import type { ReactNode } from "react";

interface HomeSectionProps {
    title: string;
    children: ReactNode;
}

function HomeSection({ title, children }: HomeSectionProps) {
    return (
        <div className="w-full">
            <h2 className="text-xl font-semibold hover:underline px-3">{title}</h2>
            <div className="flex pb-2 overflow-x-scroll">{children}</div>
        </div>
    );
}

export default HomeSection;
