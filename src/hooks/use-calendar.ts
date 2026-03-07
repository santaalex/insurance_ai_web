import useSWR from 'swr';
import { request } from '@/lib/request';
import { useAuthStore } from '@/store/auth';

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'premium' | 'expiry' | 'custom';
    amount?: string;
    policy_description?: string;
    policy_id?: string;
}

export interface CalendarResponse {
    success: boolean;
    count: number;
    data: CalendarEvent[];
}

const fetcher = (url: string) => request.get(url).then(res => res.data);

export function useCalendar() {
    const token = useAuthStore(state => state.token);

    const { data, error, isLoading, mutate } = useSWR<CalendarResponse>(
        !!token ? '/calendar/events' : null,
        fetcher
    );

    return {
        events: data?.data || [],
        total: data?.count || 0,
        isLoading,
        isError: error,
        mutate
    };
}
