const generateTask = () => {
  return {
    color: `pink`,
    description: `Example task with default color.`,
    dueDate: new Date(),
    repeatingDays: null,
    isArchive: true,
    isFavorite: false
  };
};

const generateTasks = (count) => {
  return new Array(count)
            .fill(``)
            .map(generateTask);
};


export {generateTask, generateTasks};
