type OutputCardProps = {
  eyebrow: string;
  title: string;
  body: string;
};

export default function OutputCard({ eyebrow, title, body }: OutputCardProps) {
  return (
    <article className="ai-output-card">
      <span className="ai-output-card-eyebrow">{eyebrow}</span>
      <h4>{title}</h4>
      <p>{body}</p>
    </article>
  );
}
