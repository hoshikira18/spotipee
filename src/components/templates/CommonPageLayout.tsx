import { Outlet } from "react-router-dom";

function CommonPageLayout() {
    return (
        <div className="h-full overflow-y-scroll bg-zinc-900">
            <Outlet />
            <footer className="">Footer</footer>
        </div>
    );
}

export default CommonPageLayout;
