import axios, { CancelTokenSource } from 'axios';
import { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import styled from 'styled-components';
import { fetchSuggestion } from '../../api/suggestion';

const debounceInputTime = 50;

type SelectedListType = { label: string; value: string };

let cancelTokenSource: CancelTokenSource | null = null;

export const AppSearchDx: React.FC<RouteComponentProps> = () => {
  const [selectedDx, setSelectedDx] = useState<SelectedListType | null>(null);
  const [selectedList, setSelectedList] = useState<SelectedListType[]>([]);

  const onSelectChange = (option: SelectedListType | null) => {
    if (!option) return;
    setSelectedList([...selectedList, option]);
    // setSelectedDx(option);
    setSelectedDx(null);
  };

  return (
    <Wrap>
      <Checked>
        {selectedList.map((a, i) => {
          return <div key={i}>{a.label}</div>;
        })}
      </Checked>

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

var timeout: ReturnType<typeof setTimeout> | undefined;

async function promiseSuggestion(inputValue: string): Promise<SelectedListType[]> {
  return new Promise(resolve => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(async () => {
      if (inputValue.length > 3) {
        if (cancelTokenSource) cancelTokenSource.cancel();
        cancelTokenSource = axios.CancelToken.source();
        const findSuggestion = await fetchSuggestion(inputValue.trim(), cancelTokenSource.token);
        if (!findSuggestion) return [];
        if (findSuggestion.length > 50) findSuggestion.splice(50, findSuggestion.length - 50);
        resolve(findSuggestion.map(e => ({ label: e.term, value: e.conceptId })));
      } else resolve([]);
    }, debounceInputTime);
  });
}

const Wrap = styled.div`
  padding: 2rem 1rem;
`;

const Checked = styled.div`
  padding: 1rem 1rem;
  margin-bottom: 1rem;
`;
