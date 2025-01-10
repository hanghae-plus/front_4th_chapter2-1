const eventManager = new Map();

function handleGlobalEvent(event: Event) {
  const eventType = event.type;
  const handlers = eventManager.get(eventType);

  const currentElement = event.target as HTMLElement;
  if (handlers.has(currentElement.id)) {
    const handler = handlers.get(currentElement.id);
    handler(event);
  }
}

export function setupEventListeners(root: HTMLElement) {
  eventManager.forEach((_, eventType) => {
    root.removeEventListener(eventType, handleGlobalEvent);
    root.addEventListener(eventType, handleGlobalEvent);
  });
}

export function addEvent(
  id: string,
  eventType: string,
  handler: (event: Event) => void
) {
  if (!eventManager.has(eventType)) {
    eventManager.set(eventType, new Map());
  }

  const handlerCache = eventManager.get(eventType);
  handlerCache.set(id, handler);
}

export function removeEvent(id: string, eventType: string) {
  if (!eventManager.has(eventType)) {
    return;
  }

  const handlerCache = eventManager.get(eventType);
  handlerCache.delete(id);
}
