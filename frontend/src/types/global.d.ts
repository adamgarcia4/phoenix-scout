// someDefinitionFile.d.ts

// Target the module containing the `ProcessEnv` interface
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
declare namespace NodeJS
{

    // Merge the existing `ProcessEnv` definition with ours
    // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
    export interface ProcessEnv
    {
        NODE_ENV: 'development' | 'production' | 'test';
        REACT_APP_TBA_KEY: string,
        REACT_APP_TBA_URL: string,
        SERVER_URL: string,
        MONGO_URL: string,
    }
}
