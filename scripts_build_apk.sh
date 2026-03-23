#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if command -v flutter >/dev/null 2>&1; then
  cd flutter_app
  flutter pub get
  flutter build apk --release
  echo "APK built at flutter_app/build/app/outputs/flutter-apk/app-release.apk"
  exit 0
fi

if command -v docker >/dev/null 2>&1; then
  docker run --rm -v "$ROOT_DIR":/app -w /app/flutter_app ghcr.io/cirruslabs/flutter:stable \
    bash -lc "flutter pub get && flutter build apk --release"
  echo "APK built at flutter_app/build/app/outputs/flutter-apk/app-release.apk"
  exit 0
fi

echo "Neither Flutter SDK nor Docker is available to build APK in this environment."
exit 1
