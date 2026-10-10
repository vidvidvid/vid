import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

import { Footer } from "@/components/Footer";
import { SocialIcon } from "@/components/icons/SocialIcon";

import styles from "./Main.module.css";

const sections = ["Code", "Music", "Imagery", "Words"];
const Main = ({ meta, children }: { meta: ReactNode; children: ReactNode }) => {
  const { pathname } = useRouter();
  const isHome = pathname === "/";
  const section = sections.find(
    (item) => `/${item.toLowerCase()}` === pathname,
  );
  return (
    <div className={styles.site} data-palette={section?.toLowerCase()}>
      {meta}
      <a className={styles.skipLink} href="#main">
        Skip to content
      </a>
      <header className={styles.header} data-inner={!isHome}>
        <div className={styles.topline}>
          <Link href="/" className={styles.brand} aria-label="vidvidvid home">
            <span>vid</span>
            <span>vid</span>
            <span>vid</span>
          </Link>
          <div className={styles.socials}>
            <a
              href="https://github.com/vidvidvid"
              target="_blank"
              rel="noreferrer"
            >
              <SocialIcon kind="github" /> github
            </a>
            <a
              href="https://soundcloud.com/malarozamuca"
              target="_blank"
              rel="noreferrer"
            >
              <SocialIcon kind="soundcloud" /> soundcloud
            </a>
            <a
              href="https://twitter.com/viiiiiiiiiiiid"
              target="_blank"
              rel="noreferrer"
            >
              <SocialIcon kind="twitter" /> twitter
            </a>
          </div>
        </div>
        {!isHome && (
          <nav className={styles.nav} aria-label="Main navigation">
            {sections.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                data-palette={item.toLowerCase()}
                aria-current={
                  pathname === `/${item.toLowerCase()}` ? "page" : undefined
                }
              >
                {item.toLowerCase()}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main
        id="main"
        className={`${styles.main} ${!isHome ? styles.innerMain : ""}`}
      >
        {(section || isHome) && (
          <h1 className="sr-only">{section || "vidvidvid"}</h1>
        )}
        {children}
      </main>
      {!isHome && <Footer />}
    </div>
  );
};
export { Main };
