import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface TimelineStep {
  label: string;
  actor: string;
  timestamp: string;
  remarks: string;
  status: "COMPLETED" | "ACTIVE" | "PENDING";
}

interface TimelineProps {
  currentStatus: string;
  createdAt: string;
  resolvedAt: string | null;
}

export const Timeline: React.FC<TimelineProps> = ({ currentStatus, createdAt, resolvedAt }) => {
  const formatTime = (isoStr: string) => new Date(isoStr).toLocaleString();

  // The 9-Stage Progress Definitions
  const rawStages = [
    { key: "SUBMITTED", label: "Complaint Submitted", actor: "Citizen" },
    { key: "CLASSIFIED", label: "AI Analysis Completed", actor: "CityMind AI" },
    { key: "DEPT_ASSIGNED", label: "Department Assigned", actor: "System Router" },
    { key: "ASSIGNED", label: "Officer Assigned", actor: "Supervisor" },
    { key: "IN_PROGRESS", label: "Work Started", actor: "Field Responder" },
    { key: "VERIFICATION", label: "Field Verification", actor: "Quality Assurer" },
    { key: "RESOLVED", label: "Resolution Uploaded", actor: "Field Responder" },
    { key: "CONFIRMED", label: "Citizen Confirmation", actor: "Citizen" },
    { key: "CLOSED", label: "Closed", actor: "System Agent" }
  ];

  // Resolve active index based on currentStatus parameter
  const statusHierarchy = ["SUBMITTED", "CLASSIFIED", "DEPT_ASSIGNED", "ASSIGNED", "IN_PROGRESS", "VERIFICATION", "RESOLVED", "CONFIRMED", "CLOSED"];
  const activeIdx = statusHierarchy.indexOf(currentStatus);

  const steps: TimelineStep[] = rawStages.map((stage, idx) => {
    let statusState: "COMPLETED" | "ACTIVE" | "PENDING" = "PENDING";
    let ts = "";
    let rem = "";

    if (idx < activeIdx) {
      statusState = "COMPLETED";
      ts = idx === 0 ? formatTime(createdAt) : "Timestamp logged";
      rem = `Task processed by ${stage.actor}`;
    } else if (idx === activeIdx) {
      statusState = "ACTIVE";
      ts = idx === 6 && resolvedAt ? formatTime(resolvedAt) : "Active now";
      rem = `Grievance state is currently managed by ${stage.actor}`;
    } else {
      statusState = "PENDING";
      rem = "Awaiting preceding workflow completion...";
    }

    return {
      label: stage.label,
      actor: stage.actor,
      timestamp: ts,
      remarks: rem,
      status: statusState
    };
  });

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Redressal Progress Timeline</h3>
      
      <div className="relative border-l border-gray-200 ml-4 space-y-8">
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-8">
            {/* Left Dot icons */}
            <span className="absolute -left-[17px] top-1 bg-white rounded-full">
              {step.status === "COMPLETED" ? (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              ) : step.status === "ACTIVE" ? (
                <Clock className="w-8 h-8 text-orange-500 animate-pulse" />
              ) : (
                <Circle className="w-8 h-8 text-gray-200 fill-gray-50" />
              )}
            </span>

            <div>
              <div className="flex items-center justify-between gap-4 mb-1">
                <h4 className={`text-sm font-bold ${step.status === "ACTIVE" ? "text-orange-600" : step.status === "COMPLETED" ? "text-gray-800" : "text-gray-400"}`}>
                  {step.label}
                </h4>
                {step.timestamp && (
                  <span className="text-[10px] text-gray-400 font-semibold">{step.timestamp}</span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-1">{step.remarks}</p>
              <span className="inline-block text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md font-bold">
                Actor: {step.actor}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
