/* eslint-disable no-console */
import axios from 'axios';
import qs from 'qs';
import { axiosInstance } from '../utils/axios-instance';

export async function fetchDiagnosisRelation<T>(conceptId: string, url: string): Promise<T[] | undefined> {
  try {
    const res = await axiosInstance.get<T[]>(url + '?' + qs.stringify({ conceptId }));
    return res.data;
  } catch (error) {
    if (axios.isCancel(error)) console.log('Request canceled');
    else console.error(error);
    return undefined;
  }
}
