import { LoaderCircle, TvMinimalPlay } from "lucide-react";

const Thinking = () => (
  <div className="flex gap-2 w-full max-w-3xl mx-auto px-3 items-center">
    <div className="size-fit">
      <TvMinimalPlay className="h-6 w-6" />
    </div>
    <p>is thinking...</p>
    <LoaderCircle className="h-4 w-4 animate-spin" />
  </div>
);

export default Thinking;
