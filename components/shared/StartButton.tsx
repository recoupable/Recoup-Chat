import { Button } from "@/components/ui/button";

interface StartButtonProps {
  onClick?: () => void;
}

export function StartButton({ onClick }: StartButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="px-12 py-6 text-lg font-semibold hover:scale-105 transition-transform"
    >
      Start
    </Button>
  );
}
