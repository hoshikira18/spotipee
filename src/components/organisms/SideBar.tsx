import { Box } from "@mantine/core";
import { Add, Category, Heart } from "iconsax-react";

function SideBar() {
    return (
        <div className="flex flex-col px-4 py-3 space-y-3 bg-zinc-800/60 rounded-lg overflow-y-scroll">
            <div className="p-3 rounded-md aspect-square flex items-center justify-center">
                <Category />
            </div>
            <Box className="bg-zinc-800/70 p-1 rounded-full aspect-square flex items-center justify-center">
                <Add />
            </Box>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
            <div className="bg-white p-3 rounded-md aspect-square flex items-center justify-center">
                <Heart size={20} color="green" />
            </div>
        </div>
    );
}

export default SideBar;
