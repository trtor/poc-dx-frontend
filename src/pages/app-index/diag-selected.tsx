import React from "react";
import styled from "styled-components";
import type { SelectedListType } from "./app";
import { DiagnosisBody } from "./diag-body";
import { DiagnosisNarrow } from "./diag-narrow";

export const SelectedDiagnosisList: React.FC<{
  diagnosisList: SelectedListType[];
  selectedList: SelectedListType[];
  setSelectedList: React.Dispatch<React.SetStateAction<SelectedListType[]>>;
}> = ({ diagnosisList, selectedList, setSelectedList }) => {
  return (
    <>
      {diagnosisList.map((a, i) => {
        return (
          <SelectedDiagnosis key={i}>
            <DiagnosisLabel>
              {i + 1}. {a.label}
            </DiagnosisLabel>
            <NarrowWrap>
              <DiagnosisNarrow conceptId={a.value} selectedList={selectedList} setSelectedList={setSelectedList} />
            </NarrowWrap>
            <NarrowWrap>
              <DiagnosisBody conceptId={a.value} selectedList={selectedList} setSelectedList={setSelectedList} />
            </NarrowWrap>
          </SelectedDiagnosis>
        );
      })}
    </>
  );
};

const SelectedDiagnosis = styled.div`
  padding: 0.5rem 1rem;
  margin-bottom: 0rem;
`;

const DiagnosisLabel = styled.div`
  font-size: 1.1rem;
  font-weight: bold;
`;

const NarrowWrap = styled.div`
  padding: 0.5rem 0.4rem;
`;
