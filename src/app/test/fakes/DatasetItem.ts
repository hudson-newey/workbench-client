import { Id } from "@interfaces/apiInterfaces";
import { IDatasetItem } from "@models/DatasetItem";
import { modelData } from "@test/helpers/faker";

export function generateDatasetItem(id?: Id): IDatasetItem {
  const [startTimeSeconds, endTimeSeconds] = modelData.startEndSeconds();

  return {
    id: modelData.id(id),
    datasetId: modelData.id(),
    audioRecordingId: modelData.id(),
    creatorId: modelData.id(),
    createdAt: modelData.timestamp(),
    startTimeSeconds,
    endTimeSeconds,
    order: modelData.random.number(100),
  };
}