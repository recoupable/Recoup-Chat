import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const useTrackEmail = () => {
  const searchParams = useSearchParams();
  const [trackId, setTrackId] = useState("");

  useEffect(() => {
    const init = async () => {
      const email = searchParams.get("email");
      if (!email) return;
      const response = await fetch(
        `/api/email?email=${encodeURIComponent(email)}`,
      );
      const data = await response.json();

      setTrackId(data.id);
    };
    if (!searchParams) return;
    init();
  }, [searchParams]);

  return {
    trackId,
  };
};

export default useTrackEmail;
