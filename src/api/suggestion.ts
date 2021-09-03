import axios, { AxiosResponse, CancelToken } from 'axios';
import qs from 'qs';
import { SuggestionList } from '../types/query-response';
import { axiosInstance } from '../utils/axios-instance';

export async function fetchSuggestion(text: string, cancelToken?: CancelToken): Promise<SuggestionList[] | undefined> {
  try {
    const res: AxiosResponse<SuggestionList[]> = await axiosInstance({
      method: 'GET',
      url: 'suggestion/?' + qs.stringify({ q: text }),
      cancelToken: cancelToken,
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
