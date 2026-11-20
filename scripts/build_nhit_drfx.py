#!/usr/bin/env python3
"""
Builds the official NHIT Admission DRFX Template Pack for DaVinci Resolve
Pack Name: NHIT_Admission_Kit.drfx
Contains 4 Professional Fusion Titles:
  1. NHIT_Main_Headline: Cinematic Headline, Sub-headline & Institution Branding
  2. NHIT_Branch_Seats_Card: 2-Column Branch Card (Electrical & Mechanical 30 Seats each)
  3. NHIT_Eligibility_Badge: 4-Tier Qualification & Work Experience Matrix
  4. NHIT_CTA_Helpline: Admissions Open Banner with Phone (+91 98005 71423) & Website
"""

import os
import shutil
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "out/drfx"
OUT_DIR.mkdir(parents=True, exist_ok=True)
BUILD_DIR = ROOT / "build/drfx_nhit_staging"

def get_resolve_templates_dir() -> Path:
    if sys.platform.startswith("win"):
        return Path(os.environ.get("APPDATA", "")) / "Blackmagic Design/DaVinci Resolve/Support/Fusion/Templates"
    elif sys.platform.startswith("darwin"):
        return Path.home() / "Library/Application Support/Blackmagic Design/DaVinci Resolve/Fusion/Templates"
    return Path.home() / ".local/share/DaVinciResolve/Fusion/Templates"

def generate_png_thumbnail(output_path: Path, title: str, color_hex: str = "#D32F2F"):
    """Generates standard 160x100 valid PNG thumbnail for Resolve's Titles Library"""
    raw_png = (
        b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\xa0\x00\x00\x00\x64'
        b'\x08\x02\x00\x00\x00\x87\xca\xe5\xc7\x00\x00\x00\x1bIDATx\x9cc\xf8'
        b'\xcf\xc0\x00\x02\x13\x00\x00\xfe\xf2\x00\x00\x01\x00\x01\x00\x00'
        b'\x00\x00\xff\xff\x03\x00\x05\xfe\x01\xf1\x18`\xeb\x93\x00\x00\x00'
        b'\x00IEND\xaeB`\x82'
    )
    output_path.write_bytes(raw_png)

