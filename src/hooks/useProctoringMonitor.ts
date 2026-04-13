import { useEffect, useRef, useCallback, useState } from 'react';
import api from '../services/api';

interface ProctoringEvent {
    event_type: string;
    client_timestamp: string;
    metadata?: Record<string, unknown>;
}

interface EventCounts {
    tab_switch: number;
    focus_lost: number;
    focus_gained: number;
    copy: number;
    paste: number;
    right_click: number;
}

interface UseProctoringMonitorReturn {
    eventCounts: EventCounts;
    isMonitoring: boolean;
    totalViolations: number;
}

const FLUSH_INTERVAL_MS = 10_000; // Send events every 10 seconds

export default function useProctoringMonitor(
    token: string | undefined,
    enabled: boolean
): UseProctoringMonitorReturn {
    const eventQueue = useRef<ProctoringEvent[]>([]);
    const [eventCounts, setEventCounts] = useState<EventCounts>({
        tab_switch: 0,
        focus_lost: 0,
        focus_gained: 0,
        copy: 0,
        paste: 0,
        right_click: 0,
    });
    const [isMonitoring, setIsMonitoring] = useState(false);
    const flushTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const pushEvent = useCallback((type: string, metadata?: Record<string, unknown>) => {
        eventQueue.current.push({
            event_type: type,
            client_timestamp: new Date().toISOString(),
            metadata,
        });
        setEventCounts(prev => ({
            ...prev,
            [type]: (prev[type as keyof EventCounts] || 0) + 1,
        }));
    }, []);

    // Flush events to the backend
    const flushEvents = useCallback(async () => {
        if (!token || eventQueue.current.length === 0) return;
        const batch = [...eventQueue.current];
        eventQueue.current = [];
        try {
            await api.post(`/api/v1/proctor/${token}/events`, { events: batch });
        } catch (err) {
            // Re-queue on failure (non-critical)
            eventQueue.current.unshift(...batch);
            console.warn('[Proctor] Failed to flush events:', err);
        }
    }, [token]);

    useEffect(() => {
        if (!enabled || !token) {
            setIsMonitoring(false);
            return;
        }

        setIsMonitoring(true);

        // ── Visibility Change (tab switch) ───────────────────────────
        const handleVisibilityChange = () => {
            if (document.hidden) {
                pushEvent('tab_switch', { hidden: true });
            }
        };

        // ── Window Focus / Blur ──────────────────────────────────────
        const handleBlur = () => {
            pushEvent('focus_lost');
        };
        const handleFocus = () => {
            pushEvent('focus_gained');
        };

        // ── Copy ─────────────────────────────────────────────────────
        const handleCopy = () => {
            const selection = window.getSelection()?.toString() || '';
            pushEvent('copy', { length: selection.length });
        };

        // ── Paste ────────────────────────────────────────────────────
        const handlePaste = (e: ClipboardEvent) => {
            const pasted = e.clipboardData?.getData('text') || '';
            pushEvent('paste', { length: pasted.length });
        };

        // ── Right Click ──────────────────────────────────────────────
        const handleContextMenu = () => {
            pushEvent('right_click');
        };

        // Attach listeners
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);
        window.addEventListener('focus', handleFocus);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('paste', handlePaste as EventListener);
        document.addEventListener('contextmenu', handleContextMenu);

        // Flush timer
        flushTimerRef.current = setInterval(flushEvents, FLUSH_INTERVAL_MS);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('paste', handlePaste as EventListener);
            document.removeEventListener('contextmenu', handleContextMenu);
            if (flushTimerRef.current) clearInterval(flushTimerRef.current);
            // Final flush on unmount
            flushEvents();
        };
    }, [enabled, token, pushEvent, flushEvents]);

    const totalViolations =
        eventCounts.tab_switch +
        eventCounts.focus_lost +
        eventCounts.copy +
        eventCounts.paste +
        eventCounts.right_click;

    return { eventCounts, isMonitoring, totalViolations };
}
