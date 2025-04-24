import type React from "react";

interface PhoneIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

const PhoneIcon: React.FC<PhoneIconProps> = ({
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
            <path d="M5 5a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5zm3-1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H8z" />
            <path d="M13.25 16.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z" />
        </svg>
    );
};

export default PhoneIcon;
