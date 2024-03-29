import Kudos, { From } from "@/domain/Kudos/Entities/Kudos";
import KudosPresenter, { KudosPresentation } from "@/domain/Kudos/Presenters/KudosPresenter";
import { Status } from "@/domain/Kudos/Entities/Kudos";

describe("KudosPresenter", () => {
  let presenter: KudosPresenter;

  beforeEach(() => {
    presenter = new KudosPresenter();
  });

  test("should convert Kudos to KudosPresentation", () => {
    const from: From = { id: "from-id", name: "John Doe" };
    const to = "Jane Smith";
    const title = "Great Job!";
    const description = "Congratulations on your outstanding performance.";
    const panelSlug = "panel-slug";
    const slug = "kudos-slug";
    const createdAt = new Date();
    const updatedAt = new Date();
    const status = Status.ACTIVE;

    const kudos: Kudos = {
      from,
      to,
      title,
      description,
      panelSlug,
      slug,
      createdAt,
      updatedAt,
      status,
    };

    const expectedPresentation: KudosPresentation = {
      from: "John Doe",
      to,
      title,
      description,
      slug,
      createdAt,
    };

    const presentation = presenter.single(kudos);

    expect(presentation).toEqual(expectedPresentation);
  });

  test("should convert Kudos list to KudosPresentation list", () => {
    const from: From = { id: "from-id", name: "John Doe" };
    const to = "Jane Smith";
    const title = "Great Job!";
    const description = "Congratulations on your outstanding performance.";
    const panelSlug = "panel-slug";
    const slug = "kudos-slug";
    const createdAt = new Date();
    const updatedAt = new Date();
    const status = Status.ACTIVE;

    const kudos: Kudos[] = [
      {
        from,
        to,
        title,
        description,
        panelSlug,
        slug,
        createdAt,
        updatedAt,
        status,
      },
    ];

    const expectedPresentation: KudosPresentation[] = [
      {
        from: "John Doe",
        to,
        title,
        description,
        slug,
        createdAt,
      },
    ];

    const presentation = presenter.many(kudos);

    expect(presentation).toEqual(expectedPresentation);
  });
});
