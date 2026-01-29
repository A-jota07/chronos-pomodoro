import type { TaskModel } from '../../models/TaskModel';
import type { TaskStateModel } from '../../models/TaskStateModel';

// @ts-expect-error: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
export enum TaskActionTypes {
    START_TASK = 'START_TASK',
    INTERRUPT_TASK = 'INTERRUPT_TASK',
    RESET_STATE = 'RESET_TASK',
    COUNT_DOWN = 'COUNT_DOWN',
    COMPLETE_TASK = 'COMPLETE_TASK',
    CHANGE_SETTINGS = 'CHANGE_SETTINGS',
}

export type TaskActionModel =
    | {
          type: TaskActionTypes.START_TASK;
          payload: TaskModel;
      }
    | {
          type: TaskActionTypes.COUNT_DOWN;
          payload: { secondsRemaining: number };
      }
    | {
          type: TaskActionTypes.CHANGE_SETTINGS;
          payload: TaskStateModel['config'];
      }
    // Tasks sem payload.
    | {
          type: TaskActionTypes.INTERRUPT_TASK;
      }
    | {
          type: TaskActionTypes.RESET_STATE;
      }
    | {
          type: TaskActionTypes.COMPLETE_TASK;
      };
