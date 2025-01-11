export function AuthSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
      <p className="mb-4">
        To use the AgentKit API, you&apos;ll need a campaign ID. You can find
        your campaign ID in{" "}
        <a href="/artists" className="text-blue-500 hover:text-blue-600">
          Artist Settings → Campaign ID
        </a>
        .
      </p>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-yellow-700">
          Keep your campaign ID secure and never share it publicly. If you
          believe your campaign ID has been compromised, you can generate a new
          one in your dashboard.
        </p>
      </div>
    </section>
  );
}
