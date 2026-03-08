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
