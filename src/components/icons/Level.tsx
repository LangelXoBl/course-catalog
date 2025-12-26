import type { SVGProps } from 'react';

export const LevelIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" {...props}>
    <path d="M7 14a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0v-4a1 1 0 0 1 1-1" clipRule="evenodd" />
    <path d="M17 4a1 1 0 0 1 1 1v14a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1" clipRule="evenodd" />
    <path d="M12 9a1 1 0 0 1 1 1v9a1 1 0 1 1-2 0v-9a1 1 0 0 1 1-1" clipRule="evenodd" />
  </svg>
);
