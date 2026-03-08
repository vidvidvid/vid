# Chakra UI → CSS Modules Migration

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove Chakra UI entirely and replace with CSS Modules + native HTML elements.

**Architecture:** Each component/page gets a co-located `.module.css` file. Global design tokens (colors, fonts, resets) live in `src/styles/globals.css`. Dialogs use native `<dialog>` element with `createPortal`. All Chakra layout components become plain `<div>`s with CSS classes.

**Tech Stack:** CSS Modules (built into Next.js), native `<dialog>`, React `createPortal`

---

### Task 1: Create global styles and design tokens

**Files:**
- Create: `src/styles/globals.css`

**Step 1: Create `src/styles/globals.css`**

```css
:root {
  /* Teal-mint palette */
  --mint-50: #e6fef7;
  --mint-100: #b3fceb;
  --mint-200: #80fadf;
  --mint-300: #4df8d3;
  --mint-400: #1af6c7;
  --mint-500: #0fd9a6;
  --mint-600: #0bb88a;
  --mint-700: #089770;
  --mint-800: #067656;
  --mint-900: #04553c;

  /* Violet-indigo palette */
  --violet-50: #f3effe;
  --violet-100: #ddd1fc;
  --violet-200: #c4b0fa;
  --violet-300: #a78bfa;
  --violet-400: #8b5cf6;
  --violet-500: #7c3aed;
  --violet-600: #6d28d9;
  --violet-700: #5b21b6;
  --violet-800: #4c1d95;
  --violet-900: #3b0764;

  /* Amber-gold palette */
  --amber-50: #fef9e7;
  --amber-100: #fdeeb3;
  --amber-200: #fce380;
  --amber-300: #fbd84d;
  --amber-400: #fbbf24;
  --amber-500: #f59e0b;
  --amber-600: #d97706;
  --amber-700: #b45309;
  --amber-800: #92400e;
  --amber-900: #78350f;

  /* Pink accents */
  --pink-100: #fce7f3;
  --pink-200: #fbcfe8;
  --pink-300: #f9a8d4;

  /* Gray */
  --gray-400: #9ca3af;
  --gray-600: #4b5563;

  /* Alpha colors */
  --black-alpha-400: rgba(0, 0, 0, 0.4);
  --black-alpha-800: rgba(0, 0, 0, 0.8);
  --white-alpha-50: rgba(255, 255, 255, 0.04);
  --white-alpha-100: rgba(255, 255, 255, 0.08);
  --white-alpha-300: rgba(255, 255, 255, 0.2);
  --white-alpha-400: rgba(255, 255, 255, 0.3);
  --white-alpha-500: rgba(255, 255, 255, 0.4);
  --white-alpha-800: rgba(255, 255, 255, 0.8);
  --white-alpha-900: rgba(255, 255, 255, 0.92);

  /* Font */
  --font-body: 'Sono', sans-serif;

  /* Breakpoints for reference (used in media queries):
     sm: 480px, md: 768px, lg: 992px, xl: 1280px */
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-body);
  background: #000;
  color: #fff;
  color-scheme: dark;
  -webkit-font-smoothing: antialiased;
}

a {
  color: inherit;
  text-decoration: none;
}

button {
  font-family: inherit;
  cursor: pointer;
}

dialog {
  border: none;
  padding: 0;
  background: transparent;
  color: inherit;
}

dialog::backdrop {
  background: rgba(0, 0, 0, 0.7);
}
```

**Step 2: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat: add global CSS tokens and reset for chakra migration"
```

---

### Task 2: Update `_app.tsx` and `_document.tsx` — remove Chakra provider

**Files:**
- Modify: `src/pages/_app.tsx`
- Modify: `src/pages/_document.tsx`

**Step 1: Rewrite `_app.tsx`**

Remove ChakraProvider, import globals.css instead:

```tsx
import '../static/frame.css';
import '../static/hover.css';
import '../styles/globals.css';
import '@fontsource/sono';

