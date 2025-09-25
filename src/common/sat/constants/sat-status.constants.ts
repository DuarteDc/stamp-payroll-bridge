export const SAT_STATUS = {
  '1': ' RECIVED',
  '2': 'IN_PROGRESS',
  '3': 'PROCESING',
  '4': 'NOT_FOUND',
  '5': 'NOT_PROCESED',
} as const;

export type SAT_STATUS = (typeof SAT_STATUS)[keyof typeof SAT_STATUS];
