import styles from "./tabs.module.scss";

interface TabsProps {
  tabs: string[];
  activeTab: number;
  children: React.ReactNode;
  onTabChange: (index: number) => void;
  disabled?: boolean[];
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  children,
  onTabChange,
  disabled,
  className,
}: TabsProps) {
  return (
    <>
      <div className={`${styles["swarm-comment-tabs"]} ${className}`}>
        {tabs.map((tab, index) => (
          <button
            className={index === activeTab ? styles["active"] : ""}
            key={tab}
            disabled={disabled && disabled[index]}
            onClick={() => onTabChange(index)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className={styles["swarm-comment-tabs-content"]}>{children}</div>
    </>
  );
}
