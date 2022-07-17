import type { CancelTokenSource } from "axios";
import axios from "axios";
import React, { useRef, useState } from "react";
import type { GroupBase } from "react-select";
import AsyncSelect from "react-select/async";
import type Select from "react-select/dist/declarations/src/Select";
import styled from "styled-components";
import { fetchMedicationMaster, fetchMedUsage } from "../../api/suggestion";

const debounceInputTime = 20;
const maxSuggestionLength = 1000;

let cancelTokenSource: CancelTokenSource | null = null;
let cancelTokenSourceUsage: CancelTokenSource | null = null;

export type SelectedListType = { label: string; value: string };
export type SelectedListUsageType = {
  label: string;
  value: string;
  usageText?: (string | null)[];
  usageRegimen?: string;
};

export const MedSearchPage: React.FC = () => {
  const [, setInputValue] = useState<string | null>(null);
  const [selectedMedMasterInput, setSelectedMedMasterInput] = useState<SelectedListType | null>(null);
  const [, setInputUsageValue] = useState<string | null>(null);
  const [selectedUsageInput, setSelectedUsageInput] = useState<SelectedListUsageType | null>(null);

  const inputUsageRef = useRef<Select<SelectedListUsageType, false, GroupBase<SelectedListUsageType>> | null>(null);

  const handleInputMedMasterChange = (newValue: string): string | null => {
    setInputValue(newValue.replace(/\W/g, ""));
    return newValue;
  };

  const handleInputMedUsageChange = (newValue: string): string | null => {
    setInputUsageValue(newValue.replace(/\W/g, ""));
    return newValue;
  };

  const onSelectMedMasterChange = (option: SelectedListType | null): void => {
    if (!option) {
      setSelectedMedMasterInput(null);
      return;
    }
    setSelectedMedMasterInput(option);
    inputUsageRef.current?.focus();
  };

  const onSelectUsageChange = (option: SelectedListUsageType | null): void => {
    if (!option) {
      setSelectedUsageInput(null);
      return;
    }
    setSelectedUsageInput(option);
  };

  // console.log({ selectedUsageInput, inputUsageValue });

  return (
    <Wrap>
      <div style={{ paddingBottom: "0.7rem" }}>
        <span>Medication: </span>
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
          {selectedMedMasterInput?.value
            ? `[${selectedMedMasterInput?.value}] - ${selectedMedMasterInput?.label || ""}`
            : ""}
        </span>
      </div>
      <div style={{ paddingBottom: "0.7rem" }}>
        <span>Usage: </span>
        <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{selectedUsageInput?.label || ""}</span>
        {selectedUsageInput?.usageRegimen ? (
          <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "red", paddingLeft: "1rem" }}>
            {selectedUsageInput?.usageRegimen || ""}
          </span>
        ) : (
          ""
        )}
      </div>
      <AsyncSelect
        id="medMaster"
        name="medMaster"
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        isSearchable={true}
        onInputChange={handleInputMedMasterChange}
        placeholder="Master"
        defaultValue={null}
        loadOptions={promiseSuggestionMedMaster}
        onChange={e => {
          onSelectMedMasterChange(e);
        }}
        value={selectedMedMasterInput}
        closeMenuOnSelect={false}
        defaultOptions={false}
      />
      <div style={{ borderBottom: "2px solid black", margin: "0.4rem 0.5rem", paddingBottom: "0.4rem" }}></div>
      <AsyncSelect
        id="usage"
        name="usage"
        placeholder="Usage"
        ref={inputUsageRef}
        onInputChange={handleInputMedUsageChange}
        onChange={e => {
          onSelectUsageChange(e);
        }}
        loadOptions={async e => {
          return promiseSuggestionUsage(e, selectedMedMasterInput?.value || undefined);
        }}
        value={selectedUsageInput}
        isDisabled={false}
        isLoading={false}
        isClearable={true}
        isSearchable={true}
        defaultValue={null}
        closeMenuOnSelect={false}
        defaultOptions={false}
      />
    </Wrap>
  );
};

let timeout: ReturnType<typeof setTimeout> | undefined;
async function promiseSuggestionMedMaster(inputValue: string): Promise<SelectedListType[]> {
  return new Promise(resolve => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      if (inputValue.length > 1) {
        if (cancelTokenSource) cancelTokenSource.cancel();
        cancelTokenSource = axios.CancelToken.source();
        fetchMedicationMaster(inputValue.trim(), cancelTokenSource.token)
          .then(findSuggestion => {
            if (!findSuggestion) return resolve([]);
            if (findSuggestion.length > maxSuggestionLength)
              findSuggestion.splice(maxSuggestionLength, findSuggestion.length - maxSuggestionLength);
            resolve(findSuggestion.map(e => ({ label: e.name, value: e.id })));
          })
          // eslint-disable-next-line no-console
          .catch(e => console.error(e));
      } else resolve([]);
    }, debounceInputTime);
  });
}

let timeout2: ReturnType<typeof setTimeout> | undefined;
async function promiseSuggestionUsage(inputValue: string, medId: string | undefined): Promise<SelectedListUsageType[]> {
  return new Promise(resolve => {
    if (timeout2) clearTimeout(timeout2);
    timeout2 = setTimeout(() => {
      if (inputValue.length > 1) {
        if (cancelTokenSourceUsage) cancelTokenSourceUsage.cancel();
        cancelTokenSourceUsage = axios.CancelToken.source();
        fetchMedUsage(inputValue.trim(), medId || undefined, cancelTokenSourceUsage.token)
          .then(findSuggestion => {
            if (!findSuggestion) return resolve([]);
            // if (findSuggestion.length > maxSuggestionLength)
            //   findSuggestion.splice(maxSuggestionLength, findSuggestion.length - maxSuggestionLength);
            resolve(
              findSuggestion.map(e => ({
                usageText: [e.display_line_1 || null, e.display_line_2 || null, e.display_line_3 || null],
                label:
                  e.code +
                  " ||| " +
                  `${e.display_line_1 || ""} ${e.display_line_2 || ""} ${e.display_line_3 || ""}`.trim(),
                value: e.uuid,
                usageRegimen: e.REGIMEN_CODE_HX || undefined,
              }))
            );
          })
          // eslint-disable-next-line no-console
          .catch(e => console.error(e));
      } else resolve([]);
    }, debounceInputTime);
  });
}

const Wrap = styled.div`
  padding: 2rem 1rem;
`;
