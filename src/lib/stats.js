// Derive dashboard stats straight from the data so they're always accurate.
export function computeStats(videos, categories) {
  const months = videos
    .map((v) => v.date)
    .filter(Boolean)
    .sort();

  const firstYear = months.length ? months[0].slice(0, 4) : null;
  const lastYear = months.length ? months[months.length - 1].slice(0, 4) : null;

  const yearRange =
    firstYear && lastYear
      ? firstYear === lastYear
        ? firstYear
        : `${firstYear}–${lastYear}`
      : "—";

  const usedCategories = new Set(videos.map((v) => v.category));

  return {
    videoCount: videos.length,
    categoryCount: categories.filter((c) => usedCategories.has(c.id)).length,
    yearRange,
    firstYear,
    lastYear,
  };
}

export function countByCategory(videos) {
  return videos.reduce((acc, v) => {
    acc[v.category] = (acc[v.category] || 0) + 1;
    return acc;
  }, {});
}
