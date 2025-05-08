import { useEffect, useRef, useState } from "react";
import { cn } from "../../../utils";
import { ArrowDown2, TickCircle } from "iconsax-react";

interface CustomSelectProps {
    data: {
        value: string;
        label: string;
    }[];
    defaultValue: string;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    disabled?: boolean;
    className?: string;
}

function CustomSelect({
    data,
    defaultValue,
    value,
    onChange,
    placeholder,
    disabled = false,
    className = "",
}: CustomSelectProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue);
        setIsOpen(false);
        setSelectedValue(selectedValue);
    };

    return (
        <div ref={ref} className={cn("relative", disabled && "pointer-events-none")}>
            {/* Select trigger */}
            <div
                className={cn(
                    "relative z-40 bg-zinc-700/20 border border-zinc-700/60 hover:border-zinc-600 rounded-md px-4 py-2 cursor-pointer transition-all flex items-center justify-between space-x-2",
                    disabled && "pointer-events-none",
                    className,
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <span className="text-sm text-zinc-200 select-none">
                    {value ? data.find((item) => item.value === value)?.label : placeholder}
                </span>
                <button
                    type="button"
                    className={cn(
                        "text-zinc-400 transition-all duration-500",
                        isOpen && "rotate-180",
                    )}
                >
                    <ArrowDown2 size={16} />
                </button>
            </div>

            {/* Select options */}
            <div className="absolute top-full left-0 w-full">
                {isOpen && (
                    <div className="fade-in absolute top-full left-0 w-full bg-zinc-800 border border-zinc-700/60 shadow-sm rounded-md mt-1 z-30">
                        {data.map((item, index) => (
                            <div
                                key={item.value}
                                className="px-4 py-2 hover:bg-zinc-600 cursor-pointer flex items-center space-x-2 fade-in"
                                onClick={() => handleSelect(item.value)}
                                style={{
                                    animationDuration: `0.${1 + index}s`,
                                }}
                            >
                                {selectedValue === item.value && <TickCircle size={16} />}
                                <span className="text-sm text-zinc-200 select-none">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CustomSelect;
