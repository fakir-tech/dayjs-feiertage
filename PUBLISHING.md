# Publishing to npm

This guide explains how to publish dayjs-feiertage to npm.

## Prerequisites

1. An npm account - [Create one here](https://www.npmjs.com/signup)
2. Be logged in to npm CLI:
   ```bash
   npm login
   ```
3. Have publish access to the `dayjs-feiertage` package

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass: `pnpm test`
- [ ] TypeScript compiles without errors: `pnpm lint`
- [ ] Build succeeds: `pnpm build`
- [ ] Version is updated in `package.json`
- [ ] CHANGELOG is updated (if applicable)

## Publishing Steps

### 1. Update Version

Update the version in `package.json` following [semver](https://semver.org/):

```bash
# Patch release (bug fixes): 0.1.0 -> 0.1.1
pnpm version patch

# Minor release (new features, backward compatible): 0.1.0 -> 0.2.0
pnpm version minor

# Major release (breaking changes): 0.1.0 -> 1.0.0
pnpm version major
```

### 2. Build and Test

```bash
pnpm install
pnpm lint
pnpm test
pnpm build
```

### 3. Verify Package Contents

Check what will be published:

```bash
pnpm pack --dry-run
```

This should only include:
- `dist/` folder (built files)
- `package.json`
- `README.md`
- `LICENSE`

### 4. Publish

```bash
# Publish to npm
pnpm publish

# Or if this is the first publish
pnpm publish --access public
```

### 5. Create Git Tag (optional but recommended)

```bash
git tag v$(node -p "require('./package.json').version")
git push origin --tags
```

## Automated Publishing (GitHub Actions)

The project includes a GitHub Actions workflow that can automate publishing. To enable it:

1. Add your npm token as a GitHub secret named `NPM_TOKEN`
2. Uncomment the publish step in `.github/workflows/ci.yml`

Then, every push to `main` will automatically publish if tests pass.

### Getting an npm Token

1. Go to [npmjs.com](https://www.npmjs.com/) and log in
2. Click your profile icon → Access Tokens
3. Generate New Token → Classic Token → Automation
4. Copy the token and add it to GitHub Secrets

## Troubleshooting

### "You must be logged in to publish packages"

```bash
npm login
```

### "You do not have permission to publish"

Make sure you're the package owner or have been added as a collaborator.

### "Package name already exists"

The package name is taken. Choose a different name in `package.json`.

### Version Already Published

You cannot republish the same version. Bump the version number first:

```bash
pnpm version patch
```

## Unpublishing

To unpublish a version (within 72 hours of publishing):

```bash
npm unpublish dayjs-feiertage@<version>
```

To deprecate a version (recommended over unpublishing):

```bash
npm deprecate dayjs-feiertage@<version> "Reason for deprecation"
```
