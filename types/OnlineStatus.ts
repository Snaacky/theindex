export enum Statuses {
  fetching = 'Fetching online status',
  down = 'Host is offline',
  up = 'Host is online',
  unknown = 'Could not determine host up-status',
  noURL = 'No url found to ping',
  error = 'Error occurred while fetching the ping API',
  ping = 'Still waiting for request to ping API to finish'
}

export type StatusData = {
  url: string
  time: string
  status: string
}