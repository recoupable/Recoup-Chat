import { ICONS } from "./consts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSegmentsIcons = async (fanSegments: any) => {
  try {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const segments = fanSegments.map((segment: any) => Object.keys(segment)[0]);

    const response = await fetch(`/api/segments/icons`, {
      method: "POST",
      body: JSON.stringify(segments),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const fanSegmentsWithIcons = fanSegments.map((segment: any) => {
      const iconName = data.data[`${Object.keys(segment)[0]}`];
      const icon = ICONS.find((name: string) => name.includes(iconName));
      return {
        name: Object.keys(segment)[0],
        icon: icon || "",
        count: Object.values(segment)[0],
      };
    });

    return fanSegmentsWithIcons;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getSegmentsIcons;
