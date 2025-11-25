# App Icons

To customize the home screen icon when users save this app:

1. Create two PNG images:
   - `icon-192.png` (192x192 pixels)
   - `icon-512.png` (512x512 pixels)

2. Place them in the `public/` directory

3. The icons should feature your app's branding/logo

## Design Tips

- Use a simple, recognizable design that works at small sizes
- Consider using the app's color scheme (blue #4a9eff)
- The icons will be automatically masked/rounded by the OS
- Avoid putting important content in the corners (they may be cropped)

## Temporary Solution

Until custom icons are created, the app will use the default PWA icon. Users can still add the app to their home screen - it will work perfectly, just without a custom icon.

## Tools for Creating Icons

- [Favicon Generator](https://realfavicongenerator.net/)
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- Figma, Sketch, or any image editor
