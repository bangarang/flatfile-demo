#### Entry File: `./listeners/index.js`

## Environment Variables

```bash
FLATFILE_API_KEY=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

The `FLATFILE_API_KEY` refers to your Secret Key that you'll need to securely store and use in server-side code. This key should not be exposed in client-side applications because it grants full access to your Flatfile account. You can retrieve this key from your development environment on the Flatfile Dashboard under the "Developer settings" section. Ensure that this key is used in a secure manner and is not accessible through the browser for security reasons.

```bash
FLATFILE_ENVIRONMENT_ID=us_env_xxxxxxxx
```

The `FLATFILE_ENVIRONMENT_ID` is a unique identifier for your Flatfile environment. It is used in various contexts, including development and deployment processes, to specify which environment you're working with. For instance, when you're running Flatfile applications on your local machine, you can use this ID to bypass having to enter your API Key and Environment ID every time you run the develop command. This setup allows for smoother development workflows by linking your local development actions directly to your specified Flatfile environment.

---

## Run Flatfile Listener in Local

```bash
yarn run flatfile:develop
```

[Reference](https://flatfile.com/docs/developer-tools/developing/running-local#shared-environments)

---

## Deploy Flatfile Listener

```bash
yarn run flatfile:deploy
```

[Reference](https://flatfile.com/docs/developer-tools/deploying)

---

### Important Links

- [Next.js + Flatfile - Official Example](https://github.com/FlatFilers/flatfile-nextjs)
- [xlsx extractor](https://flatfile.com/docs/plugins-docs/extractors/xlsx-extractor): for parsing Excel files
- [@flatfile/plugin-record-hook](https://flatfile.com/docs/plugins-docs/transform/record-hook): for running custom logic on individual data records
- [@flatfile/dataset-zipcodes](https://flatfile.com/docs/plugins-docs/datasets/zipcodes): `currently in development, for future integrations` dataset plugin includes US zip codes and their associated city, state, latitude, longitude, demographics and more
