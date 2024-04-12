type DbClientErrorType = 'GENERIC' | 'UNIQUE_CONSTRAINT' | 'UNKNOWN'

interface ErrorMapping {
  type: DbClientErrorType
  messagePattern: RegExp
}

const errorMappings: ErrorMapping[] = [
  {
    type: 'UNIQUE_CONSTRAINT',
    messagePattern: /^D1_ERROR: UNIQUE constraint failed:/,
  },
  {
    type: 'GENERIC',
    messagePattern: /.*/,
  },
]

const determineErrorType = (message: string): DbClientErrorType => {
  const mapping = errorMappings.find((m) => m.messagePattern.test(message))
  return mapping ? mapping.type : 'UNKNOWN'
}

const handleError = (e: unknown): never => {
  if (e instanceof Error) {
    const message = e.message
    const errorType = determineErrorType(message)
    console.error({ message })
    throw new DbClientError(message, errorType)
  } else {
    console.error(`An unknown error occurred: ${e}`)
    throw new DbClientError('An unknown error occurred', 'UNKNOWN')
  }
}

export class DbClientError extends Error {
  public errorType: DbClientErrorType

  public constructor(
    message?: string,
    errorType: DbClientErrorType = 'GENERIC'
  ) {
    super(message)
    this.errorType = errorType
  }
}

export interface IDbClient {
  exec(query: string): Promise<D1ExecResult>
  batch(statements: D1PreparedStatement[]): Promise<D1Result<unknown>[]>
  dump(): Promise<ArrayBuffer>
  prepare(query: string): D1PreparedStatementWrapper
}

export class D1DatabaseClient implements IDbClient {
  constructor(private readonly db: D1Database) {}

  async exec(query: string): Promise<D1ExecResult> {
    try {
      return await this.db.exec(query)
    } catch (e: unknown) {
      throw handleError(e)
    }
  }

  async batch(statements: D1PreparedStatement[]): Promise<D1Result<unknown>[]> {
    try {
      return await this.db.batch(statements)
    } catch (e: unknown) {
      throw handleError(e)
    }
  }

  async dump(): Promise<ArrayBuffer> {
    try {
      return await this.db.dump()
    } catch (e: unknown) {
      throw handleError(e)
    }
  }

  prepare(query: string): D1PreparedStatementWrapper {
    try {
      const statement = this.db.prepare(query)
      return new D1PreparedStatementWrapper(statement)
    } catch (e: unknown) {
      throw handleError(e)
    }
  }
}

class D1PreparedStatementWrapper {
  constructor(private statement: D1PreparedStatement) {}

  bind(...values: unknown[]): D1PreparedStatementWrapper {
    this.statement = this.statement.bind(...values)
    return this
  }

  async first<T = unknown>(colName: string): Promise<T | null>

  async first<T = Record<string, unknown>>(): Promise<T | null>

  async first<T = unknown>(colName?: string): Promise<T | null> {
    try {
      if (colName !== undefined) {
        return await this.statement.first<T>(colName)
      } else {
        return await this.statement.first<T>()
      }
    } catch (e: unknown) {
      throw handleError(e)
    }
  }

  async run(): Promise<D1Response> {
    try {
      return await this.statement.run()
    } catch (e: unknown) {
      throw handleError(e)
    }
  }

  async all<T = Record<string, unknown>>(): Promise<D1Result<T>> {
    try {
      return await this.statement.all<T>()
    } catch (e: unknown) {
      throw handleError(e)
    }
  }

  getStatement(): D1PreparedStatement {
    return this.statement
  }
}
