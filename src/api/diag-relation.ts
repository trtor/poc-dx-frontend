import axios, { AxiosResponse } from 'axios';
import qs from 'qs';
import { axiosInstance } from '../utils/axios-instance';

export async function fetchDiagnosisRelation<T>(conceptId: string, url: string): Promise<T[] | undefined> {
  try {
    const res: AxiosResponse<T[]> = await axiosInstance({
      method: 'GET',
      url: url + '?' + qs.stringify({ conceptId }),
    });
    return res.data;
  } catch (error) {
    if (axios.isCancel(error)) console.log('Request canceled');
    else console.error(error);
    return undefined;
  }
}
