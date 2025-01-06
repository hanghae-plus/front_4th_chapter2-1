export const addEventListener = <T extends Event>(event: string, callback: (event: T) => void) => {
  const root = document.getElementById('app');

  root?.addEventListener(event, callback as EventListener);
};
