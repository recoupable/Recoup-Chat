import { X } from "lucide-react";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";

interface RenameChatModalProps {
  isOpen: boolean;
  isMobile: boolean;
  newTopic: string;
  setNewTopic: (topic: string) => void;
  handleRename: () => void;
  setIsRenameModalOpen: (isOpen: boolean) => void;
}

const RenameChatModal = ({ 
  isOpen,
  isMobile,
  newTopic,
  setNewTopic,
  handleRename,
  setIsRenameModalOpen
}: RenameChatModalProps) => {
  // State for input validation
  const [inputError, setInputError] = useState<string | null>(null);
  
  // Validate input on change
  useEffect(() => {
    if (newTopic.trim().length === 0) {
      setInputError("Name cannot be empty");
    } else if (newTopic.length > 50) {
      setInputError("Name is too long (maximum 50 characters)");
    } else if (/[<>]/.test(newTopic)) {
      setInputError("Name contains invalid characters");
    } else {
      setInputError(null);
    }
  }, [newTopic]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Only proceed if input is valid
    if (newTopic.trim() && !inputError) {
      handleRename();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any problematic URL characters
    const sanitizedValue = e.target.value.replace(/[^\w\s\-.,!?@#$%&*()[\]{}]/g, '');
    setNewTopic(sanitizedValue);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-[#6262626b] bg-[url('/circle.png')] bg-center bg-cover px-3 md:px-0">
      <div className="relative bg-white rounded-md shadow-lg w-full max-w-md p-4 md:p-6">
        <button
          type="button"
          className="absolute top-3 right-3"
          onClick={() => setIsRenameModalOpen(false)}
          aria-label="Close rename dialog"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        <h2 className="text-lg font-semibold mb-3">Rename Chat</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newTopic}
            onChange={handleInputChange}
            className={`w-full border ${inputError ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 mb-1`}
            placeholder="Enter new name"
          />
          {inputError && (
            <p className="text-red-500 text-sm mb-3">{inputError}</p>
          )}
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRenameModalOpen(false)}
              className={isMobile ? 'text-base py-5 px-6' : ''}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!newTopic.trim() || !!inputError}
              className={isMobile ? 'text-base py-5 px-6' : ''}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameChatModal; 