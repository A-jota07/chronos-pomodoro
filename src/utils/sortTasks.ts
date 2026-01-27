import type { TaskModel } from '../models/TaskModel';

export type SortTasksOptions = {
    tasks: TaskModel[];
    direction?: 'asc' | 'desc';
    field?: keyof TaskModel;
};

export function sortTasks({
    field = 'startDate',
    direction = 'desc',
    tasks = [],
}: SortTasksOptions): TaskModel[] {
    return [...tasks].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];

        // --- TRATANDO VALORES NULOS ---

        // Se os dois forem nulos, mantemos a ordem atual
        if (aValue === null && bValue === null) return 0;

        // Se apenas o primeiro for nulo, ele vai para o final
        if (aValue === null) return 1;

        // Se apenas o segundo for nulo, ele vai para o final
        if (bValue === null) return -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return direction === 'asc'
                ? aValue - bValue // Ex: 1, 2, 3...
                : bValue - aValue; // Ex: 3, 2, 1...
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return direction === 'asc'
                ? aValue.localeCompare(bValue) // A -> Z
                : bValue.localeCompare(aValue); // Z -> A
        }

        return 0;
    });
}