import type { AppProps } from 'next/app';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default MyApp;
```

**Step 2: Clean up `_document.tsx`**

Remove the `className="dark"` (no longer needed for Chakra). Keep `colorScheme: 'dark'`:

```tsx
import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" style={{ colorScheme: 'dark' }}>
        <Head />
        <body style={{ margin: 0 }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

**Step 3: Commit**

```bash
git add src/pages/_app.tsx src/pages/_document.tsx
git commit -m "feat: remove ChakraProvider, use globals.css"
```

---

### Task 3: Migrate `Main.tsx` template

**Files:**
- Create: `src/templates/Main.module.css`
- Modify: `src/templates/Main.tsx`

**Step 1: Create `src/templates/Main.module.css`**

```css
.navbar {
  height: 48px;
  position: fixed;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 12px;
  align-items: center;
  background-color: var(--black-alpha-800);
  z-index: 1;
}

.navbar a {
  color: var(--white-alpha-800);
  transition: color 0.2s;
}

.navbar a:hover {
  color: #fff;
}
```

**Step 2: Rewrite `Main.tsx`**

```tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';

import styles from './Main.module.css';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => {
  const router = useRouter();
  const isHome = router.pathname === '/';

  return (
    <div
      style={{
        height: isHome ? '100vh' : 'auto',
        minHeight: '100vh',
        width: '100vw',
        overflowX: 'hidden',
      }}
    >
      {props.meta}

      {!isHome && (
        <div className={styles.navbar}>
          <Link href="/">Home</Link>
          <Link href="/code">Code</Link>
          <Link href="/music">Music</Link>
          <Link href="/imagery">Imagery</Link>
          <Link href="/words">Words</Link>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          width: '100%',
          height: isHome ? '100%' : 'auto',
          minHeight: isHome ? '100%' : undefined,
          justifyContent: 'center',
          alignItems: isHome ? 'center' : 'flex-start',
          flexDirection: 'column',
        }}
      >
        {props.children}
      </div>
    </div>
  );
};

export { Main };
```

**Step 3: Commit**

```bash
git add src/templates/Main.module.css src/templates/Main.tsx
git commit -m "feat: migrate Main template from Chakra to CSS Modules"
```

---

### Task 4: Migrate `Footer.tsx`

**Files:**
- Create: `src/components/Footer.module.css`
- Modify: `src/components/Footer.tsx`

**Step 1: Create `src/components/Footer.module.css`**

```css
.footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  z-index: 1000;
  gap: 8px;
  padding-top: 32px;
  padding-bottom: 16px;
  font-size: 0.875rem;
  background: linear-gradient(transparent, rgba(255, 255, 255, 0.1));
}

.icons {
  display: flex;
  gap: 16px;
  font-size: 1.25rem;
}

.iconLink {
  color: white;
  transition: color 0.2s;
}

.iconLink:hover {
  color: var(--mint-500);
}
```

**Step 2: Rewrite `Footer.tsx`**

```tsx
import type { SVGProps } from 'react';

import { GithubIcon } from '@/components/icons/GithubIcon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';

import styles from './Footer.module.css';

type IconLinkType = {
  Icon: React.FC<SVGProps<SVGSVGElement>>;
  href: string;
};

const iconLinks: IconLinkType[] = [
  { Icon: TwitterIcon, href: 'https://twitter.com/viiiiiiiiiiiid' },
  { Icon: GithubIcon, href: 'https://github.com/vidvidvid' },
];

const IconLink = ({ Icon, href }: IconLinkType) => (
  <a
    href={href}
    className={styles.iconLink}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon />
  </a>
);

export const Footer: React.FC = () => (
  <div className={styles.footer}>
    <div className={styles.icons}>
      {iconLinks.map((l) => (
        <IconLink key={l.href} {...l} />
      ))}
    </div>
    <p>2026 vid</p>
  </div>
);
```

**Step 3: Commit**

```bash
git add src/components/Footer.module.css src/components/Footer.tsx
git commit -m "feat: migrate Footer from Chakra to CSS Modules"
```

---

### Task 5: Migrate `StripButton.tsx`

**Files:**
- Create: `src/components/StripButton.module.css`
- Modify: `src/components/StripButton.tsx`

**Step 1: Create `src/components/StripButton.module.css`**

```css
.wrapper {
  position: relative;
  cursor: pointer;
}

.strip {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 100vw;
  opacity: 0.85;
  z-index: -1;
  transform: translateX(-50%);
  cursor: pointer;
}

.label {
  padding: 4px;
  color: white;
}
```

**Step 2: Rewrite `StripButton.tsx`**

Replace `Box` with `<div>` + CSS module classes. Keep all the ref/animation logic unchanged.

```tsx
import { useEffect, useRef, useState } from 'react';

import { hoverState } from '@/components/3js/Crazy';

import styles from './StripButton.module.css';

type StripButtonProps = {
  label: string;
  mode: string;
  stripColor: string;
  onClick: () => void;
};

const StripButton = ({ label, mode, stripColor, onClick }: StripButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    const update = () => {
      if (labelRef.current && stripRef.current) {
        const computed = getComputedStyle(stripRef.current).backgroundColor;
        const rgbMatch = computed.match(
          /rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)/
        );
        if (rgbMatch) {
          const r = parseFloat(rgbMatch[1]!) / 255;
          const g = parseFloat(rgbMatch[2]!) / 255;
          const b = parseFloat(rgbMatch[3]!) / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = ((max + min) / 2) * 100;
          let h = 0;
          let s = 0;
          if (max !== min) {
            const d = max - min;
            s = (l > 50 ? d / (2 - max - min) : d / (max + min)) * 100;
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
            else if (max === g) h = ((b - r) / d + 2) * 60;
            else h = ((r - g) / d + 4) * 60;
          }
          const textH = (h + 180) % 360;
          const textL = l > 50 ? Math.max(10, l - 45) : Math.min(90, l + 45);
          labelRef.current.style.color = `hsl(${textH}, ${Math.min(s, 90)}%, ${textL}%)`;
        }
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={styles.wrapper}
      onClick={onClick}
      onMouseEnter={() => {
        hoverState.mode = mode;
        setHovered(true);
      }}
      onMouseLeave={() => {
        hoverState.mode = null;
        setHovered(false);
      }}
    >
      <div
        ref={stripRef}
        className={styles.strip}
        style={{ backgroundColor: hovered ? 'var(--strip-bg, #333)' : stripColor }}
      />
      <div ref={labelRef} className={styles.label}>
        {label}
      </div>
    </div>
  );
};

export default StripButton;
```

**Step 3: Commit**

```bash
git add src/components/StripButton.module.css src/components/StripButton.tsx
git commit -m "feat: migrate StripButton from Chakra to CSS Modules"
```

---

### Task 6: Migrate `CountdownTimer.tsx`

**Files:**
- Modify: `src/components/CountdownTimer.tsx`

**Step 1: Rewrite `CountdownTimer.tsx`**

Simple component — just replace Flex/Text with divs/spans, inline flex style:

```tsx
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  date: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ date }) => {
  function calculateTimeLeft() {
    const difference = +date - +new Date();
    let timeLeft = {} as {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ display: 'flex', gap: 4 }}>
      <span>{timeLeft.days}d</span>
      <span>{timeLeft.hours}h</span>
      <span>{timeLeft.minutes}m</span>
      <span>{timeLeft.seconds}s</span>
    </div>
  );
};

export default CountdownTimer;
```

**Step 2: Commit**

```bash
git add src/components/CountdownTimer.tsx
git commit -m "feat: migrate CountdownTimer from Chakra to plain HTML"
```

---

### Task 7: Migrate `Card.tsx`

**Files:**
- Create: `src/components/Card.module.css`
- Modify: `src/components/Card.tsx`

**Step 1: Create `src/components/Card.module.css`**

```css
.card {
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.inner {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.code {
  padding-top: 12px;
  text-align: justify;
  font-size: 12px;
  padding: 8px;
  color: black;
  font-family: monospace;
  background: var(--white-alpha-800);
  border-radius: 4px;
}
```

**Step 2: Rewrite `Card.tsx`**

```tsx
import React, { useEffect } from 'react';

import styles from './Card.module.css';

interface CardProps {
  element: React.ReactElement;
  description: string;
  index: number;
}

const Card: React.FC<CardProps> = ({ element, description, index }) => {
  useEffect(() => {
    const colors = [
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
    ];

    const el = document.querySelector(
      `#image-${index.toString()}`
    ) as HTMLElement;
    el.style.setProperty('--color-1', colors[0] || 'red');
    el.style.setProperty('--color-2', colors[1] || 'blue');
    el.style.setProperty('--color-3', colors[2] || 'green');
    el.style.setProperty('--color-4', colors[3] || 'yellow');
    el.style.setProperty('--color-5', colors[4] || 'purple');
  }, []);

  return (
    <div
      className={`${styles.card} frame`}
      id={`image-${index.toString()}`}
    >
      <div className={styles.inner}>
        {element}
        <span className={styles.code}>{description}</span>
      </div>
    </div>
  );
};

