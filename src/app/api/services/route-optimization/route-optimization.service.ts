import { api } from "../api.service";
import type {
  DailyOptimizedRouteOptions,
  OptimizedDailyRoute,
} from "../../interfaces/route-optimization";

export class RouteOptimizationService {
  async getDailyOptimizedRoute(
    options: DailyOptimizedRouteOptions = {},
  ): Promise<{
    success: boolean;
    data?: OptimizedDailyRoute;
    error?: string;
  }> {
    const params = new URLSearchParams();

    if (options.collectionDate) {
      params.set("collectionDate", options.collectionDate);
    }
    if (options.fresh) {
      params.set("fresh", "true");
    }
    if (options.originMode) {
      params.set("originMode", options.originMode);
    }
    if (options.originLatitude != null) {
      params.set("originLatitude", String(options.originLatitude));
    }
    if (options.originLongitude != null) {
      params.set("originLongitude", String(options.originLongitude));
    }

    const query = params.toString();
    const endpoint = `/route-optimization/daily${query ? `?${query}` : ""}`;

    const result = await api.get<{ data: OptimizedDailyRoute }>(endpoint, {
      timeout: 45_000,
      useCache: false,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error ?? "Erro ao calcular rota otimizada do dia",
      };
    }

    const payload = result.data as
      | OptimizedDailyRoute
      | { data?: OptimizedDailyRoute }
      | undefined;

    const route =
      payload && "stops" in payload
        ? payload
        : payload && "data" in payload
          ? payload.data
          : undefined;

    const hasCombined =
      route?.mapGeometry?.coordinates && route.mapGeometry.coordinates.length >= 2;
    const hasOutbound =
      route?.mapGeometryOutbound?.coordinates &&
      route.mapGeometryOutbound.coordinates.length >= 2;

    if (!hasCombined && !hasOutbound) {
      return {
        success: false,
        error: "Resposta inválida do servidor de rotas",
      };
    }

    return {
      success: true,
      data: {
        ...route,
        routeStartMode: route.routeStartMode ?? options.originMode ?? "company",
      },
    };
  }
}

export const routeOptimizationService = new RouteOptimizationService();
