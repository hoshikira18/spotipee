import type React from "react";

interface MoreIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

const MoreIcon: React.FC<MoreIconProps> = ({
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
            <path d="M3 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm6.5 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM16 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
        </svg>
    );
};

export default MoreIcon;
