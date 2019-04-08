### Problem

- Modules
  - Per module inject, what variables name should we use? Default: magnetModule
  - Config path
  - Module name, which related to config path name
- How should we handle container?
- Module based folder structure, is inputs folder name make sense? Default: inputs, options: actions
- Should manifests join with recipes?

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

- npm to javascript name format?
  - mongoose => mongoose
  - next.js => next_js
  - @google/map => \_google_map
- aws-sdk structure as a module
