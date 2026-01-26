import { useEffect, useReducer, useRef } from 'react';
import { loadbeeb } from '../../utils/loadBeeb';
import { TimerWorkerManager } from '../../workers/timerWorkerManager';
import { initialTaskState } from './initialTaskState';
import { TaskActionTypes } from './taskActions';
import { TaskContext } from './TaskContext';
import { TaskReducer } from './taskReducer';
import type { TaskStateModel } from '../../models/TaskStateModel';

type TaskContextProviderProps = {
    children: React.ReactNode;
};

export function TaskContextProvider({ children }: TaskContextProviderProps) {
    const [state, dispatch] = useReducer(TaskReducer, initialTaskState, () => {
        const storegeState = localStorage.getItem('state');

        if (storegeState === null) return initialTaskState;

        const parsedStoreState = JSON.parse(storegeState) as TaskStateModel;

        return {
            ...parsedStoreState,
            activeTask: null,
            secondsRemaining: 0,
            formattedSecondsRemaining: '00:00',
        };
    });
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
        localStorage.setItem('state', JSON.stringify(state));
        if (state.activeTask) {
            workerRef.current.postMessage(state);
        } else {
            workerRef.current.terminate();
            workerRef.current = TimerWorkerManager.getInstance();
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
