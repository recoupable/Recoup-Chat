interface PropertyRow {
  readonly name: string;
  readonly type: string;
  readonly description: string;
}

interface ResponseTableProps {
  properties: readonly PropertyRow[];
}

export function ResponseTable({ properties }: ResponseTableProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Response Object</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-left p-4 border">Property</th>
              <th className="text-left p-4 border">Type</th>
              <th className="text-left p-4 border">Description</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr key={prop.name}>
                <td className="p-4 border">{prop.name}</td>
                <td className="p-4 border">{prop.type}</td>
                <td className="p-4 border">{prop.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
