// someDefinitionFile.d.ts

// Target the module containing the `ProcessEnv` interface
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
// declare namespace NodeJS
// {

//     // Merge the existing `ProcessEnv` definition with ours
//     // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
//     export interface ProcessEnv
//     {
//         NODE_ENV: 'development' | 'production' | 'test';
//         REACT_APP_FIREBASE_API_KEY: string
//         REACT_APP_FIREBASE_AUTH_DOMAIN: string
//         REACT_APP_FIREBASE_DATABASE_URL: string
//         REACT_APP_FIREBASE_PROJECT_ID: string
//         REACT_APP_FIREBASE_STORAGE_BUCKET: string
//         REACT_APP_FIREBASE_MESSAGING_SENDER_ID: string
//         REACT_APP_FIREBASE_APP_ID: string
//         REACT_APP_FIREBASE_MEASUREMENT_ID: string,
//         REACT_APP_TBA_KEY: string,
//         REACT_APP_TBA_URL: string,
//     }
// }
