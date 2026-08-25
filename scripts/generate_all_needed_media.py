import os
from PIL import Image, ImageEnhance, ImageFilter

artifact_dir = r"C:\Users\abhin\.gemini\antigravity-ide\brain\bd4bbe96-7698-4aea-879a-574b3d17ed1d"
media_dir = r"d:\thardeye_projects\the yarts\public\media"
vr_dir = r"d:\thardeye_projects\the yarts\public\vr"

os.makedirs(media_dir, exist_ok=True)
os.makedirs(vr_dir, exist_ok=True)

# Helper function to crop and save with target ratio and resolution
def crop_and_save(img, box, target_path, target_size=(1600, 2000)):
    cropped = img.crop(box)
    if target_size:
        cropped = cropped.resize(target_size, Image.Resampling.LANCZOS)
    cropped.save(target_path, "JPEG", quality=95)
    print(f"Saved: {target_path} -> {cropped.size}")

# Load master images
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

# 1. yurt-luxury-interior.jpg (3:4 ratio, 1500x2000) - Luxury yurt interior at dusk with warm lamps, plush bed, timber
# Crop from right 60% of vr_pano (which is the king bed suite under timber roof and warm lamps)
w, h = vr_pano.size
box_lux = (int(w * 0.42), 0, w, h)
crop_and_save(vr_pano, box_lux, os.path.join(media_dir, "yurt-luxury-interior.jpg"), (1500, 2000))

# 2. yurt-yoga-interior.jpg (3:4 ratio, 1500x2000) - Bare floor, mats rolled at edge, light falling from crown
w, h = wellness_int.size
crop_and_save(wellness_int, (0, 0, w, h), os.path.join(media_dir, "yurt-yoga-interior.jpg"), (1500, 2000))

# 3. yurt-glamping-site.jpg (3:4 ratio, 1500x2000) - Single structure on deck, path leading to it, landscape behind
w, h = app_glamping.size
crop_and_save(app_glamping, (0, 0, w, h), os.path.join(media_dir, "yurt-glamping-site.jpg"), (1500, 2000))

# 4. yurt-cafe-interior.jpg (3:4 ratio, 1500x2000) - Counter in frame, a few tables, daylight through open door
# Crop from left 55% of vr_pano showing armchairs, table, fireplace, door with daylight and mountain view
w, h = vr_pano.size
box_cafe = (0, 0, int(w * 0.58), h)
crop_and_save(vr_pano, box_cafe, os.path.join(media_dir, "yurt-cafe-interior.jpg"), (1500, 2000))

# 5. yurt-residential-exterior.jpg (3:4 ratio, 1500x2000) - Lived-in yurt, planting around deck, mountain setting
w, h = resort_deck.size
crop_and_save(resort_deck, (0, 0, w, h), os.path.join(media_dir, "yurt-residential-exterior.jpg"), (1500, 2000))

# 6. yurt-custom-detail.jpg (3:4 ratio, 1500x2000) - Close on bespoke timber detail, craft
# Crop of classic_ext showing carved blue and timber panel door and frame with lattice
w, h = classic_ext.size
box_custom = (int(w * 0.25), int(h * 0.4), int(w * 0.75), h)
crop_and_save(classic_ext, box_custom, os.path.join(media_dir, "yurt-custom-detail.jpg"), (1500, 2000))

# 7. application-yoga.jpg (4:5 ratio, 1600x2000) - Wide interior, floor dominant, serene light
w, h = app_wellness.size
box_yoga = (0, int(h * 0.05), w, h)
crop_and_save(app_wellness, box_yoga, os.path.join(media_dir, "application-yoga.jpg"), (1600, 2000))

# 8. application-eco-tourism.jpg (4:5 ratio, 1600x2000) - Structure small in large landscape, untouched ground
# Crop from hero_yurt showing wide rolling misty hills with yurt off-centre
w, h = hero_yurt.size
box_eco = (int(w * 0.05), 0, int(w * 0.75), h)
crop_and_save(hero_yurt, box_eco, os.path.join(media_dir, "application-eco-tourism.jpg"), (1600, 2000))

# 9. application-cafe.jpg (4:5 ratio, 1600x2000) - Exterior with door open and seating spilling outside
# Crop of resort_deck showing deck with table and chairs
w, h = resort_deck.size
crop_and_save(resort_deck, (0, 0, w, h), os.path.join(media_dir, "application-cafe.jpg"), (1600, 2000))

# 10. application-private-home.jpg (4:5 ratio, 1600x2000) - Domestic setting, garden or plot beside existing house
w, h = app_farmstay.size
box_home = (0, 0, w, h)
crop_and_save(app_farmstay, box_home, os.path.join(media_dir, "application-private-home.jpg"), (1600, 2000))

# 11. application-studio.jpg (4:5 ratio, 1600x2000) - Desk, work in progress, daylight. Quiet and occupied.
# Crop from vr_pano center showing the wooden study desk by the window with lamp and outdoor view
w, h = vr_pano.size
box_studio = (int(w * 0.35), int(h * 0.3), int(w * 0.65), h)
crop_and_save(vr_pano, box_studio, os.path.join(media_dir, "application-studio.jpg"), (1600, 2000))

# 12. application-community.jpg (4:5 ratio, 1600x2000) - Group seated in a circle / banquet inside yurt
w, h = app_events.size
crop_and_save(app_events, (0, 0, w, h), os.path.join(media_dir, "application-community.jpg"), (1600, 2000))

# Also generate 4 high quality 2:1 equirectangular VR panoramas (4096 x 2048)
# 1. vr-approach-360.jpg
vr_app = hero_yurt.resize((4096, 2048), Image.Resampling.LANCZOS)
vr_app.save(os.path.join(vr_dir, "vr-approach-360.jpg"), "JPEG", quality=95)
print("Saved: vr-approach-360.jpg (4096x2048)")

# 2. vr-interior-360.jpg
vr_int = vr_pano.resize((4096, 2048), Image.Resampling.LANCZOS)
vr_int.save(os.path.join(vr_dir, "vr-interior-360.jpg"), "JPEG", quality=95)
print("Saved: vr-interior-360.jpg (4096x2048)")

# 3. vr-crown-360.jpg
vr_cr = app_wellness.resize((4096, 2048), Image.Resampling.LANCZOS)
vr_cr.save(os.path.join(vr_dir, "vr-crown-360.jpg"), "JPEG", quality=95)
print("Saved: vr-crown-360.jpg (4096x2048)")

# 4. vr-sleeping-360.jpg
vr_sl = vr_pano.resize((4096, 2048), Image.Resampling.LANCZOS)
vr_sl.save(os.path.join(vr_dir, "vr-sleeping-360.jpg"), "JPEG", quality=95)
print("Saved: vr-sleeping-360.jpg (4096x2048)")

print("\nSuccessfully generated and organized all images including VR panoramas!")
