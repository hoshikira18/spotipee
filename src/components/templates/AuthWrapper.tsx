import { useAuth } from "../../hooks/useAuth";
import UnAuthHomePage from "../pages/UnAuthHomePage";

interface AuthWrapperProps {
    children: React.ReactNode;
}

function AuthWrapper({ children }: AuthWrapperProps) {
    const { isAuth, isLoading } = useAuth(null);

    if (!isLoading && !isAuth) return <UnAuthHomePage />;
    return children;
}

export default AuthWrapper;
