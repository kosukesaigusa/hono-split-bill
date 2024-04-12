export type UseCaseResult<T, E extends BaseUseCaseError = BaseUseCaseError> =
  | { data: T; error?: undefined }
  | { data?: undefined; error: E }

export interface BaseUseCaseError {
  object?: unknown
  stack?: string
  message: string
}
