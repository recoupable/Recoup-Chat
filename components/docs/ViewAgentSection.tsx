export function ViewAgentSection() {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">View Your Agent</h2>
      <p className="mb-4">
        You can view and manage your agent through the Recoup dashboard. Visit
        your{" "}
        <a
          href="/dashboard/agents"
          className="text-blue-500 hover:text-blue-600"
        >
          agents page
        </a>{" "}
        to see your agent&apos;s performance, adjust settings, and monitor
        usage.
      </p>
    </section>
  );
}
