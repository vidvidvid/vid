import { Flex, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  date: Date;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ date }) => {
  function calculateTimeLeft() {
    const difference = +date - +new Date();
    let timeLeft = {} as {
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Flex gap={1}>
      <Text>{timeLeft.days}d</Text>
      <Text>{timeLeft.hours}h</Text>
      <Text>{timeLeft.minutes}m</Text>
      <Text>{timeLeft.seconds}s</Text>
    </Flex>
  );
};

export default CountdownTimer;
