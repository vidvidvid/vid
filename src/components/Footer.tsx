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
