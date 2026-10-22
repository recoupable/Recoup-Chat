// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TasksList from "@/components/TasksPage/TasksList";
import type { Task } from "@/lib/tasks/getTasks";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

vi.mock("@/providers/UserProvder", () => ({
  useUserProvider: () => ({ userData: { account_id: "acct-test" } }),
}));

vi.mock("@/hooks/useArtistImage", () => ({
  default: () => ({ imageUrl: null, artistName: null }),
}));
vi.mock("@/hooks/useUpdateScheduledAction", () => ({
  useUpdateScheduledAction: () => ({ updateAction: vi.fn(), isLoading: false }),
}));
vi.mock("@/hooks/useDeleteScheduledAction", () => ({
  useDeleteScheduledAction: () => ({ deleteAction: vi.fn(), isLoading: false }),
}));

const task = (id: string, title: string) =>
  ({ id, title, schedule: "0 9 * * *", enabled: true }) as unknown as Task;

describe("TasksList", () => {
  it("links every row to its task page instead of opening a popup", () => {
    render(
      <TasksList
        tasks={[task("task-a", "Weekly report"), task("task-b", "Daily brief")]}
        isLoading={false}
        isError={false}
      />,
    );

    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/tasks/task-a",
      "/tasks/task-b",
    ]);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen
        .getAllByRole("button", { name: /Task options for/ })
        .every((button) => button.closest("a") === null),
    ).toBe(true);
  });
});
