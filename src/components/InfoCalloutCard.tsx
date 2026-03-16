import type { ReactNode } from 'react';
import type { HTMLAttributes } from 'react';

type InfoCalloutCardProps = {
  title: string;
  body: string;
  className?: string;
  children?: ReactNode;
} & HTMLAttributes<HTMLElement>;

export default function InfoCalloutCard({
  title,
  body,
  className = '',
  children,
  ...props
}: InfoCalloutCardProps) {
  return (
    <article className={`ai-callout-card ${className}`.trim()} {...props}>
      <div className="ai-callout-card-dot" aria-hidden="true" />
      <div className="ai-callout-card-body">
        <span className="ai-callout-card-title">{title}</span>
        <p>{body}</p>
        {children}
      </div>
    </article>
  );
}
