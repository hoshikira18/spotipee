import type React from "react";

interface RepeatOneIconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

const RepeatOneIcon: React.FC<RepeatOneIconProps> = ({
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
            <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h.75v1.5h-.75A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75v-5ZM12.25 2.5a2.25 2.25 0 0 1 2.25 2.25v5A2.25 2.25 0 0 1 12.25 12H9.81l1.018-1.018a.75.75 0 0 0-1.06-1.06L6.939 12.75l2.829 2.828a.75.75 0 1 0 1.06-1.06L9.811 13.5h2.439A3.75 3.75 0 0 0 16 9.75v-5A3.75 3.75 0 0 0 12.25 1h-.75v1.5h.75Z" />
            <path d="m8 1.85.77.694H6.095V1.488c.697-.051 1.2-.18 1.507-.385.316-.205.51-.51.583-.913h1.32V8H8V1.85Z" />
            <path d="M8.77 2.544 8 1.85v.693h.77Z" />
        </svg>
    );
};

export default RepeatOneIcon;
