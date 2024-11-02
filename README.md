# Survey App

## Setup instructions

Software needed:
- VSCode
- VSCode devcontainer extension
- Docker

1. Clone repository
2. Open repository in VS Code
3. Reopen workspace in the devcontainer
4. Copy in the config/master.key OR
   - Generate new credentials
   ```
   bin/rails db:encryption:init # (copy the output)
   rm config/credentials.yml.enc
   rails credentials:edit
   # paste the output into there and save the file.
   ```
5. In a devcontainer ternminal, run `rails db:seed`
6. In a devcontainer ternminal, run `npm i`

## Run commands

In a VSCode devctonainer terminal: start the rails server
```
  rails s
```

Go to `localhost:3000` in a web browser

## Testing instructions

RSpec tests
```
  rspec
```

Jest tests
```
  npm test
```


