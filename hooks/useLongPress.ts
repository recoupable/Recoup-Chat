import { useState, useCallback, useRef } from 'react';

interface LongPressOptions {
  shouldPreventDefault?: boolean;
  delay?: number;
}

interface LongPressResult {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

export default function useLongPress(
  onLongPress: (e: React.MouseEvent | React.TouchEvent) => void,
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void,
  { shouldPreventDefault = true, delay = 300 }: LongPressOptions = {}
): LongPressResult {
  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef<NodeJS.Timeout>();
  const target = useRef<EventTarget>();

  const start = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (shouldPreventDefault && e.target) {
        e.preventDefault();
      }
      
      const clonedEvent = { ...e };
      target.current = e.target;
      timeout.current = setTimeout(() => {
        onLongPress(clonedEvent);
        setLongPressTriggered(true);
      }, delay);
    },
    [onLongPress, delay, shouldPreventDefault]
  );

  const clear = useCallback(
    (e: React.MouseEvent | React.TouchEvent, shouldTriggerClick = true) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
        
        if (shouldTriggerClick && !longPressTriggered && onClick && e.target === target.current) {
          onClick(e);
        }
      }
      setLongPressTriggered(false);
      target.current = undefined;
    },
    [onClick, longPressTriggered]
  );

  return {
    onMouseDown: (e) => start(e),
    onTouchStart: (e) => start(e),
    onMouseUp: (e) => clear(e),
    onMouseLeave: (e) => clear(e, false),
    onTouchEnd: (e) => clear(e),
  };
} 