/* eslint-disable no-console */
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios from 'axios';

const axiosConfig: AxiosRequestConfig = {
  headers: { 'Content-Type': 'application/json' },
};

export const axiosInstance: AxiosInstance = axios.create({
  ...axiosConfig,
  baseURL: (process.env['REACT_APP_API_BASEURL'] || '') + '/snomed-suggestion',
});

export const axiosMedApi: AxiosInstance = axios.create({
  ...axiosConfig,
  baseURL: process.env['REACT_APP_API_BASEURL'] || '',
});

if (process.env['REACT_APP_API_BASEURL'] === undefined) console.info('Some ENV are null, Axios instance');
