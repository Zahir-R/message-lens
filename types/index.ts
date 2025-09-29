export interface Message {
    datetime: Date;
    sender: string;
    message: string;
    important: boolean;
    score: number;
    categories: string[];
}

export interface KeywordCategories {
    [category: string]: string[];
}

export interface FilterPatterns {
    date: boolean;
    time: boolean;
    link: boolean;
    place: boolean;
}

export interface FilterParameters {
    keywords: KeywordCategories;
    patterns: FilterPatterns;
    importantSenders: string[];
    scores: {
        keywordScore: number;
        patternScore: number;
        senderScore: number;
        threshold: number;
    };
}

export interface ProcessResponse {
    report: string;
    messageCount: number;
    importantCount: number;
}