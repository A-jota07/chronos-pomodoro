import styles from './styles.module.css';

import { TrashIcon } from 'lucide-react';
import { Container } from '../../components/Container';
import { DefaultButton } from '../../components/DefaultButton';
import { Heading } from '../../components/Heading';
import { MainTemplate } from '../../templates/MainTemplate';

export function History() {
    return (
        <MainTemplate>
            <Container>
                <Heading>
                    <span>History</span>
                    <span className={styles.buttonContainer}>
                        <DefaultButton
                            icon={<TrashIcon />}
                            color='red'
                            aria-label='Apagar todo o histórico'
                            title='Apagar Histórico'
                        />
                    </span>
                </Heading>
            </Container>

            <Container>
                <div className={styles.responsiveTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Tarefa</th>
                                <th>Duração</th>
                                <th>Data</th>
                                <th>Status</th>
                                <th>Tipo</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Array.from({ length: 20 }).map((_, index) => {
                                return (
                                    <tr key={index}>
                                        <td>Estudar</td>
                                        <td>25min</td>
                                        <td>26/01/2026</td>
                                        <td>Completa</td>
                                        <td>Foco</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Container>
        </MainTemplate>
    );
}
