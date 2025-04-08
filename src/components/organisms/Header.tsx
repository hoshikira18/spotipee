import { Button, Group, Menu } from "@mantine/core";
import { ArrowCircleDown2, Link1, Spotify, User } from "iconsax-react";
import { Link } from "react-router-dom";
import { AUTH_URL } from "../../constants/auth";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import ProfileButton from "../atoms/ProfileButton";
import MenuBurger from "../molecules/MenuBurger";
import SearchBar from "../molecules/SearchBar";

function Header() {
    const { data: currentUser, isLoading } = useCurrentUser();

    return (
        <header className="h-16 flex items-center justify-between p-2">
            <div className="h-full flex items-center">
                <Link to={"/"} className="px-2 flex-none">
                    <Spotify size={40} variant="Bold" />
                </Link>
                <div className="h-full flex items-center space-x-2">
                    <Link
                        to={"/"}
                        className="p-3 bg-zinc-800 h-full aspect-square flex items-center justify-center rounded-full"
                    >
                        <svg
                            fill="white"
                            data-encore-id="icon"
                            role="img"
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                        >
                            <path d="M13.5 1.515a3 3 0 0 0-3 0L3 5.845a2 2 0 0 0-1 1.732V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6h4v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V7.577a2 2 0 0 0-1-1.732l-7.5-4.33z" />
                        </svg>
                    </Link>
                    <SearchBar />
                </div>
            </div>
            <div className="flex items-center gap-2 flex-none">
                {isLoading ? (
                    <User />
                ) : (
                    <>
                        {currentUser ? (
                            <ProfileButton currentUser={currentUser} />
                        ) : (
                            <div className="flex items-center">
                                <Group c={"gray.6"}>
                                    <ul
                                        color="gray.6"
                                        className="hidden lg:flex items-center justify-between border-r-2 border-white/80 pr-2 space-x-2 font-spotify font-semibold"
                                    >
                                        <li className="hover:scale-105 transition-all duration-150">
                                            <Link to={"/"}>Premium</Link>
                                        </li>
                                        <li className="hover:scale-105 transition-all duration-150">
                                            <Link to={"/"}>Support</Link>
                                        </li>
                                        <li className="hover:scale-105 transition-all duration-150">
                                            <Link to={"/"}>Download</Link>
                                        </li>
                                    </ul>
                                </Group>
                                <Button
                                    variant="transparent"
                                    c={"gray.6"}
                                    leftSection={<ArrowCircleDown2 size={20} />}
                                    className="hover:scale-105 transition-all duration-150"
                                >
                                    Install App
                                </Button>
                                <Button
                                    variant="transparent"
                                    c={"gray.6"}
                                    className="hover:scale-105 transition-all duration-150"
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
                                    className="hover:scale-105 transition-all duration-150"
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
