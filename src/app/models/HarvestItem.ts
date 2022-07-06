import { Injector } from "@angular/core";
import {
  ACCOUNT,
  AUDIO_RECORDING,
  SHALLOW_HARVEST,
} from "@baw-api/ServiceTokens";
import { DateTimeTimezone, Id } from "@interfaces/apiInterfaces";
import {
  bawDateTime,
  bawReadonlyConvertCase,
} from "@models/AttributeDecorators";
import { AudioRecording } from "@models/AudioRecording";
import { AbstractModel } from "./AbstractModel";
import { hasOne } from "./AssociationDecorators";
import { Harvest } from "./Harvest";
import { User } from "./User";

/**
 * State of a harvest item
 *
 * @param new File on disk found
 * @param metadataGathered Analyzed the file, gotten the metadata, and validated
 * @param failed File is not valid for some known reason
 * @param completed Successfully harvested the file
 * @param errored An error occurred while harvesting the file
 */
export type HarvestItemState =
  | "new"
  | "metadataGathered"
  | "failed"
  | "completed"
  | "errored";

export interface IHarvestItemValidation {
  name?: string;
  status?: "fixable" | "notFixable";
  message?: string;
}

export interface IHarvestItem {
  id?: Id;
  harvestId?: Id;
  audioRecordingId?: Id;
  uploaderId?: Id;
  createdAt?: DateTimeTimezone | string;
  updatedAt?: DateTimeTimezone | string;
  deleted?: boolean;
  path?: string;
  status?: HarvestItemState;
  validations?: IHarvestItemValidation[];
}

export class HarvestItem extends AbstractModel implements IHarvestItem {
  public readonly kind = "HarvestItem";
  public readonly id?: Id;
  public readonly harvestId?: Id;
  public readonly audioRecordingId?: Id;
  public readonly uploaderId?: Id;
  @bawDateTime()
  public readonly createdAt?: DateTimeTimezone;
  @bawDateTime()
  public readonly updatedAt?: DateTimeTimezone;
  public readonly deleted?: boolean;
  public readonly path?: string;
  @bawReadonlyConvertCase()
  public readonly status?: HarvestItemState;
  public readonly validations?: IHarvestItemValidation[];

  // Associations
  @hasOne<HarvestItem, Harvest>(SHALLOW_HARVEST, "harvestId")
  public harvest: Harvest;
  @hasOne<HarvestItem, AudioRecording>(AUDIO_RECORDING, "audioRecordingId")
  public audioRecording: AudioRecording;
  @hasOne<HarvestItem, User>(ACCOUNT, "uploaderId")
  public uploader?: User;

  public constructor(data: IHarvestItem, injector?: Injector) {
    super(data, injector);
  }

  public get viewUrl(): string {
    throw new Error("HarvestItem viewUrl not implemented");
  }
}