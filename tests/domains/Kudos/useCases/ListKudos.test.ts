import ListKudos, { ListKudosData } from "@/domain/Kudos/UseCases/ListKudos";
import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import Kudos from "@/domain/Kudos/Entities/Kudos";

describe("ListKudos", () => {
  let kudosRepository: KudosRepository;
  let listKudos: ListKudos;

  beforeEach(() => {
    kudosRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
      findByPanelSlug: jest.fn(),
    } as KudosRepository;

    listKudos = new ListKudos(kudosRepository);
  });

  it("should call kudosRepository's findByPanelSlug and validate the response", async () => {
    const kudosList: Kudos[] = [];

    kudosRepository.findByPanelSlug = jest.fn().mockReturnValue(kudosList);

    const request: ListKudosData = {
      panelSlug: "some-panel-slug",
    };

    const response = await listKudos.handle(request);

    expect(kudosRepository.findByPanelSlug).toBeCalledWith(request.panelSlug);
    expect(response.ok).toEqual(true);
    expect(response.data).toEqual(kudosList);
  });
});
