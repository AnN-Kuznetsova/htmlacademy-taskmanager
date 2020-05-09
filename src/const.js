const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];

const Color = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`,
};

const COLORS = Object.values(Color);

const FilterType = {
  ALL: `all`,
  ARCHIVE: `archive`,
  FAVORITES: `favorites`,
  OVERDUE: `overdue`,
  REPEATING: `repeating`,
  TODAY: `today`,
};


export {
  DAYS,
  COLORS,
  FilterType,
};
