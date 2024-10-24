import { FAN_TYPE } from "@/types/fans";

const FanTable = ({ fans }: { fans: FAN_TYPE[] }) => {
  return (
    <div className="border-gray-700 border-[1px] rounded-md w-full p-2">
      <table className="w-full">
        <thead>
          <th className="text-xs text-left p-1">Name</th>
          <th className="text-xs text-left p-1">Coutry</th>
          <th className="text-xs text-left p-1">City</th>
        </thead>
        <tbody>
          {fans.map((fan, index) => (
            <tr key={index}>
              <td className="text-xs p-1">{fan.name}</td>
              <td className="text-xs p-1">{fan.country}</td>
              <td className="text-xs p-1">{fan.city}</td>
            </tr>
          ))}
          <tr>
            <td colSpan={3} className="text-center">
              ...
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FanTable;
