import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export interface FeatureFlags {
    assessments_enabled: boolean;
    ai_features_enabled: boolean;
    advanced_analytics_enabled: boolean;
}

const defaultFlags: FeatureFlags = {
    assessments_enabled: false,
    ai_features_enabled: false,
    advanced_analytics_enabled: false,
};

export function useFeatureFlags() {
    const { data, isLoading } = useQuery<FeatureFlags>({
        queryKey: ['feature-flags'],
        queryFn: async () => {
            const res = await api.get('/api/v1/config/features');
            return res.data;
        },
        staleTime: 60_000, // re-check once per minute
        retry: 1,
    });

    return {
        flags: data ?? defaultFlags,
        isLoading,
    };
}