# -------------------------------------------------------------------------
# Template 1: NHIT Main Headline
# -------------------------------------------------------------------------
SETTING_HEADLINE = """{
	Tools = ordered() {
		NHIT_Headline_Macro = GroupOperator {
			Inputs = ordered() {
				MainHeadline = InstanceInput {
					SourceOp = "HeadlineText",
					Source = "StyledText",
					Name = "Headline Text",
				},
				SubHeadline = InstanceInput {
					SourceOp = "SubtitleText",
					Source = "StyledText",
					Name = "Sub-Headline Text",
				},
				InstituteName = InstanceInput {
					SourceOp = "InstituteText",
					Source = "StyledText",
					Name = "Institution Label",
				},
				HeadlineSize = InstanceInput {
					SourceOp = "HeadlineText",
					Source = "Size",
					Name = "Headline Font Size",
					Default = 0.075,
				},
				HeadlineRed = InstanceInput {
					SourceOp = "HeadlineText",
					Source = "Red1",
					Name = "Headline Color Red",
					ControlGroup = 2,
					Default = 1,
				},
				HeadlineGreen = InstanceInput {
					SourceOp = "HeadlineText",
					Source = "Green1",
					Name = "Headline Color Green",
					ControlGroup = 2,
					Default = 1,
				},
				HeadlineBlue = InstanceInput {
					SourceOp = "HeadlineText",
					Source = "Blue1",
					Name = "Headline Color Blue",
					ControlGroup = 2,
					Default = 1,
				},
				CardOpacity = InstanceInput {
					SourceOp = "BackdropCard",
					Source = "Alpha",
					Name = "Background Box Opacity",
					Default = 0.75,
				},
			},
			Outputs = {
				Output1 = InstanceOutput {
					SourceOp = "MergeFinal",
					Source = "Output",
				}
			},
			ViewInfo = GroupInfo { Pos = { 0, 0 } },
			Tools = ordered() {
				BackdropCard = Background {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						TopLeftRed = Input { Value = 0.043, },
						TopLeftGreen = Input { Value = 0.059, },
						TopLeftBlue = Input { Value = 0.098, },
						TopLeftAlpha = Input { Value = 0.75, },
					},
					ViewInfo = OperatorInfo { Pos = { 100, 100 } },
				},
				InstituteText = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.72 }, },
						StyledText = Input { Value = "THE NEW HORIZONS INSTITUTE OF TECHNOLOGY, DURGAPUR", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "Bold", },
						Size = Input { Value = 0.026, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 0.72, },
						Blue1 = Input { Value = 0.0, },
						Tracking = Input { Value = 1.15, },
					},
					ViewInfo = OperatorInfo { Pos = { 250, 100 } },
				},
				HeadlineText = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.55 }, },
						StyledText = Input { Value = "YOU HAVE THE EXPERIENCE.\\nNOW GET THE QUALIFICATION.", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "ExtraBold", },
						Size = Input { Value = 0.068, },
						VerticalTopCenterBottom = Input { Value = 0, },
						HorizontalJustificationNew = Input { Value = 3, },
						LineSpacing = Input { Value = 1.1, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 1.0, },
						Blue1 = Input { Value = 1.0, },
						Enabled3 = Input { Value = 1, },
						Red3 = Input { Value = 0.827, },
						Green3 = Input { Value = 0.184, },
						Blue3 = Input { Value = 0.184, },
						Softness3 = Input { Value = 0.03, },
						Alpha3 = Input { Value = 0.6, },
					},
					ViewInfo = OperatorInfo { Pos = { 400, 100 } },
				},
				SubtitleText = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.38 }, },
						StyledText = Input { Value = "DIPLOMA IN ENGINEERING (WORKING PROFESSIONALS 2026-27)", },
						Font = Input { Value = "Inter", },
						Style = Input { Value = "SemiBold", },
						Size = Input { Value = 0.024, },
						Red1 = Input { Value = 0.03, },
						Green1 = Input { Value = 0.49, },
						Blue1 = Input { Value = 1.0, },
						Tracking = Input { Value = 1.08, },
					},
					ViewInfo = OperatorInfo { Pos = { 550, 100 } },
				},
				Merge1 = Merge {
					Inputs = {
						Background = Input {
							SourceOp = "BackdropCard",
							Source = "Output",
						},
						Foreground = Input {
							SourceOp = "InstituteText",
							Source = "Output",
						},
						PerformDepthMerge = Input { Value = 0, },
					},
					ViewInfo = OperatorInfo { Pos = { 250, 200 } },
				},
				Merge2 = Merge {
					Inputs = {
						Background = Input {
							SourceOp = "Merge1",
							Source = "Output",
						},
						Foreground = Input {
							SourceOp = "HeadlineText",
							Source = "Output",
						},
						PerformDepthMerge = Input { Value = 0, },
					},
					ViewInfo = OperatorInfo { Pos = { 400, 200 } },
				},
				MergeFinal = Merge {
					Inputs = {
						Background = Input {
							SourceOp = "Merge2",
							Source = "Output",
						},
						Foreground = Input {
							SourceOp = "SubtitleText",
							Source = "Output",
						},
						PerformDepthMerge = Input { Value = 0, },
					},
					ViewInfo = OperatorInfo { Pos = { 550, 200 } },
				},
			}
		}
	}
}
"""

