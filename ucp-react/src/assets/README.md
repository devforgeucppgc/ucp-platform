# src/assets — where to put images, logos & icons

This folder holds files that get **imported directly in JS/CSS** and bundled
by Vite (e.g. `import logo from '../assets/logos/logo1.png'`). That's the
recommended place for anything small and code-related, like icons or a logo
used inside a component.

```
src/assets/
 ├── images/   → general photos used inside components (e.g. admin avatar)
 ├── logos/    → university / society logos
 └── icons/    → custom SVG icons (beyond the Font Awesome set already used)
```

### How to use a file from here in a component
```jsx
import logo from '../../assets/logos/logo1.png';
// ...
<img src={logo} alt="University Logo" />
```

## Note on the rest of the site's images

This project was originally wired up so that **large content photos** (hero
banners, campus photos, team photos, magazine covers, etc.) are served
straight from **`public/images/`** and referenced with a plain string path
like `/images/campus.jpg` — see `public/images/README.md` for the exact file
names each page expects. That approach is intentional: it lets you replace a
photo just by dropping a new file in, without touching any code or rebuilding
imports.

**Use `public/images/` for:** page hero photos, campus photos, team/member
photos, magazine covers — anything content-heavy that a non-developer might
swap out later.

**Use `src/assets/` for:** logos, icons, and any image that's tightly coupled
to a specific component (like the admin dashboard avatar placeholder).

Both approaches work side-by-side in this project — pick whichever fits the
image you're adding.
