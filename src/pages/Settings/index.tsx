import { SaveIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { DefaultInput } from '../../components/DefaultInput';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';
import { useRef } from 'react';
import { useTaskContext } from '../../contexts/TaskContext/useTaskContext';
import { showMessage } from '../../adapters/showMessage';
import { TaskActionTypes } from '../../contexts/TaskContext/taskActions';

export function Settings() {
    const { state, dispatch } = useTaskContext();
    const workTimeInput = useRef<HTMLInputElement>(null);
    const shortBreakTimeInput = useRef<HTMLInputElement>(null);
    const longBreakTimeInput = useRef<HTMLInputElement>(null);

    function handleSaveSettings(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        showMessage.dismiss();
        const formErros = [];

        const workTime = Number(workTimeInput.current?.value);
        const shortBreakTime = Number(shortBreakTimeInput.current?.value);
        const longBreakTime = Number(longBreakTimeInput.current?.value);

        if (isNaN(workTime) || isNaN(shortBreakTime) || isNaN(longBreakTime)) {
            formErros.push(
                'Por favor, use apenas números para TODOS os campos.',
            );
        }

        if (workTime < 1 || workTime > 99) {
            formErros.push('Digite valores entre 1 e 99 para Foco.');
        }

        if (shortBreakTime < 1 || shortBreakTime > 30) {
            formErros.push('Digite valores entre 1 e 30 para Descanso Curto.');
        }

        if (longBreakTime < 1 || longBreakTime > 60) {
            formErros.push('Digite valores entre 1 e 99 para Descanso Longo.');
        }

        if (formErros.length > 0) {
            formErros.forEach(error => {
                showMessage.error(error);
            });
            return;
        }

        dispatch({
            type: TaskActionTypes.CHANGE_SETTINGS,
            payload: {
                workTime,
                shortBreakTime,
                longBreakTime,
            },
        });
        showMessage.success('Configurações salvas');
    }

    return (
        <MainTemplate>
            <Container>
                <Heading>Configurações</Heading>
            </Container>

            <Container>
                <p style={{ textAlign: 'center' }}>
                    Modifique as configurações para tempo de foco, descanso
                    curto e descanso longo.
                </p>
            </Container>

            <Container>
                <form onSubmit={handleSaveSettings} action='' className='form'>
                    <div className='formRow'>
                        <DefaultInput
                            id='workTime'
                            labelText='Foco'
                            ref={workTimeInput}
                            defaultValue={state.config.workTime}
                            type='number'
                        />
                    </div>

                    <div className='formRow'>
                        <DefaultInput
                            id='shortBreakTime'
                            labelText='Descanso curto'
                            ref={shortBreakTimeInput}
                            defaultValue={state.config.shortBreakTime}
                            type='number'
                        />
                    </div>

                    <div className='formRow'>
                        <DefaultInput
                            id='longBreakTime'
                            labelText='Descanso longo'
                            ref={longBreakTimeInput}
                            defaultValue={state.config.longBreakTime}
                            type='number'
                        />
                    </div>
                    <div className='formRow'>
                        <DefaultButton
                            icon={<SaveIcon />}
                            aria-label='Salvar configurações'
                            title='Salvar configurações'
                        />
                    </div>
                </form>
            </Container>
        </MainTemplate>
    );
}
