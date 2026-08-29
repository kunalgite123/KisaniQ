import React from "react";

interface Props {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-header-title">{title}</h1>
        <p className="page-header-sub">{subtitle}</p>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