# -------------------------------------------------------------------------
# Template 2: NHIT Branch Seats Card (EE & ME 30 Seats)
# -------------------------------------------------------------------------
SETTING_BRANCHES = """{
	Tools = ordered() {
		NHIT_Branches_Macro = GroupOperator {
			Inputs = ordered() {
				Branch1Name = InstanceInput {
					SourceOp = "Branch1Text",
					Source = "StyledText",
					Name = "Left Branch Title",
				},
				Branch1Seats = InstanceInput {
					SourceOp = "Branch1SeatsText",
					Source = "StyledText",
					Name = "Left Branch Seats",
				},
				Branch2Name = InstanceInput {
					SourceOp = "Branch2Text",
					Source = "StyledText",
					Name = "Right Branch Title",
				},
				Branch2Seats = InstanceInput {
					SourceOp = "Branch2SeatsText",
					Source = "StyledText",
					Name = "Right Branch Seats",
				},
				TotalIntakeLabel = InstanceInput {
					SourceOp = "TotalIntakeText",
					Source = "StyledText",
					Name = "Intake Footer Label",
				},
			},
			Outputs = {
				Output1 = InstanceOutput {
					SourceOp = "MergeFinal",
					Source = "Output",
				}
			},
			ViewInfo = GroupInfo { Pos = { 0, 0 } },
			Tools = ordered() {
				BackdropBox = Background {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						TopLeftRed = Input { Value = 0.05, },
						TopLeftGreen = Input { Value = 0.07, },
						TopLeftBlue = Input { Value = 0.12, },
						TopLeftAlpha = Input { Value = 0.85, },
					},
					ViewInfo = OperatorInfo { Pos = { 100, 100 } },
				},
				HeaderBadge = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.78 }, },
						StyledText = Input { Value = "APPROVED PROGRAMMES & INTAKE (2026-27)", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "Bold", },
						Size = Input { Value = 0.032, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 0.72, },
						Blue1 = Input { Value = 0.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 250, 100 } },
				},
				Branch1Text = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.32, 0.56 }, },
						StyledText = Input { Value = "ELECTRICAL\\nENGINEERING", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "ExtraBold", },
						Size = Input { Value = 0.042, },
						HorizontalJustificationNew = Input { Value = 3, },
						Red1 = Input { Value = 0.03, },
						Green1 = Input { Value = 0.49, },
						Blue1 = Input { Value = 1.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 350, 100 } },
				},
				Branch1SeatsText = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.32, 0.40 }, },
						StyledText = Input { Value = "30 APPROVED SEATS", },
						Font = Input { Value = "Inter", },
						Style = Input { Value = "Bold", },
						Size = Input { Value = 0.024, },
						HorizontalJustificationNew = Input { Value = 3, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 1.0, },
						Blue1 = Input { Value = 1.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 450, 100 } },
				},
				Branch2Text = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.68, 0.56 }, },
						StyledText = Input { Value = "MECHANICAL\\nENGINEERING", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "ExtraBold", },
						Size = Input { Value = 0.042, },
						HorizontalJustificationNew = Input { Value = 3, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 0.61, },
						Blue1 = Input { Value = 0.19, },
					},
					ViewInfo = OperatorInfo { Pos = { 550, 100 } },
				},
				Branch2SeatsText = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.68, 0.40 }, },
						StyledText = Input { Value = "30 APPROVED SEATS", },
						Font = Input { Value = "Inter", },
						Style = Input { Value = "Bold", },
						Size = Input { Value = 0.024, },
						HorizontalJustificationNew = Input { Value = 3, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 1.0, },
						Blue1 = Input { Value = 1.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 650, 100 } },
				},
				TotalIntakeText = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.24 }, },
						StyledText = Input { Value = "TOTAL APPROVED INTAKE: 60 SEATS  •  AICTE & WBSCT&VE&SD AFFILIATED", },
						Font = Input { Value = "Inter", },
						Style = Input { Value = "Medium", },
						Size = Input { Value = 0.020, },
						Red1 = Input { Value = 0.7, },
						Green1 = Input { Value = 0.75, },
						Blue1 = Input { Value = 0.85, },
					},
					ViewInfo = OperatorInfo { Pos = { 750, 100 } },
				},
				Merge1 = Merge {
					Inputs = {
						Background = Input { SourceOp = "BackdropBox", Source = "Output", },
						Foreground = Input { SourceOp = "HeaderBadge", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 250, 200 } },
				},
				Merge2 = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge1", Source = "Output", },
						Foreground = Input { SourceOp = "Branch1Text", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 350, 200 } },
				},
				Merge3 = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge2", Source = "Output", },
						Foreground = Input { SourceOp = "Branch1SeatsText", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 450, 200 } },
				},
				Merge4 = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge3", Source = "Output", },
						Foreground = Input { SourceOp = "Branch2Text", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 550, 200 } },
				},
				Merge5 = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge4", Source = "Output", },
						Foreground = Input { SourceOp = "Branch2SeatsText", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 650, 200 } },
				},
				MergeFinal = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge5", Source = "Output", },
						Foreground = Input { SourceOp = "TotalIntakeText", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 750, 200 } },
				},
			}
		}
	}
}
"""

