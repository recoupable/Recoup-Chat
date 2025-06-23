# SpotifyCard Component

A common reusable card component for displaying Spotify content (artists, tracks, albums, playlists, etc.) with consistent design across the application.

## Features

- **Two variants**: `compact` (horizontal scroll) and `grid` (responsive grid layout)
- **Flexible interaction**: Supports both click handlers and external links
- **Consistent design**: Unified appearance following existing design patterns
- **Image handling**: Automatic fallback for missing images
- **TypeScript strict**: Fully typed with no `any` types

## Props

```typescript
interface SpotifyCardProps {
  /** Unique identifier for the item */
  id: string;
  /** Display name/title */
  name: string;
  /** Optional subtitle (e.g., artist name, release year) */
  subtitle?: string;
  /** Spotify item data for image extraction */
  item: unknown;
  /** External URL (Spotify link) - if provided, card becomes a link */
  externalUrl?: string;
  /** Click handler - if provided and no externalUrl, card becomes clickable */
  onClick?: (name: string, id: string) => void;
  /** Visual variant - affects sizing and layout */
  variant?: "compact" | "grid";
  /** Additional CSS classes */
  className?: string;
}
```

## Usage Examples

### Basic Album Card (Grid Variant)

```tsx
import SpotifyCard from "@/components/common/SpotifyCard";

<SpotifyCard
  id={album.id}
  name={album.name}
  subtitle="2023"
  item={album}
  externalUrl={album.external_urls?.spotify}
  variant="grid"
/>
```

### Interactive Artist Card (Compact Variant)

```tsx
import SpotifyCard from "@/components/common/SpotifyCard";

const handleArtistSelect = (name: string, id: string) => {
  console.log(`Selected artist: ${name} (${id})`);
};

<SpotifyCard
  id={artist.id}
  name={artist.name}
  item={artist}
  onClick={handleArtistSelect}
  variant="compact"
  className="mx-2"
/>
```

### Track Card with Specialized Component

For tracks, use the specialized `SpotifyTrackCard` component:

```tsx
import SpotifyTrackCard from "@/components/VercelChat/tools/SpotifyTrackCard";

<SpotifyTrackCard
  track={track}
  variant="grid"
  showAlbum={true}
  onClick={(track) => playTrack(track)}
/>
```

## Variants

### Compact Variant
- **Size**: 140px width, 100px image
- **Use case**: Horizontal scrollable lists
- **Layout**: Centered image with text below
- **Hover**: Light gray background

### Grid Variant
- **Size**: Responsive, square aspect ratio
- **Use case**: Grid layouts (2-5 columns)
- **Layout**: Full-width image with text below
- **Hover**: Scale transform

## Integration Examples

### Horizontal Scroll Container

```tsx
<div className="flex flex-nowrap overflow-x-auto pb-1 -mx-2">
  {items.map((item) => (
    <SpotifyCard
      key={item.id}
      id={item.id}
      name={item.name}
      item={item}
      variant="compact"
      className="m-2"
      onClick={handleSelect}
    />
  ))}
</div>
```

### Responsive Grid Container

```tsx
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
  {items.map((item) => (
    <SpotifyCard
      key={item.id}
      id={item.id}
      name={item.name}
      item={item}
      variant="grid"
      externalUrl={item.external_urls?.spotify}
    />
  ))}
</div>
```

## Migration Guide

### From GetSpotifySearchToolResult

**Before:**
```tsx
<div className="w-[140px] border border-gray-200 rounded-lg p-2 m-2 text-center bg-white flex-shrink-0 flex flex-col items-center justify-start cursor-pointer hover:bg-gray-50 transition">
  {/* Custom image and text rendering */}
</div>
```

**After:**
```tsx
<SpotifyCard
  id={item.id}
  name={item.name}
  item={item}
  onClick={handleSelect}
  variant="compact"
  className="m-2"
/>
```

### From GetSpotifyArtistAlbumsResult

**Before:**
```tsx
<Link href={albumUrl} className="flex flex-col cursor-pointer transition-all duration-200 hover:scale-105">
  {/* Custom grid item implementation */}
</Link>
```

**After:**
```tsx
<SpotifyCard
  id={album.id}
  name={album.name}
  subtitle={releaseYear?.toString()}
  item={album}
  externalUrl={albumUrl}
  variant="grid"
/>
```

## Dependencies

- `@/lib/spotify/getSpotifyImage` - For extracting image URLs from Spotify items
- `next/link` - For external link functionality
- `react` - React component framework