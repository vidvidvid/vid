import { LinkIcon } from "@/components/icons/LinkIcon";
import { SocialIcon } from "@/components/icons/SocialIcon";

import styles from "./CodeCard.module.css";

interface Props {
  image?: string;
  name: string;
  description: string;
  githubLink?: string;
  websiteLink: string;
  appStoreLink?: string;
  current?: boolean;
  hobby?: boolean;
}

const CodeCard = ({
  image,
  name,
  description,
  githubLink,
  websiteLink,
  appStoreLink,
  current,
  hobby,
}: Props) => (
  <article className={styles.card} data-current={current || undefined}>
    <div className={styles.top}>
      {image ? (
        <img
          src={`/assets/code/${image}`}
          alt=""
          width={36}
          height={36}
          className={styles.image}
        />
      ) : (
        <div className={styles.fallbackIcon}>{name.charAt(0)}</div>
      )}
      <h2>
        <a
          href={websiteLink}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.primary}
          aria-label={`Visit ${name}`}
        >
          {name}
        </a>
      </h2>
      {(current || hobby) && (
        <span className={styles.badge}>{current ? "ACTIVE" : "PERSONAL"}</span>
      )}
    </div>
    <p>{description}</p>
    <footer className={styles.links}>
      <a
        href={websiteLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name} website`}
      >
        <LinkIcon /> Website
      </a>
      {githubLink && (
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on GitHub`}
        >
          <SocialIcon kind="github" /> GitHub
        </a>
      )}
      {appStoreLink && (
        <a
          href={appStoreLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on the App Store`}
        >
          <LinkIcon kind="mobile" /> App Store
        </a>
      )}
    </footer>
  </article>
);
export default CodeCard;
