import styled from 'styled-components';

export const SuggestedNarrowTerm = styled.span`
  display: block;
  padding: 0.2rem 0;
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

export const CloseSuggestion = styled.div`
  color: #970a0a;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
