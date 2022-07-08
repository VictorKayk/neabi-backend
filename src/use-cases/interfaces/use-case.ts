export interface IUseCase {
  execute(request: any): Promise<any>
}
