# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-09-25

### Changed
-   The `LLMProvider` interface has been refactored to use TypeScript Generics, making it fully provider-agnostic.
-   Project structure refactored for clarity, separating the core `OllamaProvider` implementation from the public `interfaces`.

### Added
- Implemented a resilient `invoke` method with an automatic "retry with exponential backoff" mechanism.
- Added support for advanced LLM parameters (`temperature`, `top_p`, etc.) through the provider options.
- Added strict, runtime validation for all input options using `Zod`.
- Added a `clone()` method to the `LLMProvider` for immutable, per-request parameter overrides.
- Added a `stream()` method for streaming LLM response.
- Added documentation files (`SECURITY.md`, `CONTRIBUTING.md`).

---

## [1.0.1] - 2025-08-03
- Initial public release. Not properly tested and served only for learning purpose.
- Superseded by v2.0.0 