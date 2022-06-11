// @ts-nocheck
import { browser } from '$app/env';
import * as Types from '$lib/graphql-client/generated/graphqlTypes';
import { defaultStoreValue, RequestStatus, ResponseResultType, type PatchType, type RequestParameters, type RequestQueryParameters, type RequestResult } from '@kitql/client';
import { get, writable } from 'svelte/store';
import { kitQLClient } from './kitQLClient';
 
/**
 * Init KitQL (to have clientStarted = true!)
 *
 * Waiting for: https://github.com/sveltejs/kit/issues/4447
 */
export function KQL__Init() {}
 
/* Internal. To skip await on a client side navigation in the load function (from queryLoad)! */
let clientStarted = false; // Will be true on a client side navigation
if (browser) {
	addEventListener('sveltekit:start', () => {
		clientStarted = true;
	});
}
 
/**
 * ResetAllCaches in One function!
 */
export function KQL__ResetAllCaches() {
	KQL_HelloThere.resetCache();
}
 
/* Operations 👇 */
function KQL_HelloThereStore() {
	const operationName = 'KQL_HelloThere';
	const operationType = ResponseResultType.Query;

	// prettier-ignore
	const { subscribe, set, update } = writable<RequestResult<Types.HelloThereQuery, Types.HelloThereQueryVariables>>({...defaultStoreValue, operationName, operationType});

		async function queryLocal(
			params?: RequestQueryParameters<Types.HelloThereQueryVariables>
		): Promise<RequestResult<Types.HelloThereQuery, Types.HelloThereQueryVariables>> {
			let { fetch, variables, settings } = params ?? {};
			let { cacheMs, policy } = settings ?? {};

			const storedVariables = get(KQL_HelloThere).variables;
			variables = variables ?? storedVariables;
			policy = policy ?? kitQLClient.policy;

			// Cache only in the browser for now. In SSR, we will need session identif to not mix peoples data
			if (browser) {
				if (policy !== 'network-only') {
					// prettier-ignore
					const cachedData = kitQLClient.requestCache<Types.HelloThereQuery, Types.HelloThereQueryVariables>({
						variables, operationName, cacheMs,	browser
					});
					if (cachedData) {
						const result = { ...cachedData, isFetching: false, status: RequestStatus.DONE };
						if (policy === 'cache-first') {
							set(result);
							if (!result.isOutdated) {
								return result;
							}
						} else if (policy === 'cache-only') {
							set(result);
							return result;
						} else if (policy === 'cache-and-network') {
							set(result);
						}
					}
				}
			}

			update((c) => {
				return { ...c, isFetching: true, status: RequestStatus.LOADING };
			});

			// prettier-ignore
			const res = await kitQLClient.request<Types.HelloThereQuery, Types.HelloThereQueryVariables>({
				skFetch: fetch,
				document: Types.HelloThereDocument,
				variables, 
				operationName, 
				operationType, 
				browser
			});
			const result = { ...res, isFetching: false, status: RequestStatus.DONE, variables };
			set(result);
			return result;
		}

	return {
		subscribe,

		/**
		 * Can be used for SSR, but simpler option is `.queryLoad`
		 * @returns fill this store & the cache
		 */
		query: queryLocal,

		/**
		 * Ideal for SSR query. To be used in SvelteKit load function
		 * @returns fill this store & the cache
		 */
		queryLoad: async (
			params?: RequestQueryParameters<Types.HelloThereQueryVariables>
		): Promise<void> => {
			if (clientStarted) {
				queryLocal(params); // No await on purpose, we are in a client navigation.
			} else {
				await queryLocal(params);
			}
		},

		/**
		 * Reset Cache
		 */
		resetCache(
			variables: Types.HelloThereQueryVariables | null = null,
			allOperationKey: boolean = true,
			withResetStore: boolean = true
		) {
			kitQLClient.cacheRemove(operationName, { variables, allOperationKey });
			if (withResetStore) {
				set({ ...defaultStoreValue, operationName });
			}
		},

		/**
		 * Patch the store &&|| cache with some data.
		 */
		// prettier-ignore
		patch(data: Types.HelloThereQuery, variables: Types.HelloThereQueryVariables | null = null, type: PatchType = 'cache-and-store'): void {
			let updatedCacheStore = undefined;
			if(type === 'cache-only' || type === 'cache-and-store') {
				updatedCacheStore = kitQLClient.cacheUpdate<Types.HelloThereQuery, Types.HelloThereQueryVariables>(operationName, data, { variables });
			}
			if(type === 'store-only' ) {
				let toReturn = { ...get(KQL_HelloThere), data, variables } ;
				set(toReturn);
			}
			if(type === 'cache-and-store' ) {
				set({...get(KQL_HelloThere), ...updatedCacheStore});
			}
			kitQLClient.logInfo(operationName, "patch", type);
		}
	};
}
/**
 * KitQL Svelte Store with the latest `HelloThere` Operation
 */
export const KQL_HelloThere = KQL_HelloThereStore();

function KQL_SendItStore() {
	const operationName = 'KQL_SendIt';
	const operationType = ResponseResultType.Mutation;

	// prettier-ignore
	const { subscribe, set, update } = writable<RequestResult<Types.SendItMutation, Types.SendItMutationVariables>>({...defaultStoreValue, operationName, operationType});

		async function mutateLocal(
			params?: RequestParameters<Types.SendItMutationVariables>
		): Promise<RequestResult<Types.SendItMutation, Types.SendItMutationVariables>> {
			let { fetch, variables } = params ?? {};

			const storedVariables = get(KQL_SendIt).variables;
			variables = variables ?? storedVariables;

			update((c) => {
				return { ...c, isFetching: true, status: RequestStatus.LOADING };
			});

			// prettier-ignore
			const res = await kitQLClient.request<Types.SendItMutation, Types.SendItMutationVariables>({
				skFetch: fetch,
				document: Types.SendItDocument,
				variables, 
				operationName, 
				operationType, 
				browser
			});
			const result = { ...res, isFetching: false, status: RequestStatus.DONE, variables };
			set(result);
			return result;
		}

	return {
		subscribe,

		/**
		 * Can be used for SSR, but simpler option is `.queryLoad`
		 * @returns fill this store & the cache
		 */
		mutate: mutateLocal,

	};
}
/**
 * KitQL Svelte Store with the latest `SendIt` Operation
 */
export const KQL_SendIt = KQL_SendItStore();
