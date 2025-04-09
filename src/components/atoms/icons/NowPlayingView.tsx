import type React from "react";

interface NowPlayingViewProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

const NowPlayingView: React.FC<NowPlayingViewProps> = ({
    size = 16,
    color = "currentColor",
    className = "",
    ...props
}) => {
    return (
        <svg
            role="img"
            aria-hidden="true"
            viewBox="0 0 16 16"
            width={size}
            height={size}
            fill={color}
            className={`${className}`}
            {...props}
        >
            <path d="M11.196 8 6 5v6l5.196-3z" />
            <path d="M15.002 1.75A1.75 1.75 0 0 0 13.252 0h-10.5a1.75 1.75 0 0 0-1.75 1.75v12.5c0 .966.783 1.75 1.75 1.75h10.5a1.75 1.75 0 0 0 1.75-1.75V1.75zm-1.75-.25a.25.25 0 0 1 .25.25v12.5a.25.25 0 0 1-.25.25h-10.5a.25.25 0 0 1-.25-.25V1.75a.25.25 0 0 1 .25-.25h10.5z" />
        </svg>
    );
};

export default NowPlayingView;
