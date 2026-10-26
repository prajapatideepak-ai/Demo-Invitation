import { useEffect, useState } from "react";

/**
 * Live wedding countdown.
 * Recomputes from `Date.now()` on every tick (instead of decrementing a
 * counter) so the numbers stay correct after the tab has been asleep or
 * backgrounded, and it handles any timezone because the target is parsed
 * from an ISO string that carries its own UTC offset.
 */

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** Remaining milliseconds — 0 once the moment has arrived. */
  remainingMs: number;
  isComplete: boolean;
  /** True when the target date could not be parsed. */
  isInvalid: boolean;
}

const EMPTY: CountdownValue = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  remainingMs: 0,
  isComplete: false,
  isInvalid: false,
};

export function useCountdown(target: string | number | Date): CountdownValue {
  const targetMs = new Date(target).getTime();
  const [value, setValue] = useState<CountdownValue>(() =>
    Number.isNaN(targetMs) ? { ...EMPTY, isInvalid: true } : EMPTY,
  );

  useEffect(() => {
    if (Number.isNaN(targetMs)) {
      setValue({ ...EMPTY, isInvalid: true });
      return;
    }

    let timer: number | undefined;

    const tick = () => {
      const remaining = targetMs - Date.now();
      if (remaining <= 0) {
        setValue({ ...EMPTY, isComplete: true });
        if (timer) window.clearInterval(timer);
        return;
      }

      const totalSeconds = Math.floor(remaining / 1000);
      setValue({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        remainingMs: remaining,
        isComplete: false,
        isInvalid: false,
      });
    };

    tick();
    timer = window.setInterval(tick, 1000);

    // Re-sync immediately when the guest returns to the tab.
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      if (timer) window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [targetMs]);

  return value;
}

export default useCountdown;
