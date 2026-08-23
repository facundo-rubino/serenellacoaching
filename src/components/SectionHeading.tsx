import styles from "./SectionHeading.module.scss";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  align?: "left" | "center";
  tone?: "default" | "light";
};

export function SectionHeading({
  eyebrow,
  title,
  accent,
  align = "center",
  tone = "default",
}: SectionHeadingProps) {
  return (
    <div className={`${styles.heading} ${styles[align]} ${styles[tone]}`}>
      <p>{eyebrow}</p>
      <h2>
        {title}
        {accent ? <span> {accent}</span> : null}
      </h2>
    </div>
  );
}
