import type React from "react";

interface PlayIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

const Play: React.FC<PlayIconProps> = ({
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
            className={`e-9800-icon e-9800-baseline ${className}`}
            {...props}
        >
            <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
        </svg>
    );
};

export default Play;
