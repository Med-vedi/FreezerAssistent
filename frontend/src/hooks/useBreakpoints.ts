import { useMediaquery } from './useMediaQuery'

export interface BreakpointDictionary {
  /** always active */
  xs: boolean;
  /** min-width: 640px */
  sm: boolean;
  /** min-width: 768px */
  md: boolean;
  /** min-width: 1024px */
  lg: boolean;
  /** min-width: 1280px */
  xl: boolean;
  /** min-width: 1536px */
  xxl: boolean;
}

export const useBreakpoints = (): BreakpointDictionary => {
  const sm = useMediaquery('(min-width: 640px)');
  const md = useMediaquery('(min-width: 768px)');
  const lg = useMediaquery('(min-width: 1024px)');
  const xl = useMediaquery('(min-width: 1280px)');
  const xxl = useMediaquery('(min-width: 1536px)');
  const xs = !sm && !md && !lg && !xl && !xxl;

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
  }
}