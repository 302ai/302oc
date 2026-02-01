/**
 * 302oc 类型定义
 */
export interface Profile {
    name: string;
    apiKey: string;
    baseUrl: string;
    models: Models;
}
export interface Models {
    primary?: string;
    haiku?: string;
    sonnet?: string;
    opus?: string;
}
export interface Config {
    version: string;
    currentProfile: string;
    profiles: Record<string, Profile>;
}
/**
 * OpenClaw 配置文件类型定义
 */
export interface OpenClawSettings {
    meta?: {
        lastTouchedVersion?: string;
        lastTouchedAt?: string;
    };
    wizard?: {
        lastRunAt?: string;
        lastRunVersion?: string;
        lastRunCommand?: string;
        lastRunMode?: string;
    };
    models?: {
        mode?: string;
        providers?: Record<string, OpenClawProvider>;
    };
    agents?: {
        defaults?: {
            model?: {
                primary?: string;
                fallbacks?: string[];
            };
            models?: Record<string, {
                alias?: string;
            }>;
            workspace?: string;
            maxConcurrent?: number;
            subagents?: {
                maxConcurrent?: number;
            };
        };
    };
    messages?: Record<string, any>;
    commands?: Record<string, any>;
    gateway?: Record<string, any>;
    skills?: Record<string, any>;
    [key: string]: any;
}
export interface OpenClawProvider {
    baseUrl: string;
    apiKey: string;
    auth: string;
    api: string;
    authHeader?: boolean;
    models: OpenClawModel[];
}
export interface OpenClawModel {
    id: string;
    name: string;
    api?: string;
    reasoning?: boolean;
    input?: string[];
    contextWindow?: number;
    maxTokens?: number;
}
export declare const DEFAULT_MODELS: {
    readonly haiku: "claude-3-5-haiku-20241022";
    readonly sonnet: "claude-sonnet-4-20250514";
    readonly opus: "claude-opus-4-20250514";
};
export declare const MODEL_ENV_KEYS: readonly ["ANTHROPIC_MODEL", "ANTHROPIC_DEFAULT_HAIKU_MODEL", "ANTHROPIC_DEFAULT_SONNET_MODEL", "ANTHROPIC_DEFAULT_OPUS_MODEL"];
//# sourceMappingURL=index.d.ts.map