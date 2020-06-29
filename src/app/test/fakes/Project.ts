import { Id } from "@interfaces/apiInterfaces";
import { IProject } from "@models/Project";
import { modelData } from "@test/helpers/faker";

export function generateProject(id?: Id): IProject {
  return {
    id: modelData.id(id),
    name: modelData.param(),
    description: modelData.description(),
    imageUrl: modelData.imageUrl(),
    creatorId: modelData.id(),
    updaterId: modelData.id(),
    ownerId: modelData.id(),
    createdAt: modelData.timestamp(),
    updatedAt: modelData.timestamp(),
    siteIds: modelData.ids(),
  };
}