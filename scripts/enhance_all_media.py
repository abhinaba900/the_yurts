import os
from PIL import Image, ImageEnhance, ImageFilter

artifact_dir = r"C:\Users\abhin\.gemini\antigravity-ide\brain\bd4bbe96-7698-4aea-879a-574b3d17ed1d"
media_dir = r"d:\thardeye_projects\the yarts\public\media"
vr_dir = r"d:\thardeye_projects\the yarts\public\vr"

os.makedirs(media_dir, exist_ok=True)
os.makedirs(vr_dir, exist_ok=True)

def enhance_and_save(img, target_path, sharpen_radius=1.3, sharpen_percent=120, contrast=1.04, color=1.02, target_size=None):
    processed = img.copy()
    
    # Resize if needed with highest quality LANCZOS filter
    if target_size:
        # Calculate aspect-ratio preserving crop/resize
        tw, th = target_size
        iw, ih = processed.size
        # crop to match aspect ratio
        target_ratio = tw / th
        img_ratio = iw / ih
        
        if img_ratio > target_ratio:
            new_w = int(ih * target_ratio)
            left = (iw - new_w) // 2
            processed = processed.crop((left, 0, left + new_w, ih))
        else:
            new_h = int(iw / target_ratio)
            top = (ih - new_h) // 2
            processed = processed.crop((0, top, iw, top + new_h))
            
        processed = processed.resize((tw, th), Image.Resampling.LANCZOS)
    
    # Photographic contrast and color grading
    if contrast != 1.0:
        enhancer = ImageEnhance.Contrast(processed)
        processed = enhancer.enhance(contrast)
    if color != 1.0:
        enhancer = ImageEnhance.Color(processed)
        processed = enhancer.enhance(color)
        
    # Apply high-precision unsharp mask for tack-sharp architectural photography
    if sharpen_percent > 0:
        processed = processed.filter(ImageFilter.UnsharpMask(radius=sharpen_radius, percent=sharpen_percent, threshold=1))
        
    # Save with 4:4:4 chroma subsampling and 98% quality (no lossy compression haze)
    processed.save(target_path, "JPEG", quality=98, subsampling=0, optimize=True)
    print(f"Enhanced & Saved: {os.path.basename(target_path)} ({processed.size})")

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

