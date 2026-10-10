import { LinkIcon } from "@/components/icons/LinkIcon";

import styles from "./Footer.module.css";

export const Footer = () => (
  <footer className={styles.footer}>
    <span>© 2026 vid</span>
    <div>
      <a href="https://github.com/vidvidvid" target="_blank" rel="noreferrer">
        github <LinkIcon />
      </a>
      <a
        href="https://twitter.com/viiiiiiiiiiiid"
        target="_blank"
        rel="noreferrer"
      >
        twitter <LinkIcon />
      </a>
      <a
        href="https://soundcloud.com/malarozamuca"
        target="_blank"
        rel="noreferrer"
      >
        soundcloud <LinkIcon />
      </a>
    </div>
  </footer>
);
