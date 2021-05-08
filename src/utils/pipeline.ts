export type PipeLineHandler<T> = (ctx: T, ...args: any) => T | undefined
export class PipeLine<T> {
  queue = [] as PipeLineHandler<T>[]
  addPipe(callback: PipeLineHandler<T>) {
    this.queue.push(callback)
  }
  async handle(ctx: T) {
    // for (const handler of this.queue) {
    //   const res  = await
    // }
    return this.queue.reduce((prev, handler) => {
      return handler.call(this, prev) ?? prev
    }, ctx)
  }
}
