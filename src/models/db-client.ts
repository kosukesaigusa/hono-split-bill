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
    } catch (e: any) {
      console.error({ message: e.message })
      throw e
    }
  }

  async batch(statements: D1PreparedStatement[]): Promise<D1Result<unknown>[]> {
    try {
      return await this.db.batch(statements)
    } catch (e: any) {
      console.error({ message: e.message })
      throw e
    }
  }

  async dump(): Promise<ArrayBuffer> {
    try {
      return await this.db.dump()
    } catch (e: any) {
      console.error({ message: e.message })
      throw e
    }
  }

  prepare(query: string): D1PreparedStatementWrapper {
    try {
      const statement = this.db.prepare(query)
      return new D1PreparedStatementWrapper(statement)
    } catch (e: any) {
      console.error({ message: e.message })
      throw e
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
    } catch (e: any) {
      console.error({ message: e.message })
      throw e
    }
  }

  async run(): Promise<D1Response> {
    try {
      return await this.statement.run()
    } catch (e: any) {
      console.error({ message: e.message })
      throw e
    }
  }

  async all<T = Record<string, unknown>>(): Promise<D1Result<T>> {
    try {
      return await this.statement.all<T>()
    } catch (e: any) {
      console.error({ message: e.message })
      throw e
    }
  }

  getStatement(): D1PreparedStatement {
    return this.statement
  }
}
