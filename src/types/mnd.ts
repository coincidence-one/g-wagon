export interface MNDMart {
  SEQ: number;
  MART: string;
  SCALE: string;
  OP_WEEKDAY: string;
  OP_SAT: string;
  OP_SUN: string;
  LUNCH_WEEKDAY: string;
  LUNCH_SAT: string;
  LUNCH_SUN: string;
  NOTE: string;
  TEL: string;
  LOC: string;
}

export interface MNDApiResponse {
  TB_MND_MART_CURRENT: {
    list_total_count: number;
    row: MNDMart[];
  };
}