# 1. hero-yurt.jpg (Cinema 21:9 / 16:9)
enhance_and_save(hero_yurt, os.path.join(media_dir, "hero-yurt.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05)

# 2. yurt-classic-exterior.jpg (3:4)
enhance_and_save(classic_ext, os.path.join(media_dir, "yurt-classic-exterior.jpg"), sharpen_radius=1.3, sharpen_percent=135, contrast=1.04)

# 3. yurt-resort-deck.jpg (3:4)
enhance_and_save(resort_deck, os.path.join(media_dir, "yurt-resort-deck.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05)

# 4. yurt-wellness-interior.jpg (3:4)
enhance_and_save(wellness_int, os.path.join(media_dir, "yurt-wellness-interior.jpg"), sharpen_radius=1.2, sharpen_percent=125, contrast=1.03)

# 5. yurt-event-evening.jpg (3:4)
enhance_and_save(event_eve, os.path.join(media_dir, "yurt-event-evening.jpg"), sharpen_radius=1.3, sharpen_percent=130, contrast=1.06)

# 6. application-resorts.jpg (4:5)
enhance_and_save(app_resorts, os.path.join(media_dir, "application-resorts.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 960))

# 7. application-glamping.jpg (4:5)
enhance_and_save(app_glamping, os.path.join(media_dir, "application-glamping.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 960))

# 8. application-farm-stay.jpg (4:5)
enhance_and_save(app_farmstay, os.path.join(media_dir, "application-farm-stay.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 960))

# 9. application-wellness.jpg (4:5)
enhance_and_save(app_wellness, os.path.join(media_dir, "application-wellness.jpg"), sharpen_radius=1.2, sharpen_percent=125, contrast=1.03, target_size=(768, 960))

# 10. application-events.jpg (4:5)
enhance_and_save(app_events, os.path.join(media_dir, "application-events.jpg"), sharpen_radius=1.2, sharpen_percent=125, contrast=1.04, target_size=(768, 960))

# 11. builder-configurator.jpg (16:9)
enhance_and_save(builder_cfg, os.path.join(media_dir, "builder-configurator.jpg"), sharpen_radius=1.1, sharpen_percent=120, contrast=1.04)

# 12. vr-interior-panorama.jpg (Panorama)
enhance_and_save(vr_pano, os.path.join(media_dir, "vr-interior-panorama.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.04)

# 13. workshop-frame-assembly.jpg (16:9)
enhance_and_save(workshop, os.path.join(media_dir, "workshop-frame-assembly.jpg"), sharpen_radius=1.3, sharpen_percent=140, contrast=1.05)

# 14. material-timber-detail.jpg (Macro, 3:4)
w, h = workshop.size
box_timber = (int(w * 0.25), int(h * 0.4), int(w * 0.7), int(h * 1.0))
crop_timber = workshop.crop(box_timber)
enhance_and_save(crop_timber, os.path.join(media_dir, "material-timber-detail.jpg"), sharpen_radius=1.5, sharpen_percent=150, contrast=1.08, target_size=(768, 1024))

# 15. material-canvas-weave.jpg (Macro, 1:1 square)
w, h = classic_ext.size
box_canvas = (int(w * 0.15), int(h * 0.5), int(w * 0.75), int(h * 0.5 + w * 0.6))
crop_canvas = classic_ext.crop(box_canvas)
enhance_and_save(crop_canvas, os.path.join(media_dir, "material-canvas-weave.jpg"), sharpen_radius=1.6, sharpen_percent=160, contrast=1.08, target_size=(800, 800))

# 16. material-crown-wheel.jpg (4:5 / 3:4)
w, h = app_wellness.size
box_crown = (int(w * 0.1), 0, int(w * 0.9), int(h * 0.65))
crop_crown = app_wellness.crop(box_crown)
enhance_and_save(crop_crown, os.path.join(media_dir, "material-crown-wheel.jpg"), sharpen_radius=1.4, sharpen_percent=140, contrast=1.06, target_size=(768, 960))

# 17. gallery-landscape-wide.jpg (16:9)
w, h = app_resorts.size
box_g1 = (0, int(h * 0.1), w, int(h * 0.1 + w * 9 / 16))
crop_g1 = app_resorts.crop(box_g1)
enhance_and_save(crop_g1, os.path.join(media_dir, "gallery-landscape-wide.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05)

# 18. gallery-interior-evening.jpg (3:4)
w, h = vr_pano.size
box_g2 = (int(w * 0.35), 0, int(w * 0.85), h)
crop_g2 = vr_pano.crop(box_g2)
enhance_and_save(crop_g2, os.path.join(media_dir, "gallery-interior-evening.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 1024))

# 19. gallery-detail-door.jpg (1:1)
w, h = classic_ext.size
box_g3 = (int(w * 0.32), int(h * 0.5), int(w * 0.68), int(h * 0.5 + w * 0.36))
crop_g3 = classic_ext.crop(box_g3)
enhance_and_save(crop_g3, os.path.join(media_dir, "gallery-detail-door.jpg"), sharpen_radius=1.4, sharpen_percent=145, contrast=1.07, target_size=(800, 800))

# 20. closing-yurt-dusk.jpg (Cinema 21:9 / 16:9)
w, h = event_eve.size
box_close = (0, int(h * 0.2), w, int(h * 0.2 + w * 9 / 16))
crop_close = event_eve.crop(box_close)
enhance_and_save(crop_close, os.path.join(media_dir, "closing-yurt-dusk.jpg"), sharpen_radius=1.3, sharpen_percent=135, contrast=1.07)

# 21. yurt-luxury-interior.jpg (3:4)
w, h = vr_pano.size
box_lux = (int(w * 0.45), 0, w, h)
crop_lux = vr_pano.crop(box_lux)
enhance_and_save(crop_lux, os.path.join(media_dir, "yurt-luxury-interior.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 1024))

# 22. yurt-yoga-interior.jpg (3:4)
enhance_and_save(wellness_int, os.path.join(media_dir, "yurt-yoga-interior.jpg"), sharpen_radius=1.2, sharpen_percent=125, contrast=1.03)

# 23. yurt-glamping-site.jpg (3:4)
enhance_and_save(app_glamping, os.path.join(media_dir, "yurt-glamping-site.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05)

# 24. yurt-cafe-interior.jpg (3:4)
w, h = vr_pano.size
box_cafe = (0, 0, int(w * 0.55), h)
crop_cafe = vr_pano.crop(box_cafe)
enhance_and_save(crop_cafe, os.path.join(media_dir, "yurt-cafe-interior.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 1024))

# 25. yurt-residential-exterior.jpg (3:4)
enhance_and_save(resort_deck, os.path.join(media_dir, "yurt-residential-exterior.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05)

# 26. yurt-custom-detail.jpg (3:4)
w, h = classic_ext.size
box_custom = (int(w * 0.28), int(h * 0.42), int(w * 0.72), h)
crop_custom = classic_ext.crop(box_custom)
enhance_and_save(crop_custom, os.path.join(media_dir, "yurt-custom-detail.jpg"), sharpen_radius=1.4, sharpen_percent=140, contrast=1.06, target_size=(768, 1024))

# 27. application-yoga.jpg (4:5)
enhance_and_save(app_wellness, os.path.join(media_dir, "application-yoga.jpg"), sharpen_radius=1.2, sharpen_percent=125, contrast=1.03, target_size=(768, 960))

# 28. application-eco-tourism.jpg (4:5)
w, h = hero_yurt.size
box_eco = (int(w * 0.05), 0, int(w * 0.75), h)
crop_eco = hero_yurt.crop(box_eco)
enhance_and_save(crop_eco, os.path.join(media_dir, "application-eco-tourism.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 960))

# 29. application-cafe.jpg (4:5)
enhance_and_save(resort_deck, os.path.join(media_dir, "application-cafe.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 960))

# 30. application-private-home.jpg (4:5)
enhance_and_save(app_farmstay, os.path.join(media_dir, "application-private-home.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 960))

# 31. application-studio.jpg (4:5)
w, h = vr_pano.size
box_studio = (int(w * 0.35), int(h * 0.25), int(w * 0.65), h)
crop_studio = vr_pano.crop(box_studio)
enhance_and_save(crop_studio, os.path.join(media_dir, "application-studio.jpg"), sharpen_radius=1.3, sharpen_percent=135, contrast=1.05, target_size=(768, 960))

# 32. application-community.jpg (4:5)
enhance_and_save(app_events, os.path.join(media_dir, "application-community.jpg"), sharpen_radius=1.2, sharpen_percent=125, contrast=1.04, target_size=(768, 960))

# Styleguide images
enhance_and_save(hero_yurt, os.path.join(media_dir, "yurt-landscape.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05)
enhance_and_save(crop_lux, os.path.join(media_dir, "luxury-yurt-interior.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(768, 960))
enhance_and_save(crop_canvas, os.path.join(media_dir, "material-canvas-detail.jpg"), sharpen_radius=1.5, sharpen_percent=150, contrast=1.08, target_size=(768, 1024))
enhance_and_save(workshop, os.path.join(media_dir, "manufacturing-process.jpg"), sharpen_radius=1.3, sharpen_percent=140, contrast=1.05)

# VR scenes
enhance_and_save(hero_yurt, os.path.join(vr_dir, "vr-approach-360.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(2048, 1024))
enhance_and_save(vr_pano, os.path.join(vr_dir, "vr-interior-360.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(2048, 1024))
enhance_and_save(app_wellness, os.path.join(vr_dir, "vr-crown-360.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(2048, 1024))
enhance_and_save(vr_pano, os.path.join(vr_dir, "vr-sleeping-360.jpg"), sharpen_radius=1.2, sharpen_percent=130, contrast=1.05, target_size=(2048, 1024))

print("\n--- ALL MEDIA ASSETS ENHANCED AND RE-PROCESSED AT MAXIMUM FIDELITY ---")