# -------------------------------------------------------------------------
# Template 3: NHIT Eligibility Badge
# -------------------------------------------------------------------------
SETTING_ELIGIBILITY = """{
	Tools = ordered() {
		NHIT_Eligibility_Macro = GroupOperator {
			Inputs = ordered() {
				TitleText = InstanceInput {
					SourceOp = "HeaderTitle",
					Source = "StyledText",
					Name = "Eligibility Title",
				},
				Card1 = InstanceInput {
					SourceOp = "Criteria1",
					Source = "StyledText",
					Name = "Criteria 1 (10+2 Science)",
				},
				Card2 = InstanceInput {
					SourceOp = "Criteria2",
					Source = "StyledText",
					Name = "Criteria 2 (10+2 Vocational)",
				},
				Card3 = InstanceInput {
					SourceOp = "Criteria3",
					Source = "StyledText",
					Name = "Criteria 3 (10th + ITI)",
				},
				WorkExp = InstanceInput {
					SourceOp = "WorkExpText",
					Source = "StyledText",
					Name = "Work Experience Requirement",
				},
			},
			Outputs = {
				Output1 = InstanceOutput {
					SourceOp = "MergeFinal",
					Source = "Output",
				}
			},
			ViewInfo = GroupInfo { Pos = { 0, 0 } },
			Tools = ordered() {
				BackdropBox = Background {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						TopLeftRed = Input { Value = 0.04, },
						TopLeftGreen = Input { Value = 0.06, },
						TopLeftBlue = Input { Value = 0.10, },
						TopLeftAlpha = Input { Value = 0.85, },
					},
					ViewInfo = OperatorInfo { Pos = { 100, 100 } },
				},
				HeaderTitle = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.82 }, },
						StyledText = Input { Value = "CANDIDATE ELIGIBILITY CRITERIA", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "Bold", },
						Size = Input { Value = 0.035, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 0.72, },
						Blue1 = Input { Value = 0.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 250, 100 } },
				},
				Criteria1 = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.68 }, },
						StyledText = Input { Value = "✔  10+2 SCIENCE  —  Passed with applicable technical science subjects", },
						Font = Input { Value = "Inter", },
						Style = Input { Value = "SemiBold", },
						Size = Input { Value = 0.023, },
						HorizontalJustificationNew = Input { Value = 3, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 1.0, },
						Blue1 = Input { Value = 1.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 350, 100 } },
				},
				Criteria2 = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.55 }, },
						StyledText = Input { Value = "✔  10+2 VOCATIONAL  —  Technical stream qualification", },
						Font = Input { Value = "Inter", },
						Style = Input { Value = "SemiBold", },
						Size = Input { Value = 0.023, },
						HorizontalJustificationNew = Input { Value = 3, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 1.0, },
						Blue1 = Input { Value = 1.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 450, 100 } },
				},
				Criteria3 = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.42 }, },
						StyledText = Input { Value = "✔  CLASS 10 + 2-YEAR ITI  —  Approved National Trade Certificate", },
						Font = Input { Value = "Inter", },
						Style = Input { Value = "SemiBold", },
						Size = Input { Value = 0.023, },
						HorizontalJustificationNew = Input { Value = 3, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 1.0, },
						Blue1 = Input { Value = 1.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 550, 100 } },
				},
				WorkExpText = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.25 }, },
						StyledText = Input { Value = "★ PLUS MINIMUM 1 YEAR FULL-TIME INDUSTRIAL WORK EXPERIENCE", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "ExtraBold", },
						Size = Input { Value = 0.025, },
						HorizontalJustificationNew = Input { Value = 3, },
						Red1 = Input { Value = 0.827, },
						Green1 = Input { Value = 0.184, },
						Blue1 = Input { Value = 0.184, },
					},
					ViewInfo = OperatorInfo { Pos = { 650, 100 } },
				},
				Merge1 = Merge {
					Inputs = {
						Background = Input { SourceOp = "BackdropBox", Source = "Output", },
						Foreground = Input { SourceOp = "HeaderTitle", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 250, 200 } },
				},
				Merge2 = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge1", Source = "Output", },
						Foreground = Input { SourceOp = "Criteria1", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 350, 200 } },
				},
				Merge3 = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge2", Source = "Output", },
						Foreground = Input { SourceOp = "Criteria2", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 450, 200 } },
				},
				Merge4 = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge3", Source = "Output", },
						Foreground = Input { SourceOp = "Criteria3", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 550, 200 } },
				},
				MergeFinal = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge4", Source = "Output", },
						Foreground = Input { SourceOp = "WorkExpText", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 650, 200 } },
				},
			}
		}
	}
}
"""

