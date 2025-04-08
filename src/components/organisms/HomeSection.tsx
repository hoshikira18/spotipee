import type { ReactNode } from "react";

interface HomeSectionProps {
    title: string;
    children: ReactNode;
}

function HomeSection({ title, children }: HomeSectionProps) {
    return (
        <div className="">
            <h2 className="text-xl font-semibold hover:underline px-3">Recently Played</h2>
            <div className="flex overflow-x-scroll pb-2">{children}</div>
        </div>
    );
}

export default HomeSection;
