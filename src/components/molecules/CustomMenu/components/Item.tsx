function Item({ children }: { children: React.ReactNode }) {
    return <li className="py-1 px-3 hover:bg-zinc-700 rounded">{children}</li>;
}
export default Item;
