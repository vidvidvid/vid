import MosaicGallery, { type MosaicItem } from '@/components/MosaicGallery';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const items: MosaicItem[] = [
  {
    youtubeId: 'UdimcciEJh8',
    description:
      'When I was listening to this song in high school I realised these lyrics need to be visualised, so I did.',
  },
  {
    image: '/assets/images/media/28.jpg',
    width: 3024,
    height: 4032,
    description:
      'Fârê †hêê wêll, Bâlkân †ï†ân, âs yôû âscênd †hê mâjês†ïc pêâks; mây yôûr jôûrnêy bê wôvên wï†h †hê †hrêâds ôf ïndômï†âblê vïgôr ând cêlês†ïâl grâcê.',
  },
  {
    image: '/assets/images/media/27.jpg',
    width: 3024,
    height: 4032,
    description:
      'Full of passion, full of fire, full of truth, full of brotherly love, full of Slovenia.',
  },
  {
    image: '/assets/images/media/26.jpg',
    width: 4032,
    height: 3024,
    description:
      'S and S were real baddies. Parents did not like them. Poor B was just a victim of the circumstances.',
  },
  {
    youtubeId: 'kPnHaL9bhGk',
    description:
      'My first frame-by-frame animation. Guy farts himself to death.',
  },
  {
    image: '/assets/images/media/25.jpg',
    width: 3024,
    height: 4032,
    description: 'Not much to say about this one.',
  },
  {
    image: '/assets/images/media/24.jpg',
    width: 3024,
    height: 4032,
    description:
      'The light ball symbolizes the truth and softness. The red ball symbolizes the passion and the fire. White ball is engulfing the red ball, because the truth and softness are more powerful than the passion and the fire. It is not a boob. Me & saint G',
  },
  {
    image: '/assets/images/media/idiot.png',
    width: 1800,
    height: 1800,
    description:
      'Idiot, 2015. One of my best drawings. I lost the original, but made an NFT out of it. A friend tattooed it on his leg. My GF made a 3D model out of it. Contact me if you wanna buy the NFT for a lot of money.',
  },
  {
    image: '/assets/images/media/23.jpeg',
    width: 2435,
    height: 2653,
    description: 'M Sesh with A, filled it up with meaning.',
  },
  {
    image: '/assets/images/media/22.jpeg',
    width: 2274,
    height: 3275,
    description: 'Some Simpson person trying to figure stuff out.',
  },
  {
    image: '/assets/images/media/21.jpeg',
    width: 465,
    height: 451,
    description: 'The бабушка rdeča. Gifted to A.',
  },
  {
    image: '/assets/images/media/18.jpeg',
    width: 2258,
    height: 3275,
    description: 'Decayed mind. Gifted to B.',
  },
  {
    image: '/assets/images/media/20.jpeg',
    width: 691,
    height: 960,
    description: 'Me, smoking my life out.',
  },
  {
    image: '/assets/images/media/19.jpeg',
    width: 2819,
    height: 3393,
    description:
      'Janez Janša, the Slovenian prime minister, protector of flowers.',
  },
  {
    image: '/assets/images/media/17.jpeg',
    width: 2283,
    height: 3258,
    description:
      'Everything is going to be eaten eventually. All of it was being eaten by the big mouth.',
  },
  {
    image: '/assets/images/media/16.jpeg',
    width: 1940,
    height: 2903,
    description:
      'Two humanz, different, but still humanz, they are. Gifted to N.',
  },
  {
    image: '/assets/images/media/15.jpeg',
    width: 2040,
    height: 3167,
    description: 'Merged two eaten up, dead faces.',
  },
  {
    image: '/assets/images/media/14.jpeg',
    width: 3382,
    height: 4801,
    description: 'This is how I heard Spikes by Death Grips. Gifted to N.',
  },
  {
    image: '/assets/images/media/13.jpeg',
    width: 1200,
    height: 1670,
    description:
      "Townes, the Sherlock cat in Dali's world. My first sold drawing.",
  },
  {
    image: '/assets/images/media/12.jpeg',
    width: 2271,
    height: 2123,
    description: 'Album cover for Manifest - Otroci iz kleti',
  },
  {
    image: '/assets/images/media/11.jpg',
    width: 1280,
    height: 538,
    description: "LeClan frens on new year's eve.",
  },
  {
    image: '/assets/images/media/10.jpg',
    width: 1280,
    height: 1810,
    description: 'That is how I saw myself. 🫠',
  },
  {
    image: '/assets/images/media/9.jpg',
    width: 1280,
    height: 1794,
    description: 'The most fruitful smoking sesh with Jojo ever.',
  },
  {
    image: '/assets/images/media/8.jpg',
    width: 1280,
    height: 1810,
    description: 'Cool dude. I always wanted to be a cool dude.',
  },
  {
    image: '/assets/images/media/7.jpg',
    width: 1280,
    height: 1810,
    description: 'Puerto Rico horse. I traded this one for a haircut.',
  },
  {
    image: '/assets/images/media/6.jpg',
    width: 1280,
    height: 1810,
    description: 'Doodling around 🤙',
  },
  {
    image: '/assets/images/media/5.jpg',
    width: 1280,
    height: 1810,
    description:
      'I started drawing this guy, because I felt like the world needed more of him. Funny enough, I never finished him. Even funnier is the fact that this guy actually one day appeared at a party, he came crawling by our table, naked, bald and apparently searching for something. D can confirm this story.',
  },
  {
    image: '/assets/images/media/4.jpg',
    width: 1000,
    height: 1318,
    description: 'Random splatters + attempt to give them some structure.',
  },
  {
    image: '/assets/images/media/2.jpg',
    width: 706,
    height: 960,
    description:
      'One of my first trials with the semi-randomised technique of doing some splatter painting and then adding some more structure on top of it.',
  },
  {
    image: '/assets/images/media/1.png',
    width: 892,
    height: 1186,
    description:
      'Originally titled "Typical Czech Woman", I have since renamed it to Non-typical Czech Woman ',
  },
];

const Visual = () => (
  <Main meta={<Meta title="Imagery" description="Drawings and visual experiments by Vid." />}>
    <MosaicGallery items={items} />
  </Main>
);

export default Visual;
