interface StartButtonProps {
  onClick?: () => void;
}

export function StartButton({ onClick }: StartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded-md border-[1px] border-grey"
    >
      Start
    </button>
  );
}
