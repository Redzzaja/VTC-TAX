"use client";

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  onComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 30,
  duration = 0.6,
  ease = 'power3.out',
  tag = 'p',
  onComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    const chars = containerRef.current.querySelectorAll('.split-char');
    gsap.fromTo(
      chars,
      { opacity: 0, y: 40, rotateX: -90 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration,
        ease,
        stagger: delay / 1000,
        onComplete,
      }
    );
  }, [isVisible, delay, duration, ease, onComplete]);

  const words = text.split(' ');

  return (
    <div ref={containerRef}>
      {React.createElement(
        tag,
        { className, style: { perspective: '1000px' } },
        words.map((word, wIdx) => (
          <span key={wIdx} className="inline-block whitespace-nowrap">
            {word.split('').map((char, cIdx) => (
              <span
                key={`${wIdx}-${cIdx}`}
                className="split-char inline-block opacity-0"
                style={{ transformOrigin: 'bottom center' }}
              >
                {char}
              </span>
            ))}
            {wIdx < words.length - 1 && (
              <span className="split-char inline-block opacity-0">&nbsp;</span>
            )}
          </span>
        ))
      )}
    </div>
  );
};

export default SplitText;
