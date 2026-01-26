import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';

export function Tips() {
    const { state } = useTaskContext();

    const nextCycle = getNextCycle(state.currentCycle);
    const nextCycleType = getNextCycleType(nextCycle);

    const tipsFormWhenActiveTask = {
        workTime: <span>Foque por {state.config.workTime} min</span>,
        shortBreakTime: (
            <span>Descanse por {state.config.shortBreakTime} min</span>
        ),
        longBreakTime: <span>Descanso longo</span>,
    };

    const tipsFormNoActiveTask = {
        workTime: <span>Próximo ciclo é de {state.config.workTime} min</span>,
        shortBreakTime: (
            <span>
                Próximo descanso será de {state.config.shortBreakTime} min
            </span>
        ),
        longBreakTime: <span>Próximo ciclo será um descanso longo</span>,
    };
    return (
        <>
            {!!state.activeTask &&
                tipsFormWhenActiveTask[state.activeTask.type]}
            {!state.activeTask && tipsFormNoActiveTask[nextCycleType]}
        </>
    );
}
