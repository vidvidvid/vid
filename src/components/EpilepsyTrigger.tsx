import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';

type EpilepsyTriggerProps = {
  title: string;
  location: string;
  hoverEffect: number;
};

const EpilepsyTrigger = ({
  title,
  location,
  hoverEffect,
}: EpilepsyTriggerProps) => {
  return (
    <Popover placement="top">
      <PopoverTrigger>
        <Box className={`hover-effect-${hoverEffect}`} p={4} cursor="pointer">
          {title}
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
              window.location.href = `/${location}`;
            }}
          >
            here
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default EpilepsyTrigger;
