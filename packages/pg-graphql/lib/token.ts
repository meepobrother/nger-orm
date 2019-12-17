import { InjectionToken } from "@nger/core";
import { Plugin } from "graphile-build";
export const AppendPluginsToken = new InjectionToken<Plugin[]>(`AppendPluginsToken`)
export const PrependPluginsToken = new InjectionToken<Plugin[]>(`PrependPluginsToken`);
export const SkipPluginsToken = new InjectionToken<Plugin[]>(`SkipPluginsToken`);