export default Card;
```

**Step 3: Commit**

```bash
git add src/components/Card.module.css src/components/Card.tsx
git commit -m "feat: migrate Card from Chakra to CSS Modules"
```

---

### Task 8: Migrate `CodeCard.tsx`

**Files:**
- Create: `src/components/CodeCard.module.css`
- Modify: `src/components/CodeCard.tsx`

**Step 1: Create `src/components/CodeCard.module.css`**

```css
.link {
  text-decoration: none;
}

.link:hover {
  text-decoration: none;
}

.card {
  border-width: 1px;
  border-style: solid;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.25s ease;
  width: 100%;
  height: 100%;
}

.card:hover {
  transform: translateY(-4px);
}

.cardDefault {
  border-color: var(--white-alpha-100);
  background: var(--white-alpha-50);
}

.cardDefault:hover {
  border-color: var(--white-alpha-300);
  background: var(--white-alpha-100);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
}

.cardCurrent {
  border-color: var(--mint-700);
  background: var(--white-alpha-100);
}

.cardCurrent:hover {
  border-color: var(--mint-500);
  background: var(--white-alpha-100);
  box-shadow: 0 8px 30px rgba(15, 217, 166, 0.1);
}

.cardHobby {
  border-color: var(--violet-800);
  background: var(--white-alpha-100);
}

.cardHobby:hover {
  border-color: var(--violet-500);
  background: var(--white-alpha-100);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.1);
}

.content {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 20px;
  gap: 20px;
}

.image {
  object-fit: contain;
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 8px;
}

.fallbackIcon {
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fallbackLetter {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--white-alpha-800);
  user-select: none;
}

.info {
  flex: 1;
  min-width: 0;
}

.nameRow {
  display: flex;
  align-items: center;
  gap: 8px;
}

.name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--white-alpha-900);
}

.currentBadge {
  font-size: 0.75rem;
  color: var(--mint-400);
  font-weight: 500;
  letter-spacing: 0.05em;
}

.hobbyBadge {
  font-size: 0.75rem;
  color: var(--violet-400);
  font-weight: 500;
  letter-spacing: 0.05em;
}

.githubLink {
  color: var(--white-alpha-400);
  transition: color 0.2s;
}

.githubLink:hover {
  color: var(--white-alpha-800);
}

