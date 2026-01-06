import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, icon: Icon, color = "blue", trend }: StatCardProps) {
  const colorClasses: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    amber: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
  };

  return (
    <Card className="hover-lift animate-fade-in-up overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
              {trend && (
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {trend.isPositive ? '+' : '-'}{trend.value}%
                </span>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[color] || colorClasses.blue}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function FeatureCard({ title, description, icon: Icon, onClick }: { title: string, description: string, icon: LucideIcon, onClick?: () => void }) {
  return (
    <Card 
      className="hover-lift animate-fade-in-up cursor-pointer group"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
