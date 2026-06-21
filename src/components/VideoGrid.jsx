import VideoCard from "./VideoCard.jsx";

export default function VideoGrid({ videos, categoriesById, onOpen }) {
  if (!videos.length) {
    return (
      <div className="rounded-3xl bg-white/60 p-16 text-center text-ink/50">
        No videos here yet — add some to <code>portfolio.json</code>.
      </div>
    );
  }

  return (
    <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          category={categoriesById[video.category]}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
