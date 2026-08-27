import os
from PIL import Image

artifact_dir = r"C:\Users\abhin\.gemini\antigravity-ide\brain\bd4bbe96-7698-4aea-879a-574b3d17ed1d"
target_dir = r"d:\thardeye_projects\the yarts\public\media"

os.makedirs(target_dir, exist_ok=True)

# Helper function to crop and save
def save_crop(img, box, target_path, target_size=None):
    cropped = img.crop(box)
    if target_size:
        cropped = cropped.resize(target_size, Image.Resampling.LANCZOS)
    cropped.save(target_path, "JPEG", quality=95)
    print(f"Saved: {target_path} ({cropped.size})")

# Load base images
hero_yurt = Image.open(os.path.join(artifact_dir, "hero_yurt_1787566560202.jpg"))
classic_ext = Image.open(os.path.join(artifact_dir, "classic_exterior_1787566580496.jpg"))
resort_deck = Image.open(os.path.join(artifact_dir, "resort_deck_1787566731362.jpg"))
wellness_int = Image.open(os.path.join(artifact_dir, "wellness_interior_1787566749861.jpg"))
event_eve = Image.open(os.path.join(artifact_dir, "event_evening_1787566768420.jpg"))
app_resorts = Image.open(os.path.join(artifact_dir, "app_resorts_1787566787922.jpg"))
app_glamping = Image.open(os.path.join(artifact_dir, "app_glamping_1787566806664.jpg"))
app_farmstay = Image.open(os.path.join(artifact_dir, "app_farmstay_1787566827047.jpg"))
app_wellness = Image.open(os.path.join(artifact_dir, "app_wellness_1787566846533.jpg"))
app_events = Image.open(os.path.join(artifact_dir, "app_events_1787566870698.jpg"))
builder_cfg = Image.open(os.path.join(artifact_dir, "builder_config_1787566893478.jpg"))
vr_pano = Image.open(os.path.join(artifact_dir, "vr_panorama_1787566991102.jpg"))
workshop = Image.open(os.path.join(artifact_dir, "workshop_frame_1787567012386.jpg"))

# 1. hero-yurt.webp
hero_yurt.save(os.path.join(target_dir, "hero-yurt.webp"), "JPEG", quality=95)

# 2. yurt-classic-exterior.jpg
classic_ext.save(os.path.join(target_dir, "yurt-classic-exterior.jpg"), "JPEG", quality=95)

# 3. yurt-resort-deck.jpg
resort_deck.save(os.path.join(target_dir, "yurt-resort-deck.jpg"), "JPEG", quality=95)

# 4. yurt-wellness-interior.jpg
wellness_int.save(os.path.join(target_dir, "yurt-wellness-interior.jpg"), "JPEG", quality=95)

# 5. yurt-event-evening.jpg
event_eve.save(os.path.join(target_dir, "yurt-event-evening.jpg"), "JPEG", quality=95)

# 6. application-resorts.jpg
app_resorts.save(os.path.join(target_dir, "application-resorts.jpg"), "JPEG", quality=95)

# 7. application-glamping.jpg
app_glamping.save(os.path.join(target_dir, "application-glamping.jpg"), "JPEG", quality=95)

# 8. application-farm-stay.jpg
app_farmstay.save(os.path.join(target_dir, "application-farm-stay.jpg"), "JPEG", quality=95)

# 9. application-wellness.jpg
app_wellness.save(os.path.join(target_dir, "application-wellness.jpg"), "JPEG", quality=95)

# 10. application-events.jpg
app_events.save(os.path.join(target_dir, "application-events.jpg"), "JPEG", quality=95)

# 11. builder-configurator.jpg
builder_cfg.save(os.path.join(target_dir, "builder-configurator.jpg"), "JPEG", quality=95)

# 12. vr-interior-panorama.jpg
vr_pano.save(os.path.join(target_dir, "vr-interior-panorama.jpg"), "JPEG", quality=95)

