export const doctorKeys = {
    all: ["doctors"] as const,
    lists: ["doctors", "list"] as const,
    list: (params: object) => ["doctors", "list", params] as const,
    detail: (id: string) => ["doctors", "detail", id] as const,
    filters: ["doctors", "filters"] as const,
    options: ["doctors", "options"] as const,
};

export const patientKeys = {
    all: ["patients"] as const,
    list: (params: object) => ["patients", "list", params] as const,
    filters: ["patients", "filters"] as const,
    byDoctor: (doctorId: string, params: object) =>
        ["patients", "doctor", doctorId, params] as const,
};

export const dashboardKeys = { all: ["dashboard"] as const };