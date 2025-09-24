import * as maplibregl from "maplibre-gl";
import * as ReactDOM from "react-dom/client";
import MapFilters, { defaultMapFilters } from "../MapFilters";
import controlWidth from "./controlWidth";
import EventBus from "./EventBus";
import { FilterForm } from "./FilterForm";
import { Themed } from "./Themed";
import { UnitSystemManager } from "./UnitSystemManager";

export class FilterControl implements maplibregl.IControl {
  _container: HTMLDivElement;
  _map: maplibregl.Map | null = null;
  _eventBus: EventBus;
  _filters: MapFilters = defaultMapFilters;
  _visibleSkiAreasCount: number = 0;
  _root: ReactDOM.Root | null = null;

  constructor(eventBus: EventBus) {
    this._eventBus = eventBus;
    this._container = document.createElement("div");
    this._container.className = "maplibregl-ctrl";
  }

  onAdd = (map: maplibregl.Map) => {
    this._root = ReactDOM.createRoot(this._container);
    this._map = map;
    this.render();
    this._map.on("resize", this.render);
    return this._container;
  };

  onRemove = () => {
    this._root?.unmount();
    this._root = null;
    this._map && this._map.off("resize", this.render);
    const parent = this._container.parentNode;
    parent && parent.removeChild(this._container);
    this._map = null;
  };

  setFilters = (filters: MapFilters) => {
    this._filters = filters;
  };

  setVisibleSkiAreasCount = (count: number) => {
    this._visibleSkiAreasCount = count;
    this.render();
  };

  private render = () => {
    this._root?.render(
      <Themed>
        <UnitSystemManager
          render={(unitSystem) => (
            <FilterForm
              eventBus={this._eventBus}
              filters={this._filters}
              width={controlWidth(this._map!)}
              visibleSkiAreasCount={this._visibleSkiAreasCount}
              unitSystem={unitSystem}
            />
          )}
        />
      </Themed>
    );
  };

  getDefaultPosition = (): maplibregl.ControlPosition => {
    return "top-left";
  };
}
