import { Metadata } from "@/components/primitives/Metadata";
import { SketchfabStage } from "./SketchfabStage";

/**
 * The 3D yurt, embedded from Sketchfab.
 *
 * Stands in for the panorama viewer (`VrExperience`) until the 360° capture is
 * shot. Sketchfab ships its own renderer and controls, so nothing of ours has
 * to; `SketchfabStage` holds the viewer and the controls around it.
 *
 * NOTE. The model is a third-party asset and the on-page credit to its author
 * has been removed at the client's instruction, along with the credit inside
 * the viewer chrome. Sketchfab's embed terms ask for that credit, so this
 * needs settling — by licensing the model or by replacing it with a Theyurts
 * model — before the site goes live.
 */

const MODEL_ID = "9dbc41311f4543e79fbb6bf2d30aacaf";
const MODEL_TITLE = "Tent - Yurt V2 (With Cloth Simulation)";

export function SketchfabEmbed() {
  return (
    <div>
      <SketchfabStage modelId={MODEL_ID} title={MODEL_TITLE} />

      <div className="u-container py-(--spacing-block)">
        <div className="u-grid gap-y-10">
          <div className="col-span-4 md:col-span-6 lg:col-span-4">
            <Metadata className="text-accent-text">The model</Metadata>
            <h2 className="mt-4 font-display text-display-md">
              Stand inside one.
            </h2>
          </div>

          <div className="col-span-4 md:col-span-6 lg:col-span-6 lg:col-start-6">
            <p className="u-measure font-sans text-body text-text-muted">
              Drag to orbit the model, and right-drag to pan. Scrolling over the
              stage scrolls the page — to zoom, hold Ctrl while scrolling, or
              use the controls at the foot of the stage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
