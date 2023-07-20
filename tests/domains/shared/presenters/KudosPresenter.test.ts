import Kudos, { From } from "@/domain/Kudos/Entities/Kudos";
import KudosPresenter, { KudosPresentation } from "@/domain/Kudos/Presenters/KudosPresenter";
import { Status } from "@/domain/Panel/Entities/Panel";

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
    const status = Status.ACTIVE;

    const kudos: Kudos = {
      from,
      to,
      title,
      description,
      panelSlug,
      slug,
      createdAt,
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
});
