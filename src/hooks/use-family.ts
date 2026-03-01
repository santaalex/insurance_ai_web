import useSWR from 'swr';
import { request } from '@/lib/request';
import { useAuthStore } from '@/store/auth';

export interface FamilyMember {
    id: string;
    name: string;
    identity_no: string;
    relation: string;
}

export interface FamilyListResponse {
    master_phone: string;
    count: number;
    members: FamilyMember[];
}

const fetcher = (url: string) => request.get(url).then(res => res.data);

export function useFamily() {
    const token = useAuthStore(state => state.token);

    // Only fetch if the user is authenticated
    const { data, error, isLoading, mutate } = useSWR<FamilyListResponse>(
        !!token ? '/family/list' : null,
        fetcher
    );

    return {
        members: data?.members || [],
        master_phone: data?.master_phone,
        total: data?.count || 0,
        isLoading,
        isError: error,
        mutate
    };
}
