import { Button, Group, Menu } from "@mantine/core";
import { ArrowCircleDown2, Link1, Spotify, User } from "iconsax-react";
import { Link } from "react-router-dom";
import { AUTH_URL } from "../../constants/auth";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ProfileButton from "../atoms/ProfileButton";
import MenuBurger from "../molecules/MenuBurger";
import SearchBar from "../molecules/SearchBar";

function Header() {
    const { data: currentUser, isFetching: isLoading } = useCurrentUser();

    return (
        <header className="relative h-16 flex items-center justify-between space-x-3 p-2">
            {/* Left section */}
            <div className="h-full flex items-center 2xl:justify-between w-2/3">
                <Link to={"/"} className="px-2 flex-none">
                    <Spotify size={40} variant="Bold" />
                </Link>
                <SearchBar className="w-auto md:w-2/3 xl:w-3/7 xl:px-5" />
            </div>

            {/* Right section */}
            <div className="flex items-center justify-end gap-2 flex-none w-2/3 md:w-auto">
                {!isLoading && !currentUser && (
                    <Group>
                        <ul className="hidden lg:flex items-center justify-between border-r-2 border-white/80 pr-4 space-x-2 font-spotify font-semibold text-[#9f9f9f]">
                            <li className="hover:scale-105 hover:text-white transition-all duration-150">
                                <Link to={"/"}>Premium</Link>
                            </li>
                            <li className="hover:scale-105 hover:text-white transition-all duration-150">
                                <Link to={"/"}>Support</Link>
                            </li>
                            <li className="hover:scale-105 hover:text-white transition-all duration-150">
                                <Link to={"/"}>Download</Link>
                            </li>
                        </ul>
                    </Group>
                )}
                <Button
                    variant="transparent"
                    leftSection={<ArrowCircleDown2 size={20} />}
                    classNames={{
                        root: "hover:!text-white hover:scale-105 transition-all duration-150 text-sm text-gray-600",
                    }}
                    c={"#9f9f9f"}
                >
                    Install App
                </Button>
                {isLoading ? (
                    <User />
                ) : (
                    <>
                        {currentUser ? (
                            <ProfileButton currentUser={currentUser} />
                        ) : (
                            <div className="flex items-center">
                                <Button
                                    variant="transparent"
                                    c={"#9f9f9f"}
                                    className="hover:scale-105 hover:!text-white transition-all duration-150"
                                >
                                    Sign up
                                </Button>
                                <Button
                                    component={"a"}
                                    href={AUTH_URL}
                                    size="lg"
                                    fz={16}
                                    fw={700}
                                    px={32}
                                    py={8}
                                    color="white"
                                    c={"black"}
                                    className="hover:scale-105 transition-all duration-150 hover:!bg-zinc-200"
                                >
                                    Log in
                                </Button>
                                <MenuBurger className="lg:hidden">
                                    <Menu.Item
                                        rightSection={<Link1 />}
                                        className="group"
                                        component={Link}
                                        to={"/test"}
                                    >
                                        <span className="w-full font-semibold group-hover:underline">
                                            Premium
                                        </span>
                                    </Menu.Item>
                                    <Menu.Item
                                        rightSection={<Link1 />}
                                        className="group"
                                        component={Link}
                                        to={"/test"}
                                    >
                                        <span className="w-full font-semibold group-hover:underline">
                                            Support
                                        </span>
                                    </Menu.Item>
                                    <Menu.Item
                                        rightSection={<Link1 />}
                                        className="group"
                                        component={Link}
                                        to={"/test"}
                                    >
                                        <span className="w-full font-semibold group-hover:underline">
                                            Download
                                        </span>
                                    </Menu.Item>
                                </MenuBurger>
                            </div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;
