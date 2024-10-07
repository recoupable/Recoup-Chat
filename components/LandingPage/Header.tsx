import { usePrivy } from "@privy-io/react-auth";
import SignInButton from "./SignInButton";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { authenticated } = usePrivy();

  return (
    <header className="flex justify-end items-center p-3 sm:p-4">
      {authenticated ? <LogoutButton /> : <SignInButton />}
    </header>
  );
};

export default Header;
