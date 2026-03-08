import { Box } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

import { hoverState } from '@/components/3js/Crazy';

type StripButtonProps = {
  label: string;
  mode: string;
  stripColor: string;
  onClick: () => void;
};


const StripButton = ({
  label,
  mode,
  stripColor,
  onClick,
}: StripButtonProps) => {
  const [hovered, setHovered] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  // Continuously read the strip's actual bg color and set complementary text
  useEffect(() => {
    let raf: number;
    const update = () => {
      if (labelRef.current && stripRef.current) {
        const computed = getComputedStyle(stripRef.current).backgroundColor;
        // Parse rgb(r, g, b) or rgba(r, g, b, a)
        const rgbMatch = computed.match(
          /rgba?\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)/
        );
        if (rgbMatch) {
          const r = parseFloat(rgbMatch[1]!) / 255;
          const g = parseFloat(rgbMatch[2]!) / 255;
          const b = parseFloat(rgbMatch[3]!) / 255;
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = ((max + min) / 2) * 100;
          let h = 0;
          let s = 0;
          if (max !== min) {
            const d = max - min;
            s =
              (l > 50 ? d / (2 - max - min) : d / (max + min)) * 100;
            if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
            else if (max === g) h = ((b - r) / d + 2) * 60;
            else h = ((r - g) / d + 4) * 60;
          }
          const textH = (h + 180) % 360;
          const textL =
            l > 50 ? Math.max(10, l - 45) : Math.min(90, l + 45);
          labelRef.current.style.color = `hsl(${textH}, ${Math.min(s, 90)}%, ${textL}%)`;
        }
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Box
      position="relative"
      cursor="pointer"
      onClick={onClick}
      onMouseEnter={() => {
        hoverState.mode = mode;
        setHovered(true);
      }}
      onMouseLeave={() => {
        hoverState.mode = null;
        setHovered(false);
      }}
    >
      <Box
        ref={stripRef}
        position="absolute"
        top={0}
        bottom={0}
        left="50%"
        width="100vw"
        bg={hovered ? 'var(--strip-bg, #333)' : stripColor}
        opacity={0.85}
        zIndex={-1}
        transform="translateX(-50%)"
        cursor="pointer"
      />
      <Box
        ref={labelRef}
        p={1}
        style={{ color: 'white' }}
      >
        {label}
      </Box>
    </Box>
  );
};

export default StripButton;
