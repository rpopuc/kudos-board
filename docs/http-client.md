No linux:

```bash
sudo apt install httpie
```

Para rodar um GET:

```bash
http :3001
```

Para rodar um POST:

```bash
http POST :3001/panel
```

```bash
http POST :3001/panel user-id:user-id --json <<< `cat docs/panel.json`
```
