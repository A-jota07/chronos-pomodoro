import { useEffect, useReducer, useRef } from 'react';
import { loadbeeb } from '../../utils/loadBeeb';
import { TimerWorkerManager } from '../../workers/timerWorkerManager';
import { initialTaskState } from './initialTaskState';
import { TaskActionTypes } from './taskActions';
import { TaskContext } from './TaskContext';
import { TaskReducer } from './taskReducer';

type TaskContextProviderProps = {
    children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [state, dispatch] = useReducer(TaskReducer, initialTaskState);
    const playBeepRef = useRef<() => void | null>(null);
    const workerRef = useRef(TimerWorkerManager.getInstance());

    const handleWorkerMessage = (e: MessageEvent) => {
        const countDowSeconds = e.data;

        if (countDowSeconds <= 0) {
            if (playBeepRef.current) {
                playBeepRef.current();
                playBeepRef.current = null;
            }
            dispatch({
                type: TaskActionTypes.COMPLETE_TASK,
            });
        } else {
            dispatch({
                type: TaskActionTypes.COUNT_DOWN,
                payload: { secondsRemaining: countDowSeconds },
            });
        }
    };

    useEffect(() => {
        workerRef.current.onmessage(handleWorkerMessage);
    }, []);

    useEffect(() => {
        if (state.activeTask) {
            workerRef.current.postMessage(state);
        } else {
            workerRef.current.terminate();
            workerRef.current = TimerWorkerManager.getInstance();
            // Set onmessage on new worker
            workerRef.current.onmessage(handleWorkerMessage);
        }
    }, [state]);

    useEffect(() => {
        document.title = `${state.formattedSecondsRemaining} - Chronos Pomodoro`;
    }, [state.formattedSecondsRemaining]);

    useEffect(() => {
        if (state.activeTask && playBeepRef.current === null) {
            playBeepRef.current = loadbeeb();
        } else {
            playBeepRef.current = null;
        }
    }, [state.activeTask]);

    return (
        <TaskContext.Provider value={{ state, dispatch }}>
            {children}
        </TaskContext.Provider>
    );
}
