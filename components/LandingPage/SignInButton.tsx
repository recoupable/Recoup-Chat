import { usePrivy } from "@privy-io/react-auth";

const SignInButton = () => {
  const { login } = usePrivy();

  return (
    <button
      onClick={login}
      className="bg-white text-[#00309A] px-2 py-1 rounded-md text-[10px] font-medium hover:bg-opacity-90 transition-all duration-150 ease-in-out hover:shadow-sm"
      aria-label="Sign In"
    >
      Sign In
    </button>
  );
};

export default SignInButton;
