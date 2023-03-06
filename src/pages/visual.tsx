import Gallery from '@/components/Gallery';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const images = [
  '/assets/images/media/1.png',
  '/assets/images/media/2.jpg',
  '/assets/images/media/3.jpg',
  '/assets/images/media/4.jpg',
  '/assets/images/media/5.jpg',
  '/assets/images/media/6.jpg',
  '/assets/images/media/7.jpg',
  '/assets/images/media/8.jpg',
  '/assets/images/media/9.jpg',
  '/assets/images/media/10.jpg',
  '/assets/images/media/11.jpg',
  '/assets/images/media/12.jpeg',
  '/assets/images/media/13.jpeg',
  '/assets/images/media/14.jpeg',
  '/assets/images/media/15.jpeg',
  '/assets/images/media/16.jpeg',
  '/assets/images/media/17.jpeg',
  '/assets/images/media/18.jpeg',
  '/assets/images/media/19.jpeg',
  '/assets/images/media/20.jpeg',
  '/assets/images/media/21.jpeg',
  '/assets/images/media/22.jpeg',
  '/assets/images/media/23.jpeg',
];

const Visual = () => (
  <Main meta={<Meta title="Visual media" description="My smudging" />}>
    <Gallery images={images} />
  </Main>
);

export default Visual;
