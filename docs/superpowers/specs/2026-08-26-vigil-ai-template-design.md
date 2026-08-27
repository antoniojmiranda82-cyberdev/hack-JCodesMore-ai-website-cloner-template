# Vigil-Inspired AI Startup Template Design

## Purpose
Create the first original commercial template derived from the structural lessons of HorizonX Vigil without reproducing its protected branding, copy, exact geometry, textures, lighting composition, or scene details.

The template will be aimed at AI startups and agent platforms, but its visual language will remain rooted in Vigil's actual experience: a slow, chapter-based night passage through monumental medieval architecture rendered as a live 3D environment.

## Product Positioning
This is not a generic SaaS landing page with 3D decoration. It is a cinematic product narrative where the visitor moves through an environment and encounters the company's story chapter by chapter.

The commercial value comes from combining:
- live WebGL presence
- smooth scroll-driven camera travel
- restrained editorial text
- atmospheric medieval architecture
- a complete five-chapter SaaS narrative
- reusable content slots for AI founders

## Audience
Primary buyers:
- AI startups
- agent platforms
- model orchestration products
- AI infrastructure companies
- advanced developer-tool startups that want a premium launch experience

Secondary buyers may include creative agencies serving those companies.

## Core Design Principle
The world is the interface.

The user should feel that they are moving through a physical place rather than scrolling through a sequence of cards. Product messaging appears as editorial overlays synchronized to movement through the environment.

The final commercial template must be recognizably its own work. Vigil is a benchmark for pacing, environmental storytelling, chapter structure, and live 3D presence, not a geometry or asset source.

## Five-Chapter Narrative

### Chapter 1: The Approach
A moonlit exterior approach to an original gatehouse or fortified structure.

Purpose:
- establish atmosphere
- introduce the startup name
- deliver one concise product promise

Behavior:
- slow forward camera movement
- restrained title treatment
- minimal UI chrome
- environmental audio support may be optional and off by default

### Chapter 2: The Threshold
The camera crosses beneath the main arch or entry passage.

Purpose:
- frame the problem the product solves
- establish urgency or friction without resorting to conventional feature cards

Behavior:
- tighter lighting
- more enclosed spatial composition
- editorial copy appears and exits with scroll progress

### Chapter 3: The Inner Ward
The environment opens into a larger interior or courtyard-like space.

Purpose:
- reveal the core product
- explain agents, workflows, integrations, or orchestration capabilities

Behavior:
- broader camera composition
- strongest product reveal moment
- restrained interactive hotspots or labels may be used, but the environment remains dominant

### Chapter 4: The Keep
The visitor enters a deeper, darker, more technical interior.

Purpose:
- establish technical credibility
- present architecture, security, supported models, infrastructure, benchmarks, or proof

Behavior:
- denser spatial detail
- more focused directional lighting
- technical information appears as clean editorial panels, not floating sci-fi dashboards

### Chapter 5: The Watch
The journey reaches a high or open vantage point where the night sky becomes visible again.

Purpose:
- resolve the narrative
- restate the product promise
- present the primary CTA

Behavior:
- visual release after the darker interior chapters
- final brand statement
- one strong CTA with optional secondary documentation/demo link

## Visual Language

### Environment
Use an original medieval-inspired architectural world with:
- cut stone
- arches
- passageways
- towers or elevated structures
- cresset or ember-style local lighting
- moonlit exterior illumination
- restrained atmospheric fog

Do not reproduce HorizonX Vigil's exact architecture, proportions, camera route, or material maps.

### Lighting
Lighting should feel physically motivated.

Primary sources:
- moonlight
- cresset or torch-like warm local sources
- limited indirect fill

Avoid:
- cyberpunk neon
- neural-network glows
- quantum particle branding
- floating HUDs
- QCore or Quantum Shadow visual motifs

### Typography
Typography should be sparse and editorial.

Requirements:
- strong display face for chapter titles
- highly readable body face
- generous negative space
- short copy blocks
- text placement coordinated with scene composition

### Color
Base palette should come from the environment:
- near-black night tones
- cool moonlit stone
- restrained warm firelight
- muted parchment or off-white text

Color should support atmosphere rather than act as decorative branding noise.

## Motion and Camera
Use smooth scroll as the main narrative control.

Recommended technical approach:
- Three.js for the live 3D environment
- Lenis for smooth scrolling
- scroll progress mapped to camera position, target, and chapter transitions

