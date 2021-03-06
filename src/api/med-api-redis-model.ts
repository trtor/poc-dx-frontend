export type MedicationMasterCsv = {
  // medication-master.csv
  id: string; // primary key
  name: string;
  tmt_id?: string;
  strength?: string;
  unit?: string;
  dosage_form?: string;
  category?: string;
  therapeutic_group?: string;
};

export type DrugMasterUsageCsv = {
  // drug_master_usage_relation.csv
  drug_master_usage_id: string; // primary key
  drug_master_id: string;
};

export type MedicationUsageCsv = {
  // medication-usage.csv
  id: string; // primary key
  code: string;
  display_line_1?: string;
  display_line_2?: string;
  display_line_3?: string;
  REGIMEN_CODE_HX?: string;
};

export type DrugUsageGlobalCsv = {
  // drug-usage-global.csv
  drug_usage_id: string; // primary key
  dosage_form?: string;
};

export type AllCsvTypes =
  | MedicationMasterCsv
  | DrugMasterUsageCsv
  | MedicationUsageCsv
  | DrugUsageGlobalCsv
  | MedicationUsageDenormalized;

/**
 * Generated table
 */
export type MedicationUsageDenormalized = MedicationUsageCsv & {
  id_escape: string;
  code_escape: string;
  code_length: number;
  display_line_1_escape?: string;
  display_line_2_escape?: string;
  display_line_3_escape?: string;
  uuid: string;
  medication_master_id: string | "__NULL__";
  dosage_form?: string;
  match_med_id_and_form: "1" | "0";
};
