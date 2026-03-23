# Build APK

## Option 1: Local Flutter SDK
```bash
cd flutter_app
flutter pub get
flutter build apk --release
```
Output:
- `build/app/outputs/flutter-apk/app-release.apk`

## Option 2: Docker (no local Flutter install)
```bash
docker run --rm -v "$PWD":/app -w /app/flutter_app ghcr.io/cirruslabs/flutter:stable \
  bash -lc "flutter pub get && flutter build apk --release"
```
Output:
- `flutter_app/build/app/outputs/flutter-apk/app-release.apk`