.description {
  margin-top: 6px;
  font-size: 0.875rem;
  color: var(--white-alpha-500);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Step 2: Rewrite `CodeCard.tsx`**

```tsx
import { GithubIcon } from './icons/GithubIcon';
import styles from './CodeCard.module.css';

interface Props {
  image?: string;
  name: string;
  description: string;
  githubLink?: string;
  websiteLink?: string;
  current?: boolean;
  hobby?: boolean;
}

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    // eslint-disable-next-line no-bitwise
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return ((hash % 360) + 360) % 360;
}

const CodeCard = ({
  image,
  name,
  description,
  githubLink,
  websiteLink,
  current,
  hobby,
}: Props) => {
  const fallbackHue = hashName(name);
  const cardVariant = current
    ? styles.cardCurrent
    : hobby
      ? styles.cardHobby
      : styles.cardDefault;

  return (
    <a
      href={websiteLink ?? '#'}
      target={websiteLink ? '_blank' : undefined}
      rel={websiteLink ? 'noopener noreferrer' : undefined}
      className={styles.link}
    >
      <div className={`${styles.card} ${cardVariant}`}>
        <div className={styles.content}>
          {image ? (
            <img
              src={`/assets/code/${image}`}
              alt={name}
              className={styles.image}
            />
          ) : (
            <div
              className={styles.fallbackIcon}
              style={{ background: `hsl(${fallbackHue}, 40%, 30%)` }}
            >
              <span className={styles.fallbackLetter}>
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          <div className={styles.info}>
            <div className={styles.nameRow}>
              <span className={styles.name}>{name}</span>
              {current && <span className={styles.currentBadge}>current</span>}
              {hobby && <span className={styles.hobbyBadge}>hobby</span>}
              {githubLink && (
                <a
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.githubLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  <GithubIcon />
                </a>
              )}
            </div>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default CodeCard;
```

**Step 3: Commit**

```bash
git add src/components/CodeCard.module.css src/components/CodeCard.tsx
git commit -m "feat: migrate CodeCard from Chakra to CSS Modules"
```

---

### Task 9: Migrate `EpilepsyTrigger.tsx`

**Files:**
- Create: `src/components/EpilepsyTrigger.module.css`
- Modify: `src/components/EpilepsyTrigger.tsx`

**Step 1: Create `src/components/EpilepsyTrigger.module.css`**

```css
.dialogContent {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90vw;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1002;
}

.dialogTitle {
  color: #3ee587;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.dialogBody {
  font-size: 20px;
}

.doNot {
  display: inline-flex;
  color: #ff11a6;
  font-size: 30px;
  text-decoration: underline;
}

.hereButton {
  padding: 16px;
  margin-top: -8px;
  color: #76eaff;
  margin-left: 4px;
  font-size: 30px;
  background: none;
  border: none;
}

.hereButton:hover {
  opacity: 0.8;
}

.closeButton {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: var(--white-alpha-500);
  font-size: 20px;
  cursor: pointer;
}

.closeButton:hover {
  color: #fff;
}

.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1001;
}
```

**Step 2: Rewrite `EpilepsyTrigger.tsx`**

Use native `<dialog>` with `createPortal`:

```tsx
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import StripButton from '@/components/StripButton';

import styles from './EpilepsyTrigger.module.css';

type EpilepsyTriggerProps = {
  title: string;
  location: string;
  stripColor: string;
};

const EpilepsyTrigger = ({ title, location, stripColor }: EpilepsyTriggerProps) => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  const dialogContent = (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      className={styles.dialogContent}
    >
      <div className={styles.dialogTitle}>EPILEPSY WARNING</div>
      <button className={styles.closeButton} onClick={() => setOpen(false)}>
        ✕
      </button>
      <div className={styles.dialogBody}>
        Flashing stuff incoming. If you have epilepsy, please{' '}
        <span className={styles.doNot}>do not</span>{' '}
        click
        <button
          className={styles.hereButton}
          onClick={() => {
            window.location.href = `/${location}`;
          }}
        >
          here
        </button>
      </div>
    </dialog>
  );

  return (
    <>
      <StripButton
        label={title}
        mode="imagery"
        stripColor={stripColor}
        onClick={() => setOpen(true)}
      />
      {typeof document !== 'undefined' && createPortal(dialogContent, document.body)}
    </>
  );
};

export default EpilepsyTrigger;
```

**Step 3: Commit**

```bash
git add src/components/EpilepsyTrigger.module.css src/components/EpilepsyTrigger.tsx
git commit -m "feat: migrate EpilepsyTrigger to native dialog + CSS Modules"
```

---

### Task 10: Migrate `Reader.tsx`

**Files:**
- Create: `src/components/Reader.module.css`
- Modify: `src/components/Reader.tsx`

**Step 1: Create `src/components/Reader.module.css`**

```css
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.navButton {
  background: none;
  border: none;
  color: var(--white-alpha-500);
  font-size: 1.25rem;
  padding: 8px;
}

.navButton:disabled {
  opacity: 0.3;
  cursor: default;
}

.navButton:not(:disabled):hover {
  color: #fff;
}

.prevButton {
  margin-right: 12px;
}

.nextButton {
  margin-left: 12px;
}
```

**Step 2: Rewrite `Reader.tsx`**

```tsx
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { Document, Page, pdfjs } from 'react-pdf';

import styles from './Reader.module.css';

interface ReaderProps {
  url: string;
  currentPage: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  numPagez: number;
  setNumPagez: (num: number) => void;
}

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Reader: React.FC<ReaderProps> = ({
  url,
  currentPage,
  handleNextPage,
  handlePrevPage,
  numPagez,
  setNumPagez,
}) => {
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPagez(numPages);
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          disabled={currentPage === 1}
          onClick={handlePrevPage}
        >
          &#8592;
        </button>
        <Document file={url} onLoadSuccess={handleDocumentLoadSuccess}>
          <Page pageNumber={currentPage} />
        </Document>
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          disabled={currentPage === numPagez}
          onClick={handleNextPage}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default Reader;
```

**Step 3: Commit**

```bash
git add src/components/Reader.module.css src/components/Reader.tsx
git commit -m "feat: migrate Reader from Chakra to CSS Modules"
```

---

### Task 11: Migrate `Gallery.tsx`

**Files:**
- Create: `src/components/Gallery.module.css`
- Modify: `src/components/Gallery.tsx`

**Step 1: Create `src/components/Gallery.module.css`**

```css
.wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  height: 100vh;
  margin-top: 128px;
}

.videoRow {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  gap: 12px;
  width: 100vw;
}

@media (max-width: 479px) {
  .videoRow {
    flex-direction: column;
  }
}

.codeRow {
  display: flex;
  gap: 12px;
}

.code {
  padding: 8px;
  color: black;
  font-family: monospace;
  background: var(--white-alpha-800);
  border-radius: 4px;
  height: min-content;
}

.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 8px;
  min-height: 300px;
  width: 100vw;
  position: relative;
}

@media (min-width: 480px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 992px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.galleryImage {
  align-self: center;
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
}

/* Dialog styles */
.dialogContent {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 8px;
  max-width: 70%;
  width: 70%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1002;
}

.closeButton {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--gray-400);
  border: none;
  color: #fff;
  font-size: 18px;
  cursor: pointer;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialogImage {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 6px;
}
```

**Step 2: Rewrite `Gallery.tsx`**

```tsx
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import YouTube from 'react-youtube';

import Card from './Card';
import styles from './Gallery.module.css';

type GalleryProps = {
  imagery: {
    image?: string;
    youtubeId?: string;
    description: string;
  }[];
};

const Gallery = ({ imagery }: GalleryProps) => {
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const breakpoint =
    typeof window !== 'undefined' && window.innerWidth < 480 ? 'base' : 'sm';

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const colors = [
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
      `hsl(${Math.random() * 360}, 100%, 70%)`,
    ];

    const el = document.querySelector('#videos') as HTMLElement;
    el.style.setProperty('--color-1', colors[0] || 'red');
    el.style.setProperty('--color-2', colors[1] || 'blue');
    el.style.setProperty('--color-3', colors[2] || 'green');
    el.style.setProperty('--color-4', colors[3] || 'yellow');
    el.style.setProperty('--color-5', colors[4] || 'purple');
  }, []);

  const opts =
    breakpoint === 'base' ? { width: '100%', height: 'auto' } : undefined;

  const dialogContent = (
    <dialog
      ref={dialogRef}
      onClose={() => setOpen(false)}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      className={styles.dialogContent}
    >
      <button className={styles.closeButton} onClick={() => setOpen(false)}>
        ✕
      </button>
      {selectedImage && (
        <img
          alt="image"
          src={selectedImage}
          className={styles.dialogImage}
        />
      )}
    </dialog>
  );

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.videoRow} frame`} id="videos">
        <YouTube videoId="UdimcciEJh8" opts={opts} />
        <div className={styles.codeRow}>
          <span className={styles.code}>
            &#8592; When I was listening to this song in high school I realised
            these lyrics need to be visualised, so I did.
          </span>
          <span className={styles.code}>
            My first frame-by-frame animation. Guy farts himself to death.
            &#8594;
          </span>
        </div>
        <YouTube videoId="kPnHaL9bhGk" opts={opts} />
      </div>
      <div className={styles.grid}>
        {imagery.map(({ image, description }, index) => (
          <Card
            key={index}
            element={
              <img
                className={styles.galleryImage}
                alt="image"
                onClick={() => {
                  if (image) handleImageClick(image);
                }}
                src={image}
              />
            }
            index={index}
            description={description}
          />
        ))}
      </div>
      {typeof document !== 'undefined' && createPortal(dialogContent, document.body)}
    </div>
  );
};

