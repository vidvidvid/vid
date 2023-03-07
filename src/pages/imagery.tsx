import Gallery from '@/components/Gallery';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const images = [
  {
    image: '/assets/images/media/1.png',
    description:
      'Originally titled "Typical Czech Woman", I have since renamed it to Non-typical Czech Woman ',
  },
  {
    image: '/assets/images/media/2.jpg',
    description:
      'One of my first trials with the semi-randomised technique of doing some splatter painting and then adding some more structure on top of it.',
  },
  {
    image: '/assets/images/media/4.jpg',
    description: 'Random splatters + attempt to give them some structure.',
  },
  {
    image: '/assets/images/media/5.jpg',
    description:
      'I started drawing this guy, because I felt like the world needed more of him. Funny enough, I never finished him. Even funnier is the fact that this guy actually one day appeared at a party, he came crawling by our table, naked, bald and apparently searching for something. D can confirm this story.',
  },
  {
    image: '/assets/images/media/6.jpg',
    description: 'Doodling around 🤙',
  },
  {
    image: '/assets/images/media/7.jpg',
    description: 'Puerto Rico horse. I traded this one for a haircut.',
  },
  {
    image: '/assets/images/media/8.jpg',
    description: 'Cool dude. I always wanted to be a cool dude.',
  },
  {
    image: '/assets/images/media/9.jpg',
    description: 'The most fruitful smoking sesh with Jojo ever.',
  },
  {
    image: '/assets/images/media/10.jpg',
    description: 'That is how I saw myself. 🫠',
  },
  {
    image: '/assets/images/media/11.jpg',
    description: "LeClan frens on new year's eve.",
  },
  {
    image: '/assets/images/media/12.jpeg',
    description: 'Album cover for Manifest - Otroci iz kleti',
  },
  {
    image: '/assets/images/media/13.jpeg',
    description:
      "Townes, the Sherlock cat in Dali's world. My first sold drawing.",
  },
  {
    image: '/assets/images/media/14.jpeg',
    description: 'This is how I heard Spikes by Death Grips. Gifted to N.',
  },
  {
    image: '/assets/images/media/15.jpeg',
    description: 'Merged two eaten up, dead faces.',
  },
  {
    image: '/assets/images/media/16.jpeg',
    description:
      'Two humanz, different, but still humanz, they are. Gifted to N.',
  },
  {
    image: '/assets/images/media/17.jpeg',
    description:
      'Everything is going to be eaten eventually. All of it was being eaten by the big mouth.',
  },
  {
    image: '/assets/images/media/19.jpeg',
    description:
      'Janez Janša, the Slovenian prime minister, protector of flowers.',
  },
  {
    image: '/assets/images/media/20.jpeg',
    description: 'Me, smoking my life out.',
  },
  {
    image: '/assets/images/media/18.jpeg',
    description: 'Decayed mind. Gifted to B.',
  },
  {
    image: '/assets/images/media/21.jpeg',
    description: 'The бабушка rdeča. Gifted to A.',
  },
  {
    image: '/assets/images/media/22.jpeg',
    description: 'Some Simpson person trying to figure stuff out.',
  },
  {
    image: '/assets/images/media/23.jpeg',
    description: 'M Sesh with A, filled it up with meaning.',
  },
  {
    image: '/assets/images/media/idiot.png',
    description:
      'Idiot, 2015. One of my best drawings. I lost the original, but made an NFT out of it. A friend tattooed it on his leg. My GF made a 3D model out of it. Contact me if you wanna buy the NFT for a lot of money.',
  },
].reverse();

const Visual = () => (
  <Main meta={<Meta title="Visual media" description="My smudging" />}>
    <Gallery imagery={images} />
  </Main>
);

export default Visual;
