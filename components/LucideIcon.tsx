import { icons } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const LucideIcon = ({ name, color, size }: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icons = icons as any;
  const LucideIcon = Icons[name];

  return <LucideIcon color={color} size={size} />;
};

export default LucideIcon;
