import Repository from "@/domain/Kudos/Repositories/KudosRepository";
import UpdateKudosData from "@/domain/Kudos/DTO/UpdateKudosData";
import KudosData from "@/domain/Kudos/DTO/KudosData";
import EmptyData from "@/domain/shared/errors/EmptyData";
import ValidationResponse from "@/domain/shared/ValidationResponse";
import UpdateSuccessfulResponse from "@/domain/shared/Responses/UpdateSuccessfulResponse";
import ErrorResponse from "@/domain/shared/Responses/ErrorResponse";
import BusinessError from "@/domain/shared/errors/BusinessError";
import Kudos, { Status } from "../Entities/Kudos";
import InvalidStatus from "@/domain/shared/errors/InvalidStatus";
import UpdateDataResponse from "@/domain/shared/Responses/UpdateDataResponse";

export type UpdateKudosRequest = {
  kudosSlug: string;
  userId: string;
  updateKudosData: UpdateKudosData;
};

class UpdateKudos {
  constructor(private repository: Repository) {}

  validate(updateKudosData: KudosData): ValidationResponse {
    const result = new ValidationResponse(true);

    if (!updateKudosData.title) {
      result.addError(new EmptyData("EMPTY_TITLE", "title"));
    }

    if (!updateKudosData.description) {
      result.addError(new EmptyData("EMPTY_DESCRIPTION", "description"));
    }

    if (!updateKudosData.to) {
      result.addError(new EmptyData("EMPTY_RECIPIENT", "recipient"));
    }

    if (updateKudosData.status === Status.ARCHIVED) {
      result.addError(new InvalidStatus("Its not possible to edit an archived kudos."));
    }

    return result;
  }

  async handle({ kudosSlug, userId, updateKudosData }: UpdateKudosRequest): Promise<UpdateDataResponse<Kudos>> {
    const existingKudos = await this.repository.findBySlug(kudosSlug);

    if (!existingKudos) {
      return new ErrorResponse([new BusinessError("KUDOS_NOT_FOUND", "Could not found a kudos with the provided ID.")]);
    }

    if (existingKudos.from.id !== userId) {
      return new ErrorResponse([new BusinessError("NOT_AUTHORIZED", "You can not edit a kudos that is not yours.")]);
    }

    const updatedKudosData = {
      ...existingKudos,
      ...updateKudosData,
      ...{
        updatedAt: new Date(),
      },
    } as KudosData;

    const validation = this.validate(updatedKudosData);

    if (!validation.ok) {
      return new ErrorResponse(validation.errors);
    }

    const updatedKudos = await this.repository.update({ slug: kudosSlug, kudosData: updatedKudosData });

    if (!updatedKudos) {
      return new ErrorResponse([new BusinessError("KUDOS_NOT_UPDATED", "Internal error")]);
    }

    return new UpdateSuccessfulResponse(updatedKudos);
  }
}

export default UpdateKudos;
