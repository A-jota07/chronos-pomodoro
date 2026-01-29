import styles from './styles.module.css';

import { TrashIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';

import { formatDate } from '../../utils/formatDate';
import { getTaskStatus } from '../../utils/getTaskStatus';
import { sortTasks, type SortTasksOptions } from '../../utils/sortTasks';

import { showMessage } from '../../adapters/showMessage';

export function History() {
    const { state, dispatch } = useTaskContext();
    const hasTasks = state.tasks.length > 0;

    const [sortField, setSortField] =
        useState<SortTasksOptions['field']>('startDate');

    const [sortDirection, setSortDirection] =
        useState<SortTasksOptions['direction']>('desc');

    const sortedTasks = useMemo(() => {
        return sortTasks({
            tasks: state.tasks,
            field: sortField,
            direction: sortDirection,
        });
    }, [state.tasks, sortField, sortDirection]);

    function handleSortTasks(field: SortTasksOptions['field']) {
        setSortDirection(prev => (prev === 'desc' ? 'asc' : 'desc'));
        setSortField(field);
    }

    function handleResetHistory() {
        showMessage.dismiss();

        showMessage.confirm('Tem certeza?', confirmation => {
            if (!confirmation) return;
            dispatch({ type: TaskActionTypes.RESET_STATE });
        });
    }

    useEffect(() => {
        document.title = 'Histórico de tarefas - Chronos Pomodoro';

        return () => {
            showMessage.dismiss();
        };
    }, []);

    return (
        <MainTemplate>
            <Container>
                <Heading>
                    <span>History</span>

                    {hasTasks && (
                        <span className={styles.buttonContainer}>
                            <DefaultButton
                                icon={<TrashIcon />}
                                color='red'
                                aria-label='Apagar todo o histórico'
                                title='Apagar Histórico'
                                onClick={handleResetHistory}
                            />
                        </span>
                    )}
                </Heading>
            </Container>

            <Container>
                {hasTasks && (
                    <div className={styles.responsiveTable}>
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        onClick={() => handleSortTasks('name')}
                                        className={styles.thSort}
                                    >
                                        Tarefa ↕
                                    </th>
                                    <th
                                        onClick={() =>
                                            handleSortTasks('duration')
                                        }
                                        className={styles.thSort}
                                    >
                                        Duração ↕
                                    </th>
                                    <th
                                        onClick={() =>
                                            handleSortTasks('startDate')
                                        }
                                        className={styles.thSort}
                                    >
                                        Data ↕
                                    </th>
                                    <th>Status</th>
                                    <th>Tipo</th>
                                </tr>
                            </thead>

                            <tbody>
                                {sortedTasks.map(task => {
                                    const taskTypeDictionary = {
                                        workTime: 'Foco',
                                        shortBreakTime: 'Descanso curto',
                                        longBreakTime: 'Descanso longo',
                                    };

                                    return (
                                        <tr key={task.id}>
                                            <td>{task.name}</td>
                                            <td>{task.duration}min</td>
                                            <td>
                                                {formatDate(task.startDate)}
                                            </td>
                                            <td>
                                                {getTaskStatus(
                                                    task,
                                                    state.activeTask,
                                                )}
                                            </td>
                                            <td>
                                                {taskTypeDictionary[task.type]}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {!hasTasks && (
                    <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        Ainda não existem tarefas criadas
                    </p>
                )}
            </Container>
        </MainTemplate>
    );
}
