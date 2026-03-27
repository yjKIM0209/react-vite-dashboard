// src/shared/components/layout/PageHeader.tsx
import { type ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

interface PageHeaderProps {
  title: string;
  breadcrumbs: string[];
  actions?: ReactNode;
}

export function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            {title}
          </h1>

          {/* 계층 구조 표현 (Breadcrumb) */}
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((name, index) => (
                <Fragment key={name}>
                  <BreadcrumbItem>
                    {index === breadcrumbs.length - 1 ? (
                      <BreadcrumbPage className="text-slate-400 font-normal">{name}</BreadcrumbPage>
                    ) : (
                      <span className="text-slate-400 font-normal">{name}</span>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="text-slate-300" />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {actions}
      </div>
    </div>
  );
}