### Problem

- Per module inject, what variables name should we use? Default: magnetModule
- How should we handle container?
- Module based folder structure, is inputs folder make sense? Default: inputs, options: actions
- Should manifests join with manifests?

  - Options 1

  ```
    /manifests
      api-app.yml
      api-svc.yml
      grpc-app.yml
      grpc-svc.yml
    /src
      /recipes
        index.js
        api.js
        grpc.js
  ```

  - Options 2

  ```
      /src
        /recipes
          index.js
          /api
            index.js
            api-app.yml
            api-svc.yml
          /grpc
            index.js
            grpc-app.yml
            grpc-svc.yml
  ```
