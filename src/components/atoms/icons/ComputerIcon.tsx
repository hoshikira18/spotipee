import type React from "react";

interface ComputerIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

const ComputerIcon: React.FC<ComputerIconProps> = ({
    size = 24,
    color = "currentColor",
    className = "",
    ...props
}) => {
    return (
        <svg
            role="presentation"
            aria-hidden="true"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            fill={color}
            className={`e-9812-icon e-9812-baseline ${className}`}
            {...props}
        >
            <path d="M0 21a1 1 0 0 1 1-1h22a1 1 0 1 1 0 2H1a1 1 0 0 1-1-1zM3 5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V5zm3-1a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H6z" />
        </svg>
    );
};

export default ComputerIcon;
