export { fakeBackend };

interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface ResponseBody {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  token: string;
}

function fakeBackend() {
  const users: User[] = [
    { id: 1, username: 'admin', password: 'admin123', firstName: 'Super', lastName: 'Admin' },
    { id: 2, username: 'admin2', password: 'admin123', firstName: 'Admin', lastName: 'External' },
  ];
  const realFetch = window.fetch;

  window.fetch = function (url: string, opts: { method: string; headers: { [key: string]: string }; body?: string }) {
    return new Promise<Response>((resolve, reject) => {
      // wrap in timeout to simulate server api call
      setTimeout(handleRoute, 500);

      function handleRoute() {
        switch (true) {
          case url.endsWith('/users/authenticate') && opts.method === 'POST':
            return authenticate();
          case url.endsWith('/users') && opts.method === 'GET':
            return getUsers();
          default:
            // pass through any requests not handled above
            return realFetch(url, opts)
              .then((response) => resolve(response))
              .catch((error) => reject(error));
        }
      }

      // route functions
      function authenticate() {
        const { username, password } = body();
        const user = users.find((x) => x.username === username && x.password === password);
        if (!user) return error('Username or password is incorrect');
        const menu = [
          {
            "id": 1,
            "title": "Internal Setting",
            "url": "/internal-setting",
            "status": 1,
            "index": 1,
            "created_at": "2024-07-17T09:16:18.000000Z",
            "updated_at": "2024-07-17T09:16:18.000000Z",
            "menus": [
              {
                "id": 1,
                "title": "User",
                "parent_id": null,
                "modules_id": 1,
                "path": "/setting/user",
                "status": 1,
                "index": 2,
                "icon": "mdi-account-circle",
                "created_at": "2024-07-17T09:16:18.000000Z",
                "updated_at": "2024-07-25T07:44:10.000000Z",
                "create": true,
                "read": true,
                "update": true,
                "delete": true,
                "children_recursive": []
              },
              {
                "id": 2,
                "title": "Role",
                "parent_id": null,
                "modules_id": 1,
                "path": "/setting/roles",
                "status": 1,
                "index": 2,
                "icon": "mdi-account-multiple",
                "created_at": "2024-07-17T09:16:18.000000Z",
                "updated_at": "2024-07-25T07:45:07.000000Z",
                "create": false,
                "read": true,
                "update": true,
                "delete": true,
                "children_recursive": []
              },
              {
                "id": 3,
                "title": "Bidang",
                "parent_id": null,
                "modules_id": 1,
                "path": "/setting/bidang",
                "status": 1,
                "index": 2,
                "icon": "mdi-account-tie-outline",
                "created_at": "2024-07-17T09:16:18.000000Z",
                "updated_at": "2024-07-25T07:44:41.000000Z",
                "create": true,
                "read": false,
                "update": true,
                "delete": true,
                "children_recursive": []
              },
              {
                "id": 4,
                "title": "Menu",
                "parent_id": null,
                "modules_id": 1,
                "path": "/setting/menu",
                "status": 1,
                "index": 2,
                "icon": "mdi-menu",
                "created_at": "2024-07-17T09:16:18.000000Z",
                "updated_at": "2024-07-25T07:46:13.000000Z",
                "create": true,
                "read": true,
                "update": true,
                "delete": true,
                "children_recursive": []
              }
            ]
          },
          {
            "id": 2,
            "title": "CMS Jacation",
            "url": "/jacation",
            "status": 1,
            "index": 1,
            "created_at": "2024-07-17T09:16:18.000000Z",
            "updated_at": "2024-07-25T07:47:33.000000Z",
            "menus": [

              {
                "id": 7,
                "title": "Dashboard",
                "parent_id": null,
                "modules_id": 2,
                "path": "/jacation/dashboard",
                "status": 1,
                "index": 5,
                "icon": "mdi-calendar-text",
                "created_at": "2024-07-17T13:32:27.000000Z",
                "updated_at": "2024-07-25T07:58:55.000000Z",
                "create": true,
                "read": true,
                "update": false,
                "delete": true,
                "children_recursive": []
              },
              {
                "id": 5,
                "title": "Artikel",
                "parent_id": null,
                "modules_id": 2,
                "path": "/jacation/artikel",
                "status": 1,
                "index": 3,
                "icon": "mdi-book-open-variant-outline",
                "created_at": "2024-07-17T09:18:28.000000Z",
                "updated_at": "2024-07-25T07:54:05.000000Z",
                "create": true,
                "read": true,
                "update": true,
                "delete": true,
                "children_recursive": [
                  
                    {
                        "id": 6,
                        "title": "Artikel",
                        "parent_id": 5,
                        "modules_id": 2,
                        "path": "\/jacation\/articles",
                        "status": 1,
                        "index": 3,
                         "create": true,
                "read": true,
                "update": true,
                "delete": true,
                        "icon": "-",
                        "created_at": "2024-07-17T10:27:32.000000Z",
                        "updated_at": "2024-07-25T07:56:41.000000Z",
                        "children_recursive": []
                    },
                    {
                        "id": 8,
                        "title": "Kategori",
                        "parent_id": 5,
                        "modules_id": 2,
                        "path": "\/jacation\/kategori",
                        "status": 1,
                         "create": true,
                "read": true,
                "update": true,
                "delete": true,
                        "index": 3,
                        "icon": "-",
                        "created_at": "2024-07-25T07:56:32.000000Z",
                        "updated_at": "2024-07-25T07:56:32.000000Z",
                        "children_recursive": []
                    }
                    ]
              },
            ]
          }
        ]
        const menu2 = [
          {
            "id": 2,
            "title": "CMS Jacation",
            "url": "/jacation",
            "status": 1,
            "index": 1,
            "created_at": "2024-07-17T09:16:18.000000Z",
            "updated_at": "2024-07-25T07:47:33.000000Z",
            "menus": [
              {
                "id": 5,
                "title": "Artikel",
                "parent_id": null,
                "modules_id": 2,
                "path": "/jacation/artikel",
                "status": 1,
                "index": 3,
                "icon": "mdi-book-open-variant-outline",
                "created_at": "2024-07-17T09:18:28.000000Z",
                "updated_at": "2024-07-25T07:54:05.000000Z",
                "create": true,
                "read": true,
                "update": true,
                "delete": true,
                "children_recursive": [
                  
                    {
                        "id": 6,
                        "title": "Artikel",
                        "parent_id": 5,
                        "modules_id": 2,
                        "path": "\/jacation\/artikel",
                        "status": 1,
                        "index": 3,
                         "create": true,
                "read": true,
                "update": true,
                "delete": true,
                        "icon": "-",
                        "created_at": "2024-07-17T10:27:32.000000Z",
                        "updated_at": "2024-07-25T07:56:41.000000Z",
                        "children_recursive": []
                    },
                    {
                        "id": 8,
                        "title": "Kategori",
                        "parent_id": 5,
                        "modules_id": 2,
                        "path": "\/jacation\/kategori",
                        "status": 1,
                         "create": true,
                "read": true,
                "update": true,
                "delete": true,
                        "index": 3,
                        "icon": "-",
                        "created_at": "2024-07-25T07:56:32.000000Z",
                        "updated_at": "2024-07-25T07:56:32.000000Z",
                        "children_recursive": []
                    }
                    ]
              },
              {
                "id": 7,
                "title": "Event",
                "parent_id": null,
                "modules_id": 2,
                "path": "/jacation/event",
                "status": 1,
                "index": 5,
                "icon": "mdi-calendar-text",
                "created_at": "2024-07-17T13:32:27.000000Z",
                "updated_at": "2024-07-25T07:58:55.000000Z",
                "create": true,
                "read": true,
                "update": false,
                "delete": true,
                "children_recursive": []
              }
            ]
          }
        ]
        const data:any = {
          user : {
            username: username,
          },
          token: 'disparekraf_api',
          modules_menus : username == 'admin'? menu:menu2
        }
        const newData:any = {
          data : data
        }
        return ok(newData);
      }

      function getUsers() {
        if (!isAuthenticated()) return unauthorized();
        return ok(users);
      }

      // helper functions
      function ok(body: User[] | ResponseBody): void {
        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) } as Response);
      }

      function unauthorized() {
        resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) } as Response);
      }

      function error(message: string) {
        resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) } as Response);
      }

      function isAuthenticated() {
        return opts.headers['Authorization'] === 'Bearer fake-jwt-token';
      }

      function body() {
        return opts.body && JSON.parse(opts.body);
      }
    });
  } as typeof window.fetch; // Type assertion here
}
