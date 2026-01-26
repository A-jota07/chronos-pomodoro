let isRunning = false;
let timerId = null;

self.onmessage = function (event) {
    const state = event.data;
    if (!state) return;

    const { activeTask, secondsRemaining } = state;

    // Para tudo se não houver task
    if (!activeTask || !activeTask.startDate || secondsRemaining == null) {
        isRunning = false;
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
        return;
    }

    // Só inicia uma vez
    if (isRunning) return;

    isRunning = true;

    const endDate = activeTask.startDate + secondsRemaining * 1000;

    function tick() {
        const now = Date.now();
        const countDowSeconds = Math.max(Math.floor((endDate - now) / 1000), 0);

        // 🔥 ESSENCIAL: sempre emitir o tempo atualizado
        self.postMessage(countDowSeconds);

        if (countDowSeconds <= 0) {
            isRunning = false;
            timerId = null;
            return;
        }

        timerId = setTimeout(tick, 1000);
    }

    tick();
};
