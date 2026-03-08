import { HStack, Link as ChakraLink, Text, VStack } from '@chakra-ui/react';
import type { SVGProps } from 'react';

import { GithubIcon } from '@/components/icons/GithubIcon';
import { TwitterIcon } from '@/components/icons/TwitterIcon';

type IconLinkType = {
  Icon: React.FC<SVGProps<SVGSVGElement>>;
  href: string;
};

const iconLinks: IconLinkType[] = [
  {
    Icon: TwitterIcon,
    href: 'https://twitter.com/viiiiiiiiiiiid',
  },
  {
    Icon: GithubIcon,
    href: 'https://github.com/vidvidvid',
  },
];

const IconLink = ({ Icon, href }: IconLinkType) => (
  <ChakraLink
    href={href}
    color="white"
    _hover={{ color: 'main' }}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon />
  </ChakraLink>
);

export const Footer: React.FC = () => (
  <VStack
    w="100%"
    justify="center"
    align="center"
    position="fixed"
    bottom={0}
    zIndex={1000}
    gap={2}
    pt={8}
    pb={4}
    fontSize="sm"
    background="linear-gradient(transparent, rgba(255, 255, 255, 0.1))"
  >
    <HStack gap={4} fontSize="xl">
      {iconLinks.map((l) => (
        <IconLink key={l.href} {...l} />
      ))}
    </HStack>
    <Text>2026 vid</Text>
  </VStack>
);
