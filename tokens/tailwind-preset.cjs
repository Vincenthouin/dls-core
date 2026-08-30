/**
 * DLS Core — Tailwind preset
 * Généré depuis Figma "DLS Core". Mappe les tokens sémantiques sur des
 * utilitaires Tailwind lisibles. À utiliser AVEC tokens.css (les valeurs
 * vivent dans les CSS variables ; ici on ne fait que référencer var(--…)).
 *
 * Usage (tailwind.config) :
 *   const dls = require('dls-core/tailwind-preset');
 *   module.exports = { presets: [dls], content: [...] };
 * Et importer une fois : `import 'dls-core/tokens.css'`.
 */
module.exports = {
  theme: {
    extend: {
      // bg-page, bg-card, bg-subtle, bg-inverse, bg-danger, bg-card-hover
      backgroundColor: {
        page: 'var(--surface-page)',
        card: 'var(--surface-card)',
        'card-hover': 'var(--surface-card-hover)',
        inverse: 'var(--surface-inverse)',
        subtle: 'var(--surface-subtle)',
        danger: 'var(--surface-danger)',
        'accent-solid': 'var(--color-accent-500)',
      },
      // text-primary, text-secondary, text-tertiary, text-inverse, text-accent, text-danger
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
        inverse: 'var(--text-inverse)',
        accent: 'var(--text-accent)',
        danger: 'var(--text-danger)',
      },
      // border (default), border-selected, border-danger
      borderColor: {
        DEFAULT: 'var(--border-default)',
        selected: 'var(--border-selected)',
        danger: 'var(--border-danger)',
      },
      // rounded-sm | md | lg | full
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        full: 'var(--radius-full)',
      },
      // gap/padding tokens : gap-control-s, p-control-m …
      spacing: {
        'control-s': 'var(--control-gap-s)',
        'control-m': 'var(--control-gap-m)',
      },
      // tailles de contrôle/icône : h-control-desktop, size-icon-m …
      height: {
        'control-desktop': 'var(--control-height-desktop)',
        'control-mobile': 'var(--control-height-mobile)',
      },
      size: {
        'icon-s': 'var(--size-icon-s)',
        'icon-m': 'var(--size-icon-m)',
        'icon-l': 'var(--size-icon-l)',
        'media-desktop': 'var(--size-media-desktop)',
        'media-mobile': 'var(--size-media-mobile)',
      },
    },
  },
};
