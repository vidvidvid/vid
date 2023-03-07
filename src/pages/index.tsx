import {
  Box,
  Button,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
} from '@chakra-ui/react';

import { Footer } from '@/components/Footer';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  return (
    <Main
      meta={
        <Meta
          title="Vid's personal website"
          description="Clusterfuck of everything I'm doing with my life."
        />
      }
    >
      <VStack fontSize={30}>
        <Link
          href="/code"
          className="hover-effect-1"
          p={3}
          borderRadius={10}
          style={{
            textDecoration: 'none',
          }}
        >
          Code
        </Link>
        <Link href="/music" className="hover-effect-4" p={4}>
          Music
        </Link>
        <Popover placement="top">
          <PopoverTrigger>
            <Box className="hover-effect-3" p={4} cursor="pointer">
              Imagery
            </Box>
          </PopoverTrigger>
          <PopoverContent w="600px">
            <PopoverArrow />

            <PopoverHeader>
              EPILEPSY WARNING <PopoverCloseButton />
            </PopoverHeader>
            <PopoverBody p={5}>
              Flashing stuff incoming. If you have epilepsy, please{' '}
              <Text display="contents" color="#ff11a6">
                do not
              </Text>{' '}
              click
              <Button
                className="hover-effect-5"
                p={4}
                mt={-2}
                color="#76eaff"
                ml={1}
                fontSize={30}
                variant="ghost"
                onClick={() => {
                  window.location.href = '/imagery';
                }}
              >
                here
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        <Link href="/words" className="hover-effect-2" p={4}>
          Words
        </Link>
      </VStack>

      <Footer />
    </Main>
  );
};

export default Index;
