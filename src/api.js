import TaskModel from "./models/task-model.js";


const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};


export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }


  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, headers, body})
      .then(this._checkStatus)
      .catch((err) => {
        throw err;
      });
  }


  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }


  getTasks() {
    return this._load({url: `tasks`})
      .then((response) => response.json())
      .then(TaskModel.parseTasks);
  }


  updateTask(id, data) {
    return this._load({
      url: `tasks/${id}`,
      method: Method.PUT,
      headers: new Headers({"Content-Type": `application/json`}),
      body: JSON.stringify(data.toRAW()),
    })
      .then((response) => response.json())
      .then(TaskModel.parseTask);
  }
}
