import { system } from "@minecraft/server";

const VOID_ARENA_ID = "custom_dim:elijah_dim";

system.beforeEvents.startup.subscribe((event) => {
  event.dimensionRegistry.registerCustomDimension(Elijah-Dim);
});
