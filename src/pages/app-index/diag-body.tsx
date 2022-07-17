import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { fetchDiagnosisRelation } from "../../api/diag-relation";
import { CloseSuggestion, SuggestedNarrowTerm } from "../../components/diag-styled";
import type { DiagnosisRelation } from "../../types/query-response";
import type { SelectedListType } from "./app";

export const DiagnosisBody: React.FC<{
  conceptId: string;
  selectedList: SelectedListType[];
  setSelectedList: React.Dispatch<React.SetStateAction<SelectedListType[]>>;
}> = ({ conceptId }) => {
  //  selectedList, setSelectedList
  const [conceptRelList, setConceptRelList] = useState<DiagnosisRelation[]>([]);
  const [openSuggestion, setOpenSuggestion] = useState<boolean>(true);
  const [selectedBodySite, setSelectedBodySite] = useState<SelectedListType | null>(null);

  useEffect(() => {
    (async function (): Promise<void> {
      const res = await fetchDiagnosisRelation<DiagnosisRelation>(conceptId, "relation-body");
      if (res) setConceptRelList(res.sort((a, b) => (a.term || "").localeCompare(b.term || "")));
      else if (conceptRelList.length) setConceptRelList([]);
    })();
  }, [conceptId]);

  const selectSite = (site: SelectedListType): void => {
    setSelectedBodySite(site);
  };

  return (
    <BodySiteWrap>
      {openSuggestion && !!conceptRelList.length && selectedBodySite === null && (
        <CloseSuggestion
          onClick={() => {
            setOpenSuggestion(false);
          }}
        >
          Close body site suggestion
        </CloseSuggestion>
      )}
      {openSuggestion &&
        !selectedBodySite &&
        conceptRelList.map((a, i) => {
          return (
            <SuggestedNarrowTerm
              key={i}
              onClick={() => {
                selectSite({ label: a.term, value: a.conceptId });
              }}
            >
              {a.term}
            </SuggestedNarrowTerm>
          );
        })}
      {selectedBodySite && <ShowSelectedSite>Site: {selectedBodySite.label}</ShowSelectedSite>}
    </BodySiteWrap>
  );
};

const BodySiteWrap = styled.div`
  color: #303030;
`;

const ShowSelectedSite = styled.div`
  color: #0084b8;
  font-weight: bold;
`;
