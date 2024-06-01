import {Scene, SceneLoader} from "@babylonjs/core";
import {ISceneLoaderProgressEvent, SceneLoaderSuccessCallback} from "@babylonjs/core/Loading/sceneLoader";
import type {Nullable} from "@babylonjs/core/types";
import type {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh";
import type {IParticleSystem} from "@babylonjs/core/Particles/IParticleSystem";
import type {Skeleton} from "@babylonjs/core/Bones/skeleton";
import type {AnimationGroup} from "@babylonjs/core/Animations/animationGroup";
import type {TransformNode} from "@babylonjs/core/Meshes/transformNode";
import type {Geometry} from "@babylonjs/core/Meshes/geometry";
import type {Light} from "@babylonjs/core/Lights/light";

export class OlympiadAssetsManager {

    static ASSET_CACHE: { [key: string]: {
                    isLoaded: boolean,
                    successArgs?: [AbstractMesh[], IParticleSystem[], Skeleton[], AnimationGroup[], TransformNode[], Geometry[], Light[]],
                    successCallbacks? : SceneLoaderSuccessCallback[],
                    progressArgs?: ISceneLoaderProgressEvent,
                    progressCallbacks?: ((event: ISceneLoaderProgressEvent) => void)[],
                    errorArgs?: [Scene, string, any],
                    errorCallbacks?: ((scene: Scene, message: string, exception?: any) => void)[],
                }
            } = {};

    public static ImportMesh(meshNames: string | string[], rootUrl: string, sceneFilename: string, scene: Scene, onSuccess?: Nullable<SceneLoaderSuccessCallback>, onProgress?: Nullable<(event: ISceneLoaderProgressEvent) => void>, onError?: Nullable<(scene: Scene, message: string, exception?: any) => void>) {
        const cacheKey = `${rootUrl}${sceneFilename}`;

        console.log("Importing mesh:", cacheKey);
        // Check if asset is already in the cache
        if (OlympiadAssetsManager.ASSET_CACHE[cacheKey]) {
            if (OlympiadAssetsManager.ASSET_CACHE[cacheKey].isLoaded) {
                console.log("Using cached asset:", cacheKey);
                if (onSuccess) {
                    let successArgs = OlympiadAssetsManager.ASSET_CACHE[cacheKey].successArgs;
                    if (successArgs) {
                        onSuccess(...successArgs);
                    }
                }

                return;
            } else {
                // Asset is being loaded, add the successCallbacks to the list
                if (onSuccess) {
                    OlympiadAssetsManager._addSuccessCallback(cacheKey, onSuccess);
                }

                if (onProgress) {
                    OlympiadAssetsManager._addProgressCallback(cacheKey, onProgress);
                }

                if (onError) {
                    OlympiadAssetsManager._addErrorCallback(cacheKey, onError);
                }
            }
        } else {
            OlympiadAssetsManager.ASSET_CACHE[cacheKey] = {
                isLoaded: false,
            }
            if (onSuccess) {
                OlympiadAssetsManager._addSuccessCallback(cacheKey, onSuccess);
            }

            if (onProgress) {
                OlympiadAssetsManager._addProgressCallback(cacheKey, onProgress);
            }

            if (onError) {
                OlympiadAssetsManager._addErrorCallback(cacheKey, onError);
            }
            console.log("Loading asset:", cacheKey);

            // Asset not in cache, load it
            SceneLoader.ImportMesh(
                meshNames,               // Mesh names to load
                rootUrl,                 // Root URL
                sceneFilename,                // File name
                scene,                   // Scene object
                (meshes: AbstractMesh[], particleSystems: IParticleSystem[], skeletons: Skeleton[], animationGroups: AnimationGroup[], transformNodes: TransformNode[], geometries: Geometry[], lights: Light[]) => {
                    // Cache the asset
                    console.log("Asset loaded:", cacheKey);
                    OlympiadAssetsManager.ASSET_CACHE[cacheKey].isLoaded = true;
                    OlympiadAssetsManager.ASSET_CACHE[cacheKey].successArgs = [meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights];

                    // Call the success successCallbacks
                    let length = OlympiadAssetsManager.ASSET_CACHE[cacheKey].successCallbacks!.length;
                    for (let i = 0; i < length; i++) {
                        let callback = OlympiadAssetsManager.ASSET_CACHE[cacheKey].successCallbacks?.shift();
                        if (callback) {
                            callback(meshes, particleSystems, skeletons, animationGroups, transformNodes, geometries, lights);
                        }
                    }
                },
                (event: ISceneLoaderProgressEvent) => {
                    OlympiadAssetsManager.ASSET_CACHE[cacheKey].progressArgs = event;
                    let length = OlympiadAssetsManager.ASSET_CACHE[cacheKey].successCallbacks!.length;
                    for (let i = 0; i < length; i++) {
                        let callback = OlympiadAssetsManager.ASSET_CACHE[cacheKey].progressCallbacks?.shift();
                        if (callback) {
                            callback(event);
                        }
                    }
                },
                (scene: Scene, message: string, exception?: any) => {
                    console.error("Asset loading error:", cacheKey, message, exception);
                    OlympiadAssetsManager.ASSET_CACHE[cacheKey].errorArgs = [scene, message, exception];
                    let length = OlympiadAssetsManager.ASSET_CACHE[cacheKey].successCallbacks!.length;
                    for (let i = 0; i < length; i++) {
                        let callback = OlympiadAssetsManager.ASSET_CACHE[cacheKey].errorCallbacks?.shift();
                        if (callback) {
                            callback(scene, message, exception);
                        }
                    }
                }
            );
        }

    }

    private static _addSuccessCallback(cacheKey: string, callback: SceneLoaderSuccessCallback) {
        if (OlympiadAssetsManager.ASSET_CACHE[cacheKey].successCallbacks) {
            OlympiadAssetsManager.ASSET_CACHE[cacheKey].successCallbacks!.push(callback);
        } else {
            OlympiadAssetsManager.ASSET_CACHE[cacheKey].successCallbacks = [callback];
        }
    }

    private static _addProgressCallback(cacheKey: string, callback: (event: ISceneLoaderProgressEvent) => void) {
        if (OlympiadAssetsManager.ASSET_CACHE[cacheKey].progressCallbacks) {
            OlympiadAssetsManager.ASSET_CACHE[cacheKey].progressCallbacks!.push(callback);
        } else {
            OlympiadAssetsManager.ASSET_CACHE[cacheKey].progressCallbacks = [callback];
        }
    }

    private static _addErrorCallback(cacheKey: string, callback: (scene: Scene, message: string, exception?: any) => void) {
        if (OlympiadAssetsManager.ASSET_CACHE[cacheKey].errorCallbacks) {
            OlympiadAssetsManager.ASSET_CACHE[cacheKey].errorCallbacks!.push(callback);
        } else {
            OlympiadAssetsManager.ASSET_CACHE[cacheKey].errorCallbacks = [callback];
        }
    }
}
