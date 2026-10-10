type Kind =
  | "external"
  | "forward"
  | "back"
  | "expand"
  | "mobile"
  | "code"
  | "music"
  | "imagery"
  | "words";

const paths: Record<Kind, string> = {
  external:
    "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2",
  forward: "M4 12h16m-7-7 7 7-7 7",
  back: "M20 12H4m7-7-7 7 7 7",
  expand: "M4 9V4h5m6 0h5v5M4 15v5h5m6 0h5v-5",
  mobile:
    "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM11 18h2",
  code: "m7 6-5 6 5 6m10-12 5 6-5 6M14 3l-4 18",
  music: "M3 10v4m4-8v12m5-16v20m5-16v12m4-8v4",
  imagery: "M3 3h18v18H3zM3 16l6-6 12 11M16 7h.01",
  words: "M3 5h18M3 12h14M3 19h8",
};

export const LinkIcon = ({
  kind = "external",
  className,
}: {
  kind?: Kind;
  className?: string;
}) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d={paths[kind]} />
  </svg>
);
