# G1 asset register

## G1.1 reuse

G1.1 introduces no third-party asset or download. All 26 GLBs, texture, licenses and manifest hashes below are unchanged. Runtime sign textures are original Canvas text with fitted sizing and revised transparency; lighting/material presentation remains original application code. Current Mini Characters proportions/rigs still limit mature character art; cinematic framing is not an asset-fidelity upgrade.

## Provenance and inclusion policy

Included 2026-10-23. All runtime files are local/versioned under `public/game/`; no third-party asset server, decoder service or font is requested by the game. Publisher/creator: **Kenney**. Both source archives include CC0 licenses permitting personal, educational and commercial use. Credit is appreciated, not required; AzureLab credits Kenney here and retains the original license files. CC0 does not grant unrelated trademark/personality rights; no Microsoft logo or official Azure Portal artwork is included.

License wording is retained; line endings and trailing whitespace are normalized for repository checks. Unused trial characters are excluded, and assets:check rejects unregistered GLBs as well as invalid registered files.

| Pack            | Official source and source version                                                                                                    | License / included proof                                                                      | Archive SHA-256                                                    |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Space Kit       | [Kenney Space Kit](https://kenney.nl/assets/space-kit); included archive identifies **2.0**, creation 2020-08-27 (page label differs) | [CC0](https://creativecommons.org/publicdomain/zero/1.0/); `public/game/licenses/station.txt` | `d5d7cdf2635ed5a43a9187deaf409b6f47484e402321128341d3c3698e9ef4d9` |
| Mini Characters | [Kenney Mini Characters](https://kenney.nl/assets/mini-characters); **1.0**, creation 2024-07-17                                      | [CC0](https://creativecommons.org/publicdomain/zero/1.0/); `public/game/licenses/people.txt`  | `9e1d48e6d7b8479ebbe84df71eb5bd8e1b3f0da546dea641890dccc8a02d0999` |

Official archive URLs used: [Space Kit download](https://kenney.nl/media/pages/assets/space-kit/20874c75ac-1677698978/kenney_space-kit.zip), [Mini Characters download](https://kenney.nl/media/pages/assets/mini-characters/bfc7e272b4-1774770718/kenney_mini-characters.zip). Raw archives/extractions are ignored development artifacts, not runtime dependencies. Reacquire from the publisher and verify hashes before rerunning the pipeline.

## Every included external asset

All station entries below share the Space Kit source/creator/date/license above; paths are relative to `public/game/station/`, format glTF 2 binary (`.glb`). Modifications: offline PBR palette remapping to ivory/slate/teal, buffer compaction, runtime origin/scale normalization and static batching. No texture files are referenced by station models.

| Model file                   | Actual purpose                            |
| ---------------------------- | ----------------------------------------- |
| `gate_complex.glb`           | Recognizable physical technical gateway   |
| `hangar_roundA.glb`          | Arrival station architecture              |
| `hangar_roundGlass.glb`      | Midground glass-front station             |
| `hangar_smallA.glb`          | Engineer-side building                    |
| `hangar_largeA.glb`          | Background/arrival scale                  |
| `satelliteDish_detailed.glb` | Technical landmark                        |
| `satelliteDish_large.glb`    | Distant station silhouette                |
| `machine_generatorLarge.glb` | Responsibility workshop base              |
| `machine_wireless.glb`       | Engineer equipment                        |
| `machine_barrel.glb`         | Workshop-side operational prop            |
| `barrels.glb`                | Arrival supply detail                     |
| `rover.glb`                  | Arrival exploration/storytelling prop     |
| `craft_cargoA.glb`           | Distant cargo context                     |
| `pipe_straight.glb`          | Constructed service route                 |
| `pipe_cornerRound.glb`       | Pipe route turn                           |
| `pipe_supportLow.glb`        | Pipe support detail                       |
| `structure_detailed.glb`     | Midground technical installation          |
| `rock_largeA.glb`            | Layered terrain formations                |
| `rock_largeB.glb`            | Varied background terrain                 |
| `rocks_smallA.glb`           | Foreground ground detail                  |
| `rock_crystals.glb`          | Restrained technological landscape detail |
| `platform_large.glb`         | Grounded interaction bays                 |
| `stairs_short.glb`           | Arrival architectural detail              |

All people entries share the Mini Characters source/creator/date/license above; paths relative to `public/game/people/`.

| File                     | Purpose                           | Modifications / optimization                                           |
| ------------------------ | --------------------------------- | ---------------------------------------------------------------------- |
| `character-female-a.glb` | Controllable player               | Original rig/skin retained, height normalized 1.75; six clips retained |
| `character-female-d.glb` | Ida / skyguide                    | Same rig/clip optimization; separate skeleton/mixer                    |
| `character-male-f.glb`   | Noor / platform engineer          | Same rig/clip optimization; separate skeleton/mixer                    |
| `Textures/colormap.png`  | Shared character material palette | Original local PNG retained, 8,706 bytes; no remote URI                |

Retained authored clips from each character: `idle`, `walk`, `interact-right`, `emote-yes`, `emote-no`, `pick-up`. Only idle/walk/interact are currently selected by gameplay; retaining a clip does not claim that its behavior is implemented. Source animation tracks are preserved; unused clips and unreachable accessor/buffer data are removed.

Runtime contact correction and walking-rate calibration are documented in [gameplay architecture](GAMEPLAY_ARCHITECTURE.md); they do not rewrite the licensed source geometry or animation tracks. Cloned skeleton bone textures are disposed with the character.

## Original AzureLab assets

`public/game/deck.svg` is original authored panel seams/fasteners/scratches. Terrain mesh, atmospheric sky shader, light composition, responsibility layer geometry/materials, canvas-rendered signs and gateway membrane are code-authored in this repository. They contain no external raster art. The responsibility stack intentionally uses schematic layer geometry; station buildings and characters use reviewed meshes rather than primitive proxies.

## Reproduction, optimization and integrity

`node scripts/prepare-game-assets.mjs <unpacked-space-kit> <unpacked-mini-characters>` selects only the reviewed filenames, remaps station materials, retains the six clips and compacts buffer/accessor references. `public/game/manifest.json` records every GLB's source bytes, included bytes, SHA-256, triangle count and animations. It is the per-file integrity record, not a substitute for this license register.

26 GLBs total **804,656 bytes** versus **1,140,872 source bytes**, plus 8,706-byte PNG, original deck and license/manifest text. Under the 2 MB GLB budget. No Draco/KTX decoder download; small assets favor simple local loading. Static geometry is batched by equivalent material at runtime; characters/teaching layers remain animated. Shared sources and owned generated GPU resources are disposed on route exit. `npm run assets:check` verifies hashes, sizes, local model/image references, buffers/accessors, required rigs/clips/licenses and budget; it runs in `check`/CI.

## Investigated but not included

[Quaternius Ultimate Space Kit](https://quaternius.com/packs/ultimatespacekit.html) is advertised CC0, but its linked Drive folder did not yield a verified archive through the available read path; **no Quaternius files were included**. [Poly Haven licensing](https://polyhaven.com/license) was reviewed; photorealistic textures/HDRIs did not fit this small stylized slice and were not downloaded/included. Website previews/logos are not treated as licensed assets. No random/unlicensed model, paid asset or unrelated third-party runtime host is used.

## L1 original teaching geometry

No external asset or registered binary changes. Demand/allocation/shortfall bars, deployment-boundary shapes and journal diagrams are original repo-native code driven by the bounded teaching model; they reuse the existing installation and local fonts/materials. The 26-GLB hash/license budget remains unchanged.

## G1.3 original audio and teaching media — 2026-10-24

Original procedural score **Lysningen**, creator AzureLab project: Dm9/Bbmaj7/Fmaj9/Cadd9 pads with periodic envelopes, authored and reproducible in [generate-ambient.mjs](../scripts/generate-ambient.mjs). No human performance, third-party samples, commercial game music or Microsoft illustration. The generated recording is explicitly dedicated under CC0 1.0, permitting public educational/workplace/commercial use; attribution appreciated, not required. [Local license](../public/game/audio/license.txt) and [hash/format manifest](../public/game/audio/manifest.json) are versioned. Included 2026-10-24, no modifications after synthesis other than metadata formatting.

Runtime [lysningen.wav](../public/game/audio/lysningen.wav): 32 seconds, PCM16 mono 22,050 Hz, 1,411,244 bytes; decoded float buffer approximately 2.8 MB. Integer-cycle oscillators and periodic chord envelopes make the loop boundary continuous. Fetch/decode occurs only after explicit enable, not initial rendering. No decoder/streaming dependency; effects use a short original Web Audio tone. assets:check validates hash/RIFF/license/allowlist and <1.5 MB transfer. Native browser playback is tested; human listening/musical acceptance is outstanding.

Provisioning flow, responsibility matrix, deployment comparison and synthetic timelines are original HTML/SVG/scene projections of reviewed local rules. No external image is downloaded, traced or hotlinked. Existing 26 GLBs and character/texture licenses/hashes are unchanged.
