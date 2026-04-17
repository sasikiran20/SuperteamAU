import { Badge, MemberRole } from "@/types";

export const badgeConfig: Record<Badge, { emoji: string; color: string }> = {
  Builder: { emoji: "🛠️", color: "bg-primary/20 text-primary border-primary/30" },
  "Hackathon Winner": { emoji: "🏆", color: "bg-accent/20 text-accent border-accent/30" },
  "Core Contributor": { emoji: "⭐", color: "bg-secondary/20 text-secondary border-secondary/30" },
  "Grant Recipient": { emoji: "💰", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
};

export const roleConfig: Record<MemberRole, string> = {
  Developer: "bg-secondary/20 text-secondary border-secondary/30",
  Designer: "bg-primary/20 text-primary border-primary/30",
  Content: "bg-accent/20 text-accent border-accent/30",
  BizDev: "bg-white/10 text-white/80 border-white/20",
  Founder: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  Operator: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};
