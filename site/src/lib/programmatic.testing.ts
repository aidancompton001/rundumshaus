/**
 * Test-only API for `programmatic.ts`.
 *
 * Functions exposed here are intended for unit tests only and should NOT
 * be imported by production code (page.tsx, layout.tsx, sitemap.ts,
 * components, etc.). They expose internal selection/pool details that
 * are not part of the public content-generator contract.
 *
 * ESLint rule `no-restricted-imports` should restrict this module to
 * test files (`*.test.ts`) — see PX-029 follow-up.
 *
 * Background: PX-026 invariant tests required deterministic access to
 * pool sizes and selected indices for distribution checks. Originally
 * these were exported directly from `programmatic.ts`, which created
 * an implicit coupling risk (Hans Landa Phase 6 finding). This module
 * gives them a separate, clearly-named home.
 */

export { getServiceBlockSizes, getSelectedIndices } from "./programmatic";