export default Gallery;
```

**Step 3: Commit**

```bash
git add src/components/Gallery.module.css src/components/Gallery.tsx
git commit -m "feat: migrate Gallery to native dialog + CSS Modules"
```

---

### Task 12: Migrate `index.tsx` (home page)

**Files:**
- Create: `src/pages/index.module.css`
- Modify: `src/pages/index.tsx`

**Step 1: Create `src/pages/index.module.css`**

```css
.nav {
  display: flex;
  flex-direction: column;
  font-size: 30px;
  z-index: 1001;
  padding-left: 24px;
  padding-right: 24px;
  gap: 32px;
}
```

**Step 2: Rewrite `index.tsx`**

```tsx
import { useMemo } from 'react';

import Crazy from '@/components/3js/Crazy';
import EpilepsyTrigger from '@/components/EpilepsyTrigger';
import { Footer } from '@/components/Footer';
import StripButton from '@/components/StripButton';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import styles from './index.module.css';

const BRIGHT_COLORS = [
  '#FF3366', '#FF6633', '#FFCC00', '#33FF66', '#00CCFF',
  '#6633FF', '#FF33CC', '#33FFCC', '#FF9900', '#00FF99',
];

const pickColor = () =>
  BRIGHT_COLORS[Math.floor(Math.random() * BRIGHT_COLORS.length)]!;

const Index = () => {
  const colors = useMemo(
    () => ({
      code: pickColor(),
      music: pickColor(),
      imagery: pickColor(),
      words: pickColor(),
    }),
    []
  );

  return (
    <Main
      meta={
        <Meta
          title="Vid's personal website"
          description="Clusterfuck of everything I'm doing with my life."
        />
      }
    >
      <Crazy />

      <div className={styles.nav}>
        <StripButton
          label="Code"
          mode="code"
          stripColor={colors.code}
          onClick={() => { window.location.href = '/code'; }}
        />
        <StripButton
          label="Music"
          mode="music"
          stripColor={colors.music}
          onClick={() => { window.location.href = '/music'; }}
        />
        <EpilepsyTrigger
          title="Imagery"
          location="imagery"
          stripColor={colors.imagery}
        />
        <StripButton
          label="Words"
          mode="words"
          stripColor={colors.words}
          onClick={() => { window.location.href = '/words'; }}
        />
      </div>

      <Footer />
    </Main>
  );
};

export default Index;
```

**Step 3: Commit**

```bash
git add src/pages/index.module.css src/pages/index.tsx
git commit -m "feat: migrate home page from Chakra to CSS Modules"
```

---

### Task 13: Migrate `code.tsx`

**Files:**
- Create: `src/pages/code.module.css`
- Modify: `src/pages/code.tsx`

**Step 1: Create `src/pages/code.module.css`**

```css
.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  padding-top: 80px;
  margin-bottom: 40px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;
  max-width: 1200px;
  width: 100%;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 992px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Step 2: Rewrite `code.tsx`**

