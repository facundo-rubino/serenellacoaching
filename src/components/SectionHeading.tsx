import styles from "./SectionHeading.module.scss";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  align?: "left" | "center";
  level?: 1 | 2;
  tone?: "default" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  accent,
  align = "center",
  level = 2,
  tone = "default",
}: SectionHeadingProps) {
  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className={`${styles.heading} ${styles[align]} ${styles[tone]}`}>
      <p>{eyebrow}</p>
      <Heading>
        {title}
        {accent ? <span> {accent}</span> : null}
      </Heading>
    </div>
  );
}
