import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { fetchDiagnosisRelation } from '../../api/diag-relation';
import { CloseSuggestion, SuggestedNarrowTerm } from '../../components/diag-styled';
import { DiagnosisRelation } from '../../types/query-response';
import { SelectedListType } from './app';

export const DiagnosisNarrow: React.FC<{
  conceptId: string;
  selectedList: SelectedListType[];
  setSelectedList: React.Dispatch<React.SetStateAction<SelectedListType[]>>;
}> = ({ conceptId, selectedList, setSelectedList }) => {
  const [conceptRelList, setConceptRelList] = useState<DiagnosisRelation[]>([]);
  const [openSuggestion, setOpenSuggestion] = useState<boolean>(true);

  useEffect(() => {
    (async function () {
      const res = await fetchDiagnosisRelation<DiagnosisRelation>(conceptId, 'relation-narrow');
      if (res) setConceptRelList(res.sort((a, b) => (a.term || '').localeCompare(b.term || '')));
      else if (conceptRelList.length) setConceptRelList([]);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conceptId]);

  return (
    <DiagnosisNarrowWrap>
      {openSuggestion && (
        <CloseSuggestion
          onClick={() => {
            setOpenSuggestion(false);
          }}
        >
          Close diagnostic suggestion
        </CloseSuggestion>
      )}
      {openSuggestion &&
        conceptRelList.map((a, i) => {
          return (
            <SuggestedNarrowTerm
              key={i}
              onClick={() => replaceSelectedList(conceptId, a.conceptId, a.term, selectedList, setSelectedList)}
            >
              {a.term}
            </SuggestedNarrowTerm>
          );
        })}
      {openSuggestion && conceptRelList.length === 0 && <NoNarrowSuggestion>No other suggestion</NoNarrowSuggestion>}
    </DiagnosisNarrowWrap>
  );
};

function replaceSelectedList(
  parentConceptId: string,
  conceptId: string,
  term: string,
  selectedList: SelectedListType[],
  setSelectedList: React.Dispatch<React.SetStateAction<SelectedListType[]>>
): void {
  setSelectedList(selectedList.map(e => (e.value === parentConceptId ? { value: conceptId, label: term } : e)));
}

const DiagnosisNarrowWrap = styled.div`
  color: #303030;
`;

const NoNarrowSuggestion = styled.span`
  color: #929292;
`;
