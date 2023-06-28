import ShowKudos from "@/domain/Kudos/UseCases/ShowKudos";
import KudosRepository from "@/domain/Kudos/Repositories/KudosRepository";
import ShowKudosResponse from "@/domain/Kudos/UseCases/Responses/ShowKudosResponse";
import ShowKudosErrorResponse from "@/domain/Kudos/UseCases/Responses/ShowKudosErrorResponse";

describe("ShowKudos", () => {
  let showKudos: ShowKudos;
  let mockRepository: KudosRepository;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      update: jest.fn(),
      archive: jest.fn(),
      delete: jest.fn(),
      findBySlug: jest.fn(),
    } as KudosRepository;

    showKudos = new ShowKudos(mockRepository);
  });

  test("should return a ShowKudosErrorResponse for a non-existing kudos", async () => {
    const slug = "non-existing-kudos";

    mockRepository.findBySlug = jest.fn().mockReturnValue(null);

    const response = await showKudos.handle({ slug });

    expect(response instanceof ShowKudosErrorResponse).toBe(true);
    expect(response.errors[0].message).toBe("Could not found a kudos with the provided ID.");
    expect(response.errors[0].status).toBe("KUDOS_NOT_FOUND");
  });

  test("should return a ShowKudosResponse for an existing kudos", async () => {
    const slug = "example-kudos";
    const kudos = {
      slug,
    };

    mockRepository.findBySlug = jest.fn().mockReturnValue(kudos);

    const response = await showKudos.handle({ slug });

    expect(response instanceof ShowKudosResponse).toBe(true);
    expect(response.ok).toBe(true);
    expect(response.kudos).toEqual(kudos);
  });
});
