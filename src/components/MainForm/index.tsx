import { PlayCircleIcon, StopCircleIcon } from 'lucide-react';
import { useRef } from 'react';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import type { TaskModel } from '../../models/TaskModel';
import { getNextCycle } from '../../utils/getNextCycle';
import { getNextCycleType } from '../../utils/getNextCycleType';
import { Cycles } from '../Cycles';
import { DefaultButton } from '../DefaultButton';
import { DefaultInput } from '../DefaultInput';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';
import { Tips } from '../tips';
import { showMessage } from '../../adapters/showMessage';

export function MainForm() {
    const { state, dispatch } = useTaskContext();
    const taskNameInput = useRef<HTMLInputElement>(null);

    // ciclos
    const nextCycle = getNextCycle(state.currentCycle);
    const nextCycleType = getNextCycleType(nextCycle);

    function handleCreateNewTask(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (taskNameInput.current === null) return;

        const taskName = taskNameInput.current.value.trim();

        if (!taskName) {
            showMessage.warning('Digite o nome da tarefa!');
            return;
        }

        // @ts-expect-error: Erro inexperado, será resolvido.
        const newTask: TaskModel = {
            id: Date.now().toString(),
            name: taskName,
            startDate: Date.now(),
            completeDate: null,
            interruptDate: null,
            duration: state.config[nextCycleType],
            type: nextCycleType,
        };

        dispatch({ type: TaskActionTypes.START_TASK, payload: newTask });
        showMessage.success('Tarefa iniciada com sucesso!');
    }

    function handleInterruptTask() {
        showMessage.error('Tarefa Interrompida!');
        dispatch({ type: TaskActionTypes.INTERRUPT_TASK });
    }

    return (
        <form onSubmit={handleCreateNewTask} className='form' action=''>
            <div className='formRow'>
                <DefaultInput
                    labelText='Task'
                    id='meuInput'
                    type='text'
                    placeholder='Digite a task...'
                    ref={taskNameInput}
                    disabled={!!state.activeTask}
                />
            </div>

            <div className='formRow'>
                <Tips />
            </div>

            {state.currentCycle > 0 && (
                <div className='formRow'>
                    <Cycles />
                </div>
            )}

            <div className='formRow'>
                {!state.activeTask && (
                    <DefaultButton
                        aria-label='Iniciar nova tarefa'
                        title='Iniciar nova tarefa'
                        type='submit'
                        icon={<PlayCircleIcon />}
                    />
                )}
                {!!state.activeTask && (
                    <DefaultButton
                        aria-label='Interromper tarefa'
                        title='Interromper tarefa'
                        type='button'
                        color='red'
                        icon={<StopCircleIcon />}
                        onClick={handleInterruptTask}
                    />
                )}
            </div>
        </form>
    );
}
