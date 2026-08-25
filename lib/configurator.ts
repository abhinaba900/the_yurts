import {
  groups,
  defaultSelection,
  type GroupDef,
  type OptionDef,
  type OptionGroupId,
  type RenderSpec,
} from "@/data/configurator";
import type { ConfiguratorOption } from "@/sanity/lib/types";

export type Selection = Record<OptionGroupId, string>;

/**
 * Merges CMS options over the static definitions.
 *
 * A CMS option is matched to a static one by `assetKey` → `id`. That match is
 * what tells the 3D scene how to draw it: an option the model has never heard of
 * cannot be rendered, so one with an unrecognised key is dropped rather than
 * shown as a control that does nothing when clicked.
 *
 * Editors can therefore rename, reorder, describe and remove options freely.
 * Adding a genuinely new *appearance* needs a matching entry in
 * `data/configurator.ts` — which is correct, because it needs 3D work too.
 */
export function resolveGroups(cmsOptions: ConfiguratorOption[]): GroupDef[] {
  if (cmsOptions.length === 0) return groups;

  return groups
    .map((group) => {
      const fromCms = cmsOptions.filter((option) => option.group === group.id);
      if (fromCms.length === 0) return group;

      const options = fromCms
        .map((option): OptionDef | null => {
          const base = group.options.find((item) => item.id === option.assetKey);
          if (!base) return null;

          return {
            id: base.id,
            label: option.label || base.label,
            description: option.description ?? base.description,
            render: base.render,
          };
        })
        .filter((option): option is OptionDef => option !== null);

      return options.length > 0 ? { ...group, options } : group;
    })
    .filter((group) => group.options.length > 0);
}

/** The chosen option in each group, falling back to the first available. */
export function resolveSelection(
  selection: Partial<Selection>,
  resolved: GroupDef[],
): Selection {
  return Object.fromEntries(
    resolved.map((group) => {
      const chosen = selection[group.id];
      const valid = chosen && group.options.some((option) => option.id === chosen);
      return [group.id, valid ? chosen : group.options[0].id];
    }),
  ) as Selection;
}

/** Flattens the current selection into the render spec the 3D scene consumes. */
export function renderSpecFor(
  selection: Selection,
  resolved: GroupDef[],
): Record<OptionGroupId, RenderSpec> {
  return Object.fromEntries(
    resolved.map((group) => {
      const option =
        group.options.find((item) => item.id === selection[group.id]) ??
        group.options[0];
      return [group.id, option.render];
    }),
  ) as Record<OptionGroupId, RenderSpec>;
}

/** Human-readable summary, used in the panel and carried into the enquiry. */
export function summarise(
  selection: Selection,
  resolved: GroupDef[],
): { group: string; label: string; value: string }[] {
  return resolved.map((group) => ({
    group: group.id,
    label: group.label,
    value:
      group.options.find((item) => item.id === selection[group.id])?.label ??
      group.options[0].label,
  }));
}

/* -------------------------------------------------------------------------- */
/* URL encoding                                                               */
/*                                                                            */
/* Deliberately readable — `size-large_exterior-charcoal` rather than base64.  */
/* A configuration gets pasted into emails and support threads, and someone    */
/* should be able to see what it says. Unknown keys and values are ignored on  */
/* read, so an old or hand-edited link degrades to defaults instead of         */
/* throwing.                                                                   */
/* -------------------------------------------------------------------------- */

export function encodeSelection(selection: Selection): string {
  return Object.entries(selection)
    .map(([group, option]) => `${group}-${option}`)
    .join("_");
}

export function decodeSelection(value: string | null | undefined): Partial<Selection> {
  if (!value) return {};

  const out: Partial<Selection> = {};

  for (const part of value.split("_")) {
    const index = part.indexOf("-");
    if (index < 1) continue;

    const groupId = part.slice(0, index) as OptionGroupId;
    const optionId = part.slice(index + 1);

    const group = groups.find((item) => item.id === groupId);
    if (!group) continue;
    if (!group.options.some((option) => option.id === optionId)) continue;

    out[groupId] = optionId;
  }

  return out;
}

export { defaultSelection };
export type { GroupDef, OptionDef, OptionGroupId, RenderSpec };
