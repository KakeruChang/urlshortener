import { ReactElement } from "react";

interface TooltipProps {
  content: string;
  children: ReactElement;
  isShow: boolean;
}

export default function Tooltip({ children, content, isShow }: TooltipProps) {
  return isShow ? (
    <div className="tooltip tooltip-open tooltip-right" data-tip={content}>
      {children}
    </div>
  ) : null;
}
