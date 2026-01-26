import './styles/theme.css';
import './styles/global.css';

import { TaskContextProvider } from './contexts/TaskContext/TaskContextProvider';
import { MessageContainer } from './components/MessagesContainer';
import { MainRouter } from './routers/MainRouter';

export function App() {
    return (
        <TaskContextProvider>
            <MessageContainer>
                <MainRouter />
            </MessageContainer>
        </TaskContextProvider>
    );
}
