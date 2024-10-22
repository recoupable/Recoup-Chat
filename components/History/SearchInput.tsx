import { SearchIcon } from "lucide-react";

const SearchInput = () => {
  return (
    <div className="border border-gray-700 rounded-md flex gap-2 p-2 w-full mx-auto max-w-3xl">
      <SearchIcon />
      <input
        type="text"
        placeholder="Search for a chat..."
        className="!outline-none !border-none !bg-transparent"
      />
    </div>
  );
};

export default SearchInput;
