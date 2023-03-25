import { Box } from '@mui/material';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Section from '../components/Section';
import { homeContent } from '../content/home';

export default function Home() {
  const { state } = useLocation();

  useEffect(() => {
    if (state && state.scroll) {
      const sectionId = state.scroll;

      setTimeout(() => {
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 10);
    }
  }, [state]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.section') as NodeListOf<HTMLElement>;
      const distances = [];
      sections.forEach((section) => {
        distances.push({
          id: section.id,
          top: section.offsetTop,
          height: section.offsetHeight,
        });
        const distTop = section.offsetTop - window.scrollY;
        const distBottom = section.offsetTop + section.offsetHeight - window.scrollY;
        if (distTop < 10 && distBottom > 10) {
          if (window.location.pathname === `/${section.id}`) return;
          if (section.id === `top` && window.location.pathname === '/') return;
          if (section.id === `top` && window.location.pathname !== '/') {
            return window.history.pushState({}, '', `/`);
          }
          window.history.pushState({}, '', `/${section.id}`);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <Box sx={{ paddingBottom: '60px' }}>
      {homeContent.map((section) => (
        <Section key={section.anchorId} {...section} />
      ))}
    </Box>
  );
}
