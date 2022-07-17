import type { AxiosResponse, CancelToken } from 'axios';
import axios from 'axios';
import qs from 'qs';
import type { SuggestionList } from '../types/query-response';
import { axiosInstance } from '../utils/axios-instance';

export async function fetchSuggestion(text: string, cancelToken?: CancelToken): Promise<SuggestionList[] | undefined> {
  try {
    const res: AxiosResponse<SuggestionList[]> = await axiosInstance.get('suggestion/?' + qs.stringify({ q: text }), {
      cancelToken,
    });
    return res.data;
  } catch (error) {
    if (axios.isCancel(error)) console.log('Request canceled');
    else {
      console.error(error);
    }
    return undefined;
  }
}
