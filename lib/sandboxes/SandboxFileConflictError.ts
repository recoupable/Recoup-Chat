export class SandboxFileConflictError extends Error {
  constructor() {
    super(
      "This file changed after you opened it. Your replacement has been kept.",
    );
    this.name = "SandboxFileConflictError";
  }
}