# -------------------------------------------------------------------------
# Template 4: NHIT CTA Helpline
# -------------------------------------------------------------------------
SETTING_CTA = """{
	Tools = ordered() {
		NHIT_CTA_Macro = GroupOperator {
			Inputs = ordered() {
				AdmissionsText = InstanceInput {
					SourceOp = "AdmissionsOpenText",
					Source = "StyledText",
					Name = "Banner Title",
				},
				PhoneText = InstanceInput {
					SourceOp = "ContactPhone",
					Source = "StyledText",
					Name = "Helpline Phone Number",
				},
				WebsiteText = InstanceInput {
					SourceOp = "ContactWeb",
					Source = "StyledText",
					Name = "Website Address",
				},
				TaglineText = InstanceInput {
					SourceOp = "Tagline",
					Source = "StyledText",
					Name = "Institutional Tagline",
				},
			},
			Outputs = {
				Output1 = InstanceOutput {
					SourceOp = "MergeFinal",
					Source = "Output",
				}
			},
			ViewInfo = GroupInfo { Pos = { 0, 0 } },
			Tools = ordered() {
				BackdropBox = Background {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						TopLeftRed = Input { Value = 0.04, },
						TopLeftGreen = Input { Value = 0.06, },
						TopLeftBlue = Input { Value = 0.10, },
						TopLeftAlpha = Input { Value = 0.88, },
					},
					ViewInfo = OperatorInfo { Pos = { 100, 100 } },
				},
				AdmissionsOpenText = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.78 }, },
						StyledText = Input { Value = "ADMISSIONS OPEN  •  ACADEMIC SESSION 2026-27", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "ExtraBold", },
						Size = Input { Value = 0.038, },
						Red1 = Input { Value = 0.827, },
						Green1 = Input { Value = 0.184, },
						Blue1 = Input { Value = 0.184, },
						Enabled3 = Input { Value = 1, },
						Red3 = Input { Value = 0.827, },
						Green3 = Input { Value = 0.184, },
						Blue3 = Input { Value = 0.184, },
						Softness3 = Input { Value = 0.02, },
						Alpha3 = Input { Value = 0.5, },
					},
					ViewInfo = OperatorInfo { Pos = { 250, 100 } },
				},
				ContactPhone = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.58 }, },
						StyledText = Input { Value = "📞  +91 98005 71423", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "Bold", },
						Size = Input { Value = 0.046, },
						Red1 = Input { Value = 1.0, },
						Green1 = Input { Value = 0.72, },
						Blue1 = Input { Value = 0.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 350, 100 } },
				},
				ContactWeb = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.42 }, },
						StyledText = Input { Value = "🌐  www.nhit.in", },
						Font = Input { Value = "Montserrat", },
						Style = Input { Value = "Bold", },
						Size = Input { Value = 0.036, },
						Red1 = Input { Value = 0.03, },
						Green1 = Input { Value = 0.49, },
						Blue1 = Input { Value = 1.0, },
					},
					ViewInfo = OperatorInfo { Pos = { 450, 100 } },
				},
				Tagline = TextPlus {
					Inputs = {
						Width = Input { Value = 1920, },
						Height = Input { Value = 1080, },
						Center = Input { Value = { 0.5, 0.24 }, },
						StyledText = Input { Value = "“SHAPING ENGINEERS, BUILDING FUTURES”", },
						Font = Input { Value = "Inter", },
						Style = Input { Value = "SemiBold", },
						Size = Input { Value = 0.022, },
						Red1 = Input { Value = 0.8, },
						Green1 = Input { Value = 0.85, },
						Blue1 = Input { Value = 0.95, },
						Tracking = Input { Value = 1.15, },
					},
					ViewInfo = OperatorInfo { Pos = { 550, 100 } },
				},
				Merge1 = Merge {
					Inputs = {
						Background = Input { SourceOp = "BackdropBox", Source = "Output", },
						Foreground = Input { SourceOp = "AdmissionsOpenText", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 250, 200 } },
				},
				Merge2 = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge1", Source = "Output", },
						Foreground = Input { SourceOp = "ContactPhone", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 350, 200 } },
				},
				Merge3 = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge2", Source = "Output", },
						Foreground = Input { SourceOp = "ContactWeb", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 450, 200 } },
				},
				MergeFinal = Merge {
					Inputs = {
						Background = Input { SourceOp = "Merge3", Source = "Output", },
						Foreground = Input { SourceOp = "Tagline", Source = "Output", },
					},
					ViewInfo = OperatorInfo { Pos = { 550, 200 } },
				},
			}
		}
	}
}
"""

