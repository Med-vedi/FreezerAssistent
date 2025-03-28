export type ValidationErrors<T> = Array<ValidationError<T>>
export type ValidationError<T> = {field: keyof T, messages: string[]}