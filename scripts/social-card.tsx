// Artwork source for public/assets/social/vidvidvid-v1.png (1200 × 630).
// To recapture: temporarily copy into src/pages/social-card-preview.tsx,
// build locally, and screenshot the .share-cover at 1200 × 630 once ready.
// Remove the temporary route before building for deployment.
import dynamic from "next/dynamic";
import Head from "next/head";

const LivingArtwork = dynamic(
  () => import("@/components/living/LivingArtwork"),
  { ssr: false },
);

export default function SocialCard() {
  return (
    <>
      <Head>
        <title>Sharing artwork</title>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <div className="share-cover">
        <div className="share-categories">
          <span>code</span>
          <span>music</span>
          <span>imagery</span>
          <span>words</span>
        </div>
        <div className="share-sculpture">
          <LivingArtwork
            mode="imagery"
            activeMode={null}
            paused
            variation={0}
            onReshape={() => {}}
          />
        </div>
        <div className="share-name">
          <span>vid</span>
          <span>vid</span>
          <span>vid</span>
        </div>
        <div className="share-domain">vidvidvid.xyz</div>
      </div>
      <style jsx>{`
        .share-cover {
          width: 1200px;
          height: 630px;
          position: relative;
          overflow: hidden;
          isolation: isolate;
          background:
            radial-gradient(ellipse at 68% 40%, #25213a66, transparent 58%),
            #07080a;
          font-family: "Helvetica Neue", Arial, sans-serif;
        }
        .share-categories {
          position: absolute;
          top: 52px;
          left: 58px;
          display: flex;
          gap: 28px;
          font-size: 23px;
          letter-spacing: -0.035em;
          z-index: 2;
        }
        .share-categories span:nth-child(1) {
          color: #9aadff;
        }
        .share-categories span:nth-child(2) {
          color: #ff9eaf;
        }
        .share-categories span:nth-child(3) {
          color: #cfacff;
        }
        .share-categories span:nth-child(4) {
          color: #f6ce86;
        }
        .share-sculpture {
          position: absolute;
          width: 750px;
          height: 750px;
          right: -60px;
          top: -106px;
          transform: rotate(-14deg);
        }
        .share-name {
          position: absolute;
          left: 50px;
          bottom: 85px;
          font-size: 176px;
          font-weight: 650;
          letter-spacing: -0.085em;
          line-height: 0.9;
          z-index: 2;
        }
        .share-name span:nth-child(1) {
          color: #9aadff;
        }
        .share-name span:nth-child(2) {
          color: #ff9eaf;
        }
        .share-name span:nth-child(3) {
          color: #f6ce86;
        }
        .share-domain {
          position: absolute;
          bottom: 36px;
          left: 60px;
          color: #a1a3af;
          font:
            14px "Sono",
            monospace;
          letter-spacing: 0.02em;
        }
      `}</style>
    </>
  );
}
