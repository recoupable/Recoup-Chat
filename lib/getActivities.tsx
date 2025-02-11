import { Conversation } from "@/types/Chat";

const getActivities = (conversations: Array<Conversation>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const activities = conversations.reduce((acc: any, item: Conversation) => {
    const date = new Date(item.updated_at);
    const formattedDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const existingEntry: any = acc.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (entry: any) => entry.date === formattedDate,
    );
    if (existingEntry) {
      existingEntry.count++;
    } else {
      acc.push({ date: formattedDate, count: 1 });
    }
    return acc;
  }, []);

  return activities;
};

export default getActivities;
