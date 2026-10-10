import { useEffect, useRef, useState } from "react";

import styles from "./GithubActivity.module.css";
import { LinkIcon } from "./icons/LinkIcon";

type Day = { date: string; count: number; level: number };
type Activity = { total: { lastYear: number }; contributions: Day[] };
type SavedActivity = { data: Activity; savedAt: number };
const endpoint =
  "https://github-contributions-api.jogruber.de/v4/vidvidvid?y=last";
const cacheKey = "vid:github-activity:v1";
const hour = 60 * 60 * 1000;
const number = new Intl.NumberFormat("en-US");
const date = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

// The public API mirrors GitHub's contribution calendar and caches for one hour.
// Keep credentials out of the static site; never substitute made-up activity.
export function isActivity(value: unknown): value is Activity {
  const candidate = value as Activity | undefined;
  return (
    !!candidate &&
    Number.isFinite(candidate.total?.lastYear) &&
    candidate.total.lastYear >= 0 &&
    Array.isArray(candidate.contributions) &&
    candidate.contributions.length > 0 &&
    candidate.contributions.every(
      (day) =>
        !!day &&
        /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
        Number.isFinite(Date.parse(day.date)) &&
        Number.isInteger(day.count) &&
        day.count >= 0 &&
        Number.isInteger(day.level) &&
        day.level >= 0 &&
        day.level <= 4,
    )
  );
}

