import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { ID } from "src/app/interfaces/apiInterfaces";
import { AudioRecording } from "src/app/models/AudioRecording";
import { AudioRecordingFilters } from "../audio-recordings.service";
import { SecurityService } from "../security.service";

@Injectable({
  providedIn: "root"
})
export class MockAudioRecordingsService extends SecurityService {
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Get list of audio recordings attached to a site ID
   * @param siteId Site ID
   * @param filters Audio recording filter
   */
  public getAudioRecordings(
    siteId: ID,
    filters?: AudioRecordingFilters
  ): Subject<AudioRecording[]> {
    const subject = new Subject<AudioRecording[]>();

    setTimeout(() => {
      subject.next([
        new AudioRecording({
          id: 1,
          uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          recordedDate: new Date("2015-03-26T19:37:46.000+10:00"),
          siteId: 2,
          durationSeconds: 3598.002
        }),
        new AudioRecording({
          id: 2,
          uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          recordedDate: new Date("2015-03-24T06:37:45.000+10:00"),
          siteId: 3,
          durationSeconds: 3599.002
        })
      ]);
    }, 50);

    return subject;
  }

  /**
   * Get audio recording
   * @param siteId Site ID
   * @param recordingId Audio Recording ID
   * @param filters Audio recording filter
   */
  public getAudioRecording(
    siteId: ID,
    recordingId: ID,
    filters?: AudioRecordingFilters
  ): Subject<AudioRecording> {
    const subject = new Subject<AudioRecording>();

    setTimeout(() => {
      subject.next(
        new AudioRecording({
          id: 1,
          uuid: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          recordedDate: new Date("2015-03-26T19:37:46.000+10:00"),
          siteId: 2,
          durationSeconds: 3598.002
        })
      );
    }, 50);

    return subject;
  }
}