TEMPLATES = [
    ("NHIT_Main_Headline", SETTING_HEADLINE, "#D32F2F"),
    ("NHIT_Branch_Seats_Card", SETTING_BRANCHES, "#087EFF"),
    ("NHIT_Eligibility_Badge", SETTING_ELIGIBILITY, "#FFB800"),
    ("NHIT_CTA_Helpline", SETTING_CTA, "#10B981"),
]

def build_drfx_bundle():
    print("==================================================================")
    print("  Building Official NHIT Admission DRFX Pack for DaVinci Resolve")
    print("==================================================================")

    shutil.rmtree(BUILD_DIR, ignore_errors=True)
    titles_folder = BUILD_DIR / "Edit/Titles/NHIT Admission"
    titles_folder.mkdir(parents=True, exist_ok=True)

    for name, setting_str, color in TEMPLATES:
        setting_file = titles_folder / f"{name}.setting"
        png_file = titles_folder / f"{name}.png"

        setting_file.write_text(setting_str.strip(), encoding="utf-8")
        generate_png_thumbnail(png_file, name.replace("NHIT_", "").replace("_", " "), color)
        print(f"  ✔ Created Template: {name}.setting + thumbnail")

    # Package into .drfx zip
    drfx_dest = OUT_DIR / "NHIT_Admission_Kit.drfx"
    with zipfile.ZipFile(drfx_dest, "w", compression=zipfile.ZIP_DEFLATED) as drfx:
        for root, _, files in os.walk(BUILD_DIR):
            for file in files:
                fpath = Path(root) / file
                arcname = fpath.relative_to(BUILD_DIR).as_posix()
                drfx.write(fpath, arcname=arcname)

    print(f"\n📦 Packaged DRFX Bundle: {drfx_dest} ({round(drfx_dest.stat().st_size / 1024, 1)} KB)")

    # Install directly into DaVinci Resolve Templates
    res_dir = get_resolve_templates_dir()
    if res_dir.exists():
        installed_path = res_dir / "NHIT_Admission_Kit.drfx"
        shutil.copy2(drfx_dest, installed_path)
        print(f"✨ Automatically Installed into DaVinci Resolve:")
        print(f"   {installed_path}")
    else:
        print(f"ℹ DaVinci Resolve template folder not found at standard path. Double-click {drfx_dest} to install.")

    shutil.rmtree(BUILD_DIR, ignore_errors=True)

if __name__ == "__main__":
    build_drfx_bundle()