```tsx
import { motion } from 'motion/react';
import React from 'react';

import CodeCard from '@/components/CodeCard';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import styles from './code.module.css';

const projects = [
  /* ... keep existing projects array unchanged ... */
];

const Code = () => (
  <Main meta={<Meta title="Code" description="Projects I contribute to." />}>
    <div className={styles.grid}>
      {projects.map((project, index) => (
        <motion.div
          key={project.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: index * 0.05,
            ease: 'easeOut',
          }}
        >
          <CodeCard
            image={project.image}
            name={project.name}
            description={project.description}
            githubLink={project.githubLink}
            websiteLink={project.websiteLink}
            current={project.current}
            hobby={project.hobby}
          />
        </motion.div>
      ))}
    </div>
  </Main>
);

export default Code;
```

**Step 3: Commit**

```bash
git add src/pages/code.module.css src/pages/code.tsx
git commit -m "feat: migrate code page from Chakra to CSS Modules"
```

---

### Task 14: Migrate `music.tsx`

**Files:**
- Create: `src/pages/music.module.css`
- Modify: `src/pages/music.tsx`

**Step 1: Create `src/pages/music.module.css`**

```css
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('/assets/music/background.gif');
  background-size: cover;
  background-position: center;
  overflow-y: auto;
  padding-bottom: 40px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 40px 0;
  height: 100%;
  width: 100%;
}

@media (min-width: 768px) {
  .content {
    padding: 80px 80px;
  }
}

.albumLinks {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.albumLink {
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 8px #000000;
  width: 100%;
  padding: 24px;
  border-radius: 6px;
  backdrop-filter: blur(8px);
  background: var(--black-alpha-400);
  justify-content: center;
  border: 1px solid var(--pink-300);
  transition: background 0.2s;
}

.albumLink:hover {
  background: var(--gray-600);
}

.albumTitle {
  font-size: 36px;
  color: var(--pink-100);
  text-align: center;
  font-weight: bold;
}

@media (min-width: 768px) {
  .albumTitle {
    font-size: 80px;
  }
}

.secondaryLink {
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 5px #000000;
  width: 100%;
  padding: 16px;
  border-radius: 6px;
  backdrop-filter: blur(5px);
  justify-content: center;
  transition: background 0.2s;
}

.secondaryLink:hover {
  background: var(--gray-600);
}

.secondaryTitle {
  font-size: 24px;
  color: var(--pink-200);
  text-align: center;
}

@media (min-width: 768px) {
  .secondaryTitle {
    font-size: 48px;
  }
}

.videoGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-bottom: 32px;
  width: 100%;
}

@media (min-width: 768px) {
  .videoGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.aspectRatio {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
}

.aspectRatio iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.twoColGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  width: 100%;
  padding-bottom: 80px;
}

@media (min-width: 768px) {
  .twoColGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.musicLinkRow {
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 5px #000000;
  width: 100%;
  padding: 16px;
  border-radius: 6px;
  backdrop-filter: blur(5px);
  justify-content: space-between;
  flex-direction: row;
  transition: background 0.2s;
}

.musicLinkRow:hover {
  background: var(--gray-600);
}

.musicImage {
  width: 50px;
  height: 50px;
  margin-right: 16px;
}

.releasesTitle {
  font-size: 24px;
  color: var(--pink-200);
  text-align: center;
  margin-bottom: 24px;
}

@media (min-width: 768px) {
  .releasesTitle {
    font-size: 36px;
  }
}

.releaseList {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.releaseRow {
  display: flex;
  align-items: center;
  box-shadow: 0px 0px 5px #000000;
  width: 100%;
  padding: 16px;
  border-radius: 6px;
  backdrop-filter: blur(5px);
  justify-content: space-between;
  transition: background 0.2s;
}

.releaseRow:hover {
  background: var(--gray-600);
}

.releaseInfo {
  display: flex;
  gap: 12px;
  align-items: center;
}

.badge {
  font-size: 0.875rem;
  padding: 4px 8px;
  border-radius: 6px;
  background: var(--pink-300);
  color: #000;
}

.releaseTitle {
  color: white;
  font-size: 1rem;
}

@media (min-width: 768px) {
  .releaseTitle {
    font-size: 1.125rem;
  }
}

.releaseType {
  color: var(--gray-400);
  font-size: 0.875rem;
}
```

**Step 2: Rewrite `music.tsx`**