# 13. workshop-frame-assembly.jpg
workshop.save(os.path.join(target_dir, "workshop-frame-assembly.jpg"), "JPEG", quality=95)

# 14. material-timber-detail.jpg (Macro. Grain, joint and fixing all legible. 3:4 crop from workshop lattice / hands)
w, h = workshop.size
# Crop focused on the timber lattice joint and fixing
box_timber = (int(w * 0.2), int(h * 0.35), int(w * 0.7), int(h * 0.95))
save_crop(workshop, box_timber, os.path.join(target_dir, "material-timber-detail.jpg"))

# 15. material-canvas-weave.jpg (Macro, 1:1 square raking light so weave reads, from classic_ext canvas wall/roof)
w, h = classic_ext.size
box_canvas = (int(w * 0.1), int(h * 0.45), int(w * 0.8), int(h * 0.45 + w * 0.7))
save_crop(classic_ext, box_canvas, os.path.join(target_dir, "material-canvas-weave.jpg"))

# 16. material-crown-wheel.jpg (Looking straight up. Roof poles radiating into wheel. 4:5 / 3:4 crop from app_wellness/wellness_int)
w, h = app_wellness.size
box_crown = (int(w * 0.1), int(h * 0.02), int(w * 0.9), int(h * 0.65))
save_crop(app_wellness, box_crown, os.path.join(target_dir, "material-crown-wheel.jpg"))

# 17. gallery-landscape-wide.jpg (Wide. Structure small in frame. 16:9 crop from app_resorts / app_glamping)
w, h = app_resorts.size
box_gallery1 = (0, int(h * 0.15), w, int(h * 0.15 + w * 9 / 16))
save_crop(app_resorts, box_gallery1, os.path.join(target_dir, "gallery-landscape-wide.jpg"))

# 18. gallery-interior-evening.jpg (Warm interior light, door or window open to dark outside, 3:4)
w, h = vr_pano.size
box_gallery2 = (int(w * 0.35), int(h * 0.1), int(w * 0.85), h)
save_crop(vr_pano, box_gallery2, os.path.join(target_dir, "gallery-interior-evening.jpg"))

# 19. gallery-detail-door.jpg (Timber door and frame. Detail. 1:1)
w, h = classic_ext.size
box_door = (int(w * 0.3), int(h * 0.48), int(w * 0.72), int(h * 0.48 + w * 0.42))
save_crop(classic_ext, box_door, os.path.join(target_dir, "gallery-detail-door.jpg"))

# 20. closing-yurt-dusk.jpg (Full-bleed closing image at dusk. 21:9 / 16:9 from event_eve)
w, h = event_eve.size
box_closing = (0, int(h * 0.25), w, int(h * 0.25 + w * 9 / 16))
save_crop(event_eve, box_closing, os.path.join(target_dir, "closing-yurt-dusk.jpg"))

# 21. yurt-landscape.jpg (styleguide)
hero_yurt.save(os.path.join(target_dir, "yurt-landscape.jpg"), "JPEG", quality=95)

# 22. luxury-yurt-interior.jpg (styleguide)
w, h = vr_pano.size
box_lux = (int(w * 0.4), int(h * 0.05), int(w * 0.9), h)
save_crop(vr_pano, box_lux, os.path.join(target_dir, "luxury-yurt-interior.jpg"))

# 23. material-canvas-detail.jpg (styleguide)
w, h = classic_ext.size
box_canvas_det = (int(w * 0.15), int(h * 0.35), int(w * 0.85), int(h * 0.35 + (w * 0.7) * 4 / 3))
save_crop(classic_ext, box_canvas_det, os.path.join(target_dir, "material-canvas-detail.jpg"))

# 24. manufacturing-process.jpg (styleguide)
workshop.save(os.path.join(target_dir, "manufacturing-process.jpg"), "JPEG", quality=95)

print("\nSuccessfully organized all 24 media files into public/media/")
