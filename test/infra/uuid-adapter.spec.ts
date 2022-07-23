import uuid from 'uuid';
import { UuidAdapter } from '@/infra/uuid-adapter';

type SutTypes = {
  sut: UuidAdapter,
};

const makeSut = (): SutTypes => {
  const sut = new UuidAdapter();
  return {
    sut,
  };
};

jest.mock('uuid', () => ({
  v4() {
    return 'any_id';
  },
}));

describe('Uuid Adapter', () => {
  it('Should return an id on success', async () => {
    const { sut } = makeSut();
    const id = await sut.generate();
    expect(id).toBe('any_id');
  });

  it('Should throw if v4 throws', async () => {
    const { sut } = makeSut();

    const uuidSpy = jest.spyOn(uuid, 'v4') as unknown as jest.Mock<ReturnType<(key: Error) => Promise<Error>>, Parameters<(key: Error) => Promise<Error>>>;
    uuidSpy.mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const idError = sut.generate();
    await expect(idError).rejects.toThrow();
  });
});
