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
        <div className="-mx-4 md:mx-0">
          {/* Mobile view - Card style */}
          <div className="block md:hidden space-y-4">
            {properties.map((prop) => (
              <div key={prop.name} className="bg-gray-100 p-4 rounded mx-4">
                <div className="font-semibold mb-1">{prop.name}</div>
                <div className="text-sm text-gray-600 mb-2">
                  Type: {prop.type}
                </div>
                <div className="text-sm">{prop.description}</div>
              </div>
            ))}
          </div>
          {/* Desktop view - Table style */}
          <div className="hidden md:block">
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
      </div>
    </div>
  );
}
