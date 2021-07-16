export interface ClickupTask {
    name: string,
    description: string,
    assignees: any[],
    tags: any[],
    status: string,
    priority: number,
    due_date: number,
    due_date_time: boolean,
    time_estimate: number,
    start_date: number,
    start_date_time: boolean,
    notify_all: boolean,
    parent?: any,
    links_to?: any,
    custom_fields?: any[]
}
