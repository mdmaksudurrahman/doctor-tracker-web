export const doctorKeys = {
    all: ["doctors"] as const,
    lists: ["doctors", "list"] as const,
    list: (params: object) => ["doctors", "list", params] as const,
    detail: (id: string) => ["doctors", "detail", id] as const,
    filters: ["doctors", "filters"] as const,
};

export const patientKeys = {
    all: ["patients"] as const,
    byDoctor: (doctorId: string, params: object) =>
        ["patients", "doctor", doctorId, params] as const,
};

// The dashboard arrives in F7. Mutations already invalidate it so it never goes stale.
export const dashboardKeys = { all: ["dashboard"] as const };