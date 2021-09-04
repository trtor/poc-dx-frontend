import axios, { CancelTokenSource } from 'axios';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import styled from 'styled-components';
import { fetchSuggestion } from '../../api/suggestion';
import { SelectedDiagnosisList } from './diag-selected';

const debounceInputTime = 50;
const maxSuggestionLength = 50;

export type SelectedListType = { label: string; value: string };

let cancelTokenSource: CancelTokenSource | null = null;

export const AppSearchDx: React.FC<RouteComponentProps> = () => {
  const [selectedDx, setSelectedDx] = useState<SelectedListType | null>(null);
  const [selectedList, setSelectedList] = useState<SelectedListType[]>([]);

  const onSelectChange = (option: SelectedListType | null) => {
    if (!option) return;
    setSelectedList([...selectedList, option]);
    setSelectedDx(null);
  };

  return (
    <Wrap>
      <SelectedDiagnosisList
        diagnosisList={selectedList}
        selectedList={selectedList}
        setSelectedList={setSelectedList}
      />
      <AsyncSelect
        loadOptions={promiseSuggestion}
        value={selectedDx}
        onChange={e => {
          onSelectChange(e);
        }}
        defaultOptions={false}
        isClearable={true}
        clearValue={() => {
          setSelectedDx(null);
        }}
        placeholder="Search..."
        onSelect={() => {
          setSelectedDx(null);
        }}
        defaultValue={null}
      />
    </Wrap>
  );
};

let timeout: ReturnType<typeof setTimeout> | undefined;
async function promiseSuggestion(inputValue: string): Promise<SelectedListType[]> {
  return new Promise(resolve => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(async () => {
      if (inputValue.length > 3) {
        if (cancelTokenSource) cancelTokenSource.cancel();
        cancelTokenSource = axios.CancelToken.source();

        const findSuggestion = await fetchSuggestion(inputValue.trim(), cancelTokenSource.token);
        if (!findSuggestion) return [];
        if (findSuggestion.length > maxSuggestionLength)
          findSuggestion.splice(maxSuggestionLength, findSuggestion.length - maxSuggestionLength);
        resolve(findSuggestion.map(e => ({ label: e.term, value: e.conceptId })));
      } else resolve([]);
    }, debounceInputTime);
  });
}

const Wrap = styled.div`
  padding: 2rem 1rem;
`;
