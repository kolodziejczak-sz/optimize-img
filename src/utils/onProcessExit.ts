const exitEvents = [
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
];

export const onProcessExit = (callback: () => void) => {
  exitEvents.forEach((eventName) => {
    process.on(eventName, callback);
  });
};