The motion system should prioritize:
- slow deliberate travel
- spatial continuity
- controlled easing
- readable text timing
- no abrupt camera jumps unless deliberately used as a chapter transition

Users who prefer reduced motion must receive a simplified experience with stable camera states and readable static chapter content.

## Architecture

### Scene Layer
Responsible for:
- Three.js renderer
- scene graph
- camera
- lights
- environment meshes
- materials
- fog
- texture loading
- render loop

### Journey Controller
Responsible for:
- mapping scroll progress to camera path
- chapter boundaries
- transition curves
- active chapter state
- reduced-motion fallback behavior

This layer should expose chapter progress without knowing presentation details.

### Editorial Layer
Responsible for:
- chapter titles
- startup messaging
- product content
- CTA content
- responsive text placement

The editorial layer consumes chapter state from the journey controller and should remain independently editable by template buyers.

### Content Model
Keep startup copy separate from rendering logic.

A content configuration should define:
- company name
- one-line promise
- five chapter titles
- chapter body copy
- product facts
- proof or benchmark content
- primary CTA
- secondary CTA

This makes the template commercially reusable without editing scene code.

## Asset Strategy
All commercial assets must be original, licensed, generated for the template, or explicitly permitted for redistribution.

Allowed categories:
- original low-poly or high-poly architecture created for the template
- licensed stone/roughness/normal maps with redistribution rights
- generated replacement textures where licensing permits
- original moon, sky, particle, fog, and fire effects

Do not ship HorizonX screenshots, logos, copy, models, textures, or extracted protected media in the commercial package.

## Performance Strategy
Target a premium experience without requiring workstation hardware.

Requirements:
- progressive asset loading
- compressed geometry where appropriate
- compressed or optimized textures
- sensible device-pixel-ratio caps
- lazy loading for noncritical assets
- fallback quality settings for mobile
- avoid blocking first content render on the heaviest 3D assets

The page should expose readable introductory content even while the 3D scene continues loading.

## Responsive Behavior
Desktop is the primary cinematic presentation, but mobile must remain fully usable.

Desktop:
- full 3D camera journey
- wide editorial compositions
- maximum environmental detail

Mobile:
- simplified camera path
- reduced scene complexity
- larger text-safe zones
- fewer simultaneous effects
- no dependence on hover

Reduced-motion mode:
- stable chapter viewpoints
- minimal interpolation
- all five chapters readable without cinematic movement

## Error Handling
- If 3D asset loading fails, show a dark editorial fallback rather than a blank canvas.
- If WebGL is unavailable, render the full five-chapter story as a static responsive page.
- If one noncritical texture fails, continue rendering with a neutral material fallback.
- Loading failures should be logged in development without exposing technical errors to visitors.

## Testing Strategy
Testing must cover:
- production build
- lint
- unit tests for chapter/content configuration
- journey-controller progress mapping
- desktop smoke test
- mobile smoke test
- reduced-motion behavior
- WebGL-unavailable fallback
- CTA navigation
- no missing required local assets
- visual QA for each chapter at representative scroll positions

Performance QA should include:
- first meaningful content visibility before full 3D completion
- acceptable mobile frame behavior with reduced scene quality
- no runaway render loop after page navigation or unmount

## Commercialization Boundary
This template can be marked `ready-to-commercialize` only when:
- company and product naming are original placeholders
- HorizonX branding is absent
- HorizonX copy is absent
- HorizonX screenshots and protected media are absent
- environment geometry is original
- textures and models are redistributable
- the camera path is independently authored
- chapter copy is original
- QA passes on desktop, mobile, reduced-motion, and WebGL fallback states

## Recommended Technical Direction
Use native Three.js plus Lenis for the first edition.

Reasoning:
- it best preserves the direct, environment-first character of the benchmark
- it avoids turning the scene into a conventional component-heavy SaaS page
- it keeps the camera/journey system explicit and easy to tune

A React Three Fiber edition may be considered later as a separate packaging option if there is commercial demand.

## Phase 1 Deliverable
A complete original five-chapter AI-startup template prototype with:
- original medieval-inspired 3D environment
- live Three.js rendering
- Lenis-driven chapter travel
- editable startup content configuration
- responsive editorial overlays
- reduced-motion mode
- WebGL fallback
- desktop/mobile QA
- no protected HorizonX commercial assets or branding

The result should evoke the pacing and environmental storytelling lessons of Vigil while remaining independently authored and commercially reusable.