```tsx
import { useEffect, useState } from 'react';

import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import styles from './music.module.css';

const Music = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <Main meta={<Meta title="Music" description="My music" />}>
      <div className={styles.page}>
        <div className={styles.content}>
          {!isMobile && (
            <div className={styles.albumLinks}>
              <a
                href="https://soundcloud.com/malarozamuca/sets/lambda-male"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.albumLink}>
                  <span className={styles.albumTitle}>
                    Λ♂ LAMBDA MALE
                  </span>
                </div>
              </a>
              <a
                href="https://soundcloud.com/malarozamuca/sets/magma-puding-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className={styles.secondaryLink}>
                  <span className={styles.secondaryTitle}>
                    🍮 MAGMA PUDING 🫠
                  </span>
                </div>
              </a>
            </div>
          )}

          <div style={{ width: '100%' }}>
            <div className={styles.videoGrid}>
              {[
                'https://www.youtube.com/embed/3_FhRjYvFLo',
                'https://www.youtube.com/embed/hL1JlhjoAGE',
                'https://www.youtube.com/embed/WNGHfBkfdPw',
                'https://www.youtube.com/embed/BCIssMctm7s',
                'https://www.youtube.com/embed/nAAXQ7M-5L8',
              ].map((videoSrc) => (
                <div className={styles.aspectRatio} key={videoSrc}>
                  <iframe
                    src={videoSrc}
                    allowFullScreen
                    title="YouTube Video"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.twoColGrid}>
            <div className={styles.stack}>
              {[
                {
                  href: 'https://open.spotify.com/artist/7FuUBYVB5laxuMXLDAeIGz',
                  img: '/assets/music/spotify.jpeg',
                  text: 'Spotify',
                },
                {
                  href: 'https://soundcloud.com/malarozamuca',
                  img: '/assets/music/soundcloud.jpg',
                  text: 'SoundCloud',
                },
                {
                  href: 'https://malarozamuca.bandcamp.com/album/magma-puding',
                  img: '/assets/music/bandcamp.jpg',
                  text: 'Bandcamp',
                },
                {
                  href: 'https://music.apple.com/us/album/magma-puding/1701729762',
                  img: '/assets/music/applemusic.jpg',
                  text: 'Apple Music',
                },
                {
                  href: 'https://www.youtube.com/channel/UCoO_Ijq0rZJwetO8a8orQJQ',
                  img: '/assets/music/youtube.jpg',
                  text: 'YouTube',
                },
              ].map((linkData) => (
                <a
                  href={linkData.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={linkData.href}
                  style={{ width: '100%' }}
                >
                  <div className={styles.musicLinkRow}>
                    <img
                      src={linkData.img}
                      className={styles.musicImage}
                      alt={linkData.text}
                    />
                    <span>{linkData.text}</span>
                  </div>
                </a>
              ))}
            </div>

            <div className={styles.stack}>
              {[
                {
                  href: 'https://radiostudent.si/glasba/tolpa-bumov/mala-roza-muca-magma-puding',
                  text: 'Review of Magma Puding by Marko Miočić',
                },
                {
                  href: 'https://www.sigic.si/dr-corecore-filozofije-mala-roza-muca.html',
                  text: 'Review of mala roza muca by Špela Cvetko',
                },
              ].map((linkData) => (
                <a
                  href={linkData.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={linkData.href}
                  style={{ width: '100%' }}
                >
                  <div className={styles.musicLinkRow}>
                    <span>{linkData.text}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div style={{ width: '100%', paddingBottom: 80 }}>
            <p className={styles.releasesTitle}>Releases</p>
            <div className={styles.releaseList}>
              {[
                {
                  title: 'Λ♂ (Lambda Male)',
                  type: 'EP',
                  year: '2025',
                  href: 'https://soundcloud.com/malarozamuca/sets/lambda-male',
                },
                {
                  title: 'Prijatelj je vreden vec kot jakna',
                  type: 'Single',
                  year: '2024',
                  href: 'https://soundcloud.com/malarozamuca',
                },
                {
                  title: 'Dino (feat. WAKNU)',
                  type: 'EP',
                  year: '2024',
                  href: 'https://soundcloud.com/malarozamuca/sets/dino',
                },
                {
                  title: 'The Balkan Dwarf',
                  type: 'Single',
                  year: '2024',
                  href: 'https://soundcloud.com/malarozamuca/balkan-dwarf',
                },
                {
                  title: 'nyulv<3',
                  type: 'EP (via childsplay)',
                  year: '2023',
                  href: 'https://childrenatplay.bandcamp.com/album/nyulv-3',
                },
                {
                  title: 'Magma Puding',
                  type: 'Album',
                  year: '2023',
                  href: 'https://soundcloud.com/malarozamuca/sets/magma-puding-1',
                },
              ].map((release) => (
                <a
                  href={release.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={release.title}
                  style={{ width: '100%' }}
                >
                  <div className={styles.releaseRow}>
                    <div className={styles.releaseInfo}>
                      <span className={styles.badge}>{release.year}</span>
                      <span className={styles.releaseTitle}>
                        {release.title}
                      </span>
                    </div>
                    <span className={styles.releaseType}>{release.type}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Music;
```

**Step 3: Commit**

```bash
git add src/pages/music.module.css src/pages/music.tsx
git commit -m "feat: migrate music page from Chakra to CSS Modules"
```

---

### Task 15: Migrate `words.tsx`

**Files:**
- Create: `src/pages/words.module.css`
- Modify: `src/pages/words.tsx`

**Step 1: Create `src/pages/words.module.css`**

```css
.libraryButton {
  position: absolute;
  left: 20px;
  top: 56px;
  background: none;
  border: none;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 1rem;
}

.libraryButton:hover {
  opacity: 0.8;
}

.libraryIcon {
  width: 32px;
  height: 32px;
  margin-right: 12px;
  filter: invert();
}

/* Drawer styles */
.drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100vh;
  background: #1a1a2e;
  z-index: 1002;
  padding: 24px;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.drawerOpen {
  transform: translateX(0);
}

.drawerBackdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
}

.drawerHeader {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 16px;
}

.drawerClose {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: var(--white-alpha-500);
  font-size: 20px;
  cursor: pointer;
}

.drawerClose:hover {
  color: #fff;
}

.sectionTitle {
  margin-bottom: 12px;
  text-align: right;
}

.sectionTitleSpaced {
  margin-bottom: 12px;
  margin-top: 32px;
  text-align: right;
}

.bookList {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bookItem {
  display: flex;
  align-items: baseline;
  cursor: pointer;
  justify-content: space-between;
  width: 100%;
}

.bookItem:hover {
  text-decoration: underline;
}

.bookSubtitle {
  font-size: 0.75rem;
  margin-left: 8px;
  color: var(--gray-400);
  text-align: right;
}

.mobileMessage {
  padding: 40px;
}
```

**Step 2: Rewrite `words.tsx`**

Use a custom drawer with CSS transitions + portal:

