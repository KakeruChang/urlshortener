import {
  forwardRef,
  ReactElement,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

interface TooltipProps {
  content: string;
  children: ReactElement;
}

export interface TooltipHandle {
  show: () => void;
  hide: () => void;
}

export default forwardRef<TooltipHandle, TooltipProps>(function Tooltip(
  { children, content }: TooltipProps,
  ref
) {
  const [isShow, setIsShow] = useState(false);

  useImperativeHandle(ref, () => ({
    hide: () => {
      setIsShow(false);
    },
    show: () => {
      setTimeout(() => {
        setIsShow(true);
      }, 1000);
    },
  }));

  useEffect(() => {
    if (isShow) {
      setTimeout(() => {
        setIsShow(false);
      }, 5000);
    }
  }, [isShow]);

  return isShow ? (
    <div className="tooltip tooltip-open tooltip-right" data-tip={content}>
      {children}
    </div>
  ) : null;
});
