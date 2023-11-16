/* eslint-disable @typescript-eslint/ban-types */

export class BaseResponseDto {
  requestId: string;

  responseId: string;
  timestamp: string;

  responseCode: number;

  responseStatus: string;

  responseMessage: string;

  data: unknown;
}
