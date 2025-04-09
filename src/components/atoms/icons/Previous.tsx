import type React from "react";

interface PreviousIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

const Previous: React.FC<PreviousIconProps> = ({
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
            <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
        </svg>
    );
};

export default Previous;
