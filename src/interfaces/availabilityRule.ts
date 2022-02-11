interface IAvailableInterval {
    start: string;
    end: string;
};

export interface IAvailabilityRule {
    uuid: string;
    frequency: "daily" | "weekly" | "once";
    day?: string;
    weekdays?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"[];
    intervals: IAvailableInterval[];
};

export interface IAvailabilityRuleDTO {
    uuid?: string;
    frequency: "daily" | "weekly" | "once";
    day?: string;
    weekdays?: "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"[];
    intervals: IAvailableInterval[];
};