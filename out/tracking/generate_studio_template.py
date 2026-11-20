
import bpy
import json
import math
from pathlib import Path
from bpy_extras.object_utils import world_to_camera_view

print("🚀 [Branch Hardware Studio] Scaffolding Production Teardown Scene inside Blender", bpy.app.version_string)

# 1. Reset Scene
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# Configure Render Engine to Cycles GPU (Fallback to CPU if GPU unavailable)
scene.render.engine = 'CYCLES'
try:
    bpy.context.preferences.addons['cycles'].preferences.compute_device_type = 'CUDA'
    scene.cycles.device = 'GPU'
except Exception:
    scene.cycles.device = 'CPU'

scene.cycles.samples = 128
scene.cycles.use_denoising = True
if bpy.app.version >= (4, 0, 0):
    scene.view_settings.view_transform = 'AgX'
    scene.view_settings.look = 'AgX - High Contrast'
else:
    scene.view_settings.view_transform = 'Filmic'
    scene.view_settings.look = 'High Contrast'

# 2. Studio Environment & Dark Cybernetic Background
world = bpy.data.worlds.new("TeardownStudioWorld")
scene.world = world
world.use_nodes = True
bg_node = world.node_tree.nodes.get("Background")
if bg_node:
    bg_node.inputs[0].default_value = (0.012, 0.016, 0.024, 1.0) # Deep matte navy
    bg_node.inputs[1].default_value = 0.8

# 3. Three-Point Macro Studio Lighting
def create_light(name, l_type, energy, location, color, size=1.0):
    l_data = bpy.data.lights.new(name=name, type=l_type)
    l_data.energy = energy
    l_data.color = color
    if l_type == 'AREA':
        l_data.size = size
    l_obj = bpy.data.objects.new(name=name, object_data=l_data)
    l_obj.location = location
    bpy.context.collection.objects.link(l_obj)
    return l_obj

create_light("Key_Softbox", 'AREA', 850.0, (80, -110, 160), (0.95, 0.98, 1.0), size=60.0)
create_light("Rim_Cyber_Cyan", 'SPOT', 1200.0, (-100, 130, 140), (0.0, 0.9, 1.0), size=20.0)
create_light("Fill_Copper_Warm", 'AREA', 350.0, (-80, -70, 40), (1.0, 0.75, 0.5), size=40.0)

# 4. Advanced PBR Micro-Shaders Library
def get_node_tree(mat):
    mat.use_nodes = True
    return mat.node_tree, mat.node_tree.nodes.get("Principled BSDF")

# 4A. Iridescent Silicon Die Shader (Thin-film spectral sheen)
mat_silicon = bpy.data.materials.new(name="Shader_Silicon_Iridescent")
nt, bsdf = get_node_tree(mat_silicon)
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.04, 0.05, 0.06, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.98
    bsdf.inputs["Roughness"].default_value = 0.04
    # Coat with subtle cyan-violet spectral tint
    if "Coat Weight" in bsdf.inputs:
        bsdf.inputs["Coat Weight"].default_value = 0.85
        bsdf.inputs["Coat Roughness"].default_value = 0.02
        if "Coat Tint" in bsdf.inputs:
            bsdf.inputs["Coat Tint"].default_value = (0.4, 0.8, 1.0, 1.0)

# 4B. FR4 Translucent Fiberglass PCB Substrate
mat_fr4 = bpy.data.materials.new(name="Shader_FR4_Subsurface")
nt, bsdf = get_node_tree(mat_fr4)
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.02, 0.07, 0.04, 1.0) # Forest emerald
    bsdf.inputs["Roughness"].default_value = 0.35
    if "Subsurface Weight" in bsdf.inputs:
        bsdf.inputs["Subsurface Weight"].default_value = 0.15
        bsdf.inputs["Subsurface Radius"].default_value = (0.8, 0.4, 0.1)

# 4C. Liquid Tin-Silver Solder Fillet
mat_solder = bpy.data.materials.new(name="Shader_Solder_Fillet")
nt, bsdf = get_node_tree(mat_solder)
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.92, 0.93, 0.95, 1.0)
    bsdf.inputs["Metallic"].default_value = 1.0
    bsdf.inputs["Roughness"].default_value = 0.025

