import useSWR from 'swr';
import { request } from '@/lib/request';
import { useAuthStore } from '@/store/auth';

export interface Policy {
    id: string;
    policy_name: string;
    policy_type: string;
    coverage_amount: string;
    effective_date: string;
    insured_person: string;
    status: string;
}

export interface PolicyListResponse {
    success: boolean;
    count: number;
    data: Policy[];
}

const fetcher = (url: string) => request.get(url).then(res => res.data);

export function usePolicies() {
    const token = useAuthStore(state => state.token);

    // Only fetch if the user is authenticated
    const { data, error, isLoading, mutate } = useSWR<PolicyListResponse>(
        !!token ? '/policy/list' : null,
        fetcher
    );

    return {
        policies: data?.data || [],
        total: data?.count || 0,
        isLoading,
        isError: error,
        mutate
    };
}
