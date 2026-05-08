export class NewsClientError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message)
    this.name = 'NewsClientError'
  }
}

export class UnsupportedDataModeError extends NewsClientError {
  constructor(mode: string) {
    super(`Unsupported data mode: ${mode}`)
    this.name = 'UnsupportedDataModeError'
  }
}

export class StaticNewsRequestError extends NewsClientError {
  constructor(
    public readonly url: string,
    message: string,
    cause?: unknown,
  ) {
    super(`Failed to fetch static news data from ${url}: ${message}`, cause)
    this.name = 'StaticNewsRequestError'
  }
}