# 4D. Brushed Aerospace Titanium
mat_titanium = bpy.data.materials.new(name="Shader_Titanium_Anisotropic")
nt, bsdf = get_node_tree(mat_titanium)
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.18, 0.19, 0.22, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.95
    bsdf.inputs["Roughness"].default_value = 0.22
    if "Anisotropic" in bsdf.inputs:
        bsdf.inputs["Anisotropic"].default_value = 0.65

# 4E. Multi-Coated Anti-Reflective Optical Glass
mat_glass = bpy.data.materials.new(name="Shader_Optical_Glass_AR")
nt, bsdf = get_node_tree(mat_glass)
if bsdf:
    bsdf.inputs["Base Color"].default_value = (0.95, 0.98, 1.0, 1.0)
    bsdf.inputs["Roughness"].default_value = 0.015
    if "Transmission Weight" in bsdf.inputs:
        bsdf.inputs["Transmission Weight"].default_value = 0.98
    elif "Transmission" in bsdf.inputs:
        bsdf.inputs["Transmission"].default_value = 0.98
    bsdf.inputs["IOR"].default_value = 1.52

print("✨ [Branch Hardware Studio] 5 PBR Physics Shaders compiled successfully.")

# 5. Create Hierarchical Disassembly Smartphone Assembly
def make_box(name, dim, loc, mat):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = dim
    if mat:
        obj.data.materials.append(mat)
    return obj

# Master Root Null
root_null = bpy.data.objects.new("SMARTPHONE_ROOT", None)
bpy.context.collection.objects.link(root_null)

# Outer Shell & Display
chassis = make_box("CHASSIS_TITANIUM", (76.0, 150.0, 7.8), (0, 0, -4.0), mat_titanium)
glass = make_box("DISPLAY_GLASS", (74.0, 148.0, 0.8), (0, 0, 4.4), mat_glass)
oled = make_box("DISPLAY_OLED_PANEL", (72.0, 146.0, 0.4), (0, 0, 3.8), mat_silicon)

# Internal Power & Electronics
battery = make_box("BATTERY_LIION", (65.0, 95.0, 4.2), (0, -22.0, -1.0), mat_titanium)
pcb = make_box("MOTHERBOARD_FR4", (68.0, 48.0, 1.2), (0, 45.0, 1.0), mat_fr4)

# Microchip Hero Silicon Stack
soc_chip = make_box("SOC_A16_SILICON", (14.0, 14.0, 0.6), (-12.0, 46.0, 2.0), mat_silicon)
ram_die = make_box("LPDDR5X_RAM", (12.0, 12.0, 0.5), (10.0, 46.0, 1.9), mat_silicon)

# Parent all to Root
for part in [chassis, glass, oled, battery, pcb, soc_chip, ram_die]:
    part.parent = root_null

# 6. Dynamic Boolean Cutaway Plane Rig (for microchip cross-section)
cutaway_cube = make_box("BOOLEAN_CUTAWAY_PLANE", (20.0, 20.0, 10.0), (-2.0, 46.0, 2.0), None)
cutaway_cube.display_type = 'WIRE'
cutaway_cube.hide_render = True

# Add Boolean modifier to SoC chip
bool_mod = soc_chip.modifiers.new(name="Microchip_Cutaway", type='BOOLEAN')
bool_mod.operation = 'DIFFERENCE'
bool_mod.object = cutaway_cube

# 7. 100mm Macro Camera with Optical Depth of Field Focus Null
focus_target = bpy.data.objects.new("FOCUS_TARGET_NULL", None)
focus_target.location = (-12.0, 46.0, 2.0) # Centered on the SoC chip
bpy.context.collection.objects.link(focus_target)

cam_data = bpy.data.cameras.new("MacroCamera_100mm")
cam_data.lens = 100.0 # 100mm true macro
cam_data.sensor_width = 36.0
cam_data.dof.use_dof = True
cam_data.dof.focus_object = focus_target
cam_data.dof.aperture_fstop = 3.5

cam_obj = bpy.data.objects.new("MacroCamera_100mm", cam_data)
cam_obj.location = (0, -220, 140)
cam_obj.rotation_euler = (math.radians(58), 0, 0)
bpy.context.collection.objects.link(cam_obj)
scene.camera = cam_obj

# 8. Save Master Template File
template_out = Path(r"C:/Users/User/Desktop/Graphics design/DaVincirelove_Motion_Graphics_Workflow/assets/templates/hardware_teardown_studio.blend")
template_out.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.save_as_mainfile(filepath=str(template_out))
print(f"💾 [Branch Hardware Studio] Production Template saved successfully to: {template_out}")
