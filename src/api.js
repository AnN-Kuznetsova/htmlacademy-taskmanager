import TaskModel from "./models/task-model.js";


export default class API {
  constructor(authorization) {
    this._authorization = authorization;
  }


  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }


  getTasks() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);

    return fetch(`https://11.ecmascript.pages.academy/task-manager/tasks`, {headers})
      .then(this._checkStatus)
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
      .then(this._checkStatus)
      .then((response) => response.json())
      .then(TaskModel.parseTasks);
  }
}