```tsx
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Reader from '@/components/Reader';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

import styles from './words.module.css';

const Words = () => {
  const [open, setOpen] = useState(false);

  const books = [
    { title: 'Starec', pdf: 'Starec', subtitle: '2020' },
    { title: 'Sveta Knjiga', subtitle: 'Lepe Marke, Kakadu & Moja soba', pdf: 'svetaknjiga' },
    { title: 'Jajce', subtitle: '2015, unfinished', pdf: 'jajce' },
    { title: 'Zgodbice za odrasle', subtitle: '2016', pdf: 'zgodbicezaodrasle' },
    { title: 'Dolga, dolga je pot do zvezd', subtitle: '2021, unfinished', pdf: 'dolga' },
    { title: 'Grde Papilone', subtitle: '2022', pdf: 'grdepapilone' },
    { title: 'Nekoc Surina', subtitle: '2018, unfinished', pdf: 'NekocSurina' },
    { title: 'Sem Iskal', subtitle: '2012', pdf: 'Sem iskal' },
    { title: 'V bistvu sem budist', subtitle: '2021', pdf: 'vbistvu' },
  ];

  const poetry = [
    { title: 'Predvčerajšnjim', pdf: 'predvcerajsnjim', subtitle: ' - 2013' },
    { title: 'Včeraj', pdf: 'vceraj', subtitle: '2013 - 2016' },
    { title: 'Pojutrišnjem', pdf: 'pojutrisnjem', subtitle: '2016 - 2019' },
    { title: 'Popojutrišnjem', pdf: 'popojutrisnjem', subtitle: '2019 - ' },
  ];

  const [bookIndex, setBookIndex] = useState<number>(0);
  const [poetryIndex, setPoetryIndex] = useState<number>(0);
  const [isViewingPoetry, setIsViewingPoetry] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numPagez, setNumPagez] = useState<number>(0);

  const handlePrevPage = () => {
    setCurrentPage((currPage) => Math.max(currPage - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((currPage) => Math.min(currPage + 1, numPagez));
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.innerWidth < 480);
  }, []);

  const drawerContent = (
    <>
      {open && (
        <div className={styles.drawerBackdrop} onClick={() => setOpen(false)} />
      )}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <button className={styles.drawerClose} onClick={() => setOpen(false)}>
          ✕
        </button>
        <div className={styles.drawerHeader}>Library</div>

        <p className={styles.sectionTitle}>Prose</p>
        <div className={styles.bookList}>
          {books.map(({ title, subtitle }, index) => (
            <div
              key={title}
              className={styles.bookItem}
              onClick={() => {
                setBookIndex(index);
                setIsViewingPoetry(false);
                setOpen(false);
                setCurrentPage(1);
              }}
            >
              <span>{title}</span>
              {subtitle && (
                <span className={styles.bookSubtitle}>({subtitle})</span>
              )}
            </div>
          ))}
        </div>

        <p className={styles.sectionTitleSpaced}>Poetry</p>
        <div className={styles.bookList}>
          {poetry.map(({ title, subtitle }, index) => (
            <div
              key={title}
              className={styles.bookItem}
              onClick={() => {
                setPoetryIndex(index);
                setIsViewingPoetry(true);
                setOpen(false);
                setCurrentPage(1);
              }}
            >
              <span>{title}</span>
              {subtitle && (
                <span className={styles.bookSubtitle}>({subtitle})</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <Main meta={<Meta title="Words" description="My words" />}>
      <button className={styles.libraryButton} onClick={() => setOpen(true)}>
        <img
          src="/assets/images/book.png"
          className={styles.libraryIcon}
          alt="library"
        />
        Library
      </button>

      {typeof document !== 'undefined' && createPortal(drawerContent, document.body)}

      {isMobile ? (
        <div className={styles.mobileMessage}>
          <p>Not available on mobile. Please view on desktop.</p>
        </div>
      ) : (
        <Reader
          url={`/assets/pdf/${
            isViewingPoetry ? poetry[poetryIndex]?.pdf : books[bookIndex]?.pdf
          }.pdf`}
          currentPage={currentPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          setNumPagez={setNumPagez}
          numPagez={numPagez}
        />
      )}
    </Main>
  );
};

export default Words;
```

**Step 3: Commit**

```bash
git add src/pages/words.module.css src/pages/words.tsx
git commit -m "feat: migrate words page from Chakra to CSS Modules"
```

---

### Task 16: Remove Chakra UI packages and clean up

**Files:**
- Delete: `src/utils/theme.ts`
- Delete: `src/types/jsx-compat.d.ts` (if only for Chakra)
- Modify: `package.json`

**Step 1: Remove Chakra and Emotion packages**

```bash
npm uninstall @chakra-ui/react @emotion/react
```

**Step 2: Delete `src/utils/theme.ts`**

```bash
rm src/utils/theme.ts
```

**Step 3: Verify build**

```bash
npm run build-prod
```

Expected: Build succeeds with no Chakra imports remaining.

**Step 4: Verify no remaining Chakra imports**

```bash
grep -r "@chakra-ui" src/
```

Expected: No results.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: remove Chakra UI and Emotion dependencies"
```

---

### Task 17: Final visual verification

**Step 1: Run dev server**

```bash
npm run dev
```

**Step 2: Check each page visually**

- `/` — Home: nav buttons with strip effect, footer, 3D background
- `/code` — Grid of project cards, responsive columns
- `/music` — Background gif, album links, video grid, releases
- `/imagery` — Gallery grid, image dialog
- `/words` — Library drawer, PDF reader

**Step 3: Run lint and type check**

```bash
npm run lint && npm run check-types
```

**Step 4: Fix any issues found, commit**
