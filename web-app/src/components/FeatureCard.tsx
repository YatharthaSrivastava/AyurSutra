import { Link } from "react-router-dom";
import type { UserRole } from "@/lib/types";

interface FeatureCardProps {
  title: string;
  description: string;
  to: string;
  badge?: string;
}

export function FeatureCard({ title, description, to, badge }: FeatureCardProps) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl border border-ayur-primary/10 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-ayur-accent hover:shadow-md"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif text-xl text-ayur-primary group-hover:text-ayur-primary-light">
          {title}
        </h3>
        {badge && (
          <span className="rounded-full bg-ayur-accent/20 px-2 py-0.5 text-xs font-medium text-ayur-primary">
            {badge}
          </span>
        )}
      </div>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </Link>
  );
}

export function RoleBadge({ role }: { role: UserRole }) {
  const colors: Record<UserRole, string> = {
    PATIENT: "bg-dosha-kapha/15 text-dosha-kapha",
    VAIDYA: "bg-dosha-pitta/15 text-dosha-pitta",
    ADMIN: "bg-ayur-accent/20 text-ayur-primary",
    THERAPIST: "bg-dosha-vata/15 text-dosha-vata",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${colors[role]}`}>
      {role}
    </span>
  );
}
