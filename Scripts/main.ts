import { system } from "@minecraft/server";

const Elijah_Dim = "elijah:elijah_dim";

system.beforeEvents.startup.subscribe((event) => {
  event.dimensionRegistry.registerCustomDimension(Elijah_Dim);
});

// Safe Platform

interface PlatformConfig {
  dimensionId: string;
  blockId: string;
  radius: number;
  center: Vector3;
  decor?: boolean;
}

const PLATFORMS: PlatformConfig[] = [
  {
    dimensionId: Elijah_Dim,
    blockId: "oak_planks",
    radius: 1,
    center: { x: 0, y: 63, z: 0 },
    decor: true,
  },
];

// Prepare dimension when world ready

const builtDimensions = new Set<string>();

world.afterEvents.worldLoad.subscribe(() => {
  for (const platform of PLATFORMS) {
    void ensurePlatformBuilt(platform);
  }
});

async function ensurePlatformBuilt(config: PlatformConfig): Promise<void> {
  if (builtDimensions.has(config.dimensionId)) {
    return;
  }

  const dim = world.getDimension(config.dimensionId);
  const tickingAreaId = `${config.dimensionId}_platform`;

  await world.tickingAreaManager.createTickingArea(tickingAreaId, {
    dimension: dim,
    from: {
      x: config.center.x - config.radius - 2,
      y: config.center.y - 1,
      z: config.center.z - config.radius - 2,
    },
    to: {
      x: config.center.x + config.radius + 2,
      y: config.center.y + 4,
      z: config.center.z + config.radius + 2,
    },
  });


buildPlatform(dim, config.blockId, config.radius, config.center);
  if (config.decor) {
    buildDecor(dim, config.center);
  }

  world.tickingAreaManager.removeTickingArea(tickingAreaId);
  builtDimensions.add(config.dimensionId);
}

const builtDimensions = new Set<string>();

world.afterEvents.worldLoad.subscribe(() => {
  for (const platform of PLATFORMS) {
    void ensurePlatformBuilt(platform);
  }
});

async function ensurePlatformBuilt(config: PlatformConfig): Promise<void> {
  if (builtDimensions.has(config.dimensionId)) {
    return;
  }

  const dim = world.getDimension(config.dimensionId);
  const tickingAreaId = `${config.dimensionId}_platform`;

  await world.tickingAreaManager.createTickingArea(tickingAreaId, {
    dimension: dim,
    from: {
      x: config.center.x - config.radius - 2,
      y: config.center.y - 1,
      z: config.center.z - config.radius - 2,
    },
    to: {
      x: config.center.x + config.radius + 2,
      y: config.center.y + 4,
      z: config.center.z + config.radius + 2,
    },
  });

buildPlatform(dim, config.blockId, config.radius, config.center);
  if (config.decor) {
    buildDecor(dim, config.center);
  }

  world.tickingAreaManager.removeTickingArea(tickingAreaId);
  builtDimensions.add(config.dimensionId);
}

interface DimensionOption {
  label: string;
  id: string;
  spawn: Vector3;
}

const DIMENSIONS: DimensionOption[] = [
  { label: "Elijah's Pocket Dimension", id: Elijah_Dim, spawn: { x: 0, y: 64, z: 0 } }
];

async function teleportToCustomDimension(player: Player, destination: DimensionOption) {
  const dim = world.getDimension(destination.id);
  const tickingAreaId = `${destination.id}_teleport`;

  await world.tickingAreaManager.createTickingArea(tickingAreaId, {
    dimension: dim,
    from: { x: destination.spawn.x - 4, y: destination.spawn.y - 4, z: destination.spawn.z - 4 },
    to: { x: destination.spawn.x + 4, y: destination.spawn.y + 4, z: destination.spawn.z + 4 },
  });

  const config = PLATFORMS.find((platform) => platform.dimensionId === destination.id);
  if (config) {
    await ensurePlatformBuilt(config);
  }

  player.teleport(destination.spawn, { dimension: dim });
  world.tickingAreaManager.removeTickingArea(tickingAreaId);
}
