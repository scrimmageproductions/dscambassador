import { galleryItems } from '../../../data/dashboard'
import { ParallaxImage } from '../../motion/ParallaxImage'

export function GalleryView() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {galleryItems.map((item, i) => (
        <figure key={item.caption + i} className="hairline group relative overflow-hidden bg-surface/40">
          <div className="relative aspect-square w-full overflow-hidden">
            <ParallaxImage
              src={item.src}
              alt={item.caption}
              loading="lazy"
              className="h-full w-full object-cover brightness-90"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
          <figcaption className="label-mono absolute bottom-4 left-4 text-[0.62rem] text-cream">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
