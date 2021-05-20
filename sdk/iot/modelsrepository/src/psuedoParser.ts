// Copyright (c) Microsoft.
// Licensed under the MIT license.

import { DTDL } from "./dtdl";
import { logger } from "./logger";
import { DtmiResolver } from "./dtmiResolver";
import { RestError } from "@azure/core-rest-pipeline";

/**
 * @internal
 */
export class PseudoParser {
  private _resolver: DtmiResolver;

  constructor(resolver: DtmiResolver) {
    this._resolver = resolver;
  }

  async expand(models: DTDL[], tryFromExpanded: boolean) {
    let expandedMap: any = {};
    for (let i=0; i<models.length; i++) {
      const model: DTDL = models[i];
      if (model["@id"] !== undefined) {
        expandedMap[model["@id"]] = model;
      } else {
        throw Error(`model ${model} does not contain @id member`);
      }
      await this._expand(model, expandedMap, tryFromExpanded);
    }
    return expandedMap;
  }

  private async _expand(model: DTDL, modelMap: any, tryFromExpanded: boolean): Promise<void> {
    logger.info(`Expanding model: ${model["@id"]}`);
    let dependencies = this._getModelDependencies(model);
    let dependenciesToResolve = dependencies.filter((dependency: string) => {
      return !(dependency in modelMap);
    });
    if (dependenciesToResolve.length !== 0) {
      logger.info(`Outstanding dependencies found: ${dependenciesToResolve}`);
      let resolvedDependenciesMap: { [s: string]: unknown; };
      try {
        resolvedDependenciesMap = await this._resolver.resolve(dependenciesToResolve, tryFromExpanded);
      } catch (e) {
        if (e instanceof RestError) {
          resolvedDependenciesMap = await this._resolver.resolve(dependenciesToResolve, false);
        } else {
          throw e;
        }
      }
      Object.keys(resolvedDependenciesMap).forEach((key) => {
        modelMap[key] = resolvedDependenciesMap[key];
      })
      const promiseList: Promise<void>[] = [];
      Object.values(resolvedDependenciesMap).forEach((dependencyModel) => {
        promiseList.push(this._expand(dependencyModel as DTDL, modelMap, tryFromExpanded));
      });
      await Promise.all(promiseList);
    }
  }

  private _getModelDependencies(model: DTDL) {
    let dependencies = [];

    if (model.contents !== undefined) {
      const contents = model.contents;
      contents.forEach((element) => {
        if (
          element["@type"] &&
          typeof element["@type"] === "string" &&
          element["@type"] === "Component"
        ) {
          if (element.schema && typeof element.schema === "string") {
            dependencies.push(element.schema);
          }
        }
      });
    }

    if (model.extends !== undefined) {
      if (typeof model.extends === "string") {
        dependencies.push(model.extends);
      } else if (Array.isArray(model.extends)) {
        model.extends.forEach((element) => {
          if (typeof element === "string") {
            dependencies.push(element);
          } else if (typeof element === "object") {
            dependencies.push(this._getModelDependencies(element));
          }
        });
      }
    }

    dependencies = Array.from(new Set(dependencies));
    return dependencies;
  }
}