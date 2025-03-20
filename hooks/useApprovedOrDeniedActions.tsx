import { ACTION_EVENT } from "@/lib/consts";
import getActions from "@/lib/stack/getActions";
import trackAction from "@/lib/stack/trackAction";
import { useArtistProvider } from "@/providers/ArtistProvider";
import { useConversationsProvider } from "@/providers/ConversationsProvider";
import { useUserProvider } from "@/providers/UserProvder";
import { useCallback, useEffect, useMemo, useState } from "react";

const useApprovedOrDeniedActions = () => {
  const { selectedArtist } = useArtistProvider();
  const { address } = useUserProvider();
  const [actions, setActions] = useState<any>([]);
  const [stackEvents, setStackEvents] = useState<any>([]);

  const { conversations } = useConversationsProvider();

  const getExistingActions = useCallback(async () => {
    if (!selectedArtist?.account_id || !address) {
      setActions([]);
      return;
    }
    const events = await getActions(
      `${ACTION_EVENT}-${selectedArtist?.account_id}`,
      address,
    );
    setActions(events);
  }, [selectedArtist, address]);

  const getStackEvents = useCallback(() => {
    if (conversations.length) {
      setStackEvents([]);
    }
  }, [conversations]);

  const addExistingActions = (action: any) => {
    setActions([action, ...actions]);
    trackAction(address, action, selectedArtist?.account_id || "", true);
  };

  useEffect(() => {
    getExistingActions();
  }, [getExistingActions]);

  useEffect(() => {
    getStackEvents();
  }, [getStackEvents]);

  const existingActions = useMemo(() => {
    return [...stackEvents, ...actions].sort(
      (a, b) => b.timestamp - a.timestamp,
    );
  }, [stackEvents, actions]);

  return {
    existingActions,
    getExistingActions,
    addExistingActions,
  };
};

export default useApprovedOrDeniedActions;
