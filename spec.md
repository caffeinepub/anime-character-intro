# Anime Character Introduction

## Current State
New project, no existing app.

## Requested Changes (Diff)

### Add
- Animated intro sequence cycling through all 10 anime characters
- Each character gets a dramatic entrance animation
- Talking mouth animation overlay (CSS-animated lip flap) synced to character name reveal
- Character name and subtitle displayed with typewriter/reveal effect
- Auto-advancing sequence with manual prev/next controls
- Cinematic fullscreen presentation with dark overlay and visual effects
- Skip/replay button

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Frontend-only app: fullscreen animated intro player
2. 10 character cards with image, name, and trait data
3. CSS keyframe animations: slide-in, mouth flap overlay, name typewriter, glow effects
4. Auto-advance timer (4s per character) with manual navigation
5. Particle/speed-line background for anime drama effect
6. Mouth animation implemented as an animated SVG/CSS overlay on the character face region
