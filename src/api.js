import TaskModel from "./models/task-model.js";


export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }


  getTasks() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks`, {headers})
      .then((response) => response.json())
      .then(TaskModel.parseTasks);
  }


  updateTask(id, data) {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks/${id}`, {
      method: `PUT`,
      headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(TaskModel.parseTasks);
  }
}
