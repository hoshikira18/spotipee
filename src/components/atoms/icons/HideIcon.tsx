import type React from "react";

interface HideIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

const HideIcon: React.FC<HideIconProps> = ({
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
            <path d="M10.03 10.53a.75.75 0 1 1-1.06-1.06L10.44 8 8.97 6.53a.75.75 0 0 1 1.06-1.06l2 2a.75.75 0 0 1 0 1.06l-2 2Z" />
            <path d="M15 16a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14Zm-8.5-1.5v-13h8v13h-8Zm-1.5 0H1.5v-13H5v13Z" />
        </svg>
    );
};

export default HideIcon;
