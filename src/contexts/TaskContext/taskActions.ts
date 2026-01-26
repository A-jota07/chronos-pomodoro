import type { TaskModel } from '../../models/TaskModel';

// @ts-expect-error: This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
export enum TaskActionTypes {
    START_TASK = 'START_TASK',
    INTERRUPT_TASK = 'INTERRUPT_TASK',
    RESET_STATE = 'RESET_TASK',
    COUNT_DOWN = 'COUNT_DOWN',
    COMPLETE_TASK = 'COMPLETE_TASK',
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
