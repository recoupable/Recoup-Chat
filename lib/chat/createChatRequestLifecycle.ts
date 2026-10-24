/** Coordinates preparation and HTTP admission independently of the SDK reader. */
export function createChatRequestLifecycle() {
  const operations = new Set<ReturnType<typeof begin>>();
  let unknownAdmission = false;
  function begin() {
    const controller = new AbortController();
    const readerController = new AbortController();
    let dispatched = false;
    let settled = false;
    let resolveAdmission!: () => void;
    const admission = new Promise<void>((resolve) => {
      resolveAdmission = resolve;
    });
    const operation = {
      controller,
      readerController,
      admission,
      markUnknown: () => {
        if (operations.has(operation) && !controller.signal.aborted)
          unknownAdmission = true;
      },
      dispatched: () => {
        dispatched = true;
      },
      settle: () => {
        if (!settled) {
          settled = true;
          resolveAdmission();
        }
      },
      cancelPreparation: () => {
        if (!dispatched) {
          controller.abort();
          operation.settle();
        }
      },
      dispose: () => {
        operation.settle();
        operations.delete(operation);
      },
    };
    operations.add(operation);
    return operation;
  }
  return {
    begin,
    hasUnknownAdmission: () => unknownAdmission,
    confirmStopped: () => {
      unknownAdmission = false;
    },
    detachReaders: () =>
      operations.forEach((operation) => operation.readerController.abort()),
    cancelPreparation: () =>
      operations.forEach((operation) => operation.cancelPreparation()),
    waitForAdmission: () =>
      Promise.all([...operations].map((operation) => operation.admission)),
    cancelAll: () => {
      unknownAdmission = false;
      operations.forEach((operation) => {
        operation.controller.abort();
        operation.dispose();
      });
    },
  };
}

export type ChatRequestLifecycle = ReturnType<
  typeof createChatRequestLifecycle
>;

/** Local callbacks travel in SDK metadata, never in the serialized request body. */
export interface ChatAdmissionMetadata {
  isCurrent: () => boolean;
  onAccepted: (ids: { chatId: string; sessionId?: string }) => void;
  onRejected: (error: Error & { status?: number }) => void;
}
