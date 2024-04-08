export class DIContainer<DependencyTypes> {
  private registry = new Map<
    keyof DependencyTypes,
    {
      factory: () => DependencyTypes[keyof DependencyTypes]
      instance?: DependencyTypes[keyof DependencyTypes]
      isOverride?: boolean
    }
  >()

  private overrides = new Map<
    keyof DependencyTypes,
    DependencyTypes[keyof DependencyTypes]
  >()

  register<Key extends keyof DependencyTypes, Args extends unknown[]>(
    key: Key,
    Constructor: new (...args: Args) => DependencyTypes[Key],
    ...args: Args
  ): void {
    const factory = () => new Constructor(...args)
    const entry = this.registry.get(key)
    if (!entry || !entry.isOverride) {
      this.registry.set(key, { factory })
    }
  }

  get<K extends keyof DependencyTypes>(key: K): DependencyTypes[K] {
    if (this.overrides.has(key)) {
      return this.overrides.get(key) as DependencyTypes[K]
    }
    const entry = this.registry.get(key)
    if (!entry) {
      throw new Error(`No instance found for key: ${String(key)}`)
    }
    if (entry.instance === undefined) {
      entry.instance = entry.factory()
    }
    return entry.instance as DependencyTypes[K]
  }

  override<Key extends keyof DependencyTypes>(
    key: Key,
    instance: DependencyTypes[Key]
  ): void {
    this.overrides.set(key, instance)
  }

  clearOverrides(): void {
    this.overrides.clear()
  }
}
