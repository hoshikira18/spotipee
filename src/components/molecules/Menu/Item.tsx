import type { ReactNode } from "react"

function Item({ children }: { children: ReactNode }) {
    return (
        <li className=" hover:bg-zinc-200 hover:text-black px-3 py-1 rounded cursor-pointer flex items-center w-full">{children}</li>
    )
}

export default Item