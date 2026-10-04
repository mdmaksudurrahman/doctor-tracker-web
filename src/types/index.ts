export type User = {
    id: string;
    name: string;
    email: string;
    role: "admin";
};

export type Gender = "male" | "female" | "other";

export type Doctor = {
    _id: string;
    name: string;
    specialization: string;
    hospital: string;
    phone: string;
    email: string;
    createdAt: string;
    updatedAt: string;
};

export type Patient = {
    _id: string;
    name: string;
    age: number;
    gender: Gender;
    condition: string;
    phone?: string;
    // The list endpoints populate the doctor with these two fields
    doctor: { _id: string; name: string; specialization: string };
    createdAt: string;
    updatedAt: string;
};

export type PageMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type Paginated<T> = { items: T[]; meta: PageMeta };

export type CountItem = { name: string; count: number };

export type DashboardStats = {
    range: { days: number; from: string };
    totals: {
        doctors: number;
        patients: number;
        newDoctors: number;
        newPatients: number;
        avgPatientsPerDoctor: number;
    };
    patientsPerDoctor: { doctorId: string; name: string; specialization: string; count: number }[];
    patientsOverTime: { date: string; count: number }[];
    conditions: CountItem[];
    genders: CountItem[];
    specializations: CountItem[];
};