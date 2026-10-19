import styles from './CodeCard.module.css';
import { GithubIcon } from './icons/GithubIcon';

interface Props {
  image?: string;
  name: string;
  description: string;
  githubLink?: string;
  websiteLink?: string;
  appStoreLink?: string;
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
  appStoreLink,
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
    <div className={styles.link}>
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
              <a className={styles.name} href={websiteLink ?? githubLink ?? appStoreLink ?? '#'} target="_blank" rel="noopener noreferrer">{name}</a>
              {current && <span className={styles.currentBadge}>current</span>}
              {hobby && <span className={styles.hobbyBadge}>hobby</span>}
              {appStoreLink && (
                <a href={appStoreLink} target="_blank" rel="noopener noreferrer" className={styles.githubLink} aria-label={`${name} on the App Store`}>App Store</a>
              )}
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
    </div>
  );
};

export default CodeCard;