export function GithubActivity() {
  const [saved, setSaved] = useState<SavedActivity | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "stale">(
    "loading",
  );
  const [retry, setRetry] = useState(0);
  const [selected, setSelected] = useState<Day | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const cells = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    let controller: AbortController | null = null;
    let timeout: ReturnType<typeof setTimeout>;
    let lastUpdated = 0;
    try {
      const cached = JSON.parse(
        localStorage.getItem(cacheKey) || "null",
      ) as SavedActivity | null;
      if (
        cached &&
        isActivity(cached.data) &&
        Number.isFinite(cached.savedAt) &&
        Date.now() - cached.savedAt < 7 * 24 * hour
      ) {
        setSaved(cached);
        lastUpdated = cached.savedAt;
        if (Date.now() - lastUpdated < hour) setStatus("ready");
      }
    } catch {
      /* Storage can be unavailable; the live request still works. */
    }
    const refresh = async () => {
      controller?.abort();
      clearTimeout(timeout);
      controller = new AbortController();
      const request = controller;
      timeout = setTimeout(() => request.abort(), 12000);
      try {
        const response = await fetch(endpoint, { signal: request.signal });
        if (!response.ok) throw new Error("Activity unavailable");
        const data: unknown = await response.json();
        if (!isActivity(data)) throw new Error("Invalid activity");
        if (cancelled || request !== controller) return;
        const next = { data, savedAt: Date.now() };
        lastUpdated = next.savedAt;
        setSaved(next);
        setStatus("ready");
        try {
          localStorage.setItem(cacheKey, JSON.stringify(next));
        } catch {
          /* Optional cache. */
        }
      } catch {
        if (!cancelled && request === controller) setStatus("stale");
      } finally {
        if (request === controller) clearTimeout(timeout);
      }
    };
    if (retry || Date.now() - lastUpdated >= hour) void refresh();
    const check = () => {
      if (!document.hidden && Date.now() - lastUpdated >= hour) void refresh();
    };
    const interval = setInterval(check, hour);
    document.addEventListener("visibilitychange", check);
    return () => {
      cancelled = true;
      controller?.abort();
      clearTimeout(timeout);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", check);
    };
  }, [retry]);

  const days = saved?.data.contributions ?? [];
  const offset = days[0]
    ? new Date(`${days[0].date}T00:00:00Z`).getUTCDay()
    : 0;
  const weeks = Math.ceil((offset + days.length) / 7);
  const monthLabels: { label: string; week: number }[] = [];
  let previousMonth = "";
  days.forEach((day, index) => {
    const month = day.date.slice(0, 7);
    if (month !== previousMonth) {
      const week = Math.floor((index + offset) / 7);
      if (
        !monthLabels.length ||
        (week < weeks - 2 &&
          week - monthLabels[monthLabels.length - 1]!.week > 2)
      ) {
        monthLabels.push({
          label: new Date(`${day.date}T00:00:00Z`).toLocaleString("en", {
            month: "short",
            timeZone: "UTC",
          }),
          week,
        });
      }
      previousMonth = month;
    }
  });
  const activeDays = days.filter((day) => day.count > 0).length;
  const busiest = Math.max(0, ...days.map((day) => day.count));
  const dayLabel = (day: Day) =>
    `${number.format(day.count)} contribution${day.count === 1 ? "" : "s"} on ${date.format(new Date(`${day.date}T00:00:00Z`))}`;

  return (
    <section className={styles.activity} aria-label="GitHub contributions">
      <div className={styles.header}>
        <div className={styles.total} aria-live="polite">
          <strong>
            {saved ? number.format(saved.data.total.lastYear) : "—"}
          </strong>
          <span>
            contributions
            <br />
            <small>in the last year</small>
          </span>
        </div>
        <a href="https://github.com/vidvidvid" target="_blank" rel="noreferrer">
          github / vidvidvid <LinkIcon />
        </a>
      </div>
      {saved ? (
        <>
          <div className={styles.scroll}>
            <div
              className={styles.calendar}
              style={{ "--weeks": weeks } as React.CSSProperties}
            >
              <div className={styles.months} aria-hidden="true">
                {monthLabels.map((month, index) => (
                  <span key={index} style={{ gridColumn: month.week + 1 }}>
                    {month.label}
                  </span>
                ))}
              </div>
              <div className={styles.weekdays} aria-hidden="true">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              <div
                className={styles.cells}
                role="group"
                aria-label="Daily contributions. Use arrow keys to explore."
                onMouseLeave={() => setSelected(null)}
              >
                {days.map((day, index) => (
                  <button
                    key={day.date}
                    ref={(element) => {
                      cells.current[index] = element;
                    }}
                    className={styles.day}
                    data-level={day.level}
                    data-cursor="inspect"
                    style={{
                      gridColumn: Math.floor((index + offset) / 7) + 1,
                      gridRow: ((index + offset) % 7) + 1,
                    }}
                    aria-label={dayLabel(day)}
                    title={dayLabel(day)}
                    tabIndex={index === focusIndex ? 0 : -1}
                    onMouseEnter={() => setSelected(day)}
                    onFocus={() => {
                      setFocusIndex(index);
                      setSelected(day);
                    }}
                    onBlur={() => setSelected(null)}
                    onClick={() => {
                      setFocusIndex(index);
                      setSelected(day);
                    }}
                    onKeyDown={(event) => {
                      const steps: Record<string, number> = {
                        ArrowUp: -1,
                        ArrowDown: 1,
                        ArrowLeft: -7,
                        ArrowRight: 7,
                        Home: -days.length,
                        End: days.length,
                      };
                      if (steps[event.key] === undefined) return;
                      event.preventDefault();
                      const next = Math.max(
                        0,
                        Math.min(days.length - 1, index + steps[event.key]!),
                      );
                      cells.current[next]?.focus();
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={styles.bottom}>
            <span>
              {selected
                ? dayLabel(selected)
                : `${activeDays} active days · ${number.format(busiest)} on the busiest day`}
            </span>
            <div className={styles.legend} aria-hidden="true">
              less{" "}
              {[0, 1, 2, 3, 4].map((level) => (
                <i key={level} data-level={level} />
              ))}{" "}
              more
            </div>
          </div>
        </>
      ) : (
        <p className={styles.empty} role="status">
          {status === "loading"
            ? "Loading GitHub activity…"
            : "GitHub activity is temporarily unavailable."}
        </p>
      )}
      {status === "stale" && (
        <div className={styles.notice} role="status">
          {saved
            ? `Showing saved activity from ${new Date(saved.savedAt).toLocaleDateString("en")}.`
            : "You can still view the calendar on GitHub."}{" "}
          <button
            data-cursor="reshape"
            onClick={() => {
              setStatus("loading");
              setRetry((value) => value + 1);
            }}
          >
            Try again
          </button>
        </div>
      )}
    </section>
  );
}
