import type { CancelToken } from 'axios';
import axios from 'axios';
import qs from 'qs';
import type { SuggestionList } from '../types/query-response';
import { axiosInstance, axiosMedApi } from '../utils/axios-instance';
import type { MedMasterParams, UsageRequestParams } from './med-api-path';
import { MedApiPathEnum } from './med-api-path';
import type { MedicationMasterCsv, MedicationUsageDenormalized } from './med-api-redis-model';
import type { MedicationMasterOkResponse, MedicationUsageDenormalizedOkResponse } from './med-api-response';

export async function fetchSuggestion(text: string, cancelToken?: CancelToken): Promise<SuggestionList[] | undefined> {
  try {
    const res = await axiosInstance.get<SuggestionList[]>('suggestion/?' + qs.stringify({ q: text }), {
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

export async function fetchMedicationMaster(
  text: string,
  cancelToken?: CancelToken
): Promise<MedicationMasterCsv[] | undefined> {
  const params: MedMasterParams = { s: text };
  try {
    const res = await axiosMedApi.get<MedicationMasterOkResponse>(MedApiPathEnum.medMaster, { params, cancelToken });
    return res.data.payload;
  } catch (error) {
    if (axios.isCancel(error)) console.log('Request canceled');
    else {
      console.error(error);
    }
    return undefined;
  }
}

export async function fetchMedUsage(
  text: string,
  medId: string | undefined,
  cancelToken?: CancelToken
): Promise<MedicationUsageDenormalized[] | undefined> {
  try {
    const params: UsageRequestParams = { s: text, id: medId };
    const res = await axiosMedApi.get<MedicationUsageDenormalizedOkResponse>(MedApiPathEnum.usage, {
      params,
      cancelToken,
    });
    return res.data.payload;
  } catch (error) {
    if (axios.isCancel(error)) console.log('Request canceled');
    else {
      console.error(error);
    }
    return undefined;
  }
}
