const VIDEO_ID = '3jGyDhzcSvc'

export function BurnerVideoEmbed() {
  return (
    <div className="hairline glass-card p-6 md:p-8">
      <p className="label-mono text-[0.68rem] text-cream-wash">Learn about Burner</p>
      <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-cream/15 bg-ink">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${VIDEO_ID}`}
          title="Learn about Burner"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  )
